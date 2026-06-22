import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Select from '../select.vue'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true }
]

describe('Select', () => {
  it('renders placeholder and options', () => {
    const wrapper = mount(Select, {
      props: { options, placeholder: 'Choose fruit' }
    })

    expect(wrapper.classes()).toContain('aheart-select')
    expect(wrapper.find('select').element.value).toBe('')
    expect(wrapper.findAll('option').map((option) => option.text())).toEqual(['Choose fruit', 'Apple', 'Banana', 'Cherry'])
  })

  it('emits model update and change when selected', async () => {
    const wrapper = mount(Select, {
      props: { options }
    })

    await wrapper.find('select').setValue('banana')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['banana'])
  })

  it('clears selected value when allowClear is clicked', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: 'apple', allowClear: true }
    })

    await wrapper.find('.aheart-select__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('supports multiple mode', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: ['apple'], mode: 'multiple' }
    })

    const select = wrapper.find('select').element
    Array.from(select.options).forEach((option) => {
      option.selected = ['apple', 'banana'].includes(option.value)
    })
    await wrapper.find('select').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana']])
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', disabled: true },
      slots: {
        default: {
          render() {
            return h(Select, { options })
          }
        }
      }
    })

    const select = wrapper.findComponent(Select)
    expect(select.classes()).toContain('aheart-select--large')
    expect(select.find('select').attributes()).toHaveProperty('disabled')
  })
})
