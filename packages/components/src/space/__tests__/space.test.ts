import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Space from '../space.vue'

describe('Space', () => {
  it('renders each default slot child as a spaced item', () => {
    const wrapper = mount(Space, {
      slots: {
        default: '<button>One</button><button>Two</button>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-space')
    expect(wrapper.classes()).toContain('aheart-space--horizontal')
    expect(wrapper.findAll('.aheart-space__item')).toHaveLength(2)
  })

  it('supports vertical direction, align, wrap, and numeric tuple size', () => {
    const wrapper = mount(Space, {
      props: {
        direction: 'vertical',
        align: 'center',
        wrap: true,
        size: [8, 12]
      },
      slots: {
        default: '<span>One</span><span>Two</span>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-space--vertical')
    expect(wrapper.classes()).toContain('aheart-space--align-center')
    expect(wrapper.classes()).toContain('is-wrap')
    expect(wrapper.attributes('style')).toContain('--aheart-space-gap-horizontal: 8px')
    expect(wrapper.attributes('style')).toContain('--aheart-space-gap-vertical: 12px')
  })

  it('uses provider size as the default gap', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large'
      },
      slots: {
        default: {
          render() {
            return h(Space, null, () => [h('span', 'One'), h('span', 'Two')])
          }
        }
      }
    })

    expect(wrapper.find('.aheart-space').attributes('style')).toContain(
      '--aheart-space-gap-horizontal: var(--aheart-spacing-lg)'
    )
  })

  it('renders separators between items', () => {
    const wrapper = mount(Space, {
      props: { separator: '|' },
      slots: { default: '<span>One</span><span>Two</span><span>Three</span>' }
    })

    expect(wrapper.findAll('.aheart-space__item')).toHaveLength(3)
    expect(wrapper.findAll('.aheart-space__separator')).toHaveLength(2)
    expect(wrapper.text()).toContain('|')
  })

  it('supports Ant-style orientation and vertical shortcut', () => {
    const oriented = mount(Space, {
      props: { orientation: 'vertical' },
      slots: { default: '<span>One</span><span>Two</span>' }
    })

    expect(oriented.classes()).toContain('aheart-space--vertical')

    const vertical = mount(Space, {
      props: { vertical: true },
      slots: { default: '<span>One</span><span>Two</span>' }
    })

    expect(vertical.classes()).toContain('aheart-space--vertical')
  })
})
