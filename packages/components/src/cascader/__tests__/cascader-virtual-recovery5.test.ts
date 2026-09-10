import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import VirtualList from '../cascader-virtual-list.vue'

type Option = { value: string; label: string }
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
  constructor(readonly callback: ResizeObserverCallback) { observers.push({ callback, disconnect: this.disconnect, observed: this.observed }) }
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
const data = (count = 200): Option[] => Array.from({ length: count }, (_, index) => ({ value: `node-${index}`, label: `Node ${index}` }))
const settle = async () => { await nextTick(); await flushPromises(); await nextTick(); const callbacks = [...rafQueue.values()]; rafQueue.clear(); callbacks.forEach(callback => callback(performance.now())); await nextTick() }
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
  const drain = async (count = 5) => { for (let index = 0; index < count; index += 1) { await settle(); const callbacks = [...rafQueue.values()]; rafQueue.clear(); callbacks.forEach(callback => callback(index * 16)) } await settle() }
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

describe('Cascader virtual recovery round five', () => {
  it('does not broadcast a local uniform row batch over another measured row', async () => {
    const { state, geometry } = await measuredList()
    try {
      expect(state.virtualizer.getVirtualItems()[0].size).toBe(100)
      const subset = observers.filter(observer => observer.observed.some(element => ['node-1', 'node-2'].some(key => element.querySelector(`[data-cascader-value="${key}"]`))))
      const observedRows = observers.filter(observer => observer.observed.some(element => element.classList.contains('aheart-cascader__virtual-row')))
      expect(observedRows.length).toBeGreaterThan(0)
      const selected = subset.length > 0 ? subset : observedRows.slice(0, 2)
      const subsetRows = selected.flatMap(observer => observer.observed.filter(element => element.classList.contains('aheart-cascader__virtual-row')))
      for (const row of subsetRows) vi.spyOn(row, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0, top: 0, left: 0, right: 180, bottom: 32, width: 180, height: 32, toJSON() {} } as DOMRect)
      for (const observer of selected) observer.callback(observer.observed.map(target => ({ target, contentRect: { height: 32, width: 180 } } as ResizeObserverEntry)), observer as unknown as ResizeObserver)
      await settle()
      expect(state.virtualizer.getVirtualItems().find((item: { index: number }) => item.index === 0)?.size).toBe(100)
    } finally {
      geometry.mockRestore()
    }
  })

  it('uses layout and border-box height100 instead of transformed visual rect98', async () => {
    const { wrapper, state, geometry, setNatural, drain } = await measuredList()
    try {
      setNatural(98)
      const rows = wrapper.findAll('.aheart-cascader__virtual-row').map(row => row.element as HTMLElement)
      for (const row of rows) Object.defineProperty(row, 'offsetHeight', { configurable: true, get: () => 100 })
      const observed = observers.filter(observer => observer.observed.some(element => rows.includes(element as HTMLElement)))
      for (const observer of observed) observer.callback(observer.observed.map(target => ({ target, borderBoxSize: [{ blockSize: 100, inlineSize: 180 }], contentRect: { height: 100, width: 180 } } as unknown as ResizeObserverEntry)), observer as unknown as ResizeObserver)
      await drain()
      expect(state.virtualizer.getVirtualItems()[0].size).toBe(100)
      expect(wrapper.get('[data-virtual-index="1"]').attributes('style')).toContain('translateY(100px)')
    } finally {
      geometry.mockRestore()
    }
  })

  it('owns both Safari RAF and deferred timeout handles across a second row event and unmount', async () => {
    const userAgent = vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15')
    const scheduled = vi.spyOn(window, 'setTimeout')
    const cleared = vi.spyOn(window, 'clearTimeout')
    try {
      const { wrapper } = await measuredList()
      const row = observers.find(observer => observer.observed.some(element => element.classList.contains('aheart-cascader__virtual-row')))
      expect(row).toBeTruthy()
      const before = scheduled.mock.results.length
      row!.callback(row!.observed.map(target => ({ target } as ResizeObserverEntry)), row as unknown as ResizeObserver)
      const firstRaf = [...rafQueue.values()]
      rafQueue.clear()
      firstRaf.forEach(callback => callback(0))
      row!.callback(row!.observed.map(target => ({ target } as ResizeObserverEntry)), row as unknown as ResizeObserver)
      wrapper.unmount()
      const created = scheduled.mock.results.slice(before).filter(result => result.type === 'return').map(result => result.value)
      expect(created.length).toBeGreaterThan(0)
      expect(created.filter(id => !cleared.mock.calls.some(([candidate]) => candidate === id))).toHaveLength(0)
    } finally {
      userAgent.mockRestore()
      scheduled.mockRestore()
      cleared.mockRestore()
    }
  })
})
