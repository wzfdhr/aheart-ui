import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import * as BadgeModule from '../index'

const Badge = BadgeModule.default
const BadgeRibbon = (BadgeModule as { BadgeRibbon?: unknown }).BadgeRibbon

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

  it('supports root hooks and vnode count and status text content', () => {
    const wrapper = mount(Badge, {
      props: {
        count: h('span', { class: 'count-node' }, 'hot'),
        status: 'processing',
        text: h('span', { class: 'status-node' }, 'Syncing'),
        className: 'badge-class',
        rootClassName: 'badge-root',
        style: { marginInlineStart: '6px' },
        classNames: {
          root: 'semantic-root',
          indicator: 'semantic-indicator'
        },
        styles: {
          root: { padding: '2px' },
          indicator: { boxShadow: '0 0 0 1px #fff' }
        }
      },
      slots: {
        default: '<span>Inbox</span>'
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['badge-class', 'badge-root', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('margin-inline-start: 6px')
    expect(wrapper.attributes('style')).toContain('padding: 2px')
    expect(wrapper.find('.count-node').text()).toBe('hot')
    expect(wrapper.find('.aheart-badge__count').classes()).toContain('semantic-indicator')
    expect(wrapper.find('.aheart-badge__count').attributes('style')).toContain('box-shadow: 0 0 0 1px #fff')
    expect(wrapper.find('.status-node').text()).toBe('Syncing')
  })

  it('renders ribbon with placement color root hooks and semantic content hooks', () => {
    const wrapper = mount(BadgeRibbon as never, {
      props: {
        text: h('strong', { class: 'ribbon-text' }, 'Limited'),
        color: '#722ed1',
        placement: 'start',
        className: 'legacy-ribbon',
        rootClassName: 'root-ribbon',
        style: { marginTop: '8px' },
        classNames: {
          root: 'semantic-ribbon-root',
          indicator: 'semantic-ribbon-indicator',
          content: 'semantic-ribbon-content'
        },
        styles: {
          root: { padding: '4px' },
          indicator: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
          content: { fontWeight: '700' }
        }
      },
      slots: {
        default: '<div class="card-body">Card</div>'
      }
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['legacy-ribbon', 'root-ribbon', 'semantic-ribbon-root', 'aheart-ribbon--start'])
    )
    expect(wrapper.attributes('style')).toContain('margin-top: 8px')
    expect(wrapper.attributes('style')).toContain('padding: 4px')
    expect(wrapper.find('.card-body').text()).toBe('Card')
    expect(wrapper.find('.aheart-ribbon__indicator').classes()).toContain('semantic-ribbon-indicator')
    expect(wrapper.find('.aheart-ribbon__indicator').attributes('style')).toContain('background-color: rgb(114, 46, 209)')
    expect(wrapper.find('.aheart-ribbon__indicator').attributes('style')).toContain('box-shadow: 0 2px 4px rgba(0,0,0,0.1)')
    expect(wrapper.find('.aheart-ribbon__content').classes()).toContain('semantic-ribbon-content')
    expect(wrapper.find('.aheart-ribbon__content').attributes('style')).toContain('font-weight: 700')
    expect(wrapper.find('.ribbon-text').text()).toBe('Limited')
  })

  it('exposes BadgeRibbon as a named export and Badge.Ribbon helper', () => {
    expect(BadgeRibbon).toBeTruthy()
    expect((Badge as typeof Badge & { Ribbon?: unknown }).Ribbon).toBe(BadgeRibbon)
  })
})
