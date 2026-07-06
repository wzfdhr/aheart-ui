import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
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

  it('renders FormItem label prop as a renderable node', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: h('span', { class: 'form-label-node' }, 'Custom label'),
        required: true
      },
      slots: { default: '<input />' }
    })

    expect(wrapper.find('.form-label-node').text()).toBe('Custom label')
    expect(wrapper.find('.aheart-form-item__required').exists()).toBe(true)
  })

  it('renders zero as a FormItem label', () => {
    const wrapper = mount(FormItem, {
      props: { label: 0 },
      slots: { default: '<input />' }
    })

    expect(wrapper.find('.aheart-form-item__label').text()).toBe('0')
  })

  it('renders FormItem help and extra props as renderable nodes', () => {
    const wrapper = mount(FormItem, {
      props: {
        help: h('span', { class: 'form-help-node' }, 'Help node'),
        extra: h('span', { class: 'form-extra-node' }, 'Extra node')
      },
      slots: { default: '<input />' }
    })

    expect(wrapper.find('.form-help-node').text()).toBe('Help node')
    expect(wrapper.find('.form-extra-node').text()).toBe('Extra node')
  })

  it('renders zero as FormItem help and extra content', () => {
    const wrapper = mount(FormItem, {
      props: {
        help: 0,
        extra: 0
      },
      slots: { default: '<input />' }
    })

    expect(wrapper.find('.aheart-form-item__help').text()).toBe('0')
    expect(wrapper.find('.aheart-form-item__extra').text()).toBe('0')
  })

  it('applies FormItem colon overrides and htmlFor to the label', () => {
    const wrapper = mount(Form, {
      props: { colon: false },
      slots: {
        default: {
          render() {
            return h('div', [
              h(FormItem, { label: 'Email', htmlFor: 'email-input', colon: true }, () =>
                h(Input, { id: 'email-input', modelValue: '' })
              ),
              h(FormItem, { label: 'Name', colon: false }, () => h(Input, { id: 'name-input', modelValue: '' }))
            ])
          }
        }
      }
    })
    const items = wrapper.findAllComponents(FormItem)

    expect(items[0].classes()).toContain('aheart-form-item--colon')
    expect(items[0].classes()).not.toContain('aheart-form-item--no-colon')
    expect(items[0].find('label').attributes('for')).toBe('email-input')
    expect(items[1].classes()).toContain('aheart-form-item--no-colon')
  })

  it('applies FormItem labelAlign and layout classes', () => {
    const wrapper = mount(Form, {
      props: { layout: 'vertical', labelAlign: 'right' },
      slots: {
        default: {
          render() {
            return h('div', [
              h(FormItem, { label: 'Horizontal', labelAlign: 'left', layout: 'horizontal' }, () =>
                h(Input, { modelValue: '' })
              ),
              h(FormItem, { label: 'Vertical', labelAlign: 'right', layout: 'vertical' }, () =>
                h(Input, { modelValue: '' })
              )
            ])
          }
        }
      }
    })
    const items = wrapper.findAllComponents(FormItem)

    expect(items[0].classes()).toContain('aheart-form-item--horizontal')
    expect(items[0].classes()).toContain('aheart-form-item--label-left')
    expect(items[1].classes()).toContain('aheart-form-item--vertical')
    expect(items[1].classes()).toContain('aheart-form-item--label-right')
  })

  it('renders FormItem tooltip text next to the label', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mount(FormItem, {
        props: {
          label: 'Email',
          tooltip: 'Use your work email'
        },
        slots: { default: '<input />' },
        global: {
          stubs: {
            Teleport: true
          }
        }
      })

      expect(wrapper.find('.aheart-form-item__tooltip').exists()).toBe(true)

      await wrapper.find('.aheart-tooltip__trigger').trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(100)

      expect(wrapper.find('.aheart-tooltip__content').text()).toBe('Use your work email')
    } finally {
      vi.useRealTimers()
    }
  })

  it('renders FormItem tooltip config title and custom icon', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: 'Password',
        tooltip: {
          title: h('span', { class: 'form-tooltip-node' }, 'At least 8 characters'),
          icon: h('span', { class: 'form-tooltip-icon' }, 'i'),
          open: true
        }
      },
      slots: { default: '<input />' },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    expect(wrapper.find('.form-tooltip-icon').text()).toBe('i')
    expect(wrapper.find('.form-tooltip-node').text()).toBe('At least 8 characters')
  })

  it('renders zero FormItem tooltip content and suppresses empty tooltip content', () => {
    const zero = mount(FormItem, {
      props: {
        label: 'Count',
        tooltip: 0
      },
      slots: { default: '<input />' },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })
    const empty = mount(FormItem, {
      props: {
        label: 'Name',
        tooltip: ''
      },
      slots: { default: '<input />' }
    })

    expect(zero.find('.aheart-form-item__tooltip').exists()).toBe(true)
    expect(empty.find('.aheart-form-item__tooltip').exists()).toBe(false)
  })

  it('hides FormItem visually while keeping it mounted', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: 'Secret',
        hidden: true
      },
      slots: { default: '<input />' }
    })

    expect(wrapper.classes()).toContain('aheart-form-item--hidden')
    expect(wrapper.attributes('style')).toContain('display: none')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('validates hidden named FormItems on submit', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { secret: '' }
      },
      slots: {
        default: {
          render() {
            return h('div', [
              h(
                FormItem,
                { label: 'Secret', name: 'secret', hidden: true, rules: [{ required: true, message: 'Secret required' }] },
                () => h(Input, { modelValue: '' })
              ),
              h('button', { type: 'submit' }, 'Submit')
            ])
          }
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.findComponent(FormItem).classes()).toContain('aheart-form-item--hidden')
    expect(wrapper.emitted('finishFailed')?.[0][0]).toEqual({
      values: { secret: '' },
      errorFields: [{ name: 'secret', errors: ['Secret required'] }]
    })
  })

  it('renders no-style FormItem as default slot content only', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: 'Token',
        help: 'Hidden help',
        extra: 'Hidden extra',
        noStyle: true
      },
      slots: { default: '<input class="token-input" />' }
    })

    expect(wrapper.find('.token-input').exists()).toBe(true)
    expect(wrapper.find('.aheart-form-item').exists()).toBe(false)
    expect(wrapper.find('.aheart-form-item__label').exists()).toBe(false)
    expect(wrapper.find('.aheart-form-item__help').exists()).toBe(false)
    expect(wrapper.find('.aheart-form-item__extra').exists()).toBe(false)
  })

  it('validates no-style named FormItems on submit', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { token: '' }
      },
      slots: {
        default: {
          render() {
            return h('div', [
              h(
                FormItem,
                { name: 'token', noStyle: true, rules: [{ required: true, message: 'Token required' }] },
                () => h(Input, { modelValue: '' })
              ),
              h('button', { type: 'submit' }, 'Submit')
            ])
          }
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('.aheart-form-item').exists()).toBe(false)
    expect(wrapper.emitted('finishFailed')?.[0][0]).toEqual({
      values: { token: '' },
      errorFields: [{ name: 'token', errors: ['Token required'] }]
    })
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

  it('collects all synchronous rule errors by default', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { email: 'abc' }
      },
      slots: {
        default: {
          render() {
            return h(
              FormItem,
              {
                label: 'Email',
                name: 'email',
                rules: [
                  { type: 'email', message: 'Use a valid email' },
                  { min: 8, message: 'Use at least 8 characters' }
                ]
              },
              () => h(Input, { modelValue: 'abc' })
            )
          }
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('finishFailed')?.[0][0]).toEqual({
      values: { email: 'abc' },
      errorFields: [{ name: 'email', errors: ['Use a valid email', 'Use at least 8 characters'] }]
    })
    expect(wrapper.emitted('validate')?.[0]).toEqual([
      'email',
      false,
      ['Use a valid email', 'Use at least 8 characters']
    ])
  })

  it('stops FormItem validation at the first rule error when validateFirst is true', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { email: 'abc' }
      },
      slots: {
        default: {
          render() {
            return h(
              FormItem,
              {
                label: 'Email',
                name: 'email',
                validateFirst: true,
                rules: [
                  { type: 'email', message: 'Use a valid email' },
                  { min: 8, message: 'Use at least 8 characters' }
                ]
              },
              () => h(Input, { modelValue: 'abc' })
            )
          }
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('finishFailed')?.[0][0]).toEqual({
      values: { email: 'abc' },
      errorFields: [{ name: 'email', errors: ['Use a valid email'] }]
    })
    expect(wrapper.emitted('validate')?.[0]).toEqual(['email', false, ['Use a valid email']])
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
