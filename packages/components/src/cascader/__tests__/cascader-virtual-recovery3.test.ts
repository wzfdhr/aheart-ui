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
  track(mount(VirtualList, {
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
  return { wrapper: wrappers.at(-1)!, state: (wrappers.at(-1)!.vm as any).$?.setupState, geometry, drain, setNatural: (height: number) => { natural = height } }
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

describe('Cascader virtual recovery round three', () => {
  it('reconciles suspended cached rows by stable key when options shrink', async () => {
    const errors: string[] = []
    const wrapper = track(mount(Cascader, { attachTo: document.body, props: { options: data(), virtual: true, open: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never, global: { config: { errorHandler: (error: unknown) => errors.push(String(error)) } } }))
    await settle()
    await wrapper.setProps({ disabled: true } as never)
    await settle()
    await wrapper.setProps({ options: [{ value: 'replacement', label: 'Replacement' }] } as never)
    await settle()
    expect(errors).toEqual([])
    expect(wrapper.findAll('.aheart-cascader__option').length).toBe(1)
    expect(wrapper.get('[data-cascader-value="replacement"]').exists()).toBe(true)
  })

  it('disconnects row observers when every key is replaced at the same index', async () => {
    const wrapper = await prepare()
    const oldObservers = observers.filter(observer => observer.observed.some(element => element.classList.contains('aheart-cascader__virtual-row')))
    expect(oldObservers.length).toBeGreaterThan(0)
    await wrapper.setProps({ options: data().map(option => ({ value: `new-${option.value}`, label: `New ${option.label}` })) } as never)
    await settle()
    const stale = oldObservers.filter(observer => observer.observed.some(element => !element.isConnected) && observer.disconnect.mock.calls.length === 0)
    expect(stale).toHaveLength(0)
  })

  it('keeps engine item size/start and DOM row transforms on one measured geometry', async () => {
    const { wrapper, state, geometry } = await measuredList()
    try {
      const first = state.virtualizer.getVirtualItems()[0]
      const second = state.virtualizer.getVirtualItems().find((item: { index: number }) => item.index === 1)
      const secondDom = wrapper.get('[data-virtual-index="1"]')
      expect(first.size).toBe(100)
      expect(second.start).toBe(100)
      expect(secondDom.attributes('style')).toContain('translateY(100px)')
      const last = state.virtualizer.getVirtualItems().at(-1)
      const totalSize = state.virtualizer.getTotalSize()
      expect(totalSize).toBeGreaterThanOrEqual((last?.start ?? 0) + (last?.size ?? 0))
      expect(totalSize).toBeLessThan(20000)
    } finally {
      geometry.mockRestore()
    }
  })

  it('updates measured geometry from 100 to 160 and back without stale engine positions', async () => {
    const { wrapper, state, geometry, setNatural, drain } = await measuredList()
    try {
      const rowObservers = observers.filter(observer => observer.observed.some(element => element.classList.contains('aheart-cascader__virtual-row')))
      expect(rowObservers.length).toBeGreaterThan(0)
      expect(state.virtualizer.getVirtualItems()[0].size).toBe(100)
      setNatural(160)
      for (const observer of rowObservers) observer.callback(observer.observed.map(target => ({ target, contentRect: { height: 160, width: 180 } } as ResizeObserverEntry)), observer as unknown as ResizeObserver)
      await drain()
      expect(state.virtualizer.getVirtualItems()[0].size).toBe(160)
      expect(wrapper.get('[data-virtual-index="1"]').attributes('style')).toContain('translateY(160px)')
      setNatural(100)
      for (const observer of rowObservers) observer.callback(observer.observed.map(target => ({ target, contentRect: { height: 100, width: 180 } } as ResizeObserverEntry)), observer as unknown as ResizeObserver)
      await drain()
      expect(state.virtualizer.getVirtualItems()[0].size).toBe(100)
      expect(wrapper.get('[data-virtual-index="1"]').attributes('style')).toContain('translateY(100px)')
    } finally {
      geometry.mockRestore()
    }
  })

  it('stops scheduling measurement frames after ten idle drains with fixed rows', async () => {
    const { state, drain } = await measuredList()
    const before = state.measurementVersion
    await drain(10)
    expect(state.measurementVersion).toBe(before)
    expect(rafQueue.size).toBe(0)
  })

  it('cancels pending column End navigation after a connected option blur', async () => {
    const wrapper = await prepare()
    const first = wrapper.get('[data-cascader-value="node-0"]').element as HTMLElement
    first.focus()
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }))
    first.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
    await settle()
    expect(document.activeElement).toBe(document.body)
  })

  it('pins a pending stable key even when the scroll offset remains unchanged', async () => {
    const wrapper = await prepare()
    const input = wrapper.get('input[type="search"]')
    await input.setValue('Node')
    await settle()
    const viewport = wrapper.get('.aheart-cascader__search-results').element as HTMLElement
    Object.defineProperty(viewport, 'scrollTop', { configurable: true, get: () => 0, set: () => undefined })
    input.element.focus()
    input.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }))
    await settle()
    expect(wrapper.find('[data-cascader-path="node-199"]').exists()).toBe(true)
  })
})
