import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import Splitter from '../splitter.vue'
import SplitterPanel from '../splitter-panel.vue'

const renderPanels = () => [
  h(SplitterPanel, { min: 100, max: 400 }, () => 'Navigation'),
  h(SplitterPanel, { min: 120 }, () => 'Content')
]

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
