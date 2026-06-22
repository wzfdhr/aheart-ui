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

  it('hides zero count by default and renders it when showZero is true', () => {
    const hidden = mount(Badge, {
      props: {
        count: 0
      }
    })
    const visible = mount(Badge, {
      props: {
        count: 0,
        showZero: true
      }
    })

    expect(hidden.find('.aheart-badge__count').exists()).toBe(false)
    expect(visible.find('.aheart-badge__count').text()).toBe('0')
  })

  it('supports small count size and positioned offset', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 8,
        size: 'small',
        offset: [8, -4]
      },
      slots: {
        default: '<span>Inbox</span>'
      }
    })

    const count = wrapper.find('.aheart-badge__count')
    expect(count.classes()).toContain('aheart-badge__count--small')
    expect(count.attributes('style')).toContain('translate(50%, -50%) translate(8px, -4px)')
  })

  it('applies custom color and title to dot indicators', () => {
    const wrapper = mount(Badge, {
      props: {
        dot: true,
        color: '#722ed1',
        title: 'Unread updates'
      },
      slots: {
        default: '<span>Notifications</span>'
      }
    })

    const dot = wrapper.find('.aheart-badge__dot')
    expect(dot.attributes('title')).toBe('Unread updates')
    expect(dot.attributes('style')).toContain('background-color: rgb(114, 46, 209)')
  })

  it('applies semantic root and indicator classes and styles', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 4,
        classNames: {
          root: 'custom-badge-root',
          indicator: 'custom-badge-indicator'
        },
        styles: {
          root: { marginInlineStart: '12px' },
          indicator: { boxShadow: '0 0 0 1px #fff' }
        }
      }
    })

    expect(wrapper.classes()).toContain('custom-badge-root')
    expect(wrapper.attributes('style')).toContain('margin-inline-start: 12px')
    expect(wrapper.find('.aheart-badge__count').classes()).toContain('custom-badge-indicator')
    expect(wrapper.find('.aheart-badge__count').attributes('style')).toContain('box-shadow: 0 0 0 1px #fff')
  })

  it('renders custom count slot instead of formatted overflow text', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 120,
        overflowCount: 99
      },
      slots: {
        count: '<span class="custom-count">new</span>'
      }
    })

    expect(wrapper.find('.custom-count').text()).toBe('new')
    expect(wrapper.find('.aheart-badge__count').text()).toBe('new')
  })

  it('applies semantic indicator hooks to status badges', () => {
    const wrapper = mount(Badge, {
      props: {
        status: 'processing',
        text: 'Syncing',
        classNames: {
          indicator: 'custom-status-dot'
        },
        styles: {
          indicator: { backgroundColor: 'rgb(19, 194, 194)' }
        }
      }
    })

    const statusDot = wrapper.find('.aheart-badge__status-dot')
    expect(statusDot.classes()).toContain('custom-status-dot')
    expect(statusDot.attributes('style')).toContain('background-color: rgb(19, 194, 194)')
  })
})
