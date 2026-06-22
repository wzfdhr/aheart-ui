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
})
