import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import Input from '../../input/input.vue'
import Form, { FormItem } from '../index'

describe('Form', () => {
  it('renders layout and emits submit', async () => {
    const wrapper = mount(Form, {
      props: { layout: 'vertical', labelAlign: 'left' },
      slots: { default: '<button type="submit">Save</button>' }
    })

    expect(wrapper.classes()).toContain('aheart-form')
    expect(wrapper.classes()).toContain('aheart-form--vertical')
    expect(wrapper.classes()).toContain('aheart-form--label-left')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('renders FormItem label, required mark, help, extra, and status', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: 'Email',
        name: 'email',
        required: true,
        validateStatus: 'error',
        help: 'Email is required',
        extra: 'Use your work email',
        hasFeedback: true
      },
      slots: { default: '<input />' }
    })

    expect(wrapper.classes()).toContain('aheart-form-item')
    expect(wrapper.classes()).toContain('aheart-form-item--error')
    expect(wrapper.find('.aheart-form-item__required').exists()).toBe(true)
    expect(wrapper.find('.aheart-form-item__feedback').exists()).toBe(true)
    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Use your work email')
  })

  it('provides size and disabled state to nested controls', () => {
    const wrapper = mount(Form, {
      props: { size: 'large', disabled: true },
      slots: {
        default: {
          render() {
            return h(FormItem, { label: 'Name' }, () => h(Input, { modelValue: 'Ada' }))
          }
        }
      }
    })

    const input = wrapper.findComponent(Input)
    expect(input.classes()).toContain('aheart-input--large')
    expect(input.find('input').attributes()).toHaveProperty('disabled')
  })

  it('validates required model fields and emits finishFailed on submit', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { email: '' },
        rules: {
          email: [{ required: true, message: 'Email is required' }]
        }
      },
      slots: {
        default: {
          render() {
            return h('button', { type: 'submit' }, 'Save')
          }
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('finish')).toBeUndefined()
    expect(wrapper.emitted('finishFailed')?.[0][0]).toEqual({
      values: { email: '' },
      errorFields: [{ name: 'email', errors: ['Email is required'] }]
    })
    expect(wrapper.emitted('validate')?.[0]).toEqual(['email', false, ['Email is required']])
  })

  it('renders FormItem automatic required state and validation help from rules', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { email: '' },
        rules: {
          email: [{ required: true, message: 'Email is required' }]
        }
      },
      slots: {
        default: {
          render() {
            return h(FormItem, { label: 'Email', name: 'email' }, () => h(Input, { modelValue: '' }))
          }
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    const item = wrapper.findComponent(FormItem)
    expect(item.classes()).toContain('aheart-form-item--error')
    expect(item.find('.aheart-form-item__required').exists()).toBe(true)
    expect(item.text()).toContain('Email is required')
  })

  it('emits finish when model passes rules', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { email: 'ada@example.com' },
        rules: {
          email: [{ required: true }, { type: 'email', message: 'Use a valid email' }]
        }
      },
      slots: { default: '<button type="submit">Save</button>' }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('finish')?.[0]).toEqual([{ email: 'ada@example.com' }])
    expect(wrapper.emitted('finishFailed')).toBeUndefined()
  })

  it('supports item rules, optional mark, colon false, and variant classes', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { age: 12 },
        requiredMark: 'optional',
        colon: false,
        variant: 'filled'
      },
      slots: {
        default: {
          render() {
            return h(FormItem, { label: 'Age', name: 'age', rules: [{ min: 18, message: 'Adults only' }] }, () =>
              h(Input, { modelValue: '12' })
            )
          }
        }
      }
    })

    expect(wrapper.classes()).toContain('aheart-form--filled')
    expect(wrapper.classes()).toContain('aheart-form--required-optional')
    expect(wrapper.classes()).toContain('aheart-form--no-colon')
    expect(wrapper.find('.aheart-form-item__optional').exists()).toBe(true)
    expect(wrapper.findComponent(Input).classes()).toContain('aheart-input--filled')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.findComponent(FormItem).classes()).toContain('aheart-form-item--error')
    expect(wrapper.text()).toContain('Adults only')
  })
})
