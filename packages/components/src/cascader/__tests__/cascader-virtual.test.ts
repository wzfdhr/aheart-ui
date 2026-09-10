import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cascader from '../cascader.vue'

type CascaderOption = { value: string | number; label: string; children?: CascaderOption[]; isLeaf?: boolean; disabled?: boolean }
type ControlledObserver = { callback: ResizeObserverCallback; disconnect: ReturnType<typeof vi.fn>; elements: Element[] }

const wrappers: Array<ReturnType<typeof mount>> = []
const observers: ControlledObserver[] = []
const rafCallbacks = new Map<number, FrameRequestCallback>()
let rafId = 0
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined

class ControlledResizeObserver {
  readonly disconnect = vi.fn()
  readonly elements: Element[] = []
  constructor(readonly callback: ResizeObserverCallback) {
    observers.push(this)
  }
  observe(element: Element) { this.elements.push(element) }
  unobserve(element: Element) { const index = this.elements.indexOf(element); if (index >= 0) this.elements.splice(index, 1) }
}

const track = <T extends ReturnType<typeof mount>>(wrapper: T) => {
  const unmount = wrapper.unmount.bind(wrapper)
  let mounted = true
  wrapper.unmount = (() => {
    if (!mounted) return
    mounted = false
    unmount()
  }) as T['unmount']
  wrappers.push(wrapper)
  return wrapper
}

const mountCascader = (props: Record<string, unknown>, options: Record<string, unknown> = {}) => track(mount(Cascader, {
  attachTo: document.body,
  ...options,
  props: {
    getPopupContainer: (trigger: HTMLElement) => trigger.parentElement!,
    ...props
  } as never
}))

const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
  const callbacks = [...rafCallbacks.values()]
  rafCallbacks.clear()
  callbacks.forEach(callback => callback(performance.now()))
  await nextTick()
}

const optionsOf = (count: number, prefix = 'node'): CascaderOption[] => Array.from({ length: count }, (_, index) => ({
  value: `${prefix}-${index}`,
  label: `${prefix} ${index}`
}))

const numericBudget = (element: HTMLElement) => [
  element.style.maxBlockSize,
  element.style.maxHeight,
  getComputedStyle(element).maxBlockSize,
  getComputedStyle(element).maxHeight
].map(value => Number.parseFloat(value)).find(Number.isFinite)

beforeEach(() => {
  observers.length = 0
  rafCallbacks.clear()
  previousResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
  previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')
  previousCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame')
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: ControlledResizeObserver })
  Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => { const id = ++rafId; rafCallbacks.set(id, callback); return id } })
  Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: (id: number) => { rafCallbacks.delete(id) } })
})

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
  observers.length = 0
  rafCallbacks.clear()
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

describe('Cascader virtual core contract', () => {
  it('keeps default false full DOM while true bounds a 1k logical column and removes active-descendant output', async () => {
    const options = optionsOf(1000)
    const full = mountCascader({ options, defaultOpen: true })
    await settle()
    expect(full.findAll('.aheart-cascader__option')).toHaveLength(1000)

    const virtual = mountCascader({ options, defaultOpen: true, virtual: true })
    await settle()
    expect(virtual.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    expect(virtual.get('.aheart-cascader__trigger').attributes('aria-activedescendant')).toBeUndefined()
  })

  it('uses Cascader defaults 256/32/4, accepts an empty config, and never mutates input', async () => {
    const config = {}
    const options = optionsOf(1000)
    const before = JSON.stringify({ config, options })
    const wrapper = mountCascader({ options, defaultOpen: true, virtual: config })
    await settle()
    expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    expect(JSON.stringify({ config, options })).toBe(before)
    expect(numericBudget(wrapper.get('.aheart-cascader__column').element as HTMLElement)).toBeDefined()
    expect(numericBudget(wrapper.get('.aheart-cascader__column').element as HTMLElement)).toBeLessThanOrEqual(256)
  })

  it('warns and individually falls back invalid virtual fields without changing valid fields', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      const config = { height: 0, estimateSize: -3, overscan: 1.5 }
      const wrapper = mountCascader({ options: optionsOf(1000), defaultOpen: true, virtual: config })
      await settle()
      expect(warn).toHaveBeenCalled()
      expect(JSON.stringify(config)).toBe('{"height":0,"estimateSize":-3,"overscan":1.5}')
      expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
      expect(numericBudget(wrapper.get('.aheart-cascader__column').element as HTMLElement)).toBeDefined()
      expect(numericBudget(wrapper.get('.aheart-cascader__column').element as HTMLElement)).toBeLessThanOrEqual(256)
    } finally {
      warn.mockRestore()
    }
  })

  it('bounds every independent column while preserving typed path identity and leaf selection', async () => {
    const options: CascaderOption[] = [
      { value: 'branch', label: 'Branch', children: [{ value: 1, label: 'Numeric' }, { value: '1', label: 'String' }, ...optionsOf(998, 'child')] },
      ...optionsOf(999, 'root')
    ]
    const wrapper = mountCascader({ options, defaultOpen: true, virtual: { height: 256, estimateSize: 32, overscan: 4 } })
    await settle()
    await wrapper.get('[data-cascader-value="branch"]').trigger('click')
    await settle()
    expect(wrapper.findAll('.aheart-cascader__column')).toHaveLength(2)
    expect(wrapper.findAll('.aheart-cascader__column').every(column => column.element.querySelectorAll('.aheart-cascader__option').length <= 24)).toBe(true)
    const typed = wrapper.findAll('[data-cascader-token="n-31"], [data-cascader-token="s-31"]')
    expect(typed).toHaveLength(2)
    await typed[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['branch', '1']]])
  })

  it('virtualizes 10k search results and enters the complete enabled result sequence with real focus', async () => {
    const wrapper = mountCascader({ options: optionsOf(10000), showSearch: true, defaultOpen: true, virtual: true })
    await settle()
    const input = wrapper.get('input[type="search"]')
    await input.setValue('node')
    await settle()
    expect(wrapper.findAll('.aheart-cascader__search-results .aheart-cascader__option').length).toBeLessThanOrEqual(24)
    const searchOwners = wrapper.findAll<HTMLElement>('*').filter(node => {
      const element = node.element
      return element.dataset.virtualScrollOwner === 'true' || ['auto', 'scroll'].includes(getComputedStyle(element).overflowY)
    })
    expect(searchOwners).toHaveLength(1)
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(wrapper.find('.aheart-cascader__search-results .aheart-cascader__option').element)
    await (document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }))
    await settle()
    expect((document.activeElement as HTMLElement).dataset.cascaderPath).toBe('node-9999')
    await (document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['node-9999']])
  })

  it('gives each visible column exactly one vertical virtual owner outside the panel chrome', async () => {
    const wrapper = mountCascader({ options: optionsOf(1000), defaultOpen: true, virtual: { height: 256, estimateSize: 32, overscan: 4 } })
    await settle()
    const panel = wrapper.get('.aheart-cascader__panel').element as HTMLElement
    const columns = wrapper.findAll('.aheart-cascader__column')
    expect(columns).toHaveLength(1)
    const owners = wrapper.findAll<HTMLElement>('*').filter(node => {
      const element = node.element
      return element.dataset.virtualScrollOwner === 'true' || ['auto', 'scroll'].includes(getComputedStyle(element).overflowY)
    })
    const columnsWrapper = wrapper.get('.aheart-cascader__columns').element
    expect(owners).toHaveLength(1)
    expect(owners[0].element).not.toBe(panel)
    expect(owners[0].element).not.toBe(columnsWrapper)
    expect(owners[0].element.querySelectorAll('.aheart-cascader__option').length).toBeGreaterThan(0)
    expect(owners[0].element.querySelectorAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
  })

  it('warns and disables virtualization for a non-plain runtime value', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      const wrapper = mountCascader({ options: optionsOf(1000), defaultOpen: true, virtual: new Number(1) })
      await settle()
      expect(warn).toHaveBeenCalled()
      expect(wrapper.findAll('.aheart-cascader__option')).toHaveLength(1000)
    } finally {
      warn.mockRestore()
    }
  })

  it('does not mutate frozen or foreign-realm config while preserving valid fields', async () => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const foreignWindow = iframe.contentWindow!
    const config = Object.freeze({ height: 384, estimateSize: 40, overscan: 2 })
    const foreignConfig = foreignWindow.Object.assign(new foreignWindow.Object(), config)
    try {
      const before = JSON.stringify(config)
      const wrapper = mountCascader({ options: optionsOf(1000), defaultOpen: true, virtual: foreignConfig })
      await settle()
      expect(JSON.stringify(config)).toBe(before)
      expect(JSON.stringify(foreignConfig)).toBe(before)
      expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    } finally {
      iframe.remove()
    }
  })

  it('highlights only a fully matching selected path when equal leaf values occur under A and B', async () => {
    const wrapper = mountCascader({
      multiple: true,
      defaultValue: [['A', 1]],
      defaultOpen: true,
      virtual: true,
      options: [
        { value: 'A', label: 'A', children: [{ value: 1, label: 'Numeric A' }, { value: '1', label: 'String A' }] },
        { value: 'B', label: 'B', children: [{ value: 1, label: 'Numeric B' }, { value: '1', label: 'String B' }] }
      ]
    })
    await settle()
    await wrapper.get('[data-cascader-value="B"]').trigger('click')
    await settle()
    expect(wrapper.get('[data-cascader-token="n-31"]').classes()).not.toContain('is-selected')
    expect(wrapper.get('[data-cascader-token="s-31"]').classes()).not.toContain('is-selected')
  })

  it('selects slash-containing typed paths exactly and gives each result a distinct identity token', async () => {
    const wrapper = mountCascader({
      showSearch: true,
      defaultOpen: true,
      virtual: true,
      options: [
        { value: 'a/b', label: 'A slash', children: [{ value: 'leaf', label: 'Leaf' }] },
        { value: 'a', label: 'A', children: [{ value: 'b', label: 'B', children: [{ value: 'leaf', label: 'Leaf' }] }] }
      ]
    })
    await settle()
    await wrapper.get('input[type="search"]').setValue('Leaf')
    await settle()
    const initialResults = wrapper.findAll('.aheart-cascader__search-results .aheart-cascader__option')
    expect(initialResults).toHaveLength(2)
    const tokens = initialResults.map(option => option.attributes('data-cascader-path-token'))
    expect(tokens.every(Boolean)).toBe(true)
    expect(new Set(tokens).size).toBe(2)
    await initialResults.find(option => option.text().includes('A slash'))!.trigger('click')
    await settle()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a/b', 'leaf']])
    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await settle()
    await wrapper.get('input[type="search"]').setValue('Leaf')
    await settle()
    const secondResults = wrapper.findAll('.aheart-cascader__search-results .aheart-cascader__option')
    await secondResults.find(option => option.text().includes('A / B / Leaf'))!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b', 'leaf']])
  })

  it('keeps a single roving option and uses the complete column for End while skipping a disabled tail', async () => {
    const column = [...optionsOf(99, 'option'), { value: 'disabled-tail', label: 'Disabled tail', disabled: true }]
    const wrapper = mountCascader({ options: [{ value: 'root', label: 'Root', children: column }], defaultOpen: true, virtual: true })
    await settle()
    const root = wrapper.get('[data-cascader-value="root"]')
    expect(wrapper.findAll('.aheart-cascader__option[tabindex="0"]')).toHaveLength(1)
    root.element.focus()
    await root.trigger('keydown', { key: 'ArrowRight' })
    await settle()
    const first = wrapper.get('[data-cascader-value="option-0"]')
    await first.trigger('keydown', { key: 'End' })
    expect(document.activeElement?.getAttribute('data-cascader-value')).toBe('option-98')
  })
})
