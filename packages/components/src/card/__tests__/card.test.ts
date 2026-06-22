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
})
