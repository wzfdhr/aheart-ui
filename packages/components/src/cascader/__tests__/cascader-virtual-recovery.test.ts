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

describe('Cascader virtual recovery boundaries', () => {
  it('cancels a pending search handoff when focus moves outside', async () => {
    const { input } = await searchCase()
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    input.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    outside.focus()
    await settle()
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })

  it('does not focus a search result after an accepted close', async () => {
    const { wrapper, input } = await searchCase()
    input.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    await wrapper.setProps({ open: false } as never)
    await settle()
    expect(document.activeElement?.classList.contains('aheart-cascader__option')).toBe(false)
  })

  it('cancels a pending search index when the query changes', async () => {
    const { input } = await searchCase()
    input.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    ;(input.element as HTMLInputElement).value = 'Node 9'
    input.element.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()
    expect(document.activeElement).toBe(input.element)
  })

  it('keeps non-virtual search ArrowDown native and focused in the input', async () => {
    const { input } = await searchCase({ virtual: false })
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    input.element.dispatchEvent(event)
    await settle()
    expect(event.defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(input.element)
  })

  it('keeps exactly one roving entry in the owner-realm fallback', async () => {
    const previous = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
    Reflect.deleteProperty(window, 'ResizeObserver')
    try {
      const wrapper = await prepare()
      const entries = wrapper.findAll('.aheart-cascader__option').filter(row => (row.element as HTMLElement).tabIndex === 0)
      expect(entries).toHaveLength(1)
    } finally {
      if (previous) Object.defineProperty(window, 'ResizeObserver', previous)
      else Reflect.deleteProperty(window, 'ResizeObserver')
    }
  })

  it('moves roving focus to another enabled option while the current branch is loading', async () => {
    const wrapper = await prepare({ options: [{ value: 'lazy', label: 'Lazy', isLeaf: false }, { value: 'other', label: 'Other' }], loadData: () => new Promise<Option[]>(() => {}) })
    const lazy = wrapper.get('[data-cascader-value="lazy"]')
    lazy.element.focus()
    await lazy.trigger('click')
    await settle()
    const entries = wrapper.findAll('.aheart-cascader__option').filter(row => (row.element as HTMLElement).tabIndex === 0)
    expect(entries).toHaveLength(1)
    expect(entries[0].attributes('data-cascader-value')).not.toBe('lazy')
  })

  it('does not make the virtual popup a second vertical overflow owner', async () => {
    const style = document.createElement('style')
    style.textContent = readFileSync('/Users/start/.codex/worktrees/091b/aheart-ui/packages/components/src/cascader/style.css', 'utf8')
    document.head.append(style)
    try {
      const wrapper = await prepare()
      const panel = wrapper.get('.aheart-cascader__panel').element as HTMLElement
      const overflow = getComputedStyle(panel).overflowY || getComputedStyle(panel).overflow
      expect(['auto', 'scroll']).not.toContain(overflow)
    } finally {
      style.remove()
    }
  })

  it('disconnects newly created virtual observers when disabled', async () => {
    const wrapper = await prepare()
    const created = observers.filter(observer => observer.observed.length > 0)
    expect(created.length).toBeGreaterThan(0)
    await wrapper.setProps({ disabled: true } as never)
    await settle()
    expect(created.filter(observer => observer.disconnect.mock.calls.length === 0)).toHaveLength(0)
  })

  it('keeps child End focus and returns Left to the typed parent', async () => {
    const wrapper = await prepare({ options: [{ value: 'root', label: 'Root', children: data() }] })
    const root = wrapper.get('[data-cascader-value="root"]')
    root.element.focus()
    await root.trigger('keydown', { key: 'ArrowRight' })
    await settle()
    const first = wrapper.get('[data-cascader-value="node-0"]')
    await first.trigger('keydown', { key: 'End' })
    await settle()
    expect(document.activeElement?.getAttribute('data-cascader-value')).toBe('node-199')
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }))
    await settle()
    expect(document.activeElement?.getAttribute('data-cascader-value')).toBe('root')
    const roving = wrapper.findAll('[data-cascader-column="1"][tabindex="0"]')
    expect(roving).toHaveLength(1)
    expect(roving[0].attributes('data-cascader-value')).toBe('node-199')
  })

  it('transfers focused search result into the active column when the query clears', async () => {
    const { wrapper, input } = await searchCase()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await settle()
    expect(document.activeElement?.getAttribute('data-cascader-path')).toBe('node-0')
    await input.setValue('')
    await settle()
    expect(document.activeElement?.getAttribute('data-cascader-value')).toBe('node-0')
    expect(document.activeElement).not.toBe(document.body)
  })

  it('retains a viewport resize after row measurement work is queued', async () => {
    const frames = new Map<number, FrameRequestCallback>()
    let id = 0
    Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => { frames.set(++id, callback); return id } })
    Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: (frame: number) => frames.delete(frame) })
    const wrapper = await prepare()
    const owner = wrapper.get('.aheart-cascader__column').element as HTMLElement
    Object.defineProperty(owner, 'clientHeight', { configurable: true, value: 256, writable: true })
    const initialRows = owner.querySelectorAll('.aheart-cascader__option').length
    const observer = observers.find(record => record.observed.includes(owner))
    expect(observer).toBeTruthy()
    Object.defineProperty(owner, 'clientHeight', { configurable: true, value: 128, writable: true })
    observer!.callback([{ target: owner } as ResizeObserverEntry], observer as unknown as ResizeObserver)
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach(callback => callback(performance.now()))
    await settle()
    const rows = owner.querySelectorAll('.aheart-cascader__option')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThan(initialRows)
    expect(rows.length).toBeLessThanOrEqual(24)
  })
})
