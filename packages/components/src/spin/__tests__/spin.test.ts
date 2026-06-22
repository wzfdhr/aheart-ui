import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Spin from '../spin.vue'

describe('Spin', () => {
  it('renders spinner with aria busy and tip', () => {
    const wrapper = mount(Spin, {
      props: {
        tip: 'Loading',
        size: 'large'
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.classes()).toContain('aheart-spin--large')
    expect(wrapper.text()).toContain('Loading')
  })

  it('wraps default content and marks container loading', () => {
    const wrapper = mount(Spin, {
      props: {
        spinning: true
      },
      slots: {
        default: '<section>Content</section>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-spin-nested')
    expect(wrapper.find('.aheart-spin-container').classes()).toContain('is-blur')
    expect(wrapper.text()).toContain('Content')
  })

  it('hides spinner when spinning is false', () => {
    const wrapper = mount(Spin, {
      props: {
        spinning: false
      }
    })

    expect(wrapper.find('.aheart-spin__indicator').exists()).toBe(false)
  })
})
