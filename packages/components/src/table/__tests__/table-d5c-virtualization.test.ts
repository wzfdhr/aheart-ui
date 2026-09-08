import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Table from '../table.vue'

type Row = { key: string | number; name: string; group?: string; disabled?: boolean }
const rows: Row[] = Array.from({ length: 40 }, (_, index) => ({
  key: index,
  name: `Row ${index}`,
  group: index < 20 ? 'A' : 'B',
  disabled: index === 2
}))
const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }]
const props = (extra: Record<string, unknown> = {}) => ({
  columns,
  dataSource: rows,
  pagination: false,
  virtual: { height: 320, overscan: 4 },
  ...extra
})

describe('Table D5-C virtualization unit contract (RED)', () => {
  it.each([
    ['size small', 'small', 40],
    ['size middle', 'middle', 48],
    ['size large', 'large', 56]
  ])('%s uses the frozen estimateSize default', (_label, size, estimate) => {
    const wrapper = mount(Table, { props: props({ size, virtual: { height: 400 } }) as any })
    const marker = wrapper.find('[data-aheart-virtual-estimate-size]')
    expect(marker.exists()).toBe(true)
    expect(marker.attributes('data-value')).toBe(String(estimate))
  })

  it('normalizes height before scroll.y, accepts only scroll.y > 320, and warns on conflicts', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const wrapper = mount(Table, { props: props({ scroll: { y: 321 }, virtual: { height: 500, estimateSize: 52, overscan: 8 } }) as any })
    const height = wrapper.find('[data-aheart-virtual-height]')
    const overscan = wrapper.find('[data-aheart-virtual-overscan]')
    expect(height.exists()).toBe(true)
    expect(overscan.exists()).toBe(true)
    expect(height.attributes('data-value')).toBe('500')
    expect(overscan.attributes('data-value')).toBe('8')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('height'))
    warn.mockRestore()
  })

  it('uses a numeric estimateSize override and a boolean virtual=false/true default contract', () => {
    const disabled = mount(Table, { props: { ...props(), virtual: false } as any })
    expect(disabled.find('[data-aheart-virtual-spacer]').exists()).toBe(false)
    const enabled = mount(Table, { props: props({ virtual: { height: 400, estimateSize: 72 } }) as any })
    const marker = enabled.find('[data-aheart-virtual-estimate-size]')
    expect(marker.exists()).toBe(true)
    expect(marker.attributes('data-value')).toBe('72')
  })

  it('renders native rows, bounded overscan and logical aria rowcount with spacers', () => {
    const wrapper = mount(Table, { props: props({ virtual: { height: 400, overscan: 4 } }) as any })
    expect(wrapper.find('table').exists()).toBe(true)
    const table = wrapper.find('[aria-rowcount]')
    expect(table.exists()).toBe(true)
    expect(table.attributes('aria-rowcount')).toBe('40')
    expect(wrapper.findAll('tbody tr').length).toBeLessThanOrEqual(20)
    expect(wrapper.findAll('[data-aheart-virtual-spacer]')).toHaveLength(2)
  })

  it('keeps an expanded base row and companion row in one logical item and measures dynamic content', async () => {
    const resize = vi.fn()
    vi.stubGlobal('ResizeObserver', class {
      observe = resize
      disconnect = vi.fn()
      unobserve = vi.fn()
    })
    const wrapper = mount(Table, {
      props: props({
        virtual: { height: 400 },
        expandable: { expandedRowRender: (record: Row) => h('div', { class: 'dynamic-detail' }, `${record.name} ${'detail '.repeat(80)}`) }
      }) as any
    })
    await wrapper.find('.aheart-table__expand-button').trigger('click')
    expect(wrapper.findAll('[data-aheart-virtual-logical-item="0"]')).toHaveLength(1)
    expect(resize).toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('filters, sorts, and pages local data before virtualizing; server data is never sliced again', async () => {
    const local = mount(Table, { props: props({ dataMode: 'local', pagination: { pageSize: 10 }, virtual: { height: 400 } }) as any })
    expect(local.findAll('tbody tr').every((row) => rows.some((item) => row.text().includes(item.name)))).toBe(true)
    const response = rows.slice(20, 22)
    const server = mount(Table, { props: props({ dataMode: 'server', dataSource: response, pagination: { current: 3, pageSize: 1, total: 40 }, virtual: { height: 400 } }) as any })
    expect(server.findAll('tbody tr').filter((row) => !row.classes('aheart-table__virtual-spacer-row'))).toHaveLength(2)
  })

  it('bases selection, select-all, disabled rows, and expansion on complete logical records', async () => {
    const wrapper = mount(Table, {
      props: props({
        rowSelection: { defaultSelectedRowKeys: [0], getCheckboxProps: (row: Row) => ({ disabled: row.disabled }) },
        expandable: { expandedRowRender: (row: Row) => row.name }
      }) as any
    })
    await wrapper.find('thead input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('selectAll')?.[0]?.[1]).toEqual(rows.filter((row) => !row.disabled).map((row) => row.key))
    expect(wrapper.find('tbody input[type="checkbox"][disabled]').exists()).toBe(true)
  })

  it('preserves typed row tokens and rejects controlled radio changes by key, never visible index', async () => {
    const typed = [{ ...rows[0], key: 1 }, { ...rows[1], key: '1' }]
    const wrapper = mount(Table, { props: props({ dataSource: typed, rowSelection: { type: 'radio', selectedRowKeys: [1] } }) as any })
    const radios = wrapper.findAll<HTMLInputElement>('tbody input[type="radio"]')
    radios[1].element.click()
    await nextTick()
    expect(wrapper.emitted('update:selectedRowKeys')).toEqual([[['1']]])
    expect(radios.map((radio) => radio.element.checked)).toEqual([true, false])
  })

  it('pins focused row through virtualization, releases on blur, and bridges Tab to the next logical row', async () => {
    const wrapper = mount(Table, { props: props({ virtual: { height: 320 } }) as any })
    const first = wrapper.find('tbody tr:not([data-aheart-virtual-spacer])')
    await first.trigger('focusin')
    expect(first.attributes('data-aheart-virtual-pinned')).toBe('true')
    await first.trigger('keydown', { key: 'Tab' })
    await first.trigger('focusout')
    expect(first.attributes('data-aheart-virtual-pinned')).toBeUndefined()
  })

  it('keeps SSR deterministic with virtual=false and remains hydration-compatible', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(Table, { ...props(), virtual: false } as any) }))
    expect(html).toContain('Row 0')
    expect(html).not.toContain('data-aheart-virtual-spacer')
    const wrapper = mount(Table, { props: { ...props(), virtual: false } as any })
    expect(wrapper.findAll('tbody tr')).toHaveLength(40)
  })

  it.each([
    ['rowspan', [{ title: 'Name', dataIndex: 'name', key: 'name', rowspan: 2 }]],
    ['invalid key', [{ title: 'Name', dataIndex: 'name', key: 'name' }]]
  ])('warns and falls back to full DOM for unsupported %s', (kind, testColumns) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const dataSource = kind === 'invalid key' ? [{ name: 'missing key' }] : rows
    const wrapper = mount(Table, { props: props({ columns: testColumns, dataSource, virtual: { height: 400 } }) as any })
    expect(warn).toHaveBeenCalled()
    expect(wrapper.find('[data-aheart-virtual-spacer]').exists()).toBe(false)
    warn.mockRestore()
  })

  it('warns on duplicate keys and restores full DOM', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const wrapper = mount(Table, { props: props({ dataSource: [{ ...rows[0] }, { ...rows[1], key: rows[0].key }], virtual: { height: 400 } }) as any })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate'))
    expect(wrapper.find('[data-aheart-virtual-spacer]').exists()).toBe(false)
    warn.mockRestore()
  })

  it('uses ownerDocument defaultView observers and cleans RAF/observers on unmount', () => {
    const observe = vi.fn()
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    vi.stubGlobal('ResizeObserver', class {
      observe = observe
      disconnect = vi.fn()
      unobserve = vi.fn()
    })
    const wrapper = mount(Table, { props: props({ virtual: { height: 400 } }) as any })
    expect(observe).toHaveBeenCalled()
    wrapper.unmount()
    expect(cancel).toHaveBeenCalled()
    vi.unstubAllGlobals()
    cancel.mockRestore()
  })
})
