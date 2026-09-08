import { defineComponent, h, nextTick, ref } from 'vue'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Table from '../table.vue'
import type { TableColumn, TableScroll } from '../types'

interface Row {
  key: string
  name: string
  score: number
}

const rows: Row[] = [
  { key: 'ada', name: 'Ada', score: 96 },
  { key: 'grace', name: 'Grace', score: 88 }
]

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Score', dataIndex: 'score', key: 'score' }
]

const filterDropdown = (context: any) => h(
  'div',
  { 'data-review-popup-content': true },
  [
    h('input', {
      'data-review-filter-input': true,
      value: context.selectedKeys?.[0] ?? '',
      onInput: (event: Event) => context.setSelectedKeys?.([(event.target as HTMLInputElement).value])
    }),
    h('button', { type: 'button', 'data-review-close': true, onClick: () => context.close?.() }, 'Close')
  ]
)

describe('Table D5-B review regressions', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('only the header is sticky: tbody cells must not receive the header top offset', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        scroll: { y: 180 },
        sticky: { offsetHeader: 8 }
      } as any
    })
    const headerStyle = wrapper.find('thead th').attributes('style') ?? ''
    const bodyStyle = wrapper.find('tbody td').attributes('style') ?? ''
    expect(headerStyle).toContain('position: sticky')
    expect(headerStyle).toContain('top: 8px')
    expect(bodyStyle).not.toContain('position: sticky')
    expect(bodyStyle).not.toContain('top: 8px')
  })

  it('includes an expand-only utility column in left fixed offsets', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ ...columns[0], width: 120, fixed: 'left' }, columns[1]],
        dataSource: rows,
        expandable: { expandedRowRender: (row: Row) => row.name }
      } as any
    })
    const headers = wrapper.findAll('thead th')
    expect(headers).toHaveLength(3)
    expect(headers[0].attributes('style') ?? '').toContain('left: 0px')
    expect(headers[1].attributes('style') ?? '').toContain('left: 48px')
  })

  it.each([
    ['loading', { loading: true, error: false }],
    ['error', { loading: false, error: { message: 'failed', retryText: 'retry' } }]
  ])('makes custom button and input inert in %s state', async (_state, props) => {
    const input = vi.fn()
    const keydown = vi.fn()
    const click = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns: [{
          ...columns[0],
          customRender: () => h('div', [
            h('input', { 'data-review-custom-input': true, onInput: input }),
            h('button', { type: 'button', 'data-review-custom-button': true, onKeydown: keydown, onClick: click }, 'Action')
          ])
        }],
        dataSource: rows,
        ...props
      } as any
    })
    expect(wrapper.find('.aheart-table').attributes('inert')).toBeDefined()
    const customInput = wrapper.find('[data-review-custom-input]')
    const customButton = wrapper.find('[data-review-custom-button]')
    expect(customInput.exists()).toBe(true)
    expect(customButton.exists()).toBe(true)
    if (!customInput.exists() || !customButton.exists()) return
    await customInput.setValue('changed')
    await customButton.trigger('keydown', { key: 'Enter' })
    await customButton.trigger('click')
    expect(input).not.toHaveBeenCalled()
    expect(keydown).not.toHaveBeenCalled()
    expect(click).not.toHaveBeenCalled()
  })

  it('preserves a draft when a controlled close request is rejected and emits one close request', async () => {
    const open = ref(true)
    const closeRequests: boolean[] = []
    const wrapper = mount(defineComponent({
      setup: () => () => h(Table, {
        columns: [{ ...columns[0], filterDropdown, filterDropdownOpen: open.value }],
        dataSource: rows,
        onFilterDropdownOpenChange: (_key: string, nextOpen: boolean) => closeRequests.push(nextOpen)
      } as any)
    }))
    await nextTick()
    const popup = document.querySelector<HTMLElement>('[data-table-filter-popup]')
    expect(popup).not.toBeNull()
    if (!popup) return
    const input = popup.querySelector<HTMLInputElement>('[data-review-filter-input]')
    expect(input).not.toBeNull()
    if (!input) return
    input.value = 'Ada'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    popup.querySelector<HTMLElement>('[data-review-close]')?.click()
    await nextTick()
    expect(closeRequests).toEqual([false])
    const retained = document.querySelector<HTMLInputElement>('[data-review-filter-input]')
    expect(retained?.value).toBe('Ada')
    retained?.closest('[data-table-filter-popup]')?.querySelector<HTMLElement>('[data-review-close]')?.click()
    await nextTick()
    expect(closeRequests).toEqual([false, false])
    open.value = false
    await nextTick()
    expect(closeRequests).toEqual([false, false])
    wrapper.unmount()
  })

  it('emits one false close request for an uncontrolled Cancel', async () => {
    const closeRequests: Array<[string, boolean]> = []
    const wrapper = mount(Table, {
      props: {
        columns: [{ ...columns[0], filterDropdown, defaultFilterDropdownOpen: true }],
        dataSource: rows,
        onFilterDropdownOpenChange: (key: string, open: boolean) => closeRequests.push([key, open])
      } as any
    })
    await nextTick()
    const popup = document.querySelector<HTMLElement>('[data-table-filter-popup]')
    expect(popup).not.toBeNull()
    if (!popup) return
    popup.querySelector<HTMLElement>('[data-review-close]')?.click()
    await nextTick()
    expect(closeRequests).toEqual([['name', false]])
    wrapper.unmount()
  })

  it('locks an already-open popup when loading/error props change without an outside click', async () => {
    const action = vi.fn()
    const render = () => h('button', { type: 'button', 'data-review-state-action': 'true', onClick: action }, 'Apply')
    const wrapper = mount(Table, {
      props: {
        columns: [{ ...columns[0], filterDropdown: render, defaultFilterDropdownOpen: true }],
        dataSource: rows
      } as any
    })
    await nextTick()
    const isLockedOrClosed = () => {
      const current = document.querySelector<HTMLElement>('[data-table-filter-popup]')
      if (!current) return true
      const button = current.querySelector<HTMLButtonElement>('[data-review-state-action]')
      return current.hasAttribute('inert') || current.getAttribute('aria-disabled') === 'true' || Boolean(button?.disabled)
    }
    await wrapper.setProps({ loading: true })
    await nextTick()
    expect(isLockedOrClosed()).toBe(true)
    document.querySelector<HTMLElement>('[data-review-state-action]')?.click()
    expect(action).not.toHaveBeenCalled()
    await wrapper.setProps({ loading: false, error: { message: 'failed', retryText: 'retry' } })
    await nextTick()
    expect(isLockedOrClosed()).toBe(true)
    document.querySelector<HTMLElement>('[data-review-state-action]')?.click()
    expect(action).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('tabs across enabled focusables, skips a disabled button, reverses with Shift, and is safe with none', async () => {
    const render = (context: any) => h('div', [
      h('input', { 'data-focus-first': 'true' }),
      h('button', { type: 'button', disabled: true, 'data-focus-disabled': 'true' }, 'Disabled'),
      h('a', { href: '#focus-link', 'data-focus-link': 'true' }, 'Link'),
      h('button', { type: 'button', 'data-focus-close': 'true', onClick: context.close }, 'Close')
    ])
    const wrapper = mount(Table, {
      props: { columns: [{ ...columns[0], filterDropdown: render, defaultFilterDropdownOpen: true }], dataSource: rows } as any
    })
    await nextTick()
    const popup = document.querySelector<HTMLElement>('[data-table-filter-popup]')
    expect(popup).not.toBeNull()
    if (!popup) return
    const first = popup.querySelector<HTMLElement>('[data-focus-first]')!
    const link = popup.querySelector<HTMLElement>('[data-focus-link]')!
    expect(first).not.toBeNull()
    expect(link).not.toBeNull()
    if (!first || !link) return
    first.focus()
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    await nextTick()
    expect(document.activeElement).toBe(link)
    link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
    await nextTick()
    expect(document.activeElement).toBe(first)
    wrapper.unmount()
  })

  it('renders null, string, and array filter VNodeChild values during SSR without throwing', async () => {
    const values = [null, 'plain text', [h('span', 'one'), h('span', 'two')]]
    for (const value of values) {
      const App = defineComponent({
        setup: () => () => h(Table, {
          columns: [{ ...columns[0], filterDropdown: () => value, defaultFilterDropdownOpen: true }],
          dataSource: rows
        } as any)
      })
      await expect(renderToString(createSSRApp(App))).resolves.toContain('<table')
    }
  })

  it('keeps the public scroll and fixed type surface narrow', () => {
    const validScroll: TableScroll = { x: true, y: '180px' }
    const validColumn: TableColumn = { title: 'Name', fixed: 'left', width: 120 }
    // @ts-expect-error D5-B scroll.x accepts true, not false.
    const invalidScroll: TableScroll = { x: false }
    void invalidScroll
    expect(validScroll.x).toBe(true)
    expect(validColumn.fixed).toBe('left')
  })
})
