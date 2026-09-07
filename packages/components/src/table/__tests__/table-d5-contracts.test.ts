import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref, toRaw } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import Table from '../table.vue'
import Pagination from '../../pagination/pagination.vue'

interface Row {
  key: string | number
  name: string
  age: number
  role: string
}

const rows: Row[] = [
  { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
  { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' },
  { key: 'linus', name: 'Linus', age: 42, role: 'Maintainer' },
  { key: 'margaret', name: 'Margaret', age: 31, role: 'Engineer' }
]

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a: Row, b: Row) => a.age - b.age },
  { title: 'Role', dataIndex: 'role', key: 'role' }
]

const text = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('tbody tr').map((row) => row.text())

describe('Table D5-A contracts', () => {
  it('local mode derives total and pages from the local collection, ignoring pagination.total', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows, dataMode: 'local', pagination: { total: 1, pageSize: 2 } }
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    await wrapper.find('.aheart-pagination__next').trigger('click')
    expect(text(wrapper)).toEqual(expect.arrayContaining(['Linus42Maintainer', 'Margaret31Engineer']))
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ current: 2, pageSize: 2, total: 4 })
  })

  it('server mode preserves response order and emits a shallow currentDataSource copy', async () => {
    const response = [rows[2], rows[0]]
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: response,
        dataMode: 'server',
        pagination: { current: 3, pageSize: 1, total: 40 }
      }
    })

    expect(text(wrapper)).toEqual(['Linus42Maintainer', 'Ada36Architect'])
    await wrapper.findAll('th')[1].find('button').trigger('click')
    const change = wrapper.emitted('change')?.[0]
    expect(text(wrapper)).toEqual(['Linus42Maintainer', 'Ada36Architect'])
    expect(change?.[3]).toMatchObject({ action: 'sort' })
    expect(change?.[3].currentDataSource).not.toBe(response)
    expect(change?.[3].currentDataSource).toEqual(response)
    expect(toRaw(change?.[3].currentDataSource[0])).toBe(toRaw(response[0]))
  })

  it('omitted dataMode retains the legacy total-present path', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: [rows[3]], pagination: { current: 5, pageSize: 10, total: 100 } }
    })
    expect(text(wrapper)).toEqual(['Margaret31Engineer'])
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('5')
  })

  it('treats sortOrder null as controlled no-sort and uses the first controlled visible column', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name', sorter: true, sortOrder: null },
          { title: 'Age', dataIndex: 'age', key: 'age', sorter: true, sortOrder: 'descend' }
        ],
        dataSource: rows
      }
    })
    expect(text(wrapper)[0]).toContain('Ada')
    expect(wrapper.findAll('th')[0].attributes('aria-sort')).toBe('none')
    expect(wrapper.findAll('th')[1].attributes('aria-sort')).toBe('none')
    await wrapper.findAll('th')[1].find('button').trigger('click')
    expect(wrapper.emitted('change')?.[0]?.[2]).toMatchObject({ columnKey: 'age', order: 'ascend' })
  })

  it('does not reset an uncontrolled page when a controlled sort is rejected, then resets after acceptance', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Age', dataIndex: 'age', key: 'age', sorter: true, sortOrder: null }],
        dataSource: rows,
        pagination: { defaultCurrent: 2, pageSize: 1 }
      }
    })
    await wrapper.find('.aheart-table__sorter').trigger('click')
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('2')
    await wrapper.setProps({
      columns: [{ title: 'Age', dataIndex: 'age', key: 'age', sorter: true, sortOrder: null }],
      pagination: { defaultCurrent: 2, pageSize: 1 }
    })
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('2')
    await wrapper.setProps({
      columns: [{ title: 'Age', dataIndex: 'age', key: 'age', sorter: true, sortOrder: 'ascend' }],
      pagination: { defaultCurrent: 2, pageSize: 1 }
    })
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('1')
    expect(wrapper.emitted('change')?.length).toBe(1)
  })

  it('keeps a rejected controlled query and page stable, and accepts asynchronously without a second request', async () => {
    const state = ref({ sortOrder: null as 'ascend' | 'descend' | null, current: 2 })
    const changes: unknown[] = []
    const wrapper = mount(defineComponent({
      setup: () => () => h(Table, {
        columns: [{ title: 'Age', dataIndex: 'age', key: 'age', sorter: true, sortOrder: state.value.sortOrder }],
        dataSource: rows,
        pagination: { current: state.value.current, pageSize: 1 },
        onChange: (pagination: { current: number }) => changes.push(pagination)
      })
    }))
    await wrapper.find('.aheart-table__sorter').trigger('click')
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('2')
    state.value = { sortOrder: 'ascend', current: 1 }
    await nextTick()
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('1')
    expect(changes).toHaveLength(1)
  })

  it.each([
    ['neither', {}, {}],
    ['current', { current: 1 }, {}],
    ['pageSize', {}, { pageSize: 2 }],
    ['both', { current: 1 }, { pageSize: 2 }]
  ])('supports the %s current/pageSize control combination', async (_label, current, pageSize) => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows, pagination: { total: 4, defaultCurrent: 1, defaultPageSize: 1, ...current, ...pageSize } }
    })
    const next = wrapper.find('.aheart-pagination__next')
    await next.trigger('click')
    expect(wrapper.emitted('change')?.[0]?.[0].current).toBe(2)
    expect(wrapper.emitted('change')?.[0]?.[0].pageSize).toBe(pageSize.pageSize ?? 1)
  })

  it('changes an uncontrolled page size in place and clamps only against the new page count', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        dataMode: 'local',
        pagination: { defaultCurrent: 2, defaultPageSize: 1, total: 4, showSizeChanger: true, pageSizeOptions: [1, 2, 4] }
      }
    })
    await wrapper.find('.aheart-pagination__size-changer').setValue('2')
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ current: 2, pageSize: 2 })
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('2')
    await wrapper.find('.aheart-pagination__size-changer').setValue('4')
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('1')
  })

  it('does not adopt a rejected controlled page size and reports one request per user operation', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        pagination: { current: 2, pageSize: 1, total: 4, showSizeChanger: true, pageSizeOptions: [1, 2] }
      }
    })
    const select = wrapper.find('.aheart-pagination__size-changer')
    await select.setValue('2')
    expect(select.element).toHaveProperty('value', '1')
    expect(wrapper.emitted('change')).toHaveLength(1)
    await select.setValue('2')
    expect(wrapper.emitted('change')).toHaveLength(2)
  })

  it('passes pagination size options and keeps the native select value in sync', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        pagination: { total: 80, pageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50], showQuickJumper: true }
      }
    })
    const select = wrapper.find('.aheart-pagination__size-changer')
    expect(select.exists()).toBe(true)
    expect(select.findAll('option').map((option) => option.attributes('value'))).toEqual(['10', '20', '50'])
    await select.setValue('20')
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ current: 1, pageSize: 20 })
  })

  it('normalizes invalid pagination display values without emitting an update', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows, pagination: { current: 0.5, pageSize: Number.NaN, total: Number.POSITIVE_INFINITY } }
    })
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('1')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('disables per-row checkboxes and selects only current-page enabled rows', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        pagination: { defaultCurrent: 1, pageSize: 2 },
        rowSelection: { getCheckboxProps: (record: Row) => ({ disabled: record.key === 'grace' }) }
      }
    })
    const checkboxes = wrapper.findAll('tbody input[type="checkbox"]')
    expect((checkboxes[1].element as HTMLInputElement).disabled).toBe(true)
    await wrapper.find('thead input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('update:selectedRowKeys')?.[0]).toEqual([['ada']])
    expect(wrapper.emitted('selectAll')?.[0]).toEqual([true, ['ada'], [rows[0]]])
  })

  it('reports half checked, all-disabled and radio semantics without a header select-all', async () => {
    const half = mount(Table, {
      props: { columns, dataSource: rows.slice(0, 2), rowSelection: {} }
    })
    await half.findAll('tbody input[type="checkbox"]')[0].setValue(true)
    expect((half.find('thead input[type="checkbox"]').element as HTMLInputElement).indeterminate).toBe(true)

    const allDisabled = mount(Table, {
      props: { columns, dataSource: rows.slice(0, 2), rowSelection: { getCheckboxProps: () => ({ disabled: true }) } }
    })
    expect((allDisabled.find('thead input[type="checkbox"]').element as HTMLInputElement).disabled).toBe(true)

    const radio = mount(Table, { props: { columns, dataSource: rows, rowSelection: { type: 'radio' } } })
    expect(radio.find('thead input').exists()).toBe(false)
    expect(radio.findAll('tbody input[type="radio"]')).toHaveLength(4)
  })

  it('preserves typed keys across pages and does not leak mutable event arrays', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: [{ ...rows[0], key: 1 }, { ...rows[1], key: '1' }],
        rowSelection: { defaultSelectedRowKeys: [1], preserveSelectedRowKeys: true }
      }
    })
    await wrapper.findAll('tbody input[type="checkbox"]')[1].setValue(true)
    const payload = wrapper.emitted('update:selectedRowKeys')?.[0]?.[0] as (string | number)[]
    payload.push('outside')
    expect(wrapper.findAll('tbody input[type="checkbox"]')[0].element).toHaveProperty('checked', true)
    expect(payload).toEqual([1, '1', 'outside'])
  })

  it('preserves selected keys across page replacement and keeps selectAll order, deduplication, and arrays independent', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        dataMode: 'local',
        pagination: { defaultCurrent: 1, pageSize: 2 },
        rowSelection: { defaultSelectedRowKeys: ['grace'] }
      }
    })
    await wrapper.find('thead input[type="checkbox"]').setValue(true)
    const firstSelectAll = wrapper.emitted('selectAll')?.[0] as [boolean, (string | number)[], Row[]]
    expect(firstSelectAll[1]).toEqual(['grace', 'ada'])
    expect(firstSelectAll[2]).toEqual([rows[0]])
    firstSelectAll[1].push('listener-mutation')
    firstSelectAll[2].push(rows[2])
    await wrapper.find('.aheart-pagination__next').trigger('click')
    expect(wrapper.findAll('tbody input[type="checkbox"]')[0].element).toHaveProperty('checked', false)
    await wrapper.findAll('tbody input[type="checkbox"]')[0].setValue(true)
    expect(wrapper.emitted('update:selectedRowKeys')?.at(-1)).toEqual([['grace', 'ada', 'linus']])
  })

  it('keeps default selection when selectedRowKeys is explicitly undefined, then hands off to controlled state', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows, rowSelection: { defaultSelectedRowKeys: ['ada'], selectedRowKeys: undefined } }
    })
    expect((wrapper.find('tbody input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false)
    await wrapper.setProps({ rowSelection: { selectedRowKeys: ['linus'] } })
    expect(wrapper.findAll('tbody input[type="checkbox"]').map((input) => (input.element as HTMLInputElement).checked))
      .toEqual([false, false, true, false])
  })

  it('keeps controlled selection when the parent rejects a select-all request', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows.slice(0, 2), rowSelection: { selectedRowKeys: [] } }
    })
    await wrapper.find('thead input[type="checkbox"]').setValue(true)
    expect(wrapper.findAll('tbody input:checked')).toHaveLength(0)
    expect(wrapper.emitted('selectAll')?.[0]?.[1]).toEqual(['ada', 'grace'])
  })

  it('preserve=false clips only keys absent from raw dataSource, not filter or pagination views', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Role', dataIndex: 'role', key: 'role', filters: [{ text: 'Engineer', value: 'Engineer' }] }],
        dataSource: rows,
        pagination: { current: 1, pageSize: 1 },
        rowSelection: { defaultSelectedRowKeys: ['grace', 'linus'], preserveSelectedRowKeys: false }
      }
    })
    await wrapper.find('.aheart-table__filter-option').trigger('click')
    expect(wrapper.emitted('update:selectedRowKeys')).toBeUndefined()
    await wrapper.setProps({
      dataSource: rows.filter((row) => row.key !== 'linus'),
      columns: [{ title: 'Role', dataIndex: 'role', key: 'role', filteredValue: [] }]
    })
    await nextTick()
    expect(wrapper.emitted('update:selectedRowKeys')).toBeUndefined()
    await wrapper.find('tbody input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('update:selectedRowKeys')?.at(-1)).toEqual([['grace', 'ada']])
  })

  it('keeps row selection SSR and hydration stable with D5 data mode', async () => {
    const App = defineComponent({ setup: () => () => h(Table, {
      columns,
      dataSource: rows,
      dataMode: 'local',
      rowSelection: { type: 'radio', defaultSelectedRowKeys: ['ada'] }
    }) })
    const html = await renderToString(createSSRApp(App))
    const host = document.createElement('div')
    host.innerHTML = html
    document.body.replaceChildren(host)
    const warnings: string[] = []
    const clientApp = createSSRApp(App)
    clientApp.config.warnHandler = (message) => warnings.push(message)
    clientApp.mount(host, true)
    await nextTick()
    expect(host.querySelectorAll('tbody input[type="radio"]')).toHaveLength(4)
    expect(warnings).toEqual([])
    clientApp.unmount()
    host.remove()
  })

  it('keeps Pagination and Table page-size normalization aligned at fractional and invalid values', async () => {
    const table = mount(Table, { props: { columns, dataSource: rows, dataMode: 'local', pagination: { total: 40, pageSize: 2.9 } } })
    const pagination = mount(Pagination, { props: { total: 40, pageSize: 2.9 } })
    expect(table.find('.aheart-pagination__page.is-active').exists()).toBe(true)
    expect(pagination.find('.aheart-pagination__page.is-active').text()).toBe('1')
    expect(table.findAll('tbody tr')).toHaveLength(2)
    await pagination.find('.aheart-pagination__next').trigger('click')
    expect(pagination.emitted('change')?.[0]).toEqual([2, 2])
  })
})
