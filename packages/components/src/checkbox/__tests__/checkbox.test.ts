import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
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
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
    expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(Event)
  })

  it('emits focus and blur events from the native input', async () => {
    const wrapper = mount(Checkbox)
    const input = wrapper.find('input')

    await input.trigger('focus')
    await input.trigger('blur')

    expect(wrapper.emitted('focus')?.[0]?.[0]).toBeInstanceOf(FocusEvent)
    expect(wrapper.emitted('blur')?.[0]?.[0]).toBeInstanceOf(FocusEvent)
  })

  it('exposes focus blur and nativeElement methods', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Checkbox, {
      attachTo: host,
      props: { label: 'Focusable' }
    })
    const checkboxVm = wrapper.vm as unknown as {
      focus: () => void
      blur: () => void
      nativeElement?: HTMLLabelElement
    }
    const input = wrapper.find('input').element

    checkboxVm.focus()
    await nextTick()
    expect(document.activeElement).toBe(input)

    checkboxVm.blur()
    await nextTick()
    expect(document.activeElement).not.toBe(input)

    expect(checkboxVm.nativeElement).toBe(wrapper.element)

    wrapper.unmount()
    host.remove()
  })

  it('focuses the native input when autoFocus is enabled', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Checkbox, {
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

  it('prefers checked alias over modelValue and supports defaultChecked', async () => {
    const checkedWrapper = mount(Checkbox, {
      props: { checked: true, modelValue: false, label: 'Alias' }
    })
    const defaultWrapper = mount(Checkbox, {
      props: { defaultChecked: true, label: 'Default' }
    })

    expect(checkedWrapper.find('input').element.checked).toBe(true)
    expect(defaultWrapper.find('input').element.checked).toBe(true)

    await defaultWrapper.find('input').setValue(false)

    expect(defaultWrapper.find('input').element.checked).toBe(false)
  })

  it('emits checked alias update and change event payload', async () => {
    const wrapper = mount(Checkbox, {
      props: { checked: false }
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
    expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(Event)
  })

  it('applies Checkbox semantic classes and styles', () => {
    const wrapper = mount(Checkbox, {
      props: {
        checked: true,
        label: 'Styled',
        className: 'checkbox-class',
        rootClassName: 'checkbox-root',
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

    expect(wrapper.classes()).toContain('checkbox-class')
    expect(wrapper.classes()).toContain('checkbox-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-checkbox__inner').classes()).toContain('semantic-icon')
    expect(wrapper.find('.aheart-checkbox__inner').attributes('style')).toContain('border-color: blue')
    expect(wrapper.find('.aheart-checkbox__label').classes()).toContain('semantic-label')
    expect(wrapper.find('.aheart-checkbox__label').attributes('style')).toContain('font-weight: 600')
  })

  it('supports CheckboxGroup value alias and uncontrolled defaultValue', async () => {
    const valueWrapper = mount(CheckboxGroup, {
      props: {
        value: ['banana'],
        modelValue: ['apple'],
        options: checkboxOptions
      }
    })
    const defaultWrapper = mount(CheckboxGroup, {
      props: {
        defaultValue: ['apple'],
        options: checkboxOptions
      }
    })

    expect(valueWrapper.findAll('input')[1].element.checked).toBe(true)
    expect(defaultWrapper.findAll('input')[0].element.checked).toBe(true)

    await defaultWrapper.findAll('input')[1].setValue(true)

    expect(defaultWrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana']])
    expect(defaultWrapper.emitted('update:value')?.[0]).toEqual([['apple', 'banana']])
    expect(defaultWrapper.emitted('change')?.[0]).toEqual([['apple', 'banana']])
    expect(defaultWrapper.findAll('input')[1].element.checked).toBe(true)
  })

  it('normalizes primitive group options and applies option metadata', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        defaultValue: ['Plain', 2],
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

    const checkboxes = wrapper.findAllComponents(Checkbox)

    expect(wrapper.text()).toContain('Plain')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.findAll('input')[0].element.checked).toBe(true)
    expect(wrapper.findAll('input')[1].element.checked).toBe(true)
    expect(checkboxes[2].classes()).toContain('option-class')
    expect(checkboxes[2].attributes('style')).toContain('color: green')
    expect(checkboxes[2].attributes('title')).toBe('Styled title')
  })
})
