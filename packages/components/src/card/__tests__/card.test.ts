import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Card from '../card.vue'

describe('Card', () => {
  it('renders title, extra, default content, cover, and actions', () => {
    const wrapper = mount(Card, {
      props: { title: 'Project', extra: 'More' },
      slots: {
        cover: '<div class="cover">Cover</div>',
        default: '<p>Card body</p>',
        actions: '<button>Open</button>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-card')
    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.text()).toContain('Project')
    expect(wrapper.text()).toContain('More')
    expect(wrapper.find('.cover').exists()).toBe(true)
    expect(wrapper.text()).toContain('Card body')
    expect(wrapper.find('.aheart-card__actions button').text()).toBe('Open')
  })

  it('renders loading and variant classes with ConfigProvider size fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: {
        default: {
          render() {
            return h(Card, { loading: true, bordered: false, hoverable: true }, () => 'Hidden')
          }
        }
      }
    })

    const card = wrapper.findComponent(Card)
    expect(card.classes()).toContain('aheart-card--small')
    expect(card.classes()).toContain('is-borderless')
    expect(card.classes()).toContain('is-hoverable')
    expect(card.find('.aheart-card__loading').exists()).toBe(true)
    expect(card.text()).not.toContain('Hidden')
  })

  it('supports variant control and inner card type', () => {
    const borderless = mount(Card, {
      props: {
        variant: 'borderless'
      }
    })

    expect(borderless.classes()).toContain('is-borderless')

    const outlined = mount(Card, {
      props: {
        variant: 'outlined',
        bordered: false,
        type: 'inner'
      }
    })

    expect(outlined.classes()).not.toContain('is-borderless')
    expect(outlined.classes()).toContain('aheart-card--inner')
  })

  it('renders actions prop when no actions slot is provided', () => {
    const wrapper = mount(Card, {
      props: {
        actions: ['Edit', 'Delete']
      }
    })

    const actions = wrapper.findAll('.aheart-card__action')
    expect(actions).toHaveLength(2)
    expect(actions[0].text()).toBe('Edit')
    expect(actions[1].text()).toBe('Delete')
  })

  it('lets actions slot override actions prop', () => {
    const wrapper = mount(Card, {
      props: {
        actions: ['Edit']
      },
      slots: {
        actions: '<button class="slot-action">Open</button>'
      }
    })

    expect(wrapper.find('.slot-action').exists()).toBe(true)
    expect(wrapper.findAll('.aheart-card__action')).toHaveLength(0)
    expect(wrapper.text()).not.toContain('Edit')
  })

  it('applies root class and style hooks', () => {
    const wrapper = mount(Card, {
      props: {
        className: 'card-class',
        rootClassName: 'card-root',
        style: { width: '240px' },
        classNames: {
          root: 'semantic-root'
        },
        styles: {
          root: { marginTop: '8px' }
        }
      }
    })

    expect(wrapper.classes()).toContain('card-class')
    expect(wrapper.classes()).toContain('card-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('width: 240px')
    expect(wrapper.attributes('style')).toContain('margin-top: 8px')
  })

  it('applies semantic class and style hooks to Card parts', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Title',
        extra: 'More',
        actions: ['Open'],
        classNames: {
          cover: 'semantic-cover',
          header: 'semantic-header',
          title: 'semantic-title',
          extra: 'semantic-extra',
          body: 'semantic-body',
          actions: 'semantic-actions'
        },
        styles: {
          cover: { background: 'rgb(1, 2, 3)' },
          header: { minHeight: '40px' },
          title: { color: 'red' },
          extra: { color: 'blue' },
          body: { padding: '12px' },
          actions: { gap: '12px' }
        }
      },
      slots: {
        cover: '<div>Cover</div>',
        default: 'Body'
      }
    })

    expect(wrapper.find('.aheart-card__cover').classes()).toContain('semantic-cover')
    expect(wrapper.find('.aheart-card__cover').attributes('style')).toContain('background: rgb(1, 2, 3)')
    expect(wrapper.find('.aheart-card__header').classes()).toContain('semantic-header')
    expect(wrapper.find('.aheart-card__header').attributes('style')).toContain('min-height: 40px')
    expect(wrapper.find('.aheart-card__title').classes()).toContain('semantic-title')
    expect(wrapper.find('.aheart-card__title').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-card__extra').classes()).toContain('semantic-extra')
    expect(wrapper.find('.aheart-card__extra').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.aheart-card__body').classes()).toContain('semantic-body')
    expect(wrapper.find('.aheart-card__body').attributes('style')).toContain('padding: 12px')
    expect(wrapper.find('.aheart-card__actions').classes()).toContain('semantic-actions')
    expect(wrapper.find('.aheart-card__actions').attributes('style')).toContain('gap: 12px')
  })

  it('maps headStyle and bodyStyle to header and body styles', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Title',
        headStyle: { background: 'rgb(10, 20, 30)' },
        bodyStyle: { minHeight: '80px' }
      }
    })

    expect(wrapper.find('.aheart-card__header').attributes('style')).toContain('background: rgb(10, 20, 30)')
    expect(wrapper.find('.aheart-card__body').attributes('style')).toContain('min-height: 80px')
  })
})
