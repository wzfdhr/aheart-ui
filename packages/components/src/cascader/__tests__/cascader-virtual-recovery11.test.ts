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

const probeRealm = (ownerDocument: Document) => {
  const ownerWindow = ownerDocument.defaultView!
  const active = new Map<string, number>()
  const listenerIds = new WeakMap<object, number>()
  let listenerId = 0
  const pendingRaf = new Map<number, FrameRequestCallback>()
  const rafOrigins = new Map<number, string>()
  const pendingTimers = new Set<ReturnType<typeof ownerWindow.setTimeout>>()
  const timerOrigins = new Map<ReturnType<typeof ownerWindow.setTimeout>, string>()
  const originalDocumentAdd = ownerDocument.addEventListener
  const originalDocumentRemove = ownerDocument.removeEventListener
  const originalWindowAdd = ownerWindow.addEventListener
  const originalWindowRemove = ownerWindow.removeEventListener
  const originalSetTimeout = ownerWindow.setTimeout
  const originalClearTimeout = ownerWindow.clearTimeout
  const previousRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'requestAnimationFrame')
  const previousCancelRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'cancelAnimationFrame')
  const previousSetTimeout = Object.getOwnPropertyDescriptor(ownerWindow, 'setTimeout')
  const previousClearTimeout = Object.getOwnPropertyDescriptor(ownerWindow, 'clearTimeout')
  const key = (target: 'document' | 'window', type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) => {
    if (!listener) return `${target}:${type}:none:${Boolean(options)}`
    const object = listener as object
    const id = listenerIds.get(object) ?? (++listenerId)
    listenerIds.set(object, id)
    const capture = typeof options === 'boolean' ? options : Boolean(options?.capture)
    return `${target}:${type}:${id}:${capture}`
  }
  const add = (target: 'document' | 'window', type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) => {
    const name = key(target, type, listener, options)
    active.set(name, (active.get(name) ?? 0) + 1)
  }
  const remove = (target: 'document' | 'window', type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions) => {
    const name = key(target, type, listener, options)
    const count = active.get(name) ?? 0
    if (count <= 1) active.delete(name)
    else active.set(name, count - 1)
  }
  Object.defineProperty(ownerDocument, 'addEventListener', { configurable: true, value(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) { add('document', type, listener, options); return originalDocumentAdd.call(this, type, listener, options) } })
  Object.defineProperty(ownerDocument, 'removeEventListener', { configurable: true, value(type: string, listener: EventListenerOrEventObject | null, options?: boolean | EventListenerOptions) { remove('document', type, listener, options); return originalDocumentRemove.call(this, type, listener, options) } })
  Object.defineProperty(ownerWindow, 'addEventListener', { configurable: true, value(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) { add('window', type, listener, options); return originalWindowAdd.call(this, type, listener, options) } })
  Object.defineProperty(ownerWindow, 'removeEventListener', { configurable: true, value(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions) { remove('window', type, listener, options); return originalWindowRemove.call(this, type, listener, options) } })
  let rafSequence = 0
  Object.defineProperty(ownerWindow, 'requestAnimationFrame', { configurable: true, value(callback: FrameRequestCallback) { const id = ++rafSequence; pendingRaf.set(id, callback); rafOrigins.set(id, new Error().stack ?? ''); return id } })
  Object.defineProperty(ownerWindow, 'cancelAnimationFrame', { configurable: true, value(id: number) { pendingRaf.delete(id); rafOrigins.delete(id) } })
  Object.defineProperty(ownerWindow, 'setTimeout', { configurable: true, value(handler: TimerHandler, timeout?: number, ...args: any[]) {
    let timer: ReturnType<typeof ownerWindow.setTimeout>
    const callback = () => { pendingTimers.delete(timer); if (typeof handler === 'function') handler(...args); else ownerWindow.eval(handler) }
    timer = originalSetTimeout.call(this, callback, timeout, ...args)
    pendingTimers.add(timer)
    timerOrigins.set(timer, new Error().stack ?? '')
    return timer
  } })
  Object.defineProperty(ownerWindow, 'clearTimeout', { configurable: true, value(id: ReturnType<typeof ownerWindow.setTimeout>) { pendingTimers.delete(id); timerOrigins.delete(id); return originalClearTimeout.call(this, id) } })
  const ownerListenerCounts = () => Object.fromEntries(['focusin', 'pointerdown', 'touchstart', 'wheel', 'keydown'].map(type => [`document:${type}`, [...active.entries()].filter(([name]) => name.startsWith(`document:${type}:`)).reduce((sum, [, count]) => sum + count, 0)]).concat([['window:blur', [...active.entries()].filter(([name]) => name.startsWith('window:blur:')).reduce((sum, [, count]) => sum + count, 0)]]))
  const ownerHandles = () => ({
    raf: [...rafOrigins.entries()].filter(([, stack]) => stack.includes('cascader.vue')).map(([id]) => id),
    timers: [...timerOrigins.entries()].filter(([, stack]) => stack.includes('cascader.vue')).map(([id]) => id)
  })
  const restore = () => {
    Object.defineProperty(ownerDocument, 'addEventListener', { configurable: true, value: originalDocumentAdd })
    Object.defineProperty(ownerDocument, 'removeEventListener', { configurable: true, value: originalDocumentRemove })
    Object.defineProperty(ownerWindow, 'addEventListener', { configurable: true, value: originalWindowAdd })
    Object.defineProperty(ownerWindow, 'removeEventListener', { configurable: true, value: originalWindowRemove })
    if (previousRaf) Object.defineProperty(ownerWindow, 'requestAnimationFrame', previousRaf)
    else Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
    if (previousCancelRaf) Object.defineProperty(ownerWindow, 'cancelAnimationFrame', previousCancelRaf)
    else Reflect.deleteProperty(ownerWindow, 'cancelAnimationFrame')
    if (previousSetTimeout) Object.defineProperty(ownerWindow, 'setTimeout', previousSetTimeout)
    else Reflect.deleteProperty(ownerWindow, 'setTimeout')
    if (previousClearTimeout) Object.defineProperty(ownerWindow, 'clearTimeout', previousClearTimeout)
    else Reflect.deleteProperty(ownerWindow, 'clearTimeout')
  }
  return { active, pendingRaf, pendingTimers, ownerListenerCounts, ownerHandles, restore }
}

const mountLazy = (props: Record<string, unknown> = {}, options: Option[] = [{ value: 'root', label: 'Lazy root', isLeaf: false }]) => track(mount(Cascader, {
  attachTo: document.body,
  props: { options, open: true, virtual: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement!, ...props } as never
}))

const enter = async (wrapper: ReturnType<typeof mount>, value = 'root') => {
  const root = wrapper.get(`[data-cascader-value="${value}"]`)
  root.element.focus()
  root.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  await nextTick()
  return root
}

const nullBlur = (element: HTMLElement, ownerDocument: Document) => {
  const ownerWindow = ownerDocument.defaultView!
  element.dispatchEvent(new ownerWindow.FocusEvent('blur', { bubbles: false, relatedTarget: null }))
  element.dispatchEvent(new ownerWindow.FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
  element.blur()
}

const expectOwnerClean = (probe: ReturnType<typeof probeRealm>, handles = { raf: [] as number[], timers: [] as ReturnType<typeof window.setTimeout>[] }, requireNoRaf = false) => {
  expect(probe.ownerListenerCounts()).toEqual({ 'document:focusin': 0, 'document:pointerdown': 0, 'document:touchstart': 0, 'document:wheel': 0, 'document:keydown': 0, 'window:blur': 0 })
  handles.raf.forEach(id => expect(probe.pendingRaf.has(id)).toBe(false))
  handles.timers.forEach(id => expect(probe.pendingTimers.has(id)).toBe(false))
  if (requireNoRaf) expect(probe.pendingRaf.size).toBe(0)
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

describe('Cascader lazy keyboard focus ownership round eleven', () => {
  it('cancels a null blur patched after loading disabled=false instead of reclaiming focus after rejection', async () => {
    let rejectLoad!: (error: Error) => void
    const wrapper = mountLazy({ loadData: vi.fn(() => new Promise<Option[]>((_resolve, reject) => { rejectLoad = reject })) })
    await settle()
    const probe = probeRealm(document)
    try {
      const root = await enter(wrapper)
      expect(root.attributes('aria-busy')).toBe('true')
      root.element.disabled = false
      root.element.removeAttribute('aria-busy')
      nullBlur(root.element, document)
      rejectLoad(new Error('offline'))
      await settle()
      expect(document.activeElement).not.toBe(root.element)
      expectOwnerClean(probe)
    } finally {
      probe.restore()
    }
  })

  it('disposes the old owner when a programmatic click changes navigation without focus or pointer events', async () => {
    let resolveLoad!: (children: Option[]) => void
    const options: Option[] = [
      { value: 'root', label: 'Lazy root', isLeaf: false },
      { value: 'other', label: 'Loaded branch', children: [{ value: 'leaf', label: 'Leaf' }] }
    ]
    const wrapper = mountLazy({ loadData: vi.fn(() => new Promise<Option[]>(resolve => { resolveLoad = resolve })) }, options)
    await settle()
    const probe = probeRealm(document)
    try {
      await enter(wrapper)
      const ownerHandles = probe.ownerHandles()
      expect(ownerHandles.raf.length + ownerHandles.timers.length).toBeGreaterThan(0)
      const other = wrapper.get('[data-cascader-value="other"]')
      other.element.click()
      resolveLoad([{ value: 'stale', label: 'Stale child' }])
      await settle()
      expectOwnerClean(probe, ownerHandles)
      expect(wrapper.find('[data-cascader-value="stale"]').exists()).toBe(false)
    } finally {
      probe.restore()
    }
  })

  it('does not schedule owner RAF or timer after the loader synchronously unmounts the component', async () => {
    let wrapper!: ReturnType<typeof mount>
    const loadData = vi.fn(() => {
      wrapper.unmount()
      return Promise.resolve<Option[]>([])
    })
    wrapper = mountLazy({ loadData })
    await settle()
    const probe = probeRealm(document)
    try {
      const root = wrapper.get('[data-cascader-value="root"]')
      root.element.focus()
      root.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
      await settle()
      expectOwnerClean(probe, probe.ownerHandles(), true)
    } finally {
      probe.restore()
    }
  })
})
