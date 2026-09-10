import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cascader from '../cascader.vue'

type Option = { value: string; label: string; isLeaf?: boolean }
const wrappers: Array<ReturnType<typeof mount>> = []
const rafQueue = new Map<number, FrameRequestCallback>()
let rafId = 0
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined
class ControlledResizeObserver { constructor(readonly callback: ResizeObserverCallback) {} observe() {} unobserve() {} disconnect() {} }
const track = <T extends ReturnType<typeof mount>>(wrapper: T) => {
  const unmount = wrapper.unmount.bind(wrapper)
  let mounted = true
  wrapper.unmount = (() => { if (mounted) { mounted = false; unmount() } }) as T['unmount']
  wrappers.push(wrapper)
  return wrapper
}
const settle = async () => { await nextTick(); await flushPromises(); await nextTick(); const callbacks = [...rafQueue.values()]; rafQueue.clear(); callbacks.forEach(callback => callback(performance.now())); await nextTick() }
const mountLazy = (loadData: (option: Option, context: { signal: AbortSignal }) => Promise<Option[]>) => track(mount(Cascader, {
  attachTo: document.body,
  props: { options: [{ value: 'root', label: 'Lazy root', isLeaf: false }], virtual: true, open: true, loadData, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never
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

describe('Cascader lazy keyboard error focus', () => {
  it('restores the stable root focus after a keyboard load fails and permits Enter retry', async () => {
    const loadData = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([{ value: 'child', label: 'Loaded child' }])
    const wrapper = mountLazy(loadData)
    await settle()
    const root = wrapper.get('[data-cascader-value="root"]')
    root.element.focus()
    await root.trigger('keydown', { key: 'Enter' })
    await settle()
    expect(loadData).toHaveBeenCalledTimes(1)
    expect(root.attributes('aria-label')).toContain('加载失败')
    expect(document.activeElement).toBe(root.element)
    await root.trigger('keydown', { key: 'Enter' })
    await settle()
    expect(loadData).toHaveBeenCalledTimes(2)
    expect(wrapper.get('[data-cascader-value="child"]').exists()).toBe(true)
  })

  it('does not reclaim focus after the user leaves while the keyboard load is pending', async () => {
    let rejectLoad!: (error: Error) => void
    const loadData = vi.fn(() => new Promise<Option[]>((_resolve, reject) => { rejectLoad = reject }))
    const wrapper = mountLazy(loadData)
    await settle()
    const root = wrapper.get('[data-cascader-value="root"]')
    root.element.focus()
    await root.trigger('keydown', { key: 'Enter' })
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    rejectLoad(new Error('offline'))
    await settle()
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })
})
