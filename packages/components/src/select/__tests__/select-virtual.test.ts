import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Select from '../select.vue'

enableAutoUnmount(afterEach)
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return this.classList.contains('aheart-select__popup') ? 286 : 32
  })
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300)
})
afterEach(() => vi.restoreAllMocks())
const options = Array.from({ length: 1000 }, (_, value) => ({ label: `Item ${value}`, value, disabled: value === 17 }))
const create = (props: Record<string, unknown> = {}) => mount(Select, {
  props: { options, defaultOpen: true, ...props } as any,
  global: { stubs: { Teleport: true } }
})

describe('Select virtual integration', () => {
  it('keeps the default full DOM path and explicitly windows the same options', () => {
    expect(create().findAll('[role="option"]')).toHaveLength(1000)
    const virtual = create({ virtual: true })
    expect(virtual.findAll('[role="option"]').length).toBeLessThan(30)
    expect(virtual.findAll('[role="option"]').length).toBeGreaterThan(0)
    expect(virtual.get('[role="option"]').attributes('aria-setsize')).toBe('1000')
  })
  it('renders an initially selected tail active item and handles Home/End', async () => {
    const wrapper = create({ virtual: true, defaultValue: 999 })
    const trigger = wrapper.get('[role="combobox"]')
    expect(wrapper.get('.is-active[role="option"]').text()).toContain('Item 999')
    expect(wrapper.get('.is-active[role="option"]').attributes('id')).toBe(trigger.attributes('aria-activedescendant'))
    await trigger.trigger('keydown', { key: 'Home' })
    expect(wrapper.get('.is-active[role="option"]').text()).toContain('Item 0')
    await trigger.trigger('keydown', { key: 'End' })
    expect(wrapper.get('.is-active[role="option"]').text()).toContain('Item 999')
    expect(wrapper.findAll('[role="option"]').length).toBeLessThan(30)
  })
  it('retains typed active identity through search and replaces removed active', async () => {
    const wrapper = create({ virtual: true, showSearch: true, options: [{ label: 'Number', value: 1 }, { label: 'String', value: '1' }, ...options.slice(2)] })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.get('.is-active[role="option"]').text()).toContain('String')
    await wrapper.setProps({ options: [{ label: 'String changed', value: '1' }, { label: 'Number', value: 1 }] })
    expect(wrapper.get('.is-active[role="option"]').text()).toContain('String changed')
    await input.setValue('Number')
    await nextTick()
    expect(wrapper.get('.is-active[role="option"]').text()).toContain('Number')
    expect(wrapper.get('[role="option"]').attributes('aria-setsize')).toBe('1')
    await wrapper.setProps({ options: [] })
    expect(input.attributes('aria-activedescendant')).toBeUndefined()
  })
  it('skips disabled items and emits only one multiple Enter and clear', async () => {
    const wrapper = create({ virtual: true, showSearch: true, mode: 'multiple', allowClear: true })
    const input = wrapper.get('input[role="combobox"]')
    for (let index = 0; index < 20; index++) await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.get('.is-active[role="option"]').text()).toContain('Item 21')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[[21]]])
    await wrapper.get('button[aria-label="清除"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[[21]], [[]]])
  })
  it('keeps IME commit events single and does not navigate during composition', async () => {
    const wrapper = create({ virtual: true, showSearch: true })
    const input = wrapper.get('input[role="combobox"]')
    const initial = input.attributes('aria-activedescendant')
    await input.trigger('compositionstart')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toBe(initial)
    ;(input.element as HTMLInputElement).value = 'Item 9'
    await input.trigger('compositionend')
    await input.trigger('input')
    expect(wrapper.emitted('search')).toEqual([['Item 9']])
  })
  it('can switch back to the complete default path without changing selection', async () => {
    const wrapper = create({ virtual: true, defaultValue: 999 })
    await wrapper.setProps({ virtual: false })
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1000)
    expect(wrapper.get('.is-active[role="option"]').text()).toContain('Item 999')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.setProps({ virtual: { height: 180, estimateSize: 40, overscan: 0 } })
    expect(wrapper.findAll('[role="option"]').length).toBeLessThan(20)
    expect(wrapper.get('.aheart-select__popup').attributes('style')).toContain('180px')
  })
  it('observes the iframe realm and disconnects virtual observers on close and unmount', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const owner = iframe.contentDocument!
    const observers: Array<{ targets: Set<Element>; disconnect: ReturnType<typeof vi.fn> }> = []
    class Observer {
      targets = new Set<Element>()
      disconnect = vi.fn(() => this.targets.clear())
      constructor() { observers.push(this) }
      observe(target: Element) { this.targets.add(target) }
      unobserve(target: Element) { this.targets.delete(target) }
    }
    ;(iframe.contentWindow as any).ResizeObserver = Observer
    const wrapper = mount(Select, { attachTo: owner.body, props: { options, virtual: true, defaultOpen: true } })
    try {
      await nextTick()
      await nextTick()
      expect(owner.querySelector('.aheart-select__popup')).toBeTruthy()
      expect(observers.length).toBeGreaterThan(0)
      expect(observers.some(observer => [...observer.targets].some(target => target.ownerDocument === owner))).toBe(true)
      await wrapper.setProps({ disabled: true })
      await nextTick()
      expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false')
      expect(wrapper.get('[role="combobox"]').attributes('aria-activedescendant')).toBeUndefined()
      expect(observers.every(observer => observer.targets.size === 0)).toBe(true)
      await wrapper.setProps({ disabled: false })
      await nextTick()
      wrapper.unmount()
      expect(observers.every(observer => observer.targets.size === 0)).toBe(true)
      expect(owner.querySelector('.aheart-select__popup')).toBeNull()
    } finally {
      if (wrapper.exists()) wrapper.unmount()
      iframe.remove()
    }
  })
})
