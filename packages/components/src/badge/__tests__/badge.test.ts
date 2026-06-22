import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Badge from '../badge.vue'

describe('Badge', () => {
  it('renders count with overflow text', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 120,
        overflowCount: 99
      },
      slots: {
        default: '<span>Inbox</span>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-badge')
    expect(wrapper.find('.aheart-badge__count').text()).toBe('99+')
  })

  it('renders a dot badge', () => {
    const wrapper = mount(Badge, {
      props: {
        dot: true
      }
    })

    expect(wrapper.find('.aheart-badge__dot').exists()).toBe(true)
  })

  it('renders standalone status with text', () => {
    const wrapper = mount(Badge, {
      props: {
        status: 'success',
        text: 'Online'
      }
    })

    expect(wrapper.classes()).toContain('aheart-badge--status')
    expect(wrapper.find('.aheart-badge__status-dot').classes()).toContain('aheart-badge__status-dot--success')
    expect(wrapper.text()).toContain('Online')
  })
})
