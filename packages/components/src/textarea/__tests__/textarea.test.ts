import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Textarea from '../textarea.vue'

describe('Textarea', () => {
  it('renders value, rows, count, and autosize class', () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'Line one', rows: 4, maxlength: 20, showCount: true, autoSize: true }
    })

    expect(wrapper.classes()).toContain('aheart-textarea')
    expect(wrapper.classes()).toContain('is-autosize')
    expect(wrapper.find('textarea').attributes('rows')).toBe('4')
    expect(wrapper.find('textarea').element.value).toBe('Line one')
    expect(wrapper.find('.aheart-textarea__count').text()).toBe('8 / 20')
  })

  it('emits model update, input, and change', async () => {
    const wrapper = mount(Textarea)

    await wrapper.find('textarea').setValue('Long text')
    await wrapper.find('textarea').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Long text'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['Long text'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['Long text'])
  })

  it('uses ConfigProvider disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Textarea, { modelValue: 'Disabled' })
          }
        }
      }
    })

    expect(wrapper.find('textarea').attributes()).toHaveProperty('disabled')
  })
})
