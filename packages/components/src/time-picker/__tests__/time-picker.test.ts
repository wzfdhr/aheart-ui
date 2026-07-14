import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TimePicker from '../time-picker.vue'

describe('TimePicker', () => {
  it('opens time options and emits a selected time', async () => {
    const wrapper = mount(TimePicker, { props: { defaultValue: '09:30' } })

    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.aheart-time-picker__panel').exists()).toBe(true)
    await wrapper.find('[data-time="10:15"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['10:15']])
    expect(wrapper.find('input').element.value).toBe('10:15')
  })

  it('does not select disabled times', async () => {
    const wrapper = mount(TimePicker, {
      props: { disabledTime: (value: string) => value === '10:15' }
    })

    await wrapper.find('input').trigger('focus')
    await wrapper.find('[data-time="10:15"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
