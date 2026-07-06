import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
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
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
    expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(Event)
  })

  it('exposes focus and blur methods', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Radio, {
      attachTo: host,
      props: { label: 'Focusable' }
    })
    const radioVm = wrapper.vm as unknown as {
      focus: () => void
      blur: () => void
    }
    const input = wrapper.find('input').element

    radioVm.focus()
    await nextTick()
    expect(document.activeElement).toBe(input)

    radioVm.blur()
    await nextTick()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
    host.remove()
  })

  it('focuses the native input when autoFocus is enabled', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Radio, {
      attachTo: host,
      props: { autoFocus: true }
    })

    await nextTick()

    expect(document.activeElement).toBe(wrapper.find('input').element)

    wrapper.unmount()
    host.remove()
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

  it('prefers checked alias over modelValue and supports defaultChecked', () => {
    const checkedWrapper = mount(Radio, {
      props: { checked: true, modelValue: false, label: 'Alias' }
    })
    const defaultWrapper = mount(Radio, {
      props: { defaultChecked: true, label: 'Default' }
    })

    expect(checkedWrapper.find('input').element.checked).toBe(true)
    expect(defaultWrapper.find('input').element.checked).toBe(true)
  })

  it('emits checked alias update and change event payload', async () => {
    const wrapper = mount(Radio, {
      props: { checked: false }
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
    expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(Event)
  })

  it('applies Radio semantic classes and styles', () => {
    const wrapper = mount(Radio, {
      props: {
        checked: true,
        label: 'Styled',
        className: 'radio-class',
        rootClassName: 'radio-root',
        style: { marginTop: '4px' },
        classNames: {
          root: 'semantic-root',
          icon: 'semantic-icon',
          label: 'semantic-label'
        },
        styles: {
          root: { color: 'red' },
          icon: { borderColor: 'blue' },
          label: { fontWeight: 600 }
        }
      }
    })

    expect(wrapper.classes()).toContain('radio-class')
    expect(wrapper.classes()).toContain('radio-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-radio__inner').classes()).toContain('semantic-icon')
    expect(wrapper.find('.aheart-radio__inner').attributes('style')).toContain('border-color: blue')
    expect(wrapper.find('.aheart-radio__label').classes()).toContain('semantic-label')
    expect(wrapper.find('.aheart-radio__label').attributes('style')).toContain('font-weight: 600')
  })

  it('supports RadioGroup value alias and uncontrolled defaultValue', async () => {
    const valueWrapper = mount(RadioGroup, {
      props: {
        value: 'banana',
        modelValue: 'apple',
        options: radioOptions
      }
    })
    const defaultWrapper = mount(RadioGroup, {
      props: {
        defaultValue: 'apple',
        options: radioOptions
      }
    })

    expect(valueWrapper.findAll('input')[1].element.checked).toBe(true)
    expect(defaultWrapper.findAll('input')[0].element.checked).toBe(true)

    await defaultWrapper.findAll('input')[1].setValue(true)

    expect(defaultWrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    expect(defaultWrapper.emitted('update:value')?.[0]).toEqual(['banana'])
    expect(defaultWrapper.emitted('change')?.[0]).toEqual(['banana'])
    expect(defaultWrapper.findAll('input')[1].element.checked).toBe(true)
  })

  it('normalizes primitive group options and applies option metadata', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        defaultValue: 2,
        options: [
          'Plain',
          2,
          {
            label: 'Styled',
            value: 'styled',
            className: 'option-class',
            style: { color: 'green' },
            title: 'Styled title'
          }
        ]
      }
    })

    const radios = wrapper.findAllComponents(Radio)

    expect(wrapper.text()).toContain('Plain')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.findAll('input')[1].element.checked).toBe(true)
    expect(radios[2].classes()).toContain('option-class')
    expect(radios[2].attributes('style')).toContain('color: green')
    expect(radios[2].attributes('title')).toBe('Styled title')
  })

  it('applies button option metadata in RadioGroup button mode', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        defaultValue: 'styled',
        optionType: 'button',
        options: [
          {
            label: 'Styled',
            value: 'styled',
            className: 'button-option',
            style: { color: 'green' },
            title: 'Button title'
          }
        ]
      }
    })

    const option = wrapper.find('.aheart-radio-button')

    expect(option.classes()).toContain('button-option')
    expect(option.attributes('style')).toContain('color: green')
    expect(option.attributes('title')).toBe('Button title')
    expect(option.classes()).toContain('is-checked')
  })
})
