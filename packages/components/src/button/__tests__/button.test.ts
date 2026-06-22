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
})
