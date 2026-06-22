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

  it('applies root and semantic classes and styles', () => {
    const wrapper = mount(Select, {
      props: {
        options,
        modelValue: 'apple',
        showSearch: true,
        allowClear: true,
        prefix: 'Fruit',
        suffixIcon: '⌄',
        className: 'outer-select',
        rootClassName: 'root-select',
        style: { width: '240px' },
        classNames: {
          root: 'semantic-root',
          prefix: 'semantic-prefix',
          search: 'semantic-search',
          selector: 'semantic-selector',
          option: 'semantic-option',
          clear: 'semantic-clear',
          suffix: 'semantic-suffix'
        },
        styles: {
          root: { minWidth: '220px' },
          prefix: { color: 'rgb(1, 2, 3)' },
          search: { background: 'rgb(4, 5, 6)' },
          selector: { borderColor: 'rgb(7, 8, 9)' },
          option: { color: 'rgb(10, 11, 12)' },
          clear: { color: 'rgb(13, 14, 15)' },
          suffix: { color: 'rgb(16, 17, 18)' }
        }
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['outer-select', 'root-select', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('width: 240px')
    expect(wrapper.attributes('style')).toContain('min-width: 220px')
    expect(wrapper.find('.aheart-select__prefix').classes()).toContain('semantic-prefix')
    expect(wrapper.find('.aheart-select__prefix').attributes('style')).toContain('color: rgb(1, 2, 3)')
    expect(wrapper.find('.aheart-select__search').classes()).toContain('semantic-search')
    expect(wrapper.find('.aheart-select__search').attributes('style')).toContain('background: rgb(4, 5, 6)')
    expect(wrapper.find('select').classes()).toContain('semantic-selector')
    expect(wrapper.find('select').attributes('style')).toContain('border-color: rgb(7, 8, 9)')
    expect(wrapper.find('option').classes()).toContain('semantic-option')
    expect(wrapper.find('option').attributes('style')).toContain('color: rgb(10, 11, 12)')
    expect(wrapper.find('.aheart-select__clear').classes()).toContain('semantic-clear')
    expect(wrapper.find('.aheart-select__clear').attributes('style')).toContain('color: rgb(13, 14, 15)')
    expect(wrapper.find('.aheart-select__suffix').classes()).toContain('semantic-suffix')
    expect(wrapper.find('.aheart-select__suffix').attributes('style')).toContain('color: rgb(16, 17, 18)')
  })

  it('maps fieldNames and uses optionFilterProp with filterSort', async () => {
    const wrapper = mount(Select, {
      props: {
        showSearch: true,
        optionFilterProp: 'code',
        fieldNames: {
          label: 'name',
          value: 'id',
          disabled: 'locked'
        },
        filterSort: (a, b, info) => `${a.label}-${info.searchValue}`.localeCompare(`${b.label}-${info.searchValue}`),
        options: [
          { name: 'Beta', id: 2, code: 'match', locked: false },
          { name: 'Alpha', id: 1, code: 'match', locked: true },
          { name: 'Gamma', id: 3, code: 'skip', locked: false }
        ]
      }
    })

    await wrapper.find('.aheart-select__search').setValue('match')

    expect(wrapper.findAll('option').map((option) => option.text())).toEqual(['Alpha', 'Beta'])
    expect(wrapper.find('option').attributes()).toHaveProperty('disabled')

    await wrapper.find('select').setValue('2')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('uses defaultValue for uncontrolled selection and updates internal value', async () => {
    const wrapper = mount(Select, {
      props: {
        defaultValue: 'banana',
        options
      }
    })

    expect(wrapper.find('select').element.value).toBe('banana')

    await wrapper.find('select').setValue('apple')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple'])
    expect(wrapper.find('select').element.value).toBe('apple')
  })

  it('renders loading state and custom loading icons', () => {
    const propIcon = mount(Select, {
      props: {
        options,
        loading: true,
        loadingIcon: h('span', { class: 'custom-loading' }, 'Loading')
      }
    })

    expect(propIcon.classes()).toContain('is-loading')
    expect(propIcon.find('.aheart-select__loading').exists()).toBe(true)
    expect(propIcon.find('.custom-loading').text()).toBe('Loading')

    const slotIcon = mount(Select, {
      props: {
        options,
        loading: true
      },
      slots: {
        loadingIcon: '<span class="slot-loading">Wait</span>'
      }
    })

    expect(slotIcon.find('.slot-loading').text()).toBe('Wait')
  })

  it('renders configurable clear icons and slot override', async () => {
    const propIcon = mount(Select, {
      props: {
        options,
        modelValue: 'apple',
        allowClear: {
          clearIcon: h('span', { class: 'custom-clear' }, 'Clear')
        }
      }
    })

    expect(propIcon.find('.custom-clear').text()).toBe('Clear')

    const slotIcon = mount(Select, {
      props: {
        options,
        modelValue: 'banana',
        allowClear: {
          clearIcon: 'Clear'
        }
      },
      slots: {
        clearIcon: '<span class="slot-clear">Slot clear</span>'
      }
    })

    expect(slotIcon.find('.slot-clear').text()).toBe('Slot clear')

    await slotIcon.find('.aheart-select__clear').trigger('click')

    expect(slotIcon.emitted('clear')).toHaveLength(1)
  })
})
