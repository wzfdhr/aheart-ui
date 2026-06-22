import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Icon from '../icon.vue'

describe('Icon', () => {
  it('renders named fallback content with semantic class', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'search'
      }
    })

    expect(wrapper.classes()).toContain('aheart-icon')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).toBe('search')
  })

  it('renders custom slot and size color styles', () => {
    const wrapper = mount(Icon, {
      props: {
        size: 20,
        color: '#1677ff'
      },
      slots: {
        default: '<svg viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg>'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('--aheart-icon-size: 20px')
    expect(wrapper.attributes('style')).toContain('--aheart-icon-color: #1677ff')
  })

  it('adds spin class when spin is true', () => {
    const wrapper = mount(Icon, {
      props: {
        spin: true
      }
    })

    expect(wrapper.classes()).toContain('aheart-icon--spin')
  })
})
