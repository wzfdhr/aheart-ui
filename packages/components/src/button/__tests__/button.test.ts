import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Button from '../button.vue'

describe('Button', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '保存'
      }
    })

    expect(wrapper.text()).toContain('保存')
  })

  it('applies type and size classes', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        size: 'large'
      }
    })

    expect(wrapper.classes()).toContain('aheart-button--primary')
    expect(wrapper.classes()).toContain('aheart-button--large')
  })

  it('disables native button while loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.aheart-button__loading').exists()).toBe(true)
  })

  it('uses global size and disabled config when local props are absent', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large',
        disabled: true
      },
      slots: {
        default: Button
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('aheart-button--large')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('lets local Button props override global config', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large',
        disabled: true
      },
      slots: {
        default: {
          render() {
            return h(Button, { size: 'small', disabled: false }, () => '保存')
          }
        }
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('aheart-button--small')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('supports Ant-style visual props and shapes', () => {
    const dashed = mount(Button, {
      props: { type: 'dashed', danger: true, ghost: true, shape: 'round' },
      slots: { default: 'Delete' }
    })

    expect(dashed.classes()).toContain('aheart-button--dashed')
    expect(dashed.classes()).toContain('is-danger')
    expect(dashed.classes()).toContain('is-ghost')
    expect(dashed.classes()).toContain('is-round')

    const circle = mount(Button, {
      props: { shape: 'circle' },
      slots: { default: 'i' }
    })

    expect(circle.classes()).toContain('is-circle')
  })

  it('renders anchor buttons from href and suppresses disabled clicks', async () => {
    const wrapper = mount(Button, {
      props: { href: 'https://example.com', target: '_blank', disabled: true },
      slots: { default: 'Docs' }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('target')).toBe('_blank')

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('uses htmlType over nativeType for native buttons', () => {
    const wrapper = mount(Button, {
      props: { nativeType: 'button', htmlType: 'submit' }
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })
})
