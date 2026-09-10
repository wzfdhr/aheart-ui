import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import VirtualList from '../cascader-virtual-list.vue'

type Option = { value: string; label: string }
type ObserverRecord = { callback: ResizeObserverCallback; observed: Element[] }

const wrappers: Array<ReturnType<typeof mount>> = []
const observers: ObserverRecord[] = []
const frames = new Map<number, FrameRequestCallback>()
const timers = new Map<number, () => void>()
let id = 0
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined
let previousSetTimeout: PropertyDescriptor | undefined
let previousClearTimeout: PropertyDescriptor | undefined

class ControlledResizeObserver {
  readonly observed: Element[] = []
  constructor(readonly callback: ResizeObserverCallback) { observers.push({ callback, observed: this.observed }) }
  observe(element: Element) { this.observed.push(element) }
  disconnect() {}
  unobserve() {}
}

const options: Option[] = Array.from({ length: 20 }, (_, index) => ({ value: String(index), label: String(index) }))
const track = <T extends ReturnType<typeof mount>>(wrapper: T) => {
  const unmount = wrapper.unmount.bind(wrapper)
  let mounted = true
  wrapper.unmount = (() => { if (mounted) { mounted = false; unmount() } }) as T['unmount']
  wrappers.push(wrapper)
  return wrapper
}
const mountList = () => track(mount(VirtualList, {
  attachTo: document.body,
  props: { items: options, config: { height: 64, estimateSize: 32, overscan: 4 }, className: 'aheart-cascader__column', rowKey: (_index: number, option: Option) => option.value, disabledIndex: () => false },
  slots: { row: ({ option, tabindex }: { option: Option; tabindex: number }) => h('button', { class: 'aheart-cascader__option', tabindex }, option.label) }
}))
const flushRaf = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(0)) }

beforeEach(() => {
  observers.length = 0
  frames.clear()
  timers.clear()
  id = 0
  previousResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
  previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')
  previousCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame')
  previousSetTimeout = Object.getOwnPropertyDescriptor(window, 'setTimeout')
  previousClearTimeout = Object.getOwnPropertyDescriptor(window, 'clearTimeout')
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: ControlledResizeObserver })
  Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => { const key = ++id; frames.set(key, callback); return key } })
  Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: (key: number) => frames.delete(key) })
  Object.defineProperty(window, 'setTimeout', { configurable: true, value: (callback: () => void) => { const key = ++id; timers.set(key, callback); return key } })
  Object.defineProperty(window, 'clearTimeout', { configurable: true, value: (key: number) => timers.delete(key) })
})

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
  observers.length = 0
  frames.clear()
  timers.clear()
  if (previousResizeObserver) Object.defineProperty(window, 'ResizeObserver', previousResizeObserver)
  else Reflect.deleteProperty(window, 'ResizeObserver')
  if (previousRequestAnimationFrame) Object.defineProperty(window, 'requestAnimationFrame', previousRequestAnimationFrame)
  else Reflect.deleteProperty(window, 'requestAnimationFrame')
  if (previousCancelAnimationFrame) Object.defineProperty(window, 'cancelAnimationFrame', previousCancelAnimationFrame)
  else Reflect.deleteProperty(window, 'cancelAnimationFrame')
  if (previousSetTimeout) Object.defineProperty(window, 'setTimeout', previousSetTimeout)
  else Reflect.deleteProperty(window, 'setTimeout')
  if (previousClearTimeout) Object.defineProperty(window, 'clearTimeout', previousClearTimeout)
  else Reflect.deleteProperty(window, 'clearTimeout')
})

describe('Cascader virtual recovery round six', () => {
  it('cancels the Safari deferred measurement timer when the list is suspended', async () => {
    const userAgent = vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15')
    try {
      const wrapper = mountList()
      await nextTick()
      await nextTick()
      const row = observers.find(observer => observer.observed.some(element => element.classList.contains('aheart-cascader__virtual-row')))
      expect(row).toBeTruthy()
      flushRaf()
      const firstTimers = [...timers.keys()]
      expect(firstTimers.length).toBeGreaterThan(0)
      await wrapper.setProps({ enabled: false } as never)
      await nextTick()
      expect(firstTimers.filter(key => timers.has(key))).toHaveLength(0)
      timers.forEach(callback => callback())
      expect(wrapper.findAll('.aheart-cascader__option').length).toBe(0)
    } finally {
      userAgent.mockRestore()
    }
  })

  it('retains and clears every Safari timer when a second RAF arrives before the first commit', async () => {
    const userAgent = vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('AppleWebKit/605.1.15 Version/18.0 Safari/18.0')
    try {
      const wrapper = mountList()
      await nextTick()
      await nextTick()
      const row = observers.find(observer => observer.observed.some(element => element.classList.contains('aheart-cascader__virtual-row')))
      expect(row).toBeTruthy()
      flushRaf()
      const firstTimers = [...timers.keys()]
      expect(firstTimers.length).toBeGreaterThan(0)
      row!.callback(row!.observed.map(target => ({ target } as ResizeObserverEntry)), row as unknown as ResizeObserver)
      flushRaf()
      expect(timers.size).toBeGreaterThan(firstTimers.length)
      wrapper.unmount()
      expect([...timers.keys()]).toHaveLength(0)
    } finally {
      userAgent.mockRestore()
    }
  })
})
