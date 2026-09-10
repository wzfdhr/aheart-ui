import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Tree from '../tree.vue'
import { createTreeIndex } from '../tree-index'
import type { TreeVirtual, TreeVirtualConfig } from '../types'
import type { TreeVirtual as PublicTreeVirtual } from '../../index'

enableAutoUnmount(afterEach)

// These aliases intentionally exercise the public type shape without coupling the
// tests to the implementation's private virtualizer instance.
const booleanVirtual: TreeVirtual = true
const configuredVirtual: TreeVirtualConfig = { height: 320, estimateSize: 28, overscan: 4 }
const publicBooleanVirtual: PublicTreeVirtual = configuredVirtual
void booleanVirtual
void configuredVirtual
void publicBooleanVirtual

const flatData = (count: number, offset = 0) => Array.from({ length: count }, (_, index) => ({
  key: offset + index,
  title: `Node ${offset + index}`
}))

const treeItems = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[role="treeitem"]')

describe('Tree virtual contract', () => {
  it('normalizes opt-in values, rejects invalid fields individually, warns, and never mutates input', async () => {
    // Keep this import runtime-local so the RED remains an individual failing
    // contract while the rest of the behavior suite still executes before the
    // implementation file exists.
    const moduleName = '../virtual-options'
    const { normalizeTreeVirtual } = await import(/* @vite-ignore */ moduleName)
    const warnings: string[] = []
    const input = { height: 480, estimateSize: 32, overscan: 2 }
    const snapshot = { ...input }

    expect(normalizeTreeVirtual(false, (message: string) => warnings.push(message))).toBeNull()
    expect(normalizeTreeVirtual(true)).toEqual({ height: 320, estimateSize: 28, overscan: 4 })
    expect(normalizeTreeVirtual({}, (message: string) => warnings.push(message))).toEqual({ height: 320, estimateSize: 28, overscan: 4 })
    expect(normalizeTreeVirtual(input)).toEqual(input)
    expect(input).toEqual(snapshot)
    expect(normalizeTreeVirtual({ height: 0, estimateSize: Infinity, overscan: 1.5 }, (message: string) => warnings.push(message)))
      .toEqual({ height: 320, estimateSize: 28, overscan: 4 })
    expect(normalizeTreeVirtual({ height: 480, unknown: 1 } as never)).toEqual({ height: 480, estimateSize: 28, overscan: 4 })
    expect(normalizeTreeVirtual('yes' as never, (message: string) => warnings.push(message))).toBeNull()
    expect(warnings.length).toBeGreaterThanOrEqual(4)
  })

  it('keeps the default path full DOM and bounds a 10k virtual window', () => {
    const data = flatData(10_000)
    const full = mount(Tree, { props: { treeData: data } })
    expect(treeItems(full)).toHaveLength(10_000)

    const virtual = mount(Tree, { props: { treeData: data, virtual: true } as never })
    expect(treeItems(virtual).length).toBeLessThanOrEqual(24)
    expect(treeItems(virtual).length).toBeGreaterThan(0)
  })

  it('supports true and config forms with per-field defaults without changing the caller object', () => {
    const data = flatData(500)
    const config = { height: 196, estimateSize: 28, overscan: 1 }
    const before = JSON.stringify(config)
    const wrapper = mount(Tree, { props: { treeData: data, virtual: config } as never })
    expect(JSON.stringify(config)).toBe(before)
    const configuredCount = treeItems(wrapper).length

    const invalid = mount(Tree, { props: { treeData: data, virtual: { height: 0, estimateSize: -1, overscan: 1.25 } } as never })
    const invalidCount = treeItems(invalid).length
    expect(configuredCount).toBeLessThanOrEqual(24)
    expect(invalidCount).toBeLessThanOrEqual(24)
  })

  it('renders explicit hierarchy metadata for partial windows and keeps numeric/string keys distinct', () => {
    const data = [{
      key: 'root', title: 'Root', children: [
        { key: 1, title: 'Numeric' },
        { key: '1', title: 'String' },
        ...flatData(500, 2)
      ]
    }]
    const wrapper = mount(Tree, { props: { treeData: data, defaultExpandedKeys: ['root'], virtual: true } as never })
    const items = treeItems(wrapper)
    for (const item of items) {
      expect(item.attributes('aria-level')).toMatch(/^\d+$/)
      expect(item.attributes('aria-posinset')).toMatch(/^\d+$/)
      expect(item.attributes('aria-setsize')).toMatch(/^\d+$/)
    }
    const numeric = wrapper.find('[data-tree-token="n-31"]')
    const string = wrapper.find('[data-tree-token="s-31"]')
    expect(numeric.exists()).toBe(true)
    expect(string.exists()).toBe(true)
    expect(numeric.attributes('id')).not.toBe(string.attributes('id'))
    expect(items.length).toBeLessThanOrEqual(24)
  })

  it('uses the complete visible sequence for End/Home and mounts before transferring focus', async () => {
    const wrapper = mount(Tree, { attachTo: document.body, props: { treeData: flatData(2_000), virtual: true } as never })
    const first = wrapper.get('[data-tree-key="0"]')
    ;(first.element as HTMLElement).focus()
    await first.trigger('keydown', { key: 'End' })
    await nextTick()
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="1999"]').element)
    expect(wrapper.get('[data-tree-key="1999"]').attributes('tabindex')).toBe('0')
    await wrapper.get('[data-tree-key="1999"]').trigger('keydown', { key: 'Home' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="0"]').element)
    expect(treeItems(wrapper).length).toBeLessThanOrEqual(24)
  })

  it('pins a focused checkbox row during recycling and cancels pending navigation when focus leaves', async () => {
    const outside = document.createElement('button')
    document.body.append(outside)
    const wrapper = mount(Tree, {
      attachTo: document.body,
      props: { treeData: flatData(1_000), checkable: true, virtual: true } as never
    })
    const checkbox = wrapper.get('[data-tree-key="0"] input').element as HTMLInputElement
    checkbox.focus()
    expect(document.activeElement).toBe(checkbox)
    wrapper.element.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(document.activeElement).toBe(checkbox)
    expect(checkbox.closest('[role="treeitem"]')).not.toBeNull()

    await wrapper.get('[data-tree-key="0"]').trigger('keydown', { key: 'End' })
    outside.focus()
    await flushPromises()
    await nextTick()
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })

  it('keeps selection, check, half-check and disabled semantics on the full logical index', async () => {
    const data = [{ key: 'disabled', title: 'Disabled', disabled: true }, { key: 'root', title: 'Root', children: flatData(400) }]
    const wrapper = mount(Tree, {
      props: {
        treeData: data,
        defaultExpandedKeys: ['root'],
        checkable: true,
        checkStrictly: false,
        checkedKeys: [2],
        selectedKeys: [],
        virtual: true
      } as never
    })
    expect(wrapper.get('[data-tree-key="root"]').attributes('aria-checked')).toBe('mixed')
    expect(wrapper.get('[data-tree-key="disabled"]').attributes('aria-disabled')).toBe('true')
    await wrapper.get('[data-tree-key="disabled"]').trigger('click')
    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
    await wrapper.get('[data-tree-key="0"]').trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.at(-1)).toEqual([[0]])
    expect(wrapper.get('[data-tree-key="0"]').attributes('aria-selected')).toBe('false')
    // Checking a mounted parent must still derive the complete logical
    // subtree, including rows that are not in the current window.
    const rootInput = wrapper.get('[data-tree-key="root"] input')
    await rootInput.setValue(true)
    const checked = wrapper.emitted('update:checkedKeys')?.at(-1)?.[0] as unknown[]
    expect(checked).toContain(399)
    expect(checked.length).toBe(401)
    expect(treeItems(wrapper).length).toBeLessThanOrEqual(24)
  })

  it('retains one roving Tab entry after blur, Tab/Shift+Tab re-entry, and a rejected controlled update', async () => {
    const before = document.createElement('button')
    const outside = document.createElement('button')
    const after = document.createElement('button')
    document.body.append(before, outside, after)
    const wrapper = mount(Tree, {
      attachTo: document.body,
      props: { treeData: flatData(1_000), virtual: true, expandedKeys: [], selectedKeys: [] } as never
    })
    expect(wrapper.findAll('[tabindex="0"]')).toHaveLength(1)
    const initialEntry = wrapper.get('[role="treeitem"][tabindex="0"]')
    expect(initialEntry.element).toBeTruthy()
    outside.focus()
    await nextTick()
    expect(wrapper.findAll('[tabindex="0"]')).toHaveLength(1)

    // Model Tab entry and Shift+Tab return with real focus transitions. The
    // roving element must stay mounted after blur; the browser owns the actual
    // traversal, so the helper focuses the resulting target explicitly.
    ;(initialEntry.element as HTMLElement).focus()
    expect(document.activeElement).toBe(initialEntry.element)
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    initialEntry.element.dispatchEvent(tab)
    after.focus()
    expect(document.activeElement).toBe(after)
    const shiftTab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
    after.dispatchEvent(shiftTab)
    ;(initialEntry.element as HTMLElement).focus()
    expect(document.activeElement).toBe(initialEntry.element)
    expect(wrapper.findAll('[role="treeitem"][tabindex="0"]')).toHaveLength(1)

    // The target starts outside the initial window. Keyboard navigation must
    // mount it before the controlled click can be exercised.
    await initialEntry.trigger('keydown', { key: 'End' })
    await flushPromises()
    await nextTick()
    const tail = wrapper.get('[data-tree-key="999"]')
    expect(document.activeElement).toBe(tail.element)
    await tail.trigger('click')
    await nextTick()
    expect(wrapper.findAll('[tabindex="0"]')).toHaveLength(1)
    expect(tail.attributes('aria-selected')).toBe('false')
    expect(treeItems(wrapper).length).toBeLessThanOrEqual(24)
    before.remove()
    outside.remove()
    after.remove()
  })

  it('keeps offscreen lazy work alive and independently aborts collapse, disable, replacement and unmount requests', async () => {
    const data = flatData(100).map(node => node.key === 99 ? { ...node, isLeaf: false } : node)
    const startRequest = async () => {
      const requests: Array<{ signal: AbortSignal; resolve: (nodes: unknown[]) => void }> = []
      const loadData = vi.fn((_node: unknown, { signal }: { signal: AbortSignal }) => new Promise<unknown[]>(resolve => {
        requests.push({ signal, resolve })
      }))
      const wrapper = mount(Tree, { props: { treeData: data, expandedKeys: [99], loadData, virtual: true } as never })
      await flushPromises()
      expect(loadData).toHaveBeenCalledTimes(1)
      expect(requests).toHaveLength(1)
      return { wrapper, requests }
    }

    const offscreen = await startRequest()
    offscreen.wrapper.element.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(offscreen.requests[0].signal.aborted).toBe(false)
    offscreen.wrapper.unmount()
    expect(offscreen.requests[0].signal.aborted).toBe(true)

    const collapsed = await startRequest()
    await collapsed.wrapper.setProps({ expandedKeys: [], virtual: true } as never)
    expect(collapsed.requests[0].signal.aborted).toBe(true)
    collapsed.wrapper.unmount()

    const disabled = await startRequest()
    await disabled.wrapper.setProps({ disabled: true, virtual: true } as never)
    expect(disabled.requests[0].signal.aborted).toBe(true)
    disabled.wrapper.unmount()

    const replaced = await startRequest()
    await replaced.wrapper.setProps({ treeData: [{ key: 99, title: 'Replacement', isLeaf: false }], virtual: true } as never)
    expect(replaced.requests[0].signal.aborted).toBe(true)
    replaced.wrapper.unmount()

    const unmounted = await startRequest()
    unmounted.wrapper.unmount()
    expect(unmounted.requests[0].signal.aborted).toBe(true)
  })

  it('uses the ownerDocument iframe realm for ResizeObserver/RAF and cleans both up on unmount', async () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const frameDocument = frame.contentDocument!
    const frameWindow = frameDocument.defaultView!
    const disconnect = vi.fn()
    const observe = vi.fn()
    const unobserve = vi.fn()
    const resizeObserver = vi.fn().mockImplementation(() => ({ observe, unobserve, disconnect }))
    const requestAnimationFrame = vi.fn().mockReturnValue(1)
    const cancelAnimationFrame = vi.fn()
    Object.defineProperty(frameWindow, 'ResizeObserver', { configurable: true, value: resizeObserver })
    Object.defineProperty(frameWindow, 'requestAnimationFrame', { configurable: true, value: requestAnimationFrame })
    Object.defineProperty(frameWindow, 'cancelAnimationFrame', { configurable: true, value: cancelAnimationFrame })
    const wrapper = mount(Tree, { attachTo: frameDocument.body, props: { treeData: flatData(500), virtual: true } as never })
    expect(wrapper.element.ownerDocument).toBe(frameDocument)
    const count = treeItems(wrapper).length
    await nextTick()
    const observerStarted = resizeObserver.mock.calls.length > 0
    const rafScheduled = requestAnimationFrame.mock.calls.length > 0
    wrapper.unmount()
    expect(frameDocument.querySelectorAll('[role="treeitem"]')).toHaveLength(0)
    const observerDisconnected = disconnect.mock.calls.length > 0
    const rafCancelled = cancelAnimationFrame.mock.calls.length > 0
    expect(observerStarted).toBe(true)
    expect(rafScheduled).toBe(true)
    expect(observerDisconnected).toBe(true)
    expect(rafCancelled).toBe(true)
    expect(count).toBeLessThanOrEqual(24)
    frame.remove()
  })

  it('renders a deterministic bounded SSR window without touching global observation capabilities', async () => {
    const props = { treeData: flatData(1_000), virtual: true } as never
    const previousResizeObserver = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver')
    const previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(globalThis, 'requestAnimationFrame')
    const serverResizeObserver = vi.fn()
    const serverRequestAnimationFrame = vi.fn()
    Object.defineProperty(globalThis, 'ResizeObserver', { configurable: true, value: serverResizeObserver })
    Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: serverRequestAnimationFrame })
    const first = await renderToString(createSSRApp(Tree, props))
    const second = await renderToString(createSSRApp(Tree, props))
    expect(serverResizeObserver).not.toHaveBeenCalled()
    expect(serverRequestAnimationFrame).not.toHaveBeenCalled()
    expect(first).toBe(second)
    const serverCount = (first.match(/role="treeitem"/g) ?? []).length
    if (previousResizeObserver) Object.defineProperty(globalThis, 'ResizeObserver', previousResizeObserver)
    else Reflect.deleteProperty(globalThis, 'ResizeObserver')
    if (previousRequestAnimationFrame) Object.defineProperty(globalThis, 'requestAnimationFrame', previousRequestAnimationFrame)
    else Reflect.deleteProperty(globalThis, 'requestAnimationFrame')
    expect(serverCount).toBeLessThanOrEqual(24)
  })

  it('hydrates with no observer before mount, then starts owner-realm observation without mismatch errors', async () => {
    const props = { treeData: flatData(1_000), virtual: true } as never
    const first = await renderToString(createSSRApp(Tree, props))
    const host = document.createElement('div')
    host.innerHTML = first
    const beforeHydrate = host.querySelectorAll('[role="treeitem"]').length
    const errors: unknown[] = []
    const hydrationResizeObserver = vi.fn().mockImplementation(() => ({ observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }))
    const hydrationRequestAnimationFrame = vi.fn().mockReturnValue(1)
    const hydrationCancelAnimationFrame = vi.fn()
    const previousResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
    const previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')
    const previousCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame')
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: hydrationResizeObserver })
    Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: hydrationRequestAnimationFrame })
    Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: hydrationCancelAnimationFrame })
    const app = createSSRApp(Tree, props)
    app.config.errorHandler = error => errors.push(error)
    expect(hydrationResizeObserver).not.toHaveBeenCalled()
    expect(hydrationRequestAnimationFrame).not.toHaveBeenCalled()
    try {
      app.mount(host, true)
      expect(host.querySelectorAll('[role="treeitem"]').length).toBe(beforeHydrate)
      expect(errors).toEqual([])
      await nextTick()
      await flushPromises()
      const observerStarted = hydrationResizeObserver.mock.calls.length > 0
      const rafScheduled = hydrationRequestAnimationFrame.mock.calls.length > 0
      const cancelBeforeUnmount = hydrationCancelAnimationFrame.mock.calls.length
      app.unmount()
      const rafCancelled = hydrationCancelAnimationFrame.mock.calls.length > 0
      expect(observerStarted).toBe(true)
      expect(rafScheduled).toBe(true)
      expect(cancelBeforeUnmount).toBe(0)
      expect(rafCancelled).toBe(true)
    } finally {
      if (previousResizeObserver) Object.defineProperty(window, 'ResizeObserver', previousResizeObserver)
      else Reflect.deleteProperty(window, 'ResizeObserver')
      if (previousRequestAnimationFrame) Object.defineProperty(window, 'requestAnimationFrame', previousRequestAnimationFrame)
      else Reflect.deleteProperty(window, 'requestAnimationFrame')
      if (previousCancelAnimationFrame) Object.defineProperty(window, 'cancelAnimationFrame', previousCancelAnimationFrame)
      else Reflect.deleteProperty(window, 'cancelAnimationFrame')
    }
  })

  it('falls back safely when the mounted owner realm lacks observation while preserving duplicate/cycle errors', () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const frameWindow = frame.contentDocument!.defaultView!
    const previousGlobal = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver')
    const globalResizeObserver = vi.fn(() => { throw new Error('wrong realm') })
    try {
      Object.defineProperty(globalThis, 'ResizeObserver', { configurable: true, value: globalResizeObserver })
      Object.defineProperty(frameWindow, 'ResizeObserver', { configurable: true, value: undefined })
      // This models a mounted realm with no observer. The adapter must not
      // borrow the parent/global constructor and must preserve full state.
      const wrapper = mount(Tree, { attachTo: frame.contentDocument!.body, props: { treeData: flatData(40), virtual: true } as never })
      expect(treeItems(wrapper).length).toBe(40)
      wrapper.unmount()
    } finally {
      if (previousGlobal) Object.defineProperty(globalThis, 'ResizeObserver', previousGlobal)
      else Reflect.deleteProperty(globalThis, 'ResizeObserver')
      frame.remove()
    }
    expect(globalResizeObserver).not.toHaveBeenCalled()
    expect(() => createTreeIndex([{ key: 'duplicate', title: 'A' }, { key: 'duplicate', title: 'B' }])).toThrow(/unique/)
    const root: any = { key: 'cycle', title: 'Cycle' }
    root.children = [root]
    expect(() => createTreeIndex([root])).toThrow(/unique/)
  })
})
