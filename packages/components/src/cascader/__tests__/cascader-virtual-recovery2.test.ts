import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import Cascader from '../cascader.vue'

type Option = { value: string; label: string; children?: Option[]; isLeaf?: boolean; disabled?: boolean }
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
const options = (count = 200, prefix = 'node'): Option[] => Array.from({ length: count }, (_, index) => ({ value: `${prefix}-${index}`, label: `${prefix} ${index}` }))
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
  const wrapper = mountCascader({ options: options(), virtual: true, showSearch: true, open: true, ...extra })
  await settle()
  return wrapper
}
const searchCase = async (extra: Record<string, unknown> = {}) => {
  const wrapper = await prepare(extra)
  const input = wrapper.get('input[type="search"]')
  await input.setValue('Node')
  await settle()
  input.element.focus()
  return { wrapper, input }
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

describe('Cascader virtual recovery round two', () => {
  it('retains a bounded visible row snapshot while an open popup is disabled', async () => {
    const wrapper = await prepare()
    await wrapper.setProps({ disabled: true } as never)
    await settle()
    const rows = wrapper.findAll('.aheart-cascader__option').length
    expect(rows).toBeGreaterThan(0)
    expect(rows).toBeLessThanOrEqual(24)
  })

  it('treats explicit null-related blur as cancellation of pending input navigation', async () => {
    const { input } = await searchCase()
    input.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    ;(input.element as HTMLInputElement).blur()
    await settle()
    expect(document.activeElement).toBe(document.body)
  })

  it('cancels an old End request when focus returns to the search input', async () => {
    const { input } = await searchCase()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await settle()
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }))
    input.element.focus()
    await settle()
    expect(document.activeElement).toBe(input.element)
  })

  it('cancels a queued query-clear column handoff when focus moves outside', async () => {
    const { input } = await searchCase()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await settle()
    const outside = document.createElement('button')
    document.body.append(outside)
    ;(input.element as HTMLInputElement).value = ''
    input.element.dispatchEvent(new Event('input', { bubbles: true }))
    outside.focus()
    await settle()
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })

  it('installs outside cancellation when an already-open panel switches from nonvirtual to virtual', async () => {
    const { wrapper, input } = await searchCase({ virtual: false })
    await wrapper.setProps({ virtual: true } as never)
    await settle()
    input.element.focus()
    const outside = document.createElement('button')
    document.body.append(outside)
    input.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    outside.focus()
    await settle()
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })

  it('observes content-only row height changes and updates the mounted row geometry', async () => {
    const wrapper = await prepare()
    const owner = wrapper.get('.aheart-cascader__column').element as HTMLElement
    const rowObservers = observers.filter(observer => observer.observed.some(element => element.classList.contains('aheart-cascader__virtual-row')))
    expect(rowObservers.length).toBeGreaterThan(0)
    const firstRow = owner.querySelector<HTMLElement>('.aheart-cascader__virtual-row')
    const secondRow = owner.querySelectorAll<HTMLElement>('.aheart-cascader__virtual-row')[1]
    expect(firstRow).toBeTruthy()
    const changed = 160
    const beforeTransform = secondRow?.style.transform
    vi.spyOn(firstRow!, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0, top: 0, left: 0, right: 180, bottom: changed, width: 180, height: changed, toJSON() {} } as DOMRect)
    for (const observer of rowObservers) observer.callback(observer.observed.map(target => ({ target, contentRect: { height: changed, width: 180 } } as ResizeObserverEntry)), observer as unknown as ResizeObserver)
    await settle()
    expect(firstRow!.getBoundingClientRect().height).toBe(changed)
    expect(secondRow?.style.transform).not.toBe(beforeTransform)
  })

  it('keeps logical overscan indices 0 through 4 mounted without requiring a scroll event', async () => {
    const geometry = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains('aheart-cascader__virtual-row')) return { x: 0, y: 0, top: 0, left: 0, right: 180, bottom: 100, width: 180, height: 100, toJSON() {} } as DOMRect
      return { x: 0, y: 0, top: 0, left: 0, right: 180, bottom: 32, width: 180, height: 32, toJSON() {} } as DOMRect
    })
    try {
      const wrapper = await prepare()
      for (let index = 0; index < 5; index += 1) await settle()
      const indices = wrapper.findAll('[data-virtual-index]').map(row => Number(row.attributes('data-virtual-index')))
      expect(indices).toEqual(expect.arrayContaining([0, 1, 2, 3, 4]))
    } finally {
      geometry.mockRestore()
    }
  })

  it('preserves the nonvirtual column minimum block size while virtual mode owns the zero-height wrapper', async () => {
    const style = document.createElement('style')
    style.textContent = readFileSync('/Users/start/.codex/worktrees/091b/aheart-ui/packages/components/src/cascader/style.css', 'utf8')
    document.head.append(style)
    try {
      const normal = mountCascader({ options: options(), defaultOpen: true, virtual: false })
      await settle()
      const normalColumns = normal.get('.aheart-cascader__columns').element as HTMLElement
      const normalStyle = getComputedStyle(normalColumns)
      expect(normalStyle.minBlockSize).toBe('180px')
      expect(normalStyle.overflowY).not.toBe('hidden')

      const virtual = mountCascader({ options: options(), defaultOpen: true, virtual: true })
      await settle()
      const virtualColumns = virtual.get('.aheart-cascader__columns').element as HTMLElement
      const virtualStyle = getComputedStyle(virtualColumns)
      expect(virtualStyle.minBlockSize).toBe('0px')
      expect(virtualStyle.overflowY).toBe('hidden')
    } finally {
      style.remove()
    }
  })

})
