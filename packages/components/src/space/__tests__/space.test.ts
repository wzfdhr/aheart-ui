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

  it('applies root item and separator semantic classes and styles', () => {
    const wrapper = mount(Space, {
      props: {
        separator: '|',
        size: [8, 12],
        className: 'space-class',
        rootClassName: 'space-root',
        style: { marginTop: '4px' },
        classNames: {
          root: 'semantic-root',
          item: 'semantic-item',
          separator: 'semantic-separator'
        },
        styles: {
          root: { color: 'red' },
          item: { paddingInline: '4px' },
          separator: { fontWeight: 600 }
        }
      },
      slots: {
        default: '<span>One</span><span>Two</span>'
      }
    })

    expect(wrapper.classes()).toContain('space-class')
    expect(wrapper.classes()).toContain('space-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('--aheart-space-gap-horizontal: 8px')
    expect(wrapper.attributes('style')).toContain('--aheart-space-gap-vertical: 12px')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('color: red')

    const item = wrapper.find('.aheart-space__item')
    expect(item.classes()).toContain('semantic-item')
    expect(item.attributes('style')).toContain('padding-inline: 4px')

    const separator = wrapper.find('.aheart-space__separator')
    expect(separator.classes()).toContain('semantic-separator')
    expect(separator.attributes('style')).toContain('font-weight: 600')
  })

  it('supports function semantic maps and node separators', () => {
    const wrapper = mount(Space, {
      props: {
        orientation: 'vertical',
        separator: h('strong', { class: 'separator-node' }, '/'),
        classNames: ({ props }) => ({
          root: `semantic-${props.orientation}`,
          item: 'semantic-item',
          separator: 'semantic-separator'
        }),
        styles: ({ props }) => ({
          root: { justifyContent: props.orientation === 'vertical' ? 'center' : 'flex-start' },
          separator: { color: 'blue' }
        })
      },
      slots: {
        default: '<span>One</span><span>Two</span>'
      }
    })

    expect(wrapper.classes()).toContain('semantic-vertical')
    expect(wrapper.attributes('style')).toContain('justify-content: center')
    expect(wrapper.findAll('.semantic-item')).toHaveLength(2)
    expect(wrapper.find('.semantic-separator').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.separator-node').text()).toBe('/')
  })
})
