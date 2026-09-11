import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cascader from '../cascader.vue'

type Option = { value: string; label: string; isLeaf?: boolean }
type Capability = { request: boolean; cancel: boolean; expectedRaf: number; expectedTimers: number }

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

const probeRealm = (ownerDocument: Document, capability: Capability) => {
  const ownerWindow = ownerDocument.defaultView!
  const listeners = new Map<string, number>()
  const createdRaf: number[] = []
  const cancelledRaf = new Set<number>()
  const createdTimers: number[] = []
  const clearedTimers = new Set<number>()
  const originalDocumentAdd = ownerDocument.addEventListener
  const originalDocumentRemove = ownerDocument.removeEventListener
  const originalWindowAdd = ownerWindow.addEventListener
  const originalWindowRemove = ownerWindow.removeEventListener
  const previousRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'requestAnimationFrame')
  const previousCancel = Object.getOwnPropertyDescriptor(ownerWindow, 'cancelAnimationFrame')
  const previousSetTimeout = Object.getOwnPropertyDescriptor(ownerWindow, 'setTimeout')
  const previousClearTimeout = Object.getOwnPropertyDescriptor(ownerWindow, 'clearTimeout')
  let rafSequence = 0
  let timerSequence = 0
  const update = (target: 'document' | 'window', type: string, delta: number) => {
    const key = `${target}:${type}`
    listeners.set(key, Math.max(0, (listeners.get(key) ?? 0) + delta))
  }
  Object.defineProperty(ownerDocument, 'addEventListener', { configurable: true, value(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) { update('document', type, 1); return originalDocumentAdd.call(this, type, listener, options) } })
  Object.defineProperty(ownerDocument, 'removeEventListener', { configurable: true, value(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions) { update('document', type, -1); return originalDocumentRemove.call(this, type, listener, options) } })
  Object.defineProperty(ownerWindow, 'addEventListener', { configurable: true, value(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) { update('window', type, 1); return originalWindowAdd.call(this, type, listener, options) } })
  Object.defineProperty(ownerWindow, 'removeEventListener', { configurable: true, value(type: string, listener: EventListenerOrEventObject | null, options?: boolean | EventListenerOptions) { update('window', type, -1); return originalWindowRemove.call(this, type, listener, options) } })
  if (capability.request) Object.defineProperty(ownerWindow, 'requestAnimationFrame', { configurable: true, value(callback: FrameRequestCallback) { const id = ++rafSequence; createdRaf.push(id); return id } })
  else Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
  if (capability.cancel) Object.defineProperty(ownerWindow, 'cancelAnimationFrame', { configurable: true, value(id: number) { cancelledRaf.add(id) } })
  else Reflect.deleteProperty(ownerWindow, 'cancelAnimationFrame')
  Object.defineProperty(ownerWindow, 'setTimeout', { configurable: true, value(_handler: TimerHandler, _timeout?: number, ..._args: any[]) { const id = ++timerSequence; createdTimers.push(id); return id } })
  Object.defineProperty(ownerWindow, 'clearTimeout', { configurable: true, value(id: number) { clearedTimers.add(id) } })
  const ownerListenerCounts = () => Object.fromEntries(['focusin', 'pointerdown', 'touchstart', 'wheel', 'keydown'].map(type => [`document:${type}`, listeners.get(`document:${type}`) ?? 0]).concat([['window:blur', listeners.get('window:blur') ?? 0]]))
  const restore = () => {
    Object.defineProperty(ownerDocument, 'addEventListener', { configurable: true, value: originalDocumentAdd })
    Object.defineProperty(ownerDocument, 'removeEventListener', { configurable: true, value: originalDocumentRemove })
    Object.defineProperty(ownerWindow, 'addEventListener', { configurable: true, value: originalWindowAdd })
    Object.defineProperty(ownerWindow, 'removeEventListener', { configurable: true, value: originalWindowRemove })
    if (previousRaf) Object.defineProperty(ownerWindow, 'requestAnimationFrame', previousRaf)
    else Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
    if (previousCancel) Object.defineProperty(ownerWindow, 'cancelAnimationFrame', previousCancel)
    else Reflect.deleteProperty(ownerWindow, 'cancelAnimationFrame')
    if (previousSetTimeout) Object.defineProperty(ownerWindow, 'setTimeout', previousSetTimeout)
    else Reflect.deleteProperty(ownerWindow, 'setTimeout')
    if (previousClearTimeout) Object.defineProperty(ownerWindow, 'clearTimeout', previousClearTimeout)
    else Reflect.deleteProperty(ownerWindow, 'clearTimeout')
  }
  return { createdRaf, cancelledRaf, createdTimers, clearedTimers, ownerListenerCounts, restore }
}

const mountLazy = (ownerDocument: Document, loadData: (option: Option, context: { signal: AbortSignal }) => Promise<Option[]>) => track(mount(Cascader, {
  attachTo: ownerDocument.body,
  props: { options: [{ value: 'root', label: 'Lazy root', isLeaf: false }], open: true, virtual: true, loadData, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never
}))

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

describe('Cascader lazy focus owner partial-capability realm', () => {
  it.each([
    { request: true, cancel: true, expectedRaf: 1, expectedTimers: 0 },
    { request: true, cancel: false, expectedRaf: 0, expectedTimers: 1 },
    { request: false, cancel: true, expectedRaf: 0, expectedTimers: 1 },
    { request: false, cancel: false, expectedRaf: 0, expectedTimers: 0 }
  ] satisfies Capability[])('uses only cancelable owner handles for request=%s cancel=%s', async capability => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    let resolveLoad!: (children: Option[]) => void
    const loadData = vi.fn(() => new Promise<Option[]>(resolve => { resolveLoad = resolve }))
    const wrapper = mountLazy(ownerDocument, loadData)
    await settle()
    const probe = probeRealm(ownerDocument, capability)
    try {
      const root = wrapper.get('[data-cascader-value="root"]')
      root.element.focus()
      root.element.dispatchEvent(new ownerDocument.defaultView!.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
      await nextTick()
      expect(probe.createdRaf).toHaveLength(capability.expectedRaf)
      expect(probe.createdTimers).toHaveLength(capability.expectedTimers)
      wrapper.unmount()
      await nextTick()
      expect(probe.createdRaf.every(id => probe.cancelledRaf.has(id))).toBe(true)
      expect(probe.createdTimers.every(id => probe.clearedTimers.has(id))).toBe(true)
      expect(probe.ownerListenerCounts()).toEqual({ 'document:focusin': 0, 'document:pointerdown': 0, 'document:touchstart': 0, 'document:wheel': 0, 'document:keydown': 0, 'window:blur': 0 })
      resolveLoad([{ value: 'late', label: 'Late child' }])
    } finally {
      probe.restore()
      iframe.remove()
    }
  })
})
