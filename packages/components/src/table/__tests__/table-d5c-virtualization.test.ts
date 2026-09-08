import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Table from '../table.vue'

type Row = { key: string | number; name: string; group?: string; disabled?: boolean }
const rows: Row[] = Array.from({ length: 40 }, (_, index) => ({ key: index, name: `Row ${index}`, group: index < 20 ? 'A' : 'B', disabled: index === 2 }))
const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }]
const wrappers: VueWrapper[] = []
const props = (extra: Record<string, unknown> = {}) => ({ columns, dataSource: rows, pagination: false, virtual: { height: 320, overscan: 4 }, ...extra })
const mountTable = (extra: Record<string, unknown> = {}, attachTo: HTMLElement = document.body) => {
  const wrapper = mount(Table, { attachTo, props: props(extra) as any })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Table D5-C virtualization unit contract (RED)', () => {
  it.each([['small', 'small', 40], ['middle', 'middle', 48], ['large', 'large', 56]])('size=%s exposes numeric estimateSize default', (_label, size, estimate) => {
    const marker = mountTable({ size, virtual: { height: 400 } }).find('[data-aheart-virtual-estimate-size]')
    expect(marker.exists(), 'virtual runtime must expose estimateSize').toBe(true)
    expect(marker.attributes('data-value')).toBe(String(estimate))
  })

  it.each([
    [{ y: 180 }, '180'],
    [{ y: '240px' }, '240'],
    [{ y: 'not-a-length' }, '320']
  ])('resolves parsed scroll.y %j as virtual height %s when virtual.height is absent', (scroll, expected) => {
    const wrapper = mountTable({ scroll, virtual: true })
    const height = wrapper.find('[data-aheart-virtual-height]')
    expect(height.exists(), 'virtual runtime must expose resolved scroll.y height').toBe(true)
    expect(height.attributes('data-value')).toBe(expected)
  })

  it('gives numeric virtual.height precedence over any parsed scroll.y', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const wrapper = mountTable({ scroll: { y: '240px' }, virtual: { height: 500, estimateSize: 52, overscan: 8 } })
    const height = wrapper.find('[data-aheart-virtual-height]')
    expect(height.exists(), 'virtual runtime must expose normalized height').toBe(true)
    expect(height.attributes('data-value')).toBe('500')
    expect(wrapper.find('[data-aheart-virtual-overscan]').attributes('data-value')).toBe('8')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('height'))
  })

  it('rejects non-numeric virtual.height, supports virtual=false, and uses defaults for virtual=true', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const invalid = mountTable({ virtual: { height: '400' } })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('height'))
    const fallbackHeight = invalid.find('[data-aheart-virtual-height]')
    expect(fallbackHeight.exists(), 'invalid height must use a normalized fallback').toBe(true)
    expect(fallbackHeight.attributes('data-value')).toBe('320')
    expect(mountTable({ virtual: false }).find('[data-aheart-virtual-spacer]').exists()).toBe(false)
    expect(mountTable({ virtual: true }).find('[data-aheart-virtual-estimate-size]').exists()).toBe(true)
  })

  it('renders native rows, bounded data-row overscan, logical aria-rowcount, and two spacers', () => {
    const wrapper = mountTable({ virtual: { height: 400, overscan: 4 } })
    const table = wrapper.find('[aria-rowcount]')
    expect(table.exists(), 'virtual table must expose logical rowcount').toBe(true)
    expect(table.attributes('aria-rowcount')).toBe('40')
    const dataRows = wrapper.findAll('tbody tr').filter((row) => !row.attributes('data-aheart-virtual-spacer'))
    expect(dataRows.length).toBeLessThanOrEqual(20)
    expect(wrapper.findAll('[data-aheart-virtual-spacer]')).toHaveLength(2)
  })

  it('keeps expanded base and companion rows in one logical item and applies ResizeObserver callback height', async () => {
    let callback: ResizeObserverCallback | undefined
    const observedTargets: Element[] = []
    const disconnect = vi.fn()
    class MockResizeObserver {
      constructor(next: ResizeObserverCallback) { callback = next }
      observe = (target: Element) => { observedTargets.push(target) }
      disconnect = disconnect
      unobserve = vi.fn()
    }
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
    const wrapper = mountTable({ virtual: true, expandable: { expandedRowRender: (record: Row) => h('div', { class: 'dynamic-detail' }, `${record.name} ${'detail '.repeat(80)}`) } })
    await wrapper.find('.aheart-table__expand-button').trigger('click')
    expect(wrapper.findAll('[data-aheart-virtual-logical-item="0"]')).toHaveLength(1)
    const base = wrapper.find('.aheart-table__expand-button').element.closest('tr')!
    const expanded = wrapper.find('.dynamic-detail').element.closest('tr')!
    expect(observedTargets).toEqual(expect.arrayContaining([base, expanded]))
    callback?.([
      { target: base, contentRect: { height: 48 } } as ResizeObserverEntry,
      { target: expanded, contentRect: { height: 777 } } as ResizeObserverEntry,
      { target: document.createElement('div'), contentRect: { height: 9999 } } as ResizeObserverEntry
    ], {} as ResizeObserver)
    await nextTick()
    expect(wrapper.find('[data-aheart-virtual-measured-height="825"]').exists()).toBe(true)
    expect(wrapper.find('[data-aheart-virtual-spacer]').attributes('data-measured-height')).toBe('825')
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it('runs local filter-sort-page before virtualizing and never slices server current-page data', async () => {
    const local = mountTable({ dataMode: 'local', columns: [
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: Row, b: Row) => Number(b.key) - Number(a.key) },
      { title: 'Group', dataIndex: 'group', key: 'group', filters: [{ text: 'A', value: 'A' }], defaultFilteredValue: ['A'] }
    ], pagination: { pageSize: 10 }, virtual: true })
    await local.find('th button').trigger('click')
    await local.find('.aheart-pagination__next').trigger('click')
    const localRows = local.findAll('tbody tr').filter((row) => !row.attributes('data-aheart-virtual-spacer'))
    expect(localRows.map((row) => row.text())).toEqual(['Row 9A', 'Row 8A', 'Row 7A', 'Row 6A', 'Row 5A', 'Row 4A', 'Row 3A', 'Row 2A', 'Row 1A', 'Row 0A'])
    const response = rows.slice(20, 22)
    const server = mountTable({ dataMode: 'server', dataSource: response, pagination: { current: 3, pageSize: 1, total: 40 }, virtual: true })
    expect(server.findAll('tbody tr').filter((row) => !row.attributes('data-aheart-virtual-spacer'))).toHaveLength(2)
  })

  it('bases select-all, disabled rows, and expansion on complete logical records', async () => {
    const wrapper = mountTable({ rowSelection: { defaultSelectedRowKeys: [0], getCheckboxProps: (row: Row) => ({ disabled: row.disabled }) }, expandable: { expandedRowRender: (row: Row) => row.name } })
    await wrapper.find('thead input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('selectAll')?.[0]?.[1]).toEqual(rows.filter((row) => !row.disabled).map((row) => row.key))
    expect(wrapper.find('tbody input[type="checkbox"][disabled]').exists()).toBe(true)
  })

  it('uses typed number/string radio keys and restores native group after rejected change', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    try {
      const typed = rows.map((row, index) => index === 20 ? { ...row, key: 1 } : index === 21 ? { ...row, key: '1' } : { ...row, key: `row-${index}` })
      const wrapper = mountTable({ dataSource: typed, rowSelection: { type: 'radio', selectedRowKeys: [1] } }, host)
      const scroll = wrapper.find('[data-aheart-virtual-scroll]')
      expect(scroll.exists(), 'typed-key selection requires a real virtual scroll window').toBe(true)
      await nextTick()
      scroll.element.scrollTop = 20 * 48
      await scroll.trigger('scroll')
      const stringRadio = wrapper.find<HTMLInputElement>('[data-aheart-row-token="string:1"]')
      const numberRadio = wrapper.find<HTMLInputElement>('[data-aheart-row-token="number:1"]')
      expect(stringRadio.exists()).toBe(true)
      expect(numberRadio.exists()).toBe(true)
      stringRadio.element.click()
      await nextTick()
      expect(wrapper.emitted('update:selectedRowKeys')).toEqual([[['1']]])
      expect(numberRadio.element.checked).toBe(true)
      expect(stringRadio.element.checked).toBe(false)
    } finally {
      host.remove()
    }
  })

  it('pins actually focused row, retains it while scrolled out, releases after external focus, and bridges Tab', async () => {
    const wrapper = mountTable({ rowSelection: {}, virtual: { height: 320 } })
    const first = wrapper.find('tbody input[type="checkbox"]')
    first.element.focus()
    await nextTick()
    expect(document.activeElement).toBe(first.element)
    expect(first.element.closest('tr')?.getAttribute('data-aheart-virtual-pinned')).toBe('true')
    const scroll = wrapper.find('[data-aheart-virtual-scroll]')
    scroll.element.scrollTop = 9999
    await scroll.trigger('scroll')
    const focusedAfterScroll = wrapper.find<HTMLInputElement>('[data-aheart-row-token="number:0"]')
    expect(focusedAfterScroll.exists()).toBe(true)
    expect(focusedAfterScroll.element.isConnected).toBe(true)
    await focusedAfterScroll.trigger('keydown', { key: 'Tab' })
    const nextLogical = wrapper.find<HTMLInputElement>('[data-aheart-row-token="number:1"]')
    expect(document.activeElement).toBe(nextLogical.element)
    const outside = document.createElement('button')
    document.body.append(outside)
    try {
      outside.focus()
      await focusedAfterScroll.trigger('focusout', { relatedTarget: outside })
      expect(document.activeElement).toBe(outside)
      expect(focusedAfterScroll.element.closest('tr')?.getAttribute('data-aheart-virtual-pinned')).toBeNull()
    } finally {
      outside.remove()
    }
  })

  it('renders enabled SSR twice deterministically and hydrates same tree; false stays full DOM', async () => {
    const renderEnabled = () => renderToString(createSSRApp({ render: () => h(Table, { ...props(), virtual: true } as any) }))
    const [first, second] = await Promise.all([renderEnabled(), renderEnabled()])
    expect(first).toBe(second)
    expect(first).toContain('aria-rowcount="40"')
    const container = document.createElement('div')
    let app: ReturnType<typeof createSSRApp> | undefined
    const hydrationWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      container.innerHTML = first
      document.body.append(container)
      const initialTree = container.innerHTML
      app = createSSRApp({ render: () => h(Table, { ...props(), virtual: true } as any) })
      app.mount(container, true)
      expect(container.innerHTML).toBe(initialTree)
      expect(hydrationWarn).not.toHaveBeenCalledWith(expect.stringContaining('Hydration'))
      expect(mountTable({ virtual: false }).findAll('tbody tr')).toHaveLength(40)
    } finally {
      app?.unmount()
      container.remove()
    }
  })

  it.each([
    ['rowspan', rows, [{ title: 'Name', dataIndex: 'name', key: 'name', rowspan: 2 }]],
    ['invalid key', [{ name: 'missing key' }], columns],
    ['duplicate key', [{ ...rows[0] }, { ...rows[1], key: rows[0].key }], columns]
  ])('warns and falls back to full DOM for %s', (kind, dataSource, testColumns) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const wrapper = mountTable({ columns: testColumns, dataSource, virtual: { height: 400 } })
    expect(warn).toHaveBeenCalled()
    expect(wrapper.find('[data-aheart-virtual-spacer]').exists()).toBe(false)
    expect(wrapper.findAll('tbody tr')).toHaveLength(dataSource.length)
    expect(wrapper.find('tbody').text()).toContain(kind === 'invalid key' ? 'missing key' : 'Row 0')
  })

  it('uses iframe ownerDocument defaultView observers/RAF and cleans disconnect, cancel, and listeners', () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerWindow = iframe.contentWindow!
    const observe = vi.fn()
    const disconnect = vi.fn()
    const add = vi.spyOn(ownerWindow, 'addEventListener')
    const remove = vi.spyOn(ownerWindow, 'removeEventListener')
    class MockResizeObserver { observe = observe; disconnect = disconnect; unobserve = vi.fn() }
    ownerWindow.ResizeObserver = MockResizeObserver as any
    let wrapper: VueWrapper | undefined
    try {
      wrapper = mountTable({ virtual: true }, iframe.contentDocument!.body)
      expect(observe).toHaveBeenCalled()
      wrapper.unmount()
      expect(disconnect).toHaveBeenCalled()
      if (add.mock.calls.length > 0) expect(remove.mock.calls.length).toBeGreaterThan(0)
    } finally {
      wrapper?.unmount()
      iframe.remove()
    }
  })
})
