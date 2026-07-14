import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Splitter from '../splitter.vue'
import SplitterPanel from '../splitter-panel.vue'

const renderPanels = () => [
  h(SplitterPanel, { min: 100, max: 400 }, () => 'Navigation'),
  h(SplitterPanel, { min: 120 }, () => 'Content')
]

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  document.querySelector('[data-aheart-drag-shield]')?.remove()
})

describe('Splitter', () => {
  it('renders horizontal panels and a separator handle between each pair', () => {
    const wrapper = mount(Splitter, {
      props: { sizes: [240, 360] },
      slots: { default: renderPanels }
    })

    expect(wrapper.classes()).toContain('aheart-splitter--horizontal')
    expect(wrapper.findAll('.aheart-splitter__panel')).toHaveLength(2)
    expect(wrapper.findAll('.aheart-splitter__handle')).toHaveLength(1)
    expect(wrapper.find('.aheart-splitter__panel').attributes('style')).toContain('flex-basis: 240px')
    expect(wrapper.find('.aheart-splitter__handle').attributes('role')).toBe('separator')
    expect(wrapper.find('.aheart-splitter__handle').attributes('aria-orientation')).toBe('vertical')
  })

  it('emits controlled numeric sizes when a horizontal handle receives arrow keys', async () => {
    const wrapper = mount(Splitter, {
      props: { sizes: [240, 360] },
      slots: { default: renderPanels }
    })

    await wrapper.find('.aheart-splitter__handle').trigger('keydown', { key: 'ArrowRight' })
    await wrapper.find('.aheart-splitter__handle').trigger('keydown', { key: 'ArrowLeft', shiftKey: true })

    expect(wrapper.emitted('update:sizes')).toEqual([[[250, 350]], [[190, 410]]])
  })

  it('uses vertical layout and vertical keyboard arrows', async () => {
    const wrapper = mount(Splitter, {
      props: { layout: 'vertical', sizes: [240, 360] },
      slots: { default: renderPanels }
    })

    const handle = wrapper.find('.aheart-splitter__handle')
    expect(wrapper.classes()).toContain('aheart-splitter--vertical')
    expect(handle.attributes('aria-orientation')).toBe('horizontal')

    await handle.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:sizes')).toEqual([[[250, 350]]])
  })

  it('reports separator bounds that account for both adjacent panels', () => {
    const wrapper = mount(Splitter, {
      props: { sizes: [240, 360] },
      slots: {
        default: () => [
          h(SplitterPanel, { min: 100, max: 400 }, () => 'Navigation'),
          h(SplitterPanel, { min: 120, max: 380 }, () => 'Content')
        ]
      }
    })

    const handle = wrapper.find('.aheart-splitter__handle')
    expect(handle.attributes('aria-valuemin')).toBe('220')
    expect(handle.attributes('aria-valuemax')).toBe('400')
  })

  it('emits eager updates while a horizontal pointer drag is still active', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Splitter, {
      props: { sizes: [240, 360] },
      attachTo: document.body,
      slots: { default: renderPanels }
    })
    const handle = wrapper.find('.aheart-splitter__handle')

    await handle.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 0 })
    document.dispatchEvent(Object.assign(new MouseEvent('pointermove', { bubbles: true, clientX: 130 }), { pointerId: 1 }))
    vi.advanceTimersByTime(20)

    expect(wrapper.emitted('update:sizes')).toEqual([[[270, 330]]])
    document.dispatchEvent(Object.assign(new MouseEvent('pointerup', { bubbles: true, clientX: 130 }), { pointerId: 1 }))
  })

  it('resizes vertical panels from pointer movement', async () => {
    const wrapper = mount(Splitter, {
      props: { layout: 'vertical', sizes: [240, 360], lazy: true },
      attachTo: document.body,
      slots: { default: renderPanels }
    })
    const handle = wrapper.find('.aheart-splitter__handle')

    await handle.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 0, clientY: 100 })
    document.dispatchEvent(Object.assign(new MouseEvent('pointermove', { bubbles: true, clientY: 140 }), { pointerId: 1 }))
    document.dispatchEvent(Object.assign(new MouseEvent('pointerup', { bubbles: true, clientY: 140 }), { pointerId: 1 }))

    expect(wrapper.emitted('update:sizes')).toEqual([[[280, 320]]])
  })

  it('clamps a keyboard resize against both adjacent panel constraints', async () => {
    const wrapper = mount(Splitter, {
      props: { sizes: [240, 360] },
      slots: {
        default: () => [
          h(SplitterPanel, { min: 100, max: 250 }, () => 'Navigation'),
          h(SplitterPanel, { min: 300 }, () => 'Content')
        ]
      }
    })

    await wrapper.find('.aheart-splitter__handle').trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    expect(wrapper.emitted('update:sizes')).toEqual([[[250, 350]]])
  })

  it('collapses and restores a collapsible panel with the handle control', async () => {
    const wrapper = mount(Splitter, {
      props: { sizes: [240, 360] },
      slots: {
        default: () => [
          h(SplitterPanel, { collapsible: true }, () => 'Navigation'),
          h(SplitterPanel, { min: 120 }, () => 'Content')
        ]
      }
    })

    const control = wrapper.find('.aheart-splitter__collapse')
    expect(control.attributes('aria-label')).toBe('Collapse panel')
    await control.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 0 })
    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()
    await control.trigger('click')
    await wrapper.setProps({ sizes: [0, 600] })
    await control.trigger('click')
    await wrapper.setProps({ sizes: [300, 300] })

    expect(wrapper.emitted('update:sizes')).toEqual([[[0, 600]], [[240, 360]]])
    expect(wrapper.find('.aheart-splitter__panel').attributes('style')).toContain('flex-basis: 300px')
  })

  it('does not start resize interactions when disabled', async () => {
    const wrapper = mount(Splitter, {
      props: { disabled: true, sizes: [240, 360] },
      attachTo: document.body,
      slots: { default: renderPanels }
    })
    const handle = wrapper.find('.aheart-splitter__handle')

    await handle.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 0 })
    await handle.trigger('keydown', { key: 'ArrowRight' })

    expect(handle.attributes('aria-disabled')).toBe('true')
    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()
    expect(wrapper.emitted('update:sizes')).toBeUndefined()
  })

  it('adds a full-page drag shield until a pointer drag is cancelled', async () => {
    const wrapper = mount(Splitter, {
      props: { sizes: [240, 360] },
      attachTo: document.body,
      slots: { default: renderPanels }
    })

    await wrapper.find('.aheart-splitter__handle').trigger('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 0 })
    expect(document.querySelector('[data-aheart-drag-shield]')).not.toBeNull()

    document.dispatchEvent(Object.assign(new MouseEvent('pointercancel', { bubbles: true }), { pointerId: 1 }))
    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()
  })

  it('recalculates auto panel sizes after its container is resized', async () => {
    const observers: Array<{ callback: () => void; observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }> = []
    class MockResizeObserver {
      callback: () => void
      observe = vi.fn()
      disconnect = vi.fn()

      constructor(callback: () => void) {
        this.callback = callback
        observers.push(this)
      }
    }
    vi.stubGlobal('ResizeObserver', MockResizeObserver)

    const wrapper = mount(Splitter, {
      props: { defaultSizes: [200, 'auto'] },
      slots: { default: renderPanels }
    })
    Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: 800 })
    observers[0].callback()
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.aheart-splitter__panel')[1].attributes('style')).toContain('flex-basis: 594px')
  })

  it('reserves every handle width when distributing an auto panel', async () => {
    const observers: Array<{ callback: () => void; observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }> = []
    class MockResizeObserver {
      callback: () => void
      observe = vi.fn()
      disconnect = vi.fn()

      constructor(callback: () => void) {
        this.callback = callback
        observers.push(this)
      }
    }
    vi.stubGlobal('ResizeObserver', MockResizeObserver)

    const wrapper = mount(Splitter, {
      props: { defaultSizes: [200, 'auto', 200] },
      slots: {
        default: () => [
          h(SplitterPanel, null, () => 'Left'),
          h(SplitterPanel, null, () => 'Center'),
          h(SplitterPanel, null, () => 'Right')
        ]
      }
    })
    Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: 1000 })
    observers[0].callback()
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.aheart-splitter__panel')[1].attributes('style')).toContain('flex-basis: 588px')
  })

  it('keeps drag updates pending until release when lazy is enabled', async () => {
    const wrapper = mount(Splitter, {
      props: { sizes: [240, 360], lazy: true },
      attachTo: document.body,
      slots: { default: renderPanels }
    })
    const handle = wrapper.find('.aheart-splitter__handle')

    await handle.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 0 })
    document.dispatchEvent(Object.assign(new MouseEvent('pointermove', { bubbles: true, clientX: 140 }), { pointerId: 1 }))
    expect(wrapper.emitted('update:sizes')).toBeUndefined()

    document.dispatchEvent(Object.assign(new MouseEvent('pointerup', { bubbles: true, clientX: 140 }), { pointerId: 1 }))
    expect(wrapper.emitted('update:sizes')).toEqual([[[280, 320]]])
  })
})
