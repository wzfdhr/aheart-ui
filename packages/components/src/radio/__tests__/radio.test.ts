import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Radio from '../radio.vue'

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
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
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
})
