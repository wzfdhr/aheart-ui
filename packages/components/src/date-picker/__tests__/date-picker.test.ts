import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DatePicker from '../date-picker.vue'

describe('DatePicker', () => {
  it('opens a month grid and emits a formatted selected value', async () => {
    const wrapper = mount(DatePicker, {
      props: { defaultValue: '2026-07-14' }
    })

    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.aheart-date-picker__panel').exists()).toBe(true)

    await wrapper.find('[data-date="2026-07-20"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-20']])
    expect(wrapper.find('input').element.value).toBe('2026-07-20')
  })

  it('does not select disabled calendar dates', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        defaultValue: '2026-07-14',
        disabledDate: (date: Date) => date.getDate() === 20
      }
    })

    await wrapper.find('input').trigger('focus')
    await wrapper.find('[data-date="2026-07-20"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
