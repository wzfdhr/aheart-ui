import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Divider from '../divider.vue'

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    const wrapper = mount(Divider)

    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.classes()).toContain('aheart-divider--horizontal')
  })

  it('renders label slot with orientation class', () => {
    const wrapper = mount(Divider, {
      props: {
        orientation: 'left'
      },
      slots: {
        default: 'Text'
      }
    })

    expect(wrapper.text()).toContain('Text')
    expect(wrapper.classes()).toContain('aheart-divider--left')
    expect(wrapper.find('.aheart-divider__text').exists()).toBe(true)
  })

  it('supports vertical dashed divider', () => {
    const wrapper = mount(Divider, {
      props: {
        type: 'vertical',
        dashed: true
      }
    })

    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.classes()).toContain('aheart-divider--vertical')
    expect(wrapper.classes()).toContain('is-dashed')
  })

  it('supports Ant-style title placement margin variant and size', () => {
    const wrapper = mount(Divider, {
      props: {
        titlePlacement: 'start',
        orientationMargin: 24,
        variant: 'dotted',
        size: 'large'
      },
      slots: { default: 'Section' }
    })

    expect(wrapper.classes()).toContain('aheart-divider--start')
    expect(wrapper.classes()).toContain('aheart-divider--large')
    expect(wrapper.classes()).toContain('is-dotted')
    expect(wrapper.attributes('style')).toContain('--aheart-divider-orientation-margin: 24px')
  })

  it('supports vertical shortcut', () => {
    const wrapper = mount(Divider, {
      props: { vertical: true }
    })

    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.classes()).toContain('aheart-divider--vertical')
  })

  it('applies root line and text semantic classes and styles', () => {
    const wrapper = mount(Divider, {
      props: {
        titlePlacement: 'start',
        orientationMargin: 16,
        className: 'divider-class',
        rootClassName: 'divider-root',
        style: { marginTop: '4px' },
        classNames: {
          root: 'semantic-root',
          line: 'semantic-line',
          text: 'semantic-text'
        },
        styles: {
          root: { color: 'red' },
          line: { borderColor: 'blue' },
          text: { fontWeight: 600 }
        }
      },
      slots: { default: 'Section' }
    })

    expect(wrapper.classes()).toContain('divider-class')
    expect(wrapper.classes()).toContain('divider-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.attributes('style')).toContain('--aheart-divider-orientation-margin: 16px')
    expect(wrapper.find('.aheart-divider__line').classes()).toContain('semantic-line')
    expect(wrapper.find('.aheart-divider__line').attributes('style')).toContain('border-color: blue')
    expect(wrapper.find('.aheart-divider__text').classes()).toContain('semantic-text')
    expect(wrapper.find('.aheart-divider__text').attributes('style')).toContain('font-weight: 600')
  })
})
