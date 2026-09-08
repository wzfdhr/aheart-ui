import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it, vi } from 'vitest'
import Table from '../table.vue'

interface Row {
  key: string
  name: string
  amount: number
}

const rows: Row[] = [
  { key: 'one', name: 'One', amount: 1 },
  { key: 'two', name: 'Two', amount: 2 }
]

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' }
]

const table = (wrapper: ReturnType<typeof mount>) => wrapper.find('table')

describe('Table D5-B layout and status contract', () => {
  it('keeps current data while loading and locks sort, pagination, selection, and customRender actions', async () => {
    const customAction = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns: [
          { ...columns[0], sorter: true },
          {
            ...columns[1],
            customRender: ({ text }: { text: unknown }) => h('button', {
              type: 'button',
              'data-custom-action': 'amount',
              onClick: customAction
            }, String(text))
          }
        ],
        dataSource: rows,
        loading: true,
        pagination: { total: 20, pageSize: 1, showSizeChanger: true },
        rowSelection: {}
      } as any
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.find('.aheart-table__sorter').attributes('disabled')).toBeDefined()
    expect(wrapper.find('thead input[type="checkbox"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.aheart-pagination__next').attributes('disabled')).toBeDefined()

    const customButton = wrapper.find('[data-custom-action="amount"]')
    expect(customButton.exists()).toBe(true)
    if (!customButton.exists()) return
    await customButton.trigger('click')
    expect(customAction).not.toHaveBeenCalled()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('keeps current data in error state, renders configured message/retryText, and emits retry', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        error: { message: 'Could not load rows', retryText: 'Try again' }
      } as any
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    const alert = wrapper.find('[role="alert"]')
    expect(alert.exists()).toBe(true)
    if (!alert.exists()) return
    expect(alert.text()).toContain('Could not load rows')
    const retry = wrapper.find('button[data-table-retry]')
    expect(retry.exists()).toBe(true)
    if (!retry.exists()) return
    expect(retry.text()).toContain('Try again')
    await retry.trigger('click')
    expect(wrapper.emitted('retry')).toEqual([[]])
  })

  it('gives loading precedence over error and does not expose retry while loading', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        loading: true,
        error: { message: 'Stale error', retryText: 'Try again' }
      } as any
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.find('button[data-table-retry]').exists()).toBe(false)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('renders one native table with a colgroup for utility and data columns', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        rowSelection: {},
        expandable: { expandedRowRender: (row: Row) => row.name }
      }
    })

    expect(wrapper.findAll('table')).toHaveLength(1)
    const nativeTable = table(wrapper)
    expect(nativeTable.exists()).toBe(true)
    expect(nativeTable.find('colgroup').exists()).toBe(true)
    expect(nativeTable.findAll('colgroup col')).toHaveLength(4)
  })

  it('applies continuous fixed-prefix/suffix offsets and rejects an invalid fixed sequence as a group', () => {
    const valid = mount(Table, {
      props: {
        columns: [
          { title: 'A', dataIndex: 'a', key: 'a', width: 80, fixed: 'left' },
          { title: 'B', dataIndex: 'b', key: 'b', width: '120px', fixed: 'left' },
          { title: 'C', dataIndex: 'c', key: 'c', width: 140, fixed: 'right' }
        ] as any,
        dataSource: [{ key: 'row', a: 'a', b: 'b', c: 'c' }]
      }
    })
    const validHeaders = valid.findAll('thead th')
    expect(validHeaders).toHaveLength(3)
    expect(validHeaders[0].attributes('style') ?? '').toContain('position: sticky')
    expect(validHeaders[0].attributes('style') ?? '').toContain('left: 0px')
    expect(validHeaders[1].attributes('style') ?? '').toContain('left: 80px')
    expect(validHeaders[2].attributes('style') ?? '').toContain('right: 0px')

    const invalid = mount(Table, {
      props: {
        columns: [
          { title: 'A', dataIndex: 'a', key: 'a', width: 80, fixed: 'left' },
          { title: 'B', dataIndex: 'b', key: 'b', width: 120 },
          { title: 'C', dataIndex: 'c', key: 'c', width: 140, fixed: 'left' }
        ] as any,
        dataSource: [{ key: 'row', a: 'a', b: 'b', c: 'c' }]
      }
    })
    expect(invalid.findAll('thead th').every((header) => !header.attributes('style')?.includes('position: sticky'))).toBe(true)
  })

  it('supports scroll x true/number/string, y, and sticky offset structure without nested native tables', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        scroll: { x: true, y: 240 },
        sticky: { offsetHeader: 12 }
      } as any
    })
    expect(wrapper.findAll('table')).toHaveLength(1)
    const container = wrapper.find('.aheart-table__container')
    expect(container.attributes('style') ?? '').toContain('max-height: 240px')
    expect(container.attributes('style') ?? '').toContain('overflow-y: auto')
    expect(table(wrapper).attributes('style') ?? '').toContain('min-width:')
    expect(wrapper.find('thead th').attributes('style') ?? '').toContain('position: sticky')
    expect(wrapper.find('thead th').attributes('style') ?? '').toContain('top: 12px')
  })

  it('keeps sticky headers usable without y and with an ancestor scroll container', () => {
    const host = document.createElement('div')
    host.style.overflow = 'auto'
    document.body.appendChild(host)
    const wrapper = mount(Table, {
      attachTo: host,
      props: { columns, dataSource: rows, sticky: true } as any
    })
    expect(wrapper.find('thead th').attributes('style') ?? '').toContain('position: sticky')
    expect(wrapper.find('.aheart-table__container').attributes('style') ?? '').not.toContain('max-height')
    wrapper.unmount()
    host.remove()
  })

  it('keeps layout structure SSR-stable and does not require browser globals', async () => {
    const App = defineComponent({
      setup: () => () => h(Table, {
        columns: [{ ...columns[0], width: 120, fixed: 'left' }],
        dataSource: rows,
        scroll: { x: 'max-content', y: '12rem' },
        sticky: { offsetHeader: 4 }
      } as any)
    })
    const first = await renderToString(createSSRApp(App))
    const second = await renderToString(createSSRApp(App))
    expect(first).toContain('<table')
    expect(first).toContain('<colgroup>')
    expect(first).toBe(second)
    await nextTick()
  })
})
