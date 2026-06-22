import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Checkbox from '../checkbox.vue'
import CheckboxGroup from '../checkbox-group.vue'

const checkboxOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true }
]

describe('Checkbox', () => {
  it('renders checked state, label, and indeterminate class', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true, indeterminate: true, label: 'Remember me' }
    })

    expect(wrapper.classes()).toContain('aheart-checkbox')
    expect(wrapper.classes()).toContain('is-indeterminate')
    expect(wrapper.find('input').element.checked).toBe(true)
    expect(wrapper.text()).toContain('Remember me')
  })

  it('emits model update and change when toggled', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false }
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('uses ConfigProvider disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Checkbox, { label: 'Disabled' })
          }
        }
      }
    })

    expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
  })

  it('renders CheckboxGroup options and emits array updates', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: ['apple'],
        options: checkboxOptions,
        name: 'fruit',
        direction: 'vertical'
      }
    })

    expect(wrapper.classes()).toContain('aheart-checkbox-group--vertical')
    expect(wrapper.findAll('input').map((input) => input.attributes('name'))).toEqual(['fruit', 'fruit', 'fruit'])
    expect(wrapper.findAll('input')[0].element.checked).toBe(true)
    expect(wrapper.findAll('input')[2].attributes()).toHaveProperty('disabled')

    await wrapper.findAll('input')[1].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['apple', 'banana']])
  })

  it('CheckboxGroup inherits disabled from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(CheckboxGroup, { options: checkboxOptions })
          }
        }
      }
    })

    expect(wrapper.findAll('input').every((input) => input.attributes('disabled') !== undefined)).toBe(true)
  })
})
