import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import RadioGroup from '../radio-group.vue'
import Radio from '../radio.vue'

const radioOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true }
]

describe('Radio', () => {
  it('renders checked state with label and name', () => {
    const wrapper = mount(Radio, {
      props: { modelValue: true, label: 'Option A', name: 'choice' }
    })

    expect(wrapper.classes()).toContain('aheart-radio')
    expect(wrapper.find('input').attributes('type')).toBe('radio')
    expect(wrapper.find('input').attributes('name')).toBe('choice')
    expect(wrapper.find('input').element.checked).toBe(true)
    expect(wrapper.text()).toContain('Option A')
  })

  it('emits true when selected', async () => {
    const wrapper = mount(Radio, {
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
            return h(Radio, { label: 'Disabled' })
          }
        }
      }
    })

    expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
  })

  it('renders RadioGroup options and emits scalar updates', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'apple',
        options: radioOptions,
        name: 'fruit',
        direction: 'vertical'
      }
    })

    expect(wrapper.classes()).toContain('aheart-radio-group--vertical')
    expect(wrapper.findAll('input').map((input) => input.attributes('name'))).toEqual(['fruit', 'fruit', 'fruit'])
    expect(wrapper.findAll('input')[0].element.checked).toBe(true)
    expect(wrapper.findAll('input')[2].attributes()).toHaveProperty('disabled')

    await wrapper.findAll('input')[1].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['banana'])
  })

  it('renders RadioGroup button options with size, block, and solid style', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'apple',
        options: radioOptions,
        optionType: 'button',
        buttonStyle: 'solid',
        size: 'large',
        block: true
      }
    })

    expect(wrapper.classes()).toContain('aheart-radio-group--button')
    expect(wrapper.classes()).toContain('aheart-radio-group--block')
    expect(wrapper.classes()).toContain('aheart-radio-group--large')
    expect(wrapper.find('.aheart-radio-button').classes()).toContain('is-checked')

    await wrapper.findAll('input')[1].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
  })

  it('RadioGroup inherits disabled from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(RadioGroup, { options: radioOptions })
          }
        }
      }
    })

    expect(wrapper.findAll('input').every((input) => input.attributes('disabled') !== undefined)).toBe(true)
  })
})
