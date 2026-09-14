import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cascader from '../cascader.vue'
import VirtualList from '../cascader-virtual-list.vue'

type Option = { value: string; label: string; children?: Option[]; isLeaf?: boolean }
type ObserverRecord = { callback: ResizeObserverCallback; disconnect: ReturnType<typeof vi.fn>; observed: Element[] }

const wrappers: Array<ReturnType<typeof mount>> = []
const observers: ObserverRecord[] = []
const rafQueue = new Map<number, FrameRequestCallback>()
let rafId = 0
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined

class ControlledResizeObserver {
  readonly disconnect = vi.fn()
  readonly observed: Element[] = []
  constructor(readonly callback: ResizeObserverCallback) {
    observers.push({ callback, disconnect: this.disconnect, observed: this.observed })
  }
  observe(element: Element) { this.observed.push(element) }
  unobserve(element: Element) { const index = this.observed.indexOf(element); if (index >= 0) this.observed.splice(index, 1) }
}

const track = <T extends ReturnType<typeof mount>>(wrapper: T) => {
  const unmount = wrapper.unmount.bind(wrapper)
  let mounted = true
  wrapper.unmount = (() => { if (mounted) { mounted = false; unmount() } }) as T['unmount']
  wrappers.push(wrapper)
  return wrapper
}
const data = (count = 200, prefix = 'node'): Option[] => Array.from({ length: count }, (_, index) => ({ value: `${prefix}-${index}`, label: `${prefix} ${index}` }))
const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
  const callbacks = [...rafQueue.values()]
  rafQueue.clear()
  callbacks.forEach(callback => callback(performance.now()))
  await nextTick()
}
const mountCascader = (props: Record<string, unknown>) => track(mount(Cascader, {
  attachTo: document.body,
  props: { getPopupContainer: (trigger: HTMLElement) => trigger.parentElement!, ...props } as never
}))
const prepare = async (extra: Record<string, unknown> = {}) => {
  const wrapper = mountCascader({ options: data(), virtual: true, showSearch: true, open: true, ...extra })
  await settle()
  return wrapper
}
const measuredList = async () => {
  let natural = 100
  const geometry = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('aheart-cascader__virtual-row')) return { x: 0, y: 0, top: 0, left: 0, right: 180, bottom: natural, width: 180, height: natural, toJSON() {} } as DOMRect
    return { x: 0, y: 0, top: 0, left: 0, right: 180, bottom: 32, width: 180, height: 32, toJSON() {} } as DOMRect
  })
  const wrapper = track(mount(VirtualList, {
    attachTo: document.body,
    props: { items: data(), config: { height: 64, estimateSize: 32, overscan: 4 }, className: 'aheart-cascader__column', rowKey: (_index: number, option: Option) => option.value, disabledIndex: () => false },
    slots: { row: ({ option, tabindex }: { option: Option; tabindex: number }) => h('button', { class: 'aheart-cascader__option', tabindex }, option.label) }
  }))
  const drain = async (count = 5) => {
    for (let index = 0; index < count; index += 1) {
      await settle()
      const callbacks = [...rafQueue.values()]
      rafQueue.clear()
      callbacks.forEach(callback => callback(index * 16))
    }
    await settle()
  }
  await drain()
  return { wrapper, state: (wrapper.vm as any).$?.setupState, geometry, drain, setNatural: (height: number) => { natural = height } }
}

beforeEach(() => {
  observers.length = 0
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
  observers.length = 0
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

describe('Cascader virtual recovery round four', () => {
  it('keeps a successful lazy child load but cancels the old ArrowRight focus after outside focus and blur', async () => {
    let resolveChildren!: (children: Option[]) => void
    let signal!: AbortSignal
    const wrapper = await prepare({
      options: [{ value: 'lazy', label: 'Lazy', isLeaf: false }],
      loadData: (_option: Option, context: { signal: AbortSignal }) => {
        signal = context.signal
        return new Promise<Option[]>(resolve => { resolveChildren = resolve })
      }
    })
    const row = wrapper.get('[data-cascader-value="lazy"]').element as HTMLElement
    row.focus()
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
    await settle()
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    outside.blur()
    resolveChildren([{ value: 'child', label: 'Child' }])
    await settle()
    expect(signal.aborted).toBe(false)
    expect(wrapper.find('[data-cascader-value="child"]').exists()).toBe(true)
    expect(document.activeElement).toBe(document.body)
    outside.remove()
  })

  it('uses a fractional row height consistently for engine size and DOM transform', async () => {
    const { wrapper, state, geometry, setNatural, drain } = await measuredList()
    try {
      const rows = observers.filter(observer => observer.observed.some(element => element.classList.contains('aheart-cascader__virtual-row')))
      expect(rows.length).toBeGreaterThan(0)
      setNatural(100.25)
      for (const observer of rows) observer.callback(observer.observed.map(target => ({ target, contentRect: { height: 100.25, width: 180 } } as ResizeObserverEntry)), observer as unknown as ResizeObserver)
      await drain()
      const size = state.virtualizer.getVirtualItems()[0].size
      const second = wrapper.get('[data-virtual-index="1"]')
      expect(Math.abs(size - 100.25)).toBeLessThanOrEqual(0.5)
      expect(second.attributes('style')).toContain('translateY(100.25px)')
    } finally {
      geometry.mockRestore()
    }
  })

  it('cancels the owner timer created after a Safari measurement RAF before unmount', async () => {
    const userAgent = vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15')
    const timers = new Map<number, () => void>()
    let timerId = 0
    const scheduled = vi.spyOn(window, 'setTimeout').mockImplementation(((callback: () => void) => { const id = ++timerId; timers.set(id, callback); return id }) as any)
    const cleared = vi.spyOn(window, 'clearTimeout').mockImplementation(((id: number) => { timers.delete(id) }) as any)
    try {
      const { wrapper } = await measuredList()
      const owned = [...timers.keys()]
      expect(owned.length).toBeGreaterThan(0)
      const row = observers.find(observer => observer.observed.some(element => element.classList.contains('aheart-cascader__virtual-row')))
      expect(row).toBeTruthy()
      row!.callback(row!.observed.map(target => ({ target } as ResizeObserverEntry)), row as unknown as ResizeObserver)
      expect([...rafQueue.keys()]).toHaveLength(0)
      wrapper.unmount()
      expect(owned.filter(id => timers.has(id))).toHaveLength(0)
    } finally {
      userAgent.mockRestore()
      scheduled.mockRestore()
      cleared.mockRestore()
    }
  })

  it('does not create active row observers when suspended options reorder, then rebinds only current rows on resume', async () => {
    const wrapper = await prepare()
    await wrapper.setProps({ disabled: true } as never)
    await settle()
    await wrapper.setProps({ options: data().reverse() } as never)
    await settle()
    const suspendedLive = observers.filter(observer => observer.disconnect.mock.calls.length === 0 && observer.observed.some(element => element.isConnected && element.classList.contains('aheart-cascader__virtual-row')))
    expect(suspendedLive).toHaveLength(0)
    await wrapper.setProps({ disabled: false } as never)
    await settle()
    const resumedLive = observers.filter(observer => observer.disconnect.mock.calls.length === 0 && observer.observed.some(element => element.isConnected && element.classList.contains('aheart-cascader__virtual-row')))
    expect(resumedLive.length).toBeGreaterThan(0)
    wrapper.unmount()
    expect(resumedLive.filter(observer => observer.disconnect.mock.calls.length === 0)).toHaveLength(0)
  })
})
