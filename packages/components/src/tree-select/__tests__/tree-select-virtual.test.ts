import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TreeSelect from '../tree-select.vue'

type ControlledObserver = {
  disconnect: ReturnType<typeof vi.fn>
}

const observers: ControlledObserver[] = []
const trackedWrappers: Array<ReturnType<typeof mount>> = []
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined

class ControlledResizeObserver {
  readonly disconnect = vi.fn()

  constructor() {
    observers.push(this)
  }

  observe() {}
  unobserve() {}
}

const flatData = (count: number) => Array.from({ length: count }, (_, key) => ({ key: `node-${key}`, title: `Node ${key}` }))

const mountSelect = (props: Record<string, unknown>) => {
  const wrapper = mount(TreeSelect, {
    attachTo: document.body,
    props: props as never,
    global: { stubs: { Teleport: true } }
  })
  trackedWrappers.push(wrapper)
  return wrapper
}

const flushOwnerRealm = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}

beforeEach(() => {
  observers.length = 0
  previousResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
  previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')
  previousCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame')
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: ControlledResizeObserver })
  Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: vi.fn().mockReturnValue(1) })
  Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: vi.fn() })
})

afterEach(() => {
  for (const wrapper of trackedWrappers.splice(0)) wrapper.unmount()
  if (previousResizeObserver) Object.defineProperty(window, 'ResizeObserver', previousResizeObserver)
  else Reflect.deleteProperty(window, 'ResizeObserver')
  if (previousRequestAnimationFrame) Object.defineProperty(window, 'requestAnimationFrame', previousRequestAnimationFrame)
  else Reflect.deleteProperty(window, 'requestAnimationFrame')
  if (previousCancelAnimationFrame) Object.defineProperty(window, 'cancelAnimationFrame', previousCancelAnimationFrame)
  else Reflect.deleteProperty(window, 'cancelAnimationFrame')
  previousResizeObserver = undefined
  previousRequestAnimationFrame = undefined
  previousCancelAnimationFrame = undefined
})

describe('TreeSelect virtual contract RED', () => {
  it('keeps default false full DOM while true bounds a large logical data window', async () => {
    const full = mountSelect({ treeData: flatData(100), defaultOpen: true })
    await flushOwnerRealm()
    expect(full.findAll('[role="treeitem"]')).toHaveLength(100)

    const virtual = mountSelect({ treeData: flatData(1_000), defaultOpen: true, virtual: true })
    await flushOwnerRealm()
    expect(virtual.findAll('[role="treeitem"]').length).toBeLessThanOrEqual(24)
    expect(virtual.get('.aheart-tree').attributes('style')).toContain('max-block-size: 256px')
  })

  it('applies empty/configured virtual defaults without mutating the caller config', async () => {
    const emptyConfig = mountSelect({ treeData: flatData(500), defaultOpen: true, virtual: {} })
    await flushOwnerRealm()
    expect(emptyConfig.findAll('[role="treeitem"]').length).toBeLessThanOrEqual(24)

    const config = { height: 180, estimateSize: 36, overscan: 1 }
    const before = JSON.stringify(config)
    const configured = mountSelect({ treeData: flatData(500), defaultOpen: true, virtual: config })
    await flushOwnerRealm()
    expect(configured.findAll('[role="treeitem"]').length).toBeLessThanOrEqual(24)
    expect(configured.get('.aheart-tree').attributes('style')).toContain('max-block-size: 180px')
    expect(JSON.stringify(config)).toBe(before)
  })

  it('falls back invalid virtual fields individually and preserves the caller config', async () => {
    const warnings: unknown[][] = []
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => { warnings.push(args) })
    const config = { height: 0, estimateSize: Infinity, overscan: 1.5 }
    const before = JSON.stringify(config)
    try {
      const wrapper = mountSelect({ treeData: flatData(500), defaultOpen: true, virtual: config })
      await flushOwnerRealm()
      expect(wrapper.get('.aheart-tree').attributes('style') ?? '').toContain('max-block-size: 256px')
      expect(wrapper.findAll('[role="treeitem"]').length).toBeLessThanOrEqual(24)
      expect(JSON.stringify(config)).toBe(before)
      expect(warnings.length).toBeGreaterThanOrEqual(3)
    } finally {
      warnSpy.mockRestore()
    }
  })

  it('uses real DOM focus for virtual search and never publishes trigger aria-activedescendant', async () => {
    const wrapper = mountSelect({ treeData: flatData(500), showSearch: true, defaultOpen: true, virtual: true })
    await flushOwnerRealm()
    const trigger = wrapper.get('.aheart-tree-select__trigger')
    expect(trigger.attributes('aria-activedescendant')).toBeUndefined()
    const search = wrapper.get('input[type="search"]')
    search.element.focus()
    await search.trigger('keydown', { key: 'ArrowDown' })
    await flushOwnerRealm()
    expect(document.activeElement?.matches('[role="treeitem"]')).toBe(true)
    expect(trigger.attributes('aria-activedescendant')).toBeUndefined()
    expect(wrapper.findAll('[role="treeitem"]').length).toBeLessThanOrEqual(24)

    await search.setValue('does-not-exist')
    expect(wrapper.get('[role="status"]').text()).toBe('暂无匹配节点')
  })

  it('uses the last enabled result for search ArrowUp and End navigation outside the mounted window', async () => {
    const data = flatData(100).map((node, index) => index === 99 ? { ...node, disabled: true } : node)
    const wrapper = mountSelect({ treeData: data, showSearch: true, defaultOpen: true, virtual: true })
    await flushOwnerRealm()
    const search = wrapper.get('input[type="search"]')
    search.element.focus()
    await search.trigger('keydown', { key: 'ArrowUp' })
    await flushOwnerRealm()
    expect(document.activeElement?.getAttribute('data-tree-key')).toBe('node-98')
    await wrapper.get('[data-tree-key="node-98"]').trigger('keydown', { key: 'End' })
    await flushOwnerRealm()
    expect(document.activeElement?.getAttribute('data-tree-key')).toBe('node-98')
  })

  it('keeps controlled open and value parent-authoritative in virtual mode', async () => {
    const open = mountSelect({ treeData: flatData(20), virtual: true, open: false })
    await open.get('.aheart-tree-select__trigger').trigger('click')
    expect(open.get('.aheart-tree-select__trigger').attributes('aria-expanded')).toBe('false')
    expect(open.find('.aheart-tree-select__panel').exists()).toBe(false)

    const value = mountSelect({ treeData: flatData(20), virtual: true, modelValue: 'node-1', defaultOpen: true })
    await flushOwnerRealm()
    await value.get('[data-tree-key="node-2"]').trigger('click')
    expect(value.emitted('update:modelValue')).toEqual([['node-2']])
    expect(value.get('.aheart-tree-select__trigger').text()).toContain('Node 1')
  })

  it('keeps checkable search semantics on the full index while virtual rows stay bounded', async () => {
    const data = [{
      key: 'root', title: 'Root', children: [
        { key: 'enabled', title: 'Enabled' },
        { key: 'disabled', title: 'Disabled', disabled: true },
        ...flatData(100)
      ]
    }]
    const wrapper = mountSelect({ treeData: data, treeCheckable: true, treeCheckStrictly: false, showSearch: true, defaultOpen: true, virtual: true, multiple: true })
    await flushOwnerRealm()
    expect(wrapper.findAll('[role="treeitem"]').length).toBeLessThanOrEqual(24)
    const search = wrapper.get('input[type="search"]')
    await search.setValue('Disabled')
    await flushOwnerRealm()
    expect((wrapper.get('[data-tree-key="disabled"] input').element as HTMLInputElement).disabled).toBe(true)
    await search.setValue('Enabled')
    await wrapper.get('[data-tree-key="root"] input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['root', 'enabled', ...data[0].children.slice(2).map(node => node.key)]])
    expect(wrapper.get('.aheart-tree-select__trigger').text()).toContain('Root')
  })

  it('keeps the popup shell from becoming a second vertical scroll owner in virtual mode', async () => {
    const wrapper = mountSelect({ treeData: flatData(500), defaultOpen: true, virtual: true })
    await flushOwnerRealm()
    const panel = wrapper.get('.aheart-tree-select__panel').element as HTMLElement
    const tree = wrapper.get('.aheart-tree').element as HTMLElement
    // This unit gate intentionally checks the component's inline owner wiring;
    // browser CSS/real clientHeight geometry remains a browser-level gate.
    expect(panel.style.overflowY).not.toBe('auto')
    expect(tree.style.overflowY).toBe('auto')
    expect(tree.style.maxBlockSize).toBe('256px')
  })

  it('renders a deterministic bounded virtual SSR window without observer capability access', async () => {
    const serverResizeObserver = vi.fn()
    const serverRequestAnimationFrame = vi.fn()
    const previousGlobalResizeObserver = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver')
    const previousGlobalRequestAnimationFrame = Object.getOwnPropertyDescriptor(globalThis, 'requestAnimationFrame')
    Object.defineProperty(globalThis, 'ResizeObserver', { configurable: true, value: serverResizeObserver })
    Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: serverRequestAnimationFrame })
    try {
      const props = { treeData: flatData(1_000), defaultOpen: true, virtual: true } as never
      const first = await renderToString(createSSRApp(TreeSelect, props))
      const second = await renderToString(createSSRApp(TreeSelect, props))
      expect(first).toBe(second)
      expect(serverResizeObserver).not.toHaveBeenCalled()
      expect(serverRequestAnimationFrame).not.toHaveBeenCalled()
      expect((first.match(/role="treeitem"/g) ?? []).length).toBeLessThanOrEqual(24)
    } finally {
      if (previousGlobalResizeObserver) Object.defineProperty(globalThis, 'ResizeObserver', previousGlobalResizeObserver)
      else Reflect.deleteProperty(globalThis, 'ResizeObserver')
      if (previousGlobalRequestAnimationFrame) Object.defineProperty(globalThis, 'requestAnimationFrame', previousGlobalRequestAnimationFrame)
      else Reflect.deleteProperty(globalThis, 'requestAnimationFrame')
    }
  })
})
