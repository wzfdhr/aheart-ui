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
})
