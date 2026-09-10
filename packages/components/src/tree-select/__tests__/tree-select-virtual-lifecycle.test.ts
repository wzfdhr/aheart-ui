import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TreeSelect from '../tree-select.vue'

type DeferredNodes = Array<{ key: string; title: string }>
type ControlledObserver = {
  disconnect: ReturnType<typeof vi.fn>
}

const wrappers: Array<ReturnType<typeof mount>> = []
const data = (count = 100) => Array.from({ length: count }, (_, key) => ({ key: `node-${key}`, title: `Node ${key}` }))
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined

const mountSelect = (props: Record<string, unknown>, options: Record<string, unknown> = {}) => {
  const wrapper = mount(TreeSelect, {
    attachTo: document.body,
    props: props as never,
    ...options
  })
  wrappers.push(wrapper)
  return wrapper
}

const disposeWrapper = (wrapper: ReturnType<typeof mount>) => {
  wrapper.unmount()
  const index = wrappers.indexOf(wrapper)
  if (index >= 0) wrappers.splice(index, 1)
}

const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}

beforeEach(() => {
  previousResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
  previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')
  previousCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame')
  // Keep the draft's capability fixture same-realm and controllable without
  // depending on a future TreeSelect-private adapter bridge.
  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    value: class DraftResizeObserver {
      disconnect() {}
      observe() {}
      unobserve() {}
    }
  })
  Object.defineProperty(window, 'requestAnimationFrame', {
    configurable: true,
    value: vi.fn().mockReturnValue(1)
  })
  Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: vi.fn() })
})

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
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

describe('TreeSelect virtual lifecycle draft', () => {
  it('keeps a valid loader alive when controlled open close is rejected, then aborts on accepted close and ignores late data', async () => {
    let resolve!: (nodes: DeferredNodes) => void
    let signal!: AbortSignal
    const loadData = vi.fn((_node: unknown, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<DeferredNodes>(done => { resolve = done })
    })
    const wrapper = mountSelect({
      treeData: [{ key: 'root', title: 'Root', isLeaf: false }],
      virtual: true,
      open: true,
      loadData
    }, { global: { stubs: { Teleport: true } } })

    await settle()
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await settle()
    expect(loadData).toHaveBeenCalledTimes(1)

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await nextTick()
    expect(wrapper.emitted('openChange')).toEqual([[false]])
    expect(wrapper.get('.aheart-tree-select__trigger').attributes('aria-expanded')).toBe('true')
    expect(signal.aborted).toBe(false)

    await wrapper.setProps({ open: false } as never)
    await settle()
    expect(signal.aborted).toBe(true)
    resolve([{ key: 'late', title: 'Late child' }])
    await settle()
    expect(wrapper.text()).not.toContain('Late child')
  })

  it('renders lazy errors, retries through the public retry action, and commits children only after retry succeeds', async () => {
    const loadData = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([{ key: 'child', title: 'Loaded child' }])
    const wrapper = mountSelect({
      treeData: [{ key: 'root', title: 'Root', isLeaf: false }],
      virtual: true,
      defaultOpen: true,
      loadData
    }, { global: { stubs: { Teleport: true } } })

    await settle()
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await settle()
    expect(wrapper.get('[aria-label="重试加载 Root"]').exists()).toBe(true)
    expect(wrapper.get('[data-tree-key="root"]').attributes('aria-busy')).toBeUndefined()

    await wrapper.get('[aria-label="重试加载 Root"]').trigger('click')
    await settle()
    expect(loadData).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('Loaded child')
  })

  it('aborts pending lazy work on disabled transition and unmount', async () => {
    let signal!: AbortSignal
    const loadData = vi.fn((_node: unknown, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<DeferredNodes>(() => {})
    })
    const disabled = mountSelect({
      treeData: [{ key: 'root', title: 'Root', isLeaf: false }],
      virtual: true,
      defaultOpen: true,
      loadData
    }, { global: { stubs: { Teleport: true } } })
    await settle()
    await disabled.get('.aheart-tree__switcher').trigger('click')
    await settle()
    const disabledSignal = signal
    await disabled.setProps({ disabled: true } as never)
    expect(disabledSignal.aborted).toBe(true)

    let unmountSignal!: AbortSignal
    const unmounted = mountSelect({
      treeData: [{ key: 'root', title: 'Root', isLeaf: false }],
      virtual: true,
      defaultOpen: true,
      loadData: vi.fn((_node: unknown, context: { signal: AbortSignal }) => {
        unmountSignal = context.signal
        return new Promise<DeferredNodes>(() => {})
      })
    }, { global: { stubs: { Teleport: true } } })
    await settle()
    await unmounted.get('.aheart-tree__switcher').trigger('click')
    await settle()
    disposeWrapper(unmounted)
    expect(unmountSignal.aborted).toBe(true)
  })

  it('hydrates a bounded first window without pre-mount observation or hydration diagnostics', async () => {
    const props = {
      treeData: data(100),
      virtual: true,
      defaultOpen: true
    } as never
    const html = await renderToString(createSSRApp(TreeSelect, props))
    const host = document.createElement('div')
    host.innerHTML = html
    document.body.append(host)
    const beforeHydrate = host.querySelectorAll('[role="treeitem"]').length
    const warnings: unknown[] = []
    const errors: unknown[] = []
    const consoleWarnings: unknown[][] = []
    const consoleErrors: unknown[][] = []
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => { consoleWarnings.push(args) })
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => { consoleErrors.push(args) })
    const observerCalls: unknown[] = []
    const hydrationObserver = vi.fn().mockImplementation(() => {
      observerCalls.push(true)
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
    })
    const rafCalls = vi.fn().mockReturnValue(1)
    const cancelCalls = vi.fn()
    const previousResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
    const previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')
    const previousCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame')
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: hydrationObserver })
    Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: rafCalls })
    Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: cancelCalls })
    const app = createSSRApp(TreeSelect, props)
    app.config.warnHandler = warning => warnings.push(warning)
    app.config.errorHandler = error => errors.push(error)
    let beforeMountObserverCalls: number | undefined
    let beforeMountRafCalls: number | undefined
    app.mixin({
      beforeMount() {
        if (beforeMountObserverCalls === undefined) {
          beforeMountObserverCalls = hydrationObserver.mock.calls.length
          beforeMountRafCalls = rafCalls.mock.calls.length
        }
      }
    })
    let mounted = false
    let unmounted = false
    try {
      expect(observerCalls).toHaveLength(0)
      expect(rafCalls).not.toHaveBeenCalled()
      app.mount(host, true)
      mounted = true
      expect(host.querySelectorAll('[role="treeitem"]').length).toBe(beforeHydrate)
      expect(beforeHydrate).toBeLessThanOrEqual(24)
      expect(beforeMountObserverCalls).toBe(0)
      expect(beforeMountRafCalls).toBe(0)
      await settle()
      expect(warnings).toEqual([])
      expect(errors).toEqual([])
      expect(consoleWarnings).toEqual([])
      expect(consoleErrors).toEqual([])
      expect(hydrationObserver).toHaveBeenCalled()
      expect(rafCalls).toHaveBeenCalled()
      app.unmount()
      unmounted = true
      expect(cancelCalls).toHaveBeenCalled()
    } finally {
      if (mounted && !unmounted) app.unmount()
      warnSpy.mockRestore()
      errorSpy.mockRestore()
      if (previousResizeObserver) Object.defineProperty(window, 'ResizeObserver', previousResizeObserver)
      else Reflect.deleteProperty(window, 'ResizeObserver')
      if (previousRequestAnimationFrame) Object.defineProperty(window, 'requestAnimationFrame', previousRequestAnimationFrame)
      else Reflect.deleteProperty(window, 'requestAnimationFrame')
      if (previousCancelAnimationFrame) Object.defineProperty(window, 'cancelAnimationFrame', previousCancelAnimationFrame)
      else Reflect.deleteProperty(window, 'cancelAnimationFrame')
      host.remove()
    }
  })

  it('uses the iframe owner realm for virtual popup observation and cleans it on unmount', async () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const frameDocument = frame.contentDocument!
    const frameWindow = frameDocument.defaultView!
    const frameObservers: Array<{ disconnect: ReturnType<typeof vi.fn> }> = []
    const frameRaf = new Map<number, FrameRequestCallback>()
    let frameHandle = 0
    class FrameResizeObserver {
      readonly disconnect = vi.fn()
      constructor() { frameObservers.push(this) }
      observe() {}
      unobserve() {}
    }
    Object.defineProperty(frameWindow, 'ResizeObserver', { configurable: true, value: FrameResizeObserver })
    Object.defineProperty(frameWindow, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => { const id = ++frameHandle; frameRaf.set(id, callback); return id }
    })
    Object.defineProperty(frameWindow, 'cancelAnimationFrame', {
      configurable: true,
      value: (id: number) => { frameRaf.delete(id) }
    })
    let iframeWrapper: ReturnType<typeof mount> | undefined
    try {
      const created = mount(TreeSelect, {
        attachTo: frameDocument.body,
        props: { treeData: data(100), virtual: true, defaultOpen: true } as never
      })
      iframeWrapper = created
      wrappers.push(created)
      await settle()
      expect(created.element.ownerDocument).toBe(frameDocument)
      expect(frameDocument.querySelector('.aheart-tree-select__panel')).toBeTruthy()
      expect(frameObservers.length).toBeGreaterThan(0)
      disposeWrapper(created)
      iframeWrapper = undefined
      expect(frameDocument.querySelector('.aheart-tree-select__panel')).toBeNull()
      expect(frameObservers.every(observer => observer.disconnect.mock.calls.length > 0)).toBe(true)
      expect(frameRaf.size).toBe(0)
    } finally {
      if (iframeWrapper) disposeWrapper(iframeWrapper)
      frame.remove()
    }
  })
})
