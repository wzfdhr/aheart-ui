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

const mountLazy = (props: Record<string, unknown> = {}, options: Option[] = [{ value: 'root', label: 'Lazy root', isLeaf: false }]) => track(mount(Cascader, {
  attachTo: document.body,
  props: (() => {
    const merged = { options, open: true, virtual: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement!, ...props }
    if ('defaultOpen' in props && props.open === undefined) Reflect.deleteProperty(merged, 'open')
    return merged
  })() as never
}))

const enter = async (wrapper: ReturnType<typeof mount>, value = 'root') => {
  const root = wrapper.get(`[data-cascader-value="${value}"]`)
  root.element.focus()
  root.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  await nextTick()
  return root
}

const nativeRenderBlur = (element: HTMLElement, ownerDocument: Document) => {
  const ownerWindow = ownerDocument.defaultView!
  element.dispatchEvent(new ownerWindow.FocusEvent('blur', { bubbles: false, relatedTarget: null }))
  element.dispatchEvent(new ownerWindow.FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
  element.blur()
}

const probeRealm = (ownerDocument: Document) => {
  const ownerWindow = ownerDocument.defaultView!
  const active = new Map<string, number>()
  const listenerIds = new WeakMap<object, number>()
  let listenerId = 0
  const pendingRaf = new Map<number, FrameRequestCallback>()
  const pendingTimers = new Set<ReturnType<typeof ownerWindow.setTimeout>>()
  const originalDocumentAdd = ownerDocument.addEventListener
  const originalDocumentRemove = ownerDocument.removeEventListener
  const originalWindowAdd = ownerWindow.addEventListener
  const originalWindowRemove = ownerWindow.removeEventListener
  const originalSetTimeout = ownerWindow.setTimeout
  const originalClearTimeout = ownerWindow.clearTimeout
  const previousWindowRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'requestAnimationFrame')
  const previousWindowCancelRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'cancelAnimationFrame')
  const previousWindowSetTimeout = Object.getOwnPropertyDescriptor(ownerWindow, 'setTimeout')
  const previousWindowClearTimeout = Object.getOwnPropertyDescriptor(ownerWindow, 'clearTimeout')
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
  Object.defineProperty(ownerWindow, 'removeEventListener', { configurable: true, value(type: string, listener: EventListenerOrEventObject | null, options?: boolean | EventListenerOptions) { remove('window', type, listener, options); return originalWindowRemove.call(this, type, listener, options) } })
  let rafSequence = 0
  Object.defineProperty(ownerWindow, 'requestAnimationFrame', { configurable: true, value(callback: FrameRequestCallback) { const id = ++rafSequence; pendingRaf.set(id, callback); return id } })
  Object.defineProperty(ownerWindow, 'cancelAnimationFrame', { configurable: true, value(id: number) { pendingRaf.delete(id) } })
  Object.defineProperty(ownerWindow, 'setTimeout', { configurable: true, value(handler: TimerHandler, timeout?: number, ...args: any[]) {
    let timer: ReturnType<typeof ownerWindow.setTimeout>
    const callback = () => { pendingTimers.delete(timer); if (typeof handler === 'function') handler(...args); else ownerWindow.eval(handler) }
    timer = originalSetTimeout.call(this, callback, timeout, ...args)
    pendingTimers.add(timer)
    return timer
  } })
  Object.defineProperty(ownerWindow, 'clearTimeout', { configurable: true, value(id: ReturnType<typeof ownerWindow.setTimeout>) { pendingTimers.delete(id); return originalClearTimeout.call(this, id) } })
  const focusKeys = ['focusin', 'pointerdown', 'touchstart', 'wheel', 'keydown'].map(type => `document:${type}`)
  const ownerListenerCounts = () => Object.fromEntries(focusKeys.concat(['window:blur']).map(type => [type, [...active.entries()].filter(([name]) => name.startsWith(`${type}:`)).reduce((sum, [, count]) => sum + count, 0)]))
  const drainOwnerRaf = () => { const callbacks = [...pendingRaf.values()]; pendingRaf.clear(); callbacks.forEach(callback => callback(ownerWindow.performance.now())) }
  const restore = () => {
    if (Object.getOwnPropertyDescriptor(ownerDocument, 'addEventListener')?.value) Object.defineProperty(ownerDocument, 'addEventListener', { configurable: true, value: originalDocumentAdd })
    if (Object.getOwnPropertyDescriptor(ownerDocument, 'removeEventListener')?.value) Object.defineProperty(ownerDocument, 'removeEventListener', { configurable: true, value: originalDocumentRemove })
    if (Object.getOwnPropertyDescriptor(ownerWindow, 'addEventListener')?.value) Object.defineProperty(ownerWindow, 'addEventListener', { configurable: true, value: originalWindowAdd })
    if (Object.getOwnPropertyDescriptor(ownerWindow, 'removeEventListener')?.value) Object.defineProperty(ownerWindow, 'removeEventListener', { configurable: true, value: originalWindowRemove })
    if (previousWindowRaf) Object.defineProperty(ownerWindow, 'requestAnimationFrame', previousWindowRaf)
    else Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
    if (previousWindowCancelRaf) Object.defineProperty(ownerWindow, 'cancelAnimationFrame', previousWindowCancelRaf)
    else Reflect.deleteProperty(ownerWindow, 'cancelAnimationFrame')
    if (previousWindowSetTimeout) Object.defineProperty(ownerWindow, 'setTimeout', previousWindowSetTimeout)
    else Reflect.deleteProperty(ownerWindow, 'setTimeout')
    if (previousWindowClearTimeout) Object.defineProperty(ownerWindow, 'clearTimeout', previousWindowClearTimeout)
    else Reflect.deleteProperty(ownerWindow, 'clearTimeout')
  }
  return { active, pendingRaf, pendingTimers, ownerListenerCounts, drainOwnerRaf, restore }
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

describe('Cascader lazy keyboard focus ownership round ten', () => {
  it('arms native render blur only until the owner-realm RAF and cancels a later null blur', async () => {
    const probe = probeRealm(document)
    let resolveLoad!: (children: Option[]) => void
    const wrapper = mountLazy({ loadData: vi.fn(() => new Promise<Option[]>(resolve => { resolveLoad = resolve })) })
    try {
      await settle()
      const initial = probe.ownerListenerCounts()
      const root = await enter(wrapper)
      nativeRenderBlur(root.element, document)
      expect(probe.pendingRaf.size).toBeGreaterThan(0)
      probe.drainOwnerRaf()
      nativeRenderBlur(root.element, document)
      resolveLoad([{ value: 'child', label: 'Loaded child' }])
      await settle()
      expect(document.activeElement).not.toBe(wrapper.get('[data-cascader-value="child"]').element)
    } finally {
      probe.restore()
    }
  })

  it.each(['search', 'another panel row'] as const)('disposes the focus owner when focus moves to %s', async target => {
    const probe = probeRealm(document)
    let resolveLoad!: (children: Option[]) => void
    const options = [{ value: 'root', label: 'Lazy root', isLeaf: false }, { value: 'other', label: 'Other', isLeaf: false }]
    const wrapper = mountLazy({ showSearch: true, loadData: vi.fn(() => new Promise<Option[]>(resolve => { resolveLoad = resolve })) }, options)
    try {
      await settle()
      const initial = probe.ownerListenerCounts()
      await enter(wrapper)
      if (target === 'search') wrapper.get('input[type="search"]').element.focus()
      else wrapper.get('[data-cascader-value="other"]').element.focus()
      expect(probe.ownerListenerCounts()).toEqual(initial)
      resolveLoad([{ value: 'child', label: 'Loaded child' }])
      await settle()
    } finally {
      probe.restore()
    }
  })

  it.each(['options', 'loadData'] as const)('cleans every owner listener when %s replacement makes the old request return early', async replacement => {
    const probe = probeRealm(document)
    const loadData = vi.fn(() => new Promise<Option[]>(() => undefined))
    const wrapper = mountLazy({ loadData })
    try {
      await settle()
      const pendingRafBaseline = probe.pendingRaf.size
      const pendingTimerBaseline = probe.pendingTimers.size
      await enter(wrapper)
      const before = probe.ownerListenerCounts()
      expect(before['document:focusin']).toBeGreaterThan(0)
      if (replacement === 'options') await wrapper.setProps({ options: [{ value: 'replacement', label: 'Replacement' }] } as never)
      else await wrapper.setProps({ loadData: vi.fn(() => new Promise<Option[]>(() => undefined)) } as never)
      await settle()
      const counts = probe.ownerListenerCounts()
      expect(counts['document:pointerdown']).toBe(0)
      expect(counts['document:touchstart']).toBe(0)
      expect(counts['document:wheel']).toBe(0)
      expect(counts['document:keydown']).toBe(0)
      expect(counts['window:blur']).toBe(0)
      expect(probe.pendingRaf.size).toBe(pendingRafBaseline)
      expect(probe.pendingTimers.size).toBe(pendingTimerBaseline)
    } finally {
      probe.restore()
    }
  })

  it('does not let an old finally remove a newer same-key owner', async () => {
    const probe = probeRealm(document)
    const resolvers: Array<(children: Option[]) => void> = []
    const loadData = vi.fn(() => new Promise<Option[]>(resolve => { resolvers.push(resolve) }))
    const wrapper = mountLazy({ loadData })
    try {
      await settle()
      const first = await enter(wrapper)
      first.element.blur()
      await wrapper.setProps({ loadData: vi.fn(() => new Promise<Option[]>(resolve => { resolvers.push(resolve) })) } as never)
      await settle()
      const second = await enter(wrapper)
      const ownerBeforeLate = probe.ownerListenerCounts()
      resolvers[0]([{ value: 'stale', label: 'Stale' }])
      await settle()
      expect(probe.ownerListenerCounts()).toEqual(ownerBeforeLate)
      resolvers[1]([{ value: 'fresh', label: 'Fresh' }])
      await settle()
      expect(wrapper.find('[data-cascader-value="fresh"]').exists()).toBe(true)
      const counts = probe.ownerListenerCounts()
      expect(counts['document:pointerdown']).toBe(0)
      expect(counts['document:touchstart']).toBe(0)
      expect(counts['document:wheel']).toBe(0)
      expect(counts['document:keydown']).toBe(0)
      expect(counts['window:blur']).toBe(0)
    } finally {
      probe.restore()
    }
  })

  it.each(['disable', 'accepted close', 'refused close', 'unmount'] as const)('cleans owner listeners on %s', async action => {
    const probe = probeRealm(document)
    const loadData = vi.fn(() => new Promise<Option[]>(() => undefined))
    const controlled = action === 'refused close'
    const wrapper = mountLazy({ loadData, ...(controlled ? {} : { defaultOpen: true, open: undefined }) })
    try {
      await settle()
      await enter(wrapper)
      if (action === 'disable') await wrapper.setProps({ disabled: true } as never)
      else if (action === 'accepted close') await wrapper.get('.aheart-cascader__trigger').trigger('keydown', { key: 'Escape' })
      else if (action === 'refused close') await wrapper.get('.aheart-cascader__trigger').trigger('click')
      else wrapper.unmount()
      await settle()
      const counts = probe.ownerListenerCounts()
      expect(counts['document:pointerdown']).toBe(0)
      expect(counts['document:touchstart']).toBe(0)
      expect(counts['document:wheel']).toBe(0)
      expect(counts['document:keydown']).toBe(0)
      expect(counts['window:blur']).toBe(0)
    } finally {
      probe.restore()
    }
  })

  it('uses the iframe owner realm for listener cleanup and render-loss RAF', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    let resolveLoad!: (children: Option[]) => void
    let probe: ReturnType<typeof probeRealm> | undefined
    const wrapper = track(mount(Cascader, {
      attachTo: ownerDocument.body,
      props: { options: [{ value: 'root', label: 'Lazy root', isLeaf: false }], open: true, virtual: true, loadData: vi.fn(() => new Promise<Option[]>(resolve => { resolveLoad = resolve })), getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never
    }))
    try {
      await settle()
      // Install the probe after the panel is mounted so unrelated overlay-controller
      // document listeners are outside this owner-lifetime measurement.
      probe = probeRealm(ownerDocument)
      const root = wrapper.get('[data-cascader-value="root"]')
      root.element.focus()
      root.element.dispatchEvent(new ownerDocument.defaultView!.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
      await nextTick()
      nativeRenderBlur(root.element, ownerDocument)
      expect(probe.pendingRaf.size).toBeGreaterThan(0)
      resolveLoad([{ value: 'child', label: 'Loaded child' }])
      await settle()
      wrapper.unmount()
      const counts = probe.ownerListenerCounts()
      expect(counts['document:focusin']).toBe(0)
      expect(counts['document:pointerdown']).toBe(0)
      expect(counts['document:touchstart']).toBe(0)
      expect(counts['document:wheel']).toBe(0)
      expect(counts['document:keydown']).toBe(0)
      expect(counts['window:blur']).toBe(0)
      expect(probe.pendingRaf.size).toBe(0)
      expect(probe.pendingTimers.size).toBe(0)
    } finally {
      probe?.restore()
      iframe.remove()
    }
  })
})
