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
})
