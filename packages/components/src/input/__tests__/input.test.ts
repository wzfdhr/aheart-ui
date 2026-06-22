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

  it('renders custom allowClear icon content', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'Clear me',
        allowClear: {
          clearIcon: 'clear'
        }
      }
    })

    expect(wrapper.find('.aheart-input__clear').text()).toBe('clear')
  })

  it('lets clearIcon slot override allowClear clearIcon', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'Clear me',
        allowClear: {
          clearIcon: 'clear'
        }
      },
      slots: {
        clearIcon: '<span class="custom-clear">x</span>'
      }
    })

    expect(wrapper.find('.custom-clear').exists()).toBe(true)
    expect(wrapper.find('.aheart-input__clear').text()).toBe('x')
  })

  it('renders showCount formatter output', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'abc',
        showCount: {
          formatter: ({ count, maxLength, value }: { count: number; maxLength?: number; value: string }) =>
            `${count}:${maxLength}:${value}`
        },
        maxlength: 8
      }
    })

    expect(wrapper.find('.aheart-input__count').text()).toBe('3:8:abc')
  })

  it('supports count max, strategy, and show formatter', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'hello',
        count: {
          max: 10,
          strategy: (value: string) => value.split('').filter((char) => char === 'l').length,
          show: ({ count, maxLength }: { count: number; maxLength?: number }) => `${count} of ${maxLength}`
        }
      }
    })

    expect(wrapper.find('.aheart-input__count').text()).toBe('2 of 10')
  })

  it('lets count show false hide count display', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'hidden',
        showCount: true,
        count: {
          show: false
        }
      }
    })

    expect(wrapper.find('.aheart-input__count').exists()).toBe(false)
  })

  it('applies root class and style hooks', () => {
    const wrapper = mount(Input, {
      props: {
        className: 'input-class',
        rootClassName: 'input-root',
        style: { width: '320px' },
        classNames: {
          root: 'semantic-root'
        },
        styles: {
          root: { marginTop: '6px' }
        }
      }
    })

    expect(wrapper.classes()).toContain('input-class')
    expect(wrapper.classes()).toContain('input-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('width: 320px')
    expect(wrapper.attributes('style')).toContain('margin-top: 6px')
  })

  it('applies semantic class and style hooks to Input parts', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'value',
        prefix: 'pre',
        suffix: 'suf',
        allowClear: true,
        showCount: true,
        classNames: {
          input: 'semantic-input',
          prefix: 'semantic-prefix',
          suffix: 'semantic-suffix',
          clear: 'semantic-clear',
          count: 'semantic-count'
        },
        styles: {
          input: { color: 'red' },
          prefix: { color: 'blue' },
          suffix: { color: 'green' },
          clear: { color: 'purple' },
          count: { color: 'orange' }
        }
      }
    })

    expect(wrapper.find('input').classes()).toContain('semantic-input')
    expect(wrapper.find('input').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-input__prefix').classes()).toContain('semantic-prefix')
    expect(wrapper.find('.aheart-input__prefix').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.aheart-input__suffix').classes()).toContain('semantic-suffix')
    expect(wrapper.find('.aheart-input__suffix').attributes('style')).toContain('color: green')
    expect(wrapper.find('.aheart-input__clear').classes()).toContain('semantic-clear')
    expect(wrapper.find('.aheart-input__clear').attributes('style')).toContain('color: purple')
    expect(wrapper.find('.aheart-input__count').classes()).toContain('semantic-count')
    expect(wrapper.find('.aheart-input__count').attributes('style')).toContain('color: orange')
  })
})
