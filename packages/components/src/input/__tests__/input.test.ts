import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Input from '../input.vue'

describe('Input', () => {
  it('renders model value with prefix, suffix, and count', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'Aheart', maxlength: 12, showCount: true },
      slots: { prefix: 'P', suffix: 'S' }
    })

    expect(wrapper.classes()).toContain('aheart-input')
    expect(wrapper.find('input').element.value).toBe('Aheart')
    expect(wrapper.find('.aheart-input__count').text()).toBe('6 / 12')
    expect(wrapper.text()).toContain('P')
    expect(wrapper.text()).toContain('S')
  })

  it('emits model update, input, and change', async () => {
    const wrapper = mount(Input)

    await wrapper.find('input').setValue('Hello')
    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['Hello'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['Hello'])
  })

  it('clears value when allowClear button is clicked', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'Clear me', allowClear: true }
    })

    await wrapper.find('.aheart-input__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', disabled: true },
      slots: {
        default: {
          render() {
            return h(Input, { modelValue: 'Readonly' })
          }
        }
      }
    })

    const input = wrapper.findComponent(Input)
    expect(input.classes()).toContain('aheart-input--large')
    expect(input.find('input').attributes()).toHaveProperty('disabled')
  })

  it('supports Ant-style addons prefix suffix and variants', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'site',
        prefix: 'https://',
        suffix: '.com',
        addonBefore: 'URL',
        addonAfter: 'open',
        variant: 'filled',
        id: 'site-input',
        readOnly: true
      }
    })

    expect(wrapper.classes()).toContain('aheart-input-group')
    expect(wrapper.find('.aheart-input__addon--before').text()).toBe('URL')
    expect(wrapper.find('.aheart-input__addon--after').text()).toBe('open')
    expect(wrapper.find('.aheart-input').classes()).toContain('aheart-input--filled')
    expect(wrapper.find('.aheart-input__prefix').text()).toBe('https://')
    expect(wrapper.find('.aheart-input__suffix').text()).toBe('.com')
    expect(wrapper.find('input').attributes('id')).toBe('site-input')
    expect(wrapper.find('input').attributes()).toHaveProperty('readonly')
  })

  it('maps bordered false to borderless and emits pressEnter', async () => {
    const wrapper = mount(Input, {
      props: { bordered: false }
    })

    expect(wrapper.find('.aheart-input').classes()).toContain('aheart-input--borderless')

    await wrapper.find('input').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('pressEnter')).toHaveLength(1)
  })
})
