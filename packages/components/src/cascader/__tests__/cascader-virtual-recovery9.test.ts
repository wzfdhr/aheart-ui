import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cascader from '../cascader.vue'

type Option = { value: string; label: string; children?: Option[]; isLeaf?: boolean }

const wrappers: Array<ReturnType<typeof mount>> = []
const rafQueue = new Map<number, FrameRequestCallback>()
let rafId = 0
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined

class ControlledResizeObserver {
  constructor(readonly callback: ResizeObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

const track = <T extends ReturnType<typeof mount>>(wrapper: T) => {
  const unmount = wrapper.unmount.bind(wrapper)
  let mounted = true
  wrapper.unmount = (() => { if (mounted) { mounted = false; unmount() } }) as T['unmount']
  wrappers.push(wrapper)
  return wrapper
}

const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
  const callbacks = [...rafQueue.values()]
  rafQueue.clear()
  callbacks.forEach(callback => callback(performance.now()))
  await nextTick()
}

const mountLazy = (props: Record<string, unknown> = {}) => track(mount(Cascader, {
  attachTo: document.body,
  props: {
    options: [{ value: 'root', label: 'Lazy root', isLeaf: false }],
    open: true,
    virtual: true,
    getPopupContainer: (trigger: HTMLElement) => trigger.parentElement!,
    ...props
  } as never
}))

const enter = async (wrapper: ReturnType<typeof mount>) => {
  const root = wrapper.get('[data-cascader-value="root"]')
  root.element.focus()
  root.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  await nextTick()
  return root
}

/** Model the native focus loss caused by replacing a focused button with a disabled loading button. */
const nativeLoadingRenderLoss = (element: HTMLElement, ownerDocument: Document) => {
  const ownerWindow = ownerDocument.defaultView!
  element.dispatchEvent(new ownerWindow.FocusEvent('blur', { bubbles: false, relatedTarget: null }))
  element.dispatchEvent(new ownerWindow.FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
  element.blur()
}

beforeEach(() => {
  rafQueue.clear()
  previousResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
  previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')
  previousCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame')
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: ControlledResizeObserver })
  Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => { const id = ++rafId; rafQueue.set(id, callback); return id } })
  Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: (id: number) => rafQueue.delete(id) })
})

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
  rafQueue.clear()
  if (previousResizeObserver) Object.defineProperty(window, 'ResizeObserver', previousResizeObserver)
  else Reflect.deleteProperty(window, 'ResizeObserver')
  if (previousRequestAnimationFrame) Object.defineProperty(window, 'requestAnimationFrame', previousRequestAnimationFrame)
  else Reflect.deleteProperty(window, 'requestAnimationFrame')
  if (previousCancelAnimationFrame) Object.defineProperty(window, 'cancelAnimationFrame', previousCancelAnimationFrame)
  else Reflect.deleteProperty(window, 'cancelAnimationFrame')
})

describe('Cascader lazy keyboard focus ownership round nine', () => {
  it.each([true, false])('naturally restores the same enabled retry row after a loading render blur (%s)', async virtual => {
    let rejectLoad!: (error: Error) => void
    const loadData = vi.fn(() => new Promise<Option[]>((_resolve, reject) => { rejectLoad = reject }))
    const wrapper = mountLazy({ virtual, loadData })
    await settle()
    const root = await enter(wrapper)
    expect(root.attributes('aria-busy')).toBe('true')
    nativeLoadingRenderLoss(root.element, root.element.ownerDocument)
    rejectLoad(new Error('offline'))
    await settle()

    expect(root.attributes('aria-busy')).toBeUndefined()
    expect(root.attributes('aria-label')).toContain('加载失败')
    expect(root.element.disabled).toBe(false)
    expect(root.element.ownerDocument.activeElement).toBe(root.element)

    // This dispatch intentionally does not focus the target; a locator.press-style helper would hide a lost owner.
    root.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await nextTick()
    expect(loadData).toHaveBeenCalledTimes(2)
  })

  it.each([true, false])('focuses the first child after a natural loading render blur and successful load (%s)', async virtual => {
    let resolveLoad!: (children: Option[]) => void
    const loadData = vi.fn(() => new Promise<Option[]>(resolve => { resolveLoad = resolve }))
    const wrapper = mountLazy({ virtual, loadData })
    await settle()
    const root = await enter(wrapper)
    nativeLoadingRenderLoss(root.element, root.element.ownerDocument)
    resolveLoad([{ value: 'child', label: 'Loaded child' }])
    await settle()
    const child = wrapper.get('[data-cascader-value="child"]')
    expect(root.element.ownerDocument.activeElement).toBe(child.element)
  })

  it.each([true, false])('retains the source focus when a natural loading render completes with empty children (%s)', async virtual => {
    let resolveLoad!: (children: Option[]) => void
    const loadData = vi.fn(() => new Promise<Option[]>(resolve => { resolveLoad = resolve }))
    const wrapper = mountLazy({ virtual, loadData })
    await settle()
    const root = await enter(wrapper)
    nativeLoadingRenderLoss(root.element, root.element.ownerDocument)
    resolveLoad([])
    await settle()
    expect(root.element.ownerDocument.activeElement).toBe(root.element)
  })

  it.each([
    ['nonfocusable outside pointerdown', (wrapper: ReturnType<typeof mount>) => {
      const outside = document.createElement('div')
      document.body.append(outside)
      outside.dispatchEvent(new document.defaultView!.Event('pointerdown', { bubbles: true, cancelable: true }))
      outside.remove()
    }],
    ['owner window blur', (_wrapper: ReturnType<typeof mount>) => window.dispatchEvent(new Event('blur'))],
    ['Tab departure', (wrapper: ReturnType<typeof mount>) => {
      const outside = document.createElement('button')
      document.body.append(outside)
      const root = wrapper.get('[data-cascader-value="root"]')
      root.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
      outside.focus()
      outside.remove()
    }]
  ] as const)('cancels focus restoration on %s while valid loading still resolves', async (_name, cancel) => {
    let resolveLoad!: (children: Option[]) => void
    let signal!: AbortSignal
    const loadData = vi.fn((_option: Option, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<Option[]>(resolve => { resolveLoad = resolve })
    })
    const wrapper = mountLazy({ loadData })
    await settle()
    const root = await enter(wrapper)
    cancel(wrapper)
    resolveLoad([{ value: 'child', label: 'Loaded child' }])
    await settle()
    expect(signal.aborted).toBe(false)
    expect(wrapper.get('[data-cascader-value="child"]').exists()).toBe(true)
    expect(root.element.ownerDocument.activeElement).not.toBe(wrapper.get('[data-cascader-value="child"]').element)
  })

  it.each(['wheel', 'touchstart'] as const)('cancels focus restoration on panel %s without aborting the loader', async eventName => {
    let resolveLoad!: (children: Option[]) => void
    let signal!: AbortSignal
    const loadData = vi.fn((_option: Option, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<Option[]>(resolve => { resolveLoad = resolve })
    })
    const wrapper = mountLazy({ loadData })
    await settle()
    const root = await enter(wrapper)
    wrapper.get('.aheart-cascader__panel').element.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }))
    resolveLoad([{ value: 'child', label: 'Loaded child' }])
    await settle()
    expect(signal.aborted).toBe(false)
    expect(root.element.ownerDocument.activeElement).not.toBe(wrapper.get('[data-cascader-value="child"]').element)
  })

  it('uses the iframe owner document for natural recovery instead of the parent document', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    let resolveLoad!: (children: Option[]) => void
    const loadData = vi.fn(() => new Promise<Option[]>(resolve => { resolveLoad = resolve }))
    const wrapper = track(mount(Cascader, {
      attachTo: ownerDocument.body,
      props: { options: [{ value: 'root', label: 'Lazy root', isLeaf: false }], open: true, virtual: true, loadData, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never
    }))
    try {
      await settle()
      const root = wrapper.get('[data-cascader-value="root"]')
      root.element.focus()
      root.element.dispatchEvent(new ownerDocument.defaultView!.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
      await nextTick()
      nativeLoadingRenderLoss(root.element, ownerDocument)
      resolveLoad([{ value: 'child', label: 'Loaded child' }])
      await settle()
      expect(ownerDocument.activeElement).toBe(wrapper.get('[data-cascader-value="child"]').element)
      expect(document.activeElement).not.toBe(wrapper.get('[data-cascader-value="child"]').element)
    } finally {
      iframe.remove()
    }
  })

  it('does not let an old same-key finally clear a newer loader owner', async () => {
    const resolvers: Array<(children: Option[]) => void> = []
    const loadData = vi.fn(() => new Promise<Option[]>(resolve => { resolvers.push(resolve) }))
    const wrapper = mountLazy({ loadData })
    await settle()
    let root = await enter(wrapper)
    root.element.blur()
    await wrapper.setProps({ loadData: vi.fn(() => new Promise<Option[]>(resolve => { resolvers.push(resolve) })) } as never)
    await settle()
    root = wrapper.get('[data-cascader-value="root"]')
    root.element.focus()
    root.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await nextTick()
    expect(resolvers).toHaveLength(2)
    resolvers[0]([{ value: 'stale', label: 'Stale child' }])
    await settle()
    expect(wrapper.find('[data-cascader-value="stale"]').exists()).toBe(false)
    resolvers[1]([{ value: 'fresh', label: 'Fresh child' }])
    await settle()
    expect(wrapper.find('[data-cascader-value="fresh"]').exists()).toBe(true)
  })
})
