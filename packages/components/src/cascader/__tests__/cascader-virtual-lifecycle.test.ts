import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cascader from '../cascader.vue'
import CascaderVirtualList from '../cascader-virtual-list.vue'

type Option = { value: string; label: string; children?: Option[]; isLeaf?: boolean }
type OwnerObserver = { callback: ResizeObserverCallback; disconnect: ReturnType<typeof vi.fn>; observed: Element[] }
type CapabilityObserver = { callback: ResizeObserverCallback; disconnect: ReturnType<typeof vi.fn>; observed: Element[] }

const wrappers: Array<ReturnType<typeof mount>> = []
const ownerObservers: OwnerObserver[] = []
const capabilityObservers: CapabilityObserver[] = []
const rafQueue = new Map<number, FrameRequestCallback>()
let rafSequence = 0
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined
const options = (count: number): Option[] => Array.from({ length: count }, (_, index) => ({ value: `item-${index}`, label: `Item ${index}` }))
const track = <T extends ReturnType<typeof mount>>(wrapper: T) => {
  const unmount = wrapper.unmount.bind(wrapper)
  let mounted = true
  wrapper.unmount = (() => { if (mounted) { mounted = false; unmount() } }) as T['unmount']
  wrappers.push(wrapper)
  return wrapper
}
class ControlledCapabilityResizeObserver {
  readonly disconnect = vi.fn()
  readonly observed: Element[] = []
  constructor(readonly callback: ResizeObserverCallback) {
    capabilityObservers.push({ callback, disconnect: this.disconnect, observed: this.observed })
  }
  observe(element: Element) { this.observed.push(element) }
  unobserve(element: Element) { const index = this.observed.indexOf(element); if (index >= 0) this.observed.splice(index, 1) }
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
const mountCascader = (props: Record<string, unknown>, extra: Record<string, unknown> = {}) => track(mount(Cascader, {
  attachTo: document.body,
  ...extra,
  props: { getPopupContainer: (trigger: HTMLElement) => trigger.parentElement!, ...props } as never
}))

it.each([false, true])('cancels superseded focus retries on unmount with enabled=%s', async enabled => {
  const wrapper = track(mount(CascaderVirtualList, {
    attachTo: document.body,
    props: { enabled, items: options(10), config: { height: 240, estimateSize: 32, overscan: 4 }, className: 'focus-retry-test', rowKey: index => String(index), disabledIndex: () => false }
  }))
  await settle()
  const api = wrapper.vm as unknown as { focusIndex: (index: number) => void; suspend: () => void }
  // No option slot: each request must queue a retry instead of focusing a row.
  api.focusIndex(1)
  await nextTick()
  const firstFrames = new Set(rafQueue.keys())
  expect(firstFrames.size).toBeGreaterThan(0)
  api.focusIndex(2)
  await nextTick()
  api.suspend()
  wrapper.unmount()
  await nextTick()
  expect([...firstFrames].filter(id => rafQueue.has(id))).toEqual([])
  expect(rafQueue.size).toBe(0)
})

beforeEach(() => {
  ownerObservers.length = 0
  capabilityObservers.length = 0
  rafQueue.clear()
  previousResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
  previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')
  previousCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame')
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: ControlledCapabilityResizeObserver })
  Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => { const id = ++rafSequence; rafQueue.set(id, callback); return id } })
  Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: (id: number) => { rafQueue.delete(id) } })
})

it.each([false, true])('returns keyboard search selection focus to trigger with virtual=%s', async virtual => {
  const wrapper = mountCascader({ options: options(10), virtual, showSearch: true, defaultOpen: true })
  await settle()
  await wrapper.find('input').setValue('Item 2')
  await settle()
  const row = wrapper.find('.aheart-cascader__search-results .aheart-cascader__option')
  ;(row.element as HTMLElement).focus()
  await row.trigger('keydown', { key: 'Enter' })
  if (!virtual) await row.trigger('click') // jsdom does not synthesize a native button's Enter click.
  await settle()
  expect(wrapper.find('[role="combobox"]').attributes('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(wrapper.find('[role="combobox"]').element)
  expect(wrapper.emitted('change')).toHaveLength(1)
})

it.each(['refused', 'multiple', 'external', 'external-blur', 'source-blur', 'accepted', 'delayed'] as const)('respects %s focus ownership after search selection', async mode => {
  const outside = document.createElement('button')
  document.body.append(outside)
  let wrapper: ReturnType<typeof mountCascader>
  wrapper = mountCascader({ options: options(10), virtual: true, showSearch: true,
    ...(['refused', 'accepted', 'delayed', 'source-blur'].includes(mode) ? { open: true } : { defaultOpen: true }),
    multiple: mode === 'multiple',
    onOpenChange: (open: boolean) => {
      if (!open && mode === 'external') outside.focus()
      if (!open && mode === 'external-blur') { outside.focus(); outside.blur() }
      if (!open && mode === 'source-blur') (document.activeElement as HTMLElement)?.blur()
      if (!open && mode === 'accepted') void wrapper.setProps({ open: false })
    }
  })
  try {
    await settle()
    await wrapper.find('input').setValue('Item 2')
    await settle()
    const row = wrapper.find('.aheart-cascader__search-results .aheart-cascader__option')
    ;(row.element as HTMLElement).focus()
    await row.trigger('keydown', { key: 'Enter' })
    await settle()
    if (mode === 'delayed' || mode === 'source-blur') { await wrapper.setProps({ open: false }); await settle() }
    const trigger = wrapper.find('[role="combobox"]')
    if (mode === 'refused' || mode === 'multiple') {
      expect(trigger.attributes('aria-expanded')).toBe('true')
      expect(document.activeElement).toBe(row.element)
    } else {
      expect(trigger.attributes('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(mode === 'external' ? outside : mode === 'external-blur' || mode === 'source-blur' ? document.body : trigger.element)
    }
    expect(wrapper.emitted('change')).toHaveLength(1)
  } finally { outside.remove() }
})

it('removes pending selection ownership listeners on unmount after rejected close', async () => {
  const wrapper = mountCascader({ options: options(10), virtual: true, showSearch: true, open: true })
  await settle()
  await wrapper.find('input').setValue('Item 2')
  await settle()
  const row = wrapper.find('.aheart-cascader__search-results .aheart-cascader__option')
  ;(row.element as HTMLElement).focus()
  const add = vi.spyOn(document, 'addEventListener')
  const remove = vi.spyOn(document, 'removeEventListener')
  try {
    await row.trigger('keydown', { key: 'Enter' })
    await settle()
    const owned = add.mock.calls.filter(([type, , capture]) => ['focusin', 'focusout', 'pointerdown', 'keydown'].includes(type) && capture === true)
    expect(owned.map(([type]) => type).sort()).toEqual(['focusin', 'focusout', 'keydown', 'pointerdown'])
    wrapper.unmount()
    for (const [type, listener, capture] of owned) expect(remove).toHaveBeenCalledWith(type, listener, capture)
  } finally { add.mockRestore(); remove.mockRestore() }
})

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
  ownerObservers.length = 0
  capabilityObservers.length = 0
  rafQueue.clear()
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

describe('Cascader virtual lifecycle, SSR and owner realm', () => {
  it('renders a deterministic bounded SSR window and hydrates without mismatch diagnostics', async () => {
    const props = { options: options(1000), defaultOpen: true, virtual: true }
    const first = await renderToString(createSSRApp({ render: () => h(Cascader, props) }))
    const second = await renderToString(createSSRApp({ render: () => h(Cascader, props) }))
    expect(first).toBe(second)

    const host = document.createElement('div')
    host.innerHTML = first
    document.body.appendChild(host)
    const serverPanel = host.querySelector<HTMLElement>('.aheart-cascader__panel') ?? document.body.querySelector<HTMLElement>('.aheart-cascader__panel')
    expect(serverPanel).toBeTruthy()
    expect(serverPanel!.querySelectorAll('.aheart-cascader__option').length).toBeGreaterThan(0)
    expect(serverPanel!.querySelectorAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    const warnings: unknown[] = []
    const errors: unknown[] = []
    const warn = vi.spyOn(console, 'warn').mockImplementation((...args) => warnings.push(args))
    const error = vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args))
    const app = createSSRApp(Cascader, props)
    app.config.warnHandler = (message) => warnings.push(message)
    try {
      app.mount(host, true)
      await settle()
      expect(warnings.filter(value => String(value).toLowerCase().includes('hydration'))).toHaveLength(0)
      expect(errors.filter(value => String(value).toLowerCase().includes('hydration'))).toHaveLength(0)
      const clientPanel = document.body.querySelector<HTMLElement>('.aheart-cascader__panel')
      expect(clientPanel).toBeTruthy()
      expect(clientPanel!.querySelectorAll('.aheart-cascader__option').length).toBeGreaterThan(0)
      expect(clientPanel!.querySelectorAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    } finally {
      app.unmount()
      warn.mockRestore()
      error.mockRestore()
      host.remove()
    }
  })

  it('uses the mounted iframe owner realm for observation and disconnects it before frame removal', async () => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    class IframeResizeObserver {
      readonly disconnect = vi.fn()
      constructor(readonly callback: ResizeObserverCallback) { ownerObservers.push({ callback, disconnect: this.disconnect, observed: [] }) }
      observe(element: Element) { ownerObservers.at(-1)?.observed.push(element) }
      unobserve() {}
    }
    const previousResizeObserver = Object.getOwnPropertyDescriptor(ownerWindow, 'ResizeObserver')
    const previousRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'requestAnimationFrame')
    const previousCancel = Object.getOwnPropertyDescriptor(ownerWindow, 'cancelAnimationFrame')
    Object.defineProperty(ownerWindow, 'ResizeObserver', { configurable: true, value: IframeResizeObserver })
    Object.defineProperty(ownerWindow, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => ownerWindow.setTimeout(() => callback(ownerWindow.performance.now()), 0) })
    Object.defineProperty(ownerWindow, 'cancelAnimationFrame', { configurable: true, value: (id: number) => ownerWindow.clearTimeout(id) })
    let wrapper: ReturnType<typeof mount> | undefined
    try {
      wrapper = track(mount(Cascader, { attachTo: ownerDocument.body, props: { options: options(1000), defaultOpen: true, virtual: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never }))
      await settle()
      expect(ownerObservers.some(observer => observer.observed.length > 0)).toBe(true)
      wrapper.unmount()
      expect(ownerObservers.length).toBeGreaterThan(0)
      expect(ownerObservers.every(observer => observer.disconnect.mock.calls.length > 0)).toBe(true)
    } finally {
      if (wrapper) wrapper.unmount()
      if (previousResizeObserver) Object.defineProperty(ownerWindow, 'ResizeObserver', previousResizeObserver)
      else Reflect.deleteProperty(ownerWindow, 'ResizeObserver')
      if (previousRaf) Object.defineProperty(ownerWindow, 'requestAnimationFrame', previousRaf)
      else Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
      if (previousCancel) Object.defineProperty(ownerWindow, 'cancelAnimationFrame', previousCancel)
      else Reflect.deleteProperty(ownerWindow, 'cancelAnimationFrame')
      iframe.remove()
    }
  })

  it('keeps virtual windows bounded after options replacement and does not retain stale rows', async () => {
    const wrapper = mountCascader({ options: options(1000), defaultOpen: true, virtual: true })
    await settle()
    expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    await wrapper.setProps({ options: options(1000).map((item, index) => ({ ...item, value: `replacement-${index}`, label: `Replacement ${index}` })) } as never)
    await settle()
    expect(wrapper.find('[data-cascader-value="item-0"]').exists()).toBe(false)
    expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
  })

  it('cancels pending virtual lazy work on close, disable, replacement and unmount without stale children', async () => {
    let resolveChildren!: (children: Option[]) => void
    let signal!: AbortSignal
    const loadData = (_option: Option, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<Option[]>(resolve => { resolveChildren = resolve })
    }
    const wrapper = mountCascader({
      options: [{ value: 'lazy', label: 'Lazy', isLeaf: false }, ...options(1000)],
      defaultOpen: true,
      virtual: true,
      loadData
    })
    await settle()
    expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    await wrapper.get('[data-cascader-value="lazy"]').trigger('click')
    await wrapper.setProps({ open: false } as never)
    expect(signal?.aborted).toBe(true)
    resolveChildren([{ value: 'stale', label: 'Stale' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="stale"]').exists()).toBe(false)
    await wrapper.setProps({ open: true, disabled: false } as never)
    await wrapper.get('[data-cascader-value="lazy"]').trigger('click')
    const beforeDisable = signal
    await wrapper.setProps({ disabled: true } as never)
    expect(beforeDisable?.aborted).toBe(true)
    wrapper.unmount()
  })

  it('keeps one stable roving option after blur and restores trigger focus on close', async () => {
    const wrapper = mountCascader({ options: options(1000), defaultOpen: true, virtual: true })
    await settle()
    const first = wrapper.find('.aheart-cascader__option')
    first.element.focus()
    expect(first.attributes('tabindex')).toBe('0')
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.focus()
    await settle()
    expect(wrapper.findAll('.aheart-cascader__option').filter(option => option.attributes('tabindex') === '0')).toHaveLength(1)
    await wrapper.get('.aheart-cascader__trigger').trigger('keydown', { key: 'Escape' })
    await settle()
    expect(document.activeElement).toBe(wrapper.get('.aheart-cascader__trigger').element)
    outside.remove()
  })

  it('does not mount an offscreen lazy branch into the initial virtual window', async () => {
    const data = [...options(999), { value: 'offscreen-lazy', label: 'Offscreen lazy', isLeaf: false }]
    const loadData = vi.fn(async () => [{ value: 'child', label: 'Child' }])
    const wrapper = mountCascader({ options: data, defaultOpen: true, virtual: true, loadData })
    await settle()
    expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    expect(wrapper.find('[data-cascader-value="offscreen-lazy"]').exists()).toBe(false)
    expect(loadData).not.toHaveBeenCalled()
  })

  it('keeps refused controlled close from aborting a lazy request, but cancels accepted close', async () => {
    let resolveChildren!: (children: Option[]) => void
    let signal!: AbortSignal
    const loadData = (_option: Option, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<Option[]>(resolve => { resolveChildren = resolve })
    }
    const wrapper = mountCascader({
      options: [{ value: 'lazy', label: 'Lazy', isLeaf: false }],
      open: true,
      virtual: true,
      loadData
    })
    await settle()
    await wrapper.get('[data-cascader-value="lazy"]').trigger('click')
    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await settle()
    expect(signal.aborted).toBe(false)
    await wrapper.setProps({ open: false } as never)
    expect(signal.aborted).toBe(true)
    resolveChildren([{ value: 'late', label: 'Late' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="late"]').exists()).toBe(false)
  })

  it('falls back safely after mounted owner-realm capabilities are partial', async () => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    const previousObserver = Object.getOwnPropertyDescriptor(ownerWindow, 'ResizeObserver')
    const previousRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'requestAnimationFrame')
    const previousCancel = Object.getOwnPropertyDescriptor(ownerWindow, 'cancelAnimationFrame')
    Object.defineProperty(ownerWindow, 'ResizeObserver', { configurable: true, value: ControlledCapabilityResizeObserver })
    Object.defineProperty(ownerWindow, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => ownerWindow.setTimeout(() => callback(ownerWindow.performance.now()), 0) })
    Object.defineProperty(ownerWindow, 'cancelAnimationFrame', { configurable: true, value: (id: number) => ownerWindow.clearTimeout(id) })
    Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
    let wrapper: ReturnType<typeof mount> | undefined
    try {
      wrapper = track(mount(Cascader, { attachTo: ownerDocument.body, props: { options: options(1000), defaultOpen: true, virtual: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never }))
      await settle()
      expect(wrapper.findAll('.aheart-cascader__option').length).toBeGreaterThan(24)
    } finally {
      if (wrapper) wrapper.unmount()
      if (previousObserver) Object.defineProperty(ownerWindow, 'ResizeObserver', previousObserver)
      else Reflect.deleteProperty(ownerWindow, 'ResizeObserver')
      if (previousRaf) Object.defineProperty(ownerWindow, 'requestAnimationFrame', previousRaf)
      else Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
      if (previousCancel) Object.defineProperty(ownerWindow, 'cancelAnimationFrame', previousCancel)
      else Reflect.deleteProperty(ownerWindow, 'cancelAnimationFrame')
      iframe.remove()
    }
  })

  it.each(['requestAnimationFrame', 'cancelAnimationFrame'] as const)('keeps a focusable, End-reachable fallback when %s is absent', async missing => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    const previous = Object.getOwnPropertyDescriptor(ownerWindow, missing)
    const previousObserver = Object.getOwnPropertyDescriptor(ownerWindow, 'ResizeObserver')
    const previousRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'requestAnimationFrame')
    const previousCancel = Object.getOwnPropertyDescriptor(ownerWindow, 'cancelAnimationFrame')
    Object.defineProperty(ownerWindow, 'ResizeObserver', { configurable: true, value: ControlledCapabilityResizeObserver })
    Object.defineProperty(ownerWindow, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => ownerWindow.setTimeout(() => callback(ownerWindow.performance.now()), 0) })
    Object.defineProperty(ownerWindow, 'cancelAnimationFrame', { configurable: true, value: (id: number) => ownerWindow.clearTimeout(id) })
    Reflect.deleteProperty(ownerWindow, missing)
    let wrapper: ReturnType<typeof mount> | undefined
    try {
      wrapper = track(mount(Cascader, { attachTo: ownerDocument.body, props: { options: options(1000), defaultOpen: true, virtual: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never }))
      await settle()
      const rows = Array.from(ownerDocument.querySelectorAll<HTMLElement>('.aheart-cascader__option'))
      expect(rows.length).toBeGreaterThan(0)
      rows[0].focus()
      rows[0].dispatchEvent(new ownerWindow.KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }))
      await settle()
      const target = ownerDocument.querySelector<HTMLElement>('[data-cascader-value="item-999"]')
      expect(target?.isConnected).toBe(true)
      expect(target?.hidden).toBe(false)
      expect(ownerDocument.activeElement?.getAttribute('data-cascader-value')).toBe('item-999')
    } finally {
      if (wrapper) wrapper.unmount()
      if (previousObserver) Object.defineProperty(ownerWindow, 'ResizeObserver', previousObserver)
      else Reflect.deleteProperty(ownerWindow, 'ResizeObserver')
      if (previousRaf) Object.defineProperty(ownerWindow, 'requestAnimationFrame', previousRaf)
      else Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
      if (previousCancel) Object.defineProperty(ownerWindow, 'cancelAnimationFrame', previousCancel)
      else Reflect.deleteProperty(ownerWindow, 'cancelAnimationFrame')
      if (previous) Object.defineProperty(ownerWindow, missing, previous)
      else Reflect.deleteProperty(ownerWindow, missing)
      iframe.remove()
    }
  })

  it('keeps a usable focusable fallback when ResizeObserver is absent but resize scheduling remains available', async () => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    const previousObserver = Object.getOwnPropertyDescriptor(ownerWindow, 'ResizeObserver')
    const previousRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'requestAnimationFrame')
    const previousCancel = Object.getOwnPropertyDescriptor(ownerWindow, 'cancelAnimationFrame')
    Object.defineProperty(ownerWindow, 'ResizeObserver', { configurable: true, value: ControlledCapabilityResizeObserver })
    Object.defineProperty(ownerWindow, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => ownerWindow.setTimeout(() => callback(ownerWindow.performance.now()), 0) })
    Object.defineProperty(ownerWindow, 'cancelAnimationFrame', { configurable: true, value: (id: number) => ownerWindow.clearTimeout(id) })
    Reflect.deleteProperty(ownerWindow, 'ResizeObserver')
    let wrapper: ReturnType<typeof mount> | undefined
    try {
      wrapper = track(mount(Cascader, { attachTo: ownerDocument.body, props: { options: options(1000), defaultOpen: true, virtual: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never }))
      await settle()
      const rows = Array.from(ownerDocument.querySelectorAll<HTMLElement>('.aheart-cascader__option'))
      expect(rows.length).toBeGreaterThan(0)
      rows[0].focus()
      rows[0].dispatchEvent(new ownerWindow.KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }))
      await settle()
      const target = ownerDocument.querySelector<HTMLElement>('[data-cascader-value="item-999"]')
      expect(target?.isConnected).toBe(true)
      expect(target?.hidden).toBe(false)
      expect(ownerDocument.activeElement?.getAttribute('data-cascader-value')).toBe('item-999')
    } finally {
      if (wrapper) wrapper.unmount()
      if (previousObserver) Object.defineProperty(ownerWindow, 'ResizeObserver', previousObserver)
      else Reflect.deleteProperty(ownerWindow, 'ResizeObserver')
      if (previousRaf) Object.defineProperty(ownerWindow, 'requestAnimationFrame', previousRaf)
      else Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
      if (previousCancel) Object.defineProperty(ownerWindow, 'cancelAnimationFrame', previousCancel)
      else Reflect.deleteProperty(ownerWindow, 'cancelAnimationFrame')
      iframe.remove()
    }
  })

  it('aborts a same-turn virtual options replacement and ignores its late children', async () => {
    let resolveChildren!: (children: Option[]) => void
    let signal!: AbortSignal
    const loadData = (_option: Option, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<Option[]>(resolve => { resolveChildren = resolve })
    }
    const wrapper = mountCascader({ options: [{ value: 'old', label: 'Old', isLeaf: false }], defaultOpen: true, virtual: true, loadData })
    await settle()
    await wrapper.get('[data-cascader-value="old"]').trigger('click')
    await wrapper.setProps({ options: [{ value: 'new', label: 'New' }] } as never)
    expect(signal.aborted).toBe(true)
    resolveChildren([{ value: 'stale', label: 'Stale' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="stale"]').exists()).toBe(false)
    expect(wrapper.find('[data-cascader-value="new"]').exists()).toBe(true)
  })

  it('aborts a same-turn virtual unmount and retires the pending loader', async () => {
    let resolveChildren!: (children: Option[]) => void
    let signal!: AbortSignal
    const loadData = (_option: Option, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<Option[]>(resolve => { resolveChildren = resolve })
    }
    const wrapper = mountCascader({ options: [{ value: 'old', label: 'Old', isLeaf: false }], defaultOpen: true, virtual: true, loadData })
    await settle()
    await wrapper.get('[data-cascader-value="old"]').trigger('click')
    wrapper.unmount()
    expect(signal.aborted).toBe(true)
    resolveChildren([{ value: 'stale', label: 'Stale' }])
    await flushPromises()
  })

  it('aborts an old same-path request before accepting a fresh branch request', async () => {
    const signals: AbortSignal[] = []
    const resolvers: Array<(children: Option[]) => void> = []
    const loadData = (_option: Option, context: { signal: AbortSignal }) => {
      signals.push(context.signal)
      return new Promise<Option[]>(resolve => { resolvers.push(resolve) })
    }
    const wrapper = mountCascader({
      options: [
        { value: 'first', label: 'First', isLeaf: false },
        { value: 'second', label: 'Second', isLeaf: false }
      ],
      defaultOpen: true,
      virtual: true,
      loadData
    })
    await settle()
    await wrapper.get('[data-cascader-value="first"]').trigger('click')
    await wrapper.get('[data-cascader-value="second"]').trigger('click')
    await wrapper.get('[data-cascader-value="first"]').trigger('click')
    expect(signals).toHaveLength(3)
    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(true)
    expect(signals[2].aborted).toBe(false)
    resolvers[0]?.([{ value: 'stale-1', label: 'Stale 1' }])
    resolvers[1]?.([{ value: 'stale-2', label: 'Stale 2' }])
    resolvers[2]?.([{ value: 'fresh', label: 'Fresh' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="fresh"]').exists()).toBe(true)
    expect(wrapper.find('[data-cascader-value="stale-1"]').exists()).toBe(false)
    expect(wrapper.find('[data-cascader-value="stale-2"]').exists()).toBe(false)
  })

  it('does not touch observation capabilities during SSR before a mounted scroll element exists', async () => {
    let observerCalls = 0
    const previous = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
    class BeforeMountObserver {
      constructor() { observerCalls += 1 }
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: BeforeMountObserver })
    try {
      await renderToString(createSSRApp({ render: () => h(Cascader, { options: options(1000), defaultOpen: true, virtual: true }) }))
      expect(observerCalls).toBe(0)
    } finally {
      if (previous) Object.defineProperty(window, 'ResizeObserver', previous)
      else Reflect.deleteProperty(window, 'ResizeObserver')
    }
  })
})
