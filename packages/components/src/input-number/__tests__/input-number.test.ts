import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import InputNumber from '../input-number.vue'

describe('InputNumber', () => {
  it('renders numeric value and size class', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 4, size: 'small' }
    })

    expect(wrapper.classes()).toContain('aheart-input-number')
    expect(wrapper.classes()).toContain('aheart-input-number--small')
    expect(wrapper.find('input').element.value).toBe('4')
  })

  it('clamps typed values to min and max', async () => {
    const wrapper = mount(InputNumber, {
      props: { min: 1, max: 10 }
    })

    await wrapper.find('input').setValue('20')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
    expect(wrapper.emitted('change')?.[0]).toEqual([10])
  })

  it('increments and decrements by step controls', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, step: 2, controls: true }
    })

    await wrapper.find('.aheart-input-number__increase').trigger('click')
    await wrapper.find('.aheart-input-number__decrease').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', disabled: true },
      slots: {
        default: {
          render() {
            return h(InputNumber, { modelValue: 8 })
          }
        }
      }
    })

    const inputNumber = wrapper.findComponent(InputNumber)
    expect(inputNumber.classes()).toContain('aheart-input-number--large')
    expect(inputNumber.find('input').attributes()).toHaveProperty('disabled')
  })

  it('supports prefix suffix status variant readonly id and formatted display', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 1200,
        prefix: '$',
        suffix: 'USD',
        status: 'warning',
        variant: 'filled',
        id: 'amount',
        readOnly: true,
        formatter: (value?: number) => (value === undefined ? '' : `${value.toLocaleString()}`)
      }
    })

    expect(wrapper.classes()).toContain('aheart-input-number--warning')
    expect(wrapper.classes()).toContain('aheart-input-number--filled')
    expect(wrapper.find('.aheart-input-number__prefix').text()).toBe('$')
    expect(wrapper.find('.aheart-input-number__suffix').text()).toBe('USD')
    expect(wrapper.find('input').element.value).toBe('1,200')
    expect(wrapper.find('input').attributes('id')).toBe('amount')
    expect(wrapper.find('input').attributes()).toHaveProperty('readonly')
  })

  it('parses input applies precision and emits pressEnter', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        precision: 2,
        parser: (value: string) => Number(value.replace('$', ''))
      }
    })

    await wrapper.find('input').setValue('$12.345')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([12.35])
    expect(wrapper.emitted('pressEnter')).toHaveLength(1)
  })

  it('supports keyboard suppression and step events', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, keyboard: false }
    })

    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.find('.aheart-input-number__increase').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    expect(wrapper.emitted('step')?.[0]).toEqual([3, { offset: 1, type: 'up' }])
  })

  it('renders custom controls icon content and hides controls when disabled', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 2,
        controls: {
          upIcon: 'up',
          downIcon: 'down'
        }
      }
    })

    expect(wrapper.find('.aheart-input-number__increase').text()).toBe('up')
    expect(wrapper.find('.aheart-input-number__decrease').text()).toBe('down')

    const withoutControls = mount(InputNumber, {
      props: { modelValue: 2, controls: false }
    })

    expect(withoutControls.find('.aheart-input-number__controls').exists()).toBe(false)
  })

  it('steps with mouse wheel only when changeOnWheel is enabled', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, step: 2, changeOnWheel: true }
    })

    await wrapper.find('input').trigger('wheel', { deltaY: -1 })
    await wrapper.find('input').trigger('wheel', { deltaY: 1 })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])

    const disabledWheel = mount(InputNumber, {
      props: { modelValue: 2 }
    })

    await disabledWheel.find('input').trigger('wheel', { deltaY: -1 })
    expect(disabledWheel.emitted('update:modelValue')).toBeUndefined()
  })

  it('passes formatter info to formatter', () => {
    const calls: Array<{ value: number | undefined; userTyping?: boolean; input?: string }> = []
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 1200,
        formatter: (value, info) => {
          calls.push({ value, ...info })
          return `${info.userTyping}:${info.input}`
        }
      }
    })

    expect(wrapper.find('input').element.value).toBe('false:1200')
    expect(calls[0]).toEqual({ value: 1200, userTyping: false, input: '1200' })
  })

  it('applies root class and style hooks', () => {
    const wrapper = mount(InputNumber, {
      props: {
        className: 'input-number-class',
        rootClassName: 'input-number-root',
        style: { width: '320px' },
        classNames: {
          root: 'semantic-root'
        },
        styles: {
          root: { marginTop: '6px' }
        }
      }
    })

    expect(wrapper.classes()).toContain('input-number-class')
    expect(wrapper.classes()).toContain('input-number-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('width: 320px')
    expect(wrapper.attributes('style')).toContain('margin-top: 6px')
  })

  it('applies semantic class and style hooks to InputNumber parts', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 2,
        prefix: '$',
        suffix: 'USD',
        classNames: {
          input: 'semantic-input',
          prefix: 'semantic-prefix',
          suffix: 'semantic-suffix',
          actions: 'semantic-actions',
          action: 'semantic-action'
        },
        styles: {
          input: { color: 'red' },
          prefix: { color: 'blue' },
          suffix: { color: 'green' },
          actions: { color: 'purple' },
          action: { color: 'orange' }
        }
      }
    })

    expect(wrapper.find('input').classes()).toContain('semantic-input')
    expect(wrapper.find('input').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-input-number__prefix').classes()).toContain('semantic-prefix')
    expect(wrapper.find('.aheart-input-number__prefix').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.aheart-input-number__suffix').classes()).toContain('semantic-suffix')
    expect(wrapper.find('.aheart-input-number__suffix').attributes('style')).toContain('color: green')
    expect(wrapper.find('.aheart-input-number__controls').classes()).toContain('semantic-actions')
    expect(wrapper.find('.aheart-input-number__controls').attributes('style')).toContain('color: purple')
    expect(wrapper.find('.aheart-input-number__increase').classes()).toContain('semantic-action')
    expect(wrapper.find('.aheart-input-number__increase').attributes('style')).toContain('color: orange')
    expect(wrapper.find('.aheart-input-number__decrease').classes()).toContain('semantic-action')
    expect(wrapper.find('.aheart-input-number__decrease').attributes('style')).toContain('color: orange')
  })
})
