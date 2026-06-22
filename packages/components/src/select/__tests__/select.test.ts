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

  it('filters options when showSearch is enabled and emits search', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        showSearch: true,
        notFoundContent: 'No fruit'
      }
    })

    await wrapper.find('.aheart-select__search').setValue('ban')

    expect(wrapper.emitted('search')?.[0]).toEqual(['ban'])
    expect(wrapper.findAll('option').map((option) => option.text())).toEqual(['Banana'])

    await wrapper.find('.aheart-select__search').setValue('zzz')

    expect(wrapper.findAll('option')).toHaveLength(1)
    expect(wrapper.find('option').text()).toBe('No fruit')
  })

  it('supports variant adornments native attributes and numeric values', async () => {
    const numericOptions = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 }
    ]
    const wrapper = mount(Select, {
      props: {
        options: numericOptions,
        modelValue: 1,
        id: 'level',
        name: 'level',
        prefix: 'Level',
        suffixIcon: '⌄',
        variant: 'filled'
      }
    })

    expect(wrapper.classes()).toContain('aheart-select--filled')
    expect(wrapper.find('.aheart-select__prefix').text()).toBe('Level')
    expect(wrapper.find('.aheart-select__suffix').text()).toBe('⌄')
    expect(wrapper.find('select').attributes('id')).toBe('level')
    expect(wrapper.find('select').attributes('name')).toBe('level')

    await wrapper.find('select').setValue('2')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('maps bordered false to borderless and limits tags values with maxCount', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        mode: 'tags',
        maxCount: 1,
        bordered: false
      }
    })

    expect(wrapper.classes()).toContain('aheart-select--borderless')

    const select = wrapper.find('select').element
    Array.from(select.options).forEach((option) => {
      option.selected = ['apple', 'banana'].includes(option.value)
    })
    await wrapper.find('select').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple']])
  })
})
