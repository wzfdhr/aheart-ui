import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import TimePicker, { TimeRangePicker } from '../index'

const mountPicker = (props: Record<string, unknown> = {}) => mount(TimeRangePicker, {
  props,
  global: { stubs: { Teleport: true } }
})

describe('TimeRangePicker', () => {
  it('is available as a named and namespaced component', () => {
    expect(TimeRangePicker).toBeTruthy()
    expect(TimePicker.RangePicker).toBe(TimeRangePicker)
  })

  it('selects an ordered range in one coordinated popup', async () => {
    const wrapper = mountPicker({ defaultValue: ['09:30:00', '10:30:00'], defaultOpen: true })
    expect(wrapper.findAll('[role="dialog"]')).toHaveLength(1)
    await wrapper.get('[data-range-part="start"]').trigger('focus')
    await wrapper.get('[data-hour="11"]').trigger('click')
    await wrapper.get('[data-minute="15"]').trigger('click')
    await wrapper.get('[data-second="20"]').trigger('click')
    await wrapper.get('[data-range-part="end"]').trigger('focus')
    await wrapper.get('[data-hour="12"]').trigger('click')
    await wrapper.get('[data-minute="45"]').trigger('click')
    await wrapper.get('[data-second="50"]').trigger('click')
    await wrapper.get('.aheart-time-range-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['11:15:20', '12:45:50']])
  })

  it('keeps a controlled range unchanged when its owner rejects the update', async () => {
    const wrapper = mountPicker({ modelValue: ['09:00:00', '10:00:00'], defaultOpen: true })
    await wrapper.get('[data-range-part="start"]').setValue('08:00:00')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('input').map((input) => input.element.value)).toEqual(['08:00:00', '10:00:00'])
    await wrapper.get('.aheart-time-range-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['08:00:00', '10:00:00']])
    expect(wrapper.findAll('input').map((input) => input.element.value)).toEqual(['09:00:00', '10:00:00'])
  })

  it('supports reverse order, empty endpoints, presets, and part-aware disabled rules', async () => {
    const wrapper = mountPicker({
      order: false,
      allowEmpty: [false, true],
      defaultOpen: true,
      presets: [{ label: '夜班', value: ['22:00:00', '06:00:00'] }],
      disabledTime: (value: string | undefined, part: 'start' | 'end') => part === 'start' && value === '23:00:00'
    })
    await wrapper.get('[data-preset-index="0"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.get('.aheart-time-range-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['22:00:00', '06:00:00']])
    await wrapper.get('[data-range-part="end"]').trigger('focus')
    await wrapper.get('[data-range-clear="end"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['22:00:00', '06:00:00']])
    await wrapper.get('.aheart-time-range-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['22:00:00', undefined]])
    await wrapper.get('[data-range-part="start"]').setValue('23:00:00')
    expect(wrapper.emitted('invalid')?.at(-1)).toEqual(['23:00:00', 'start'])
  })

  it('supports 12-hour steps and hides disabled options per active endpoint', async () => {
    const wrapper = mountPicker({
      defaultValue: ['01:30:00 AM', '03:30:00 PM'],
      defaultOpen: true,
      format: 'hh:mm:ss A',
      valueFormat: 'hh:mm:ss A',
      use12Hours: true,
      minuteStep: 5,
      hideDisabledOptions: true,
      disabledTime: (_value: string | undefined, part: 'start' | 'end') => part === 'start' ? { disabledHours: () => [2] } : false
    })
    expect(wrapper.findAll('[data-minute]')).toHaveLength(12)
    expect(wrapper.find('[data-hour="2"]').exists()).toBe(false)
  })

  it('uses a roving keyboard model and commits scroll changes only when enabled', async () => {
    const wrapper = mountPicker({ defaultValue: ['09:30:00', '10:30:00'], defaultOpen: true, changeOnScroll: true })
    const input = wrapper.get('[data-range-part="start"]')
    expect(input.attributes('aria-activedescendant')).toContain('hour-9')
    await input.trigger('keydown', { key: 'ArrowRight' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toContain('minute-31')

    const minuteColumn = wrapper.get('[data-time-column="minute"]')
    Object.defineProperty(minuteColumn.element, 'scrollTop', { value: 15 * 28, configurable: true })
    await minuteColumn.trigger('scroll')
    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.get('.aheart-time-range-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['09:15:00', '10:30:00']])
  })

  it('keeps a controlled popup closed when opening is rejected', async () => {
    const wrapper = mountPicker({ open: false })
    await wrapper.get('[data-range-part="start"]').trigger('focus')
    expect(wrapper.emitted('openChange')).toEqual([[true]])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('shows panel drafts before confirmation and clears the complete range', async () => {
    const wrapper = mountPicker({ defaultValue: ['09:00:00', '10:00:00'], defaultOpen: true })
    await wrapper.get('[data-hour="11"]').trigger('click')
    expect(wrapper.get('[data-range-part="start"]').element.value).toBe('11:00:00')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('[data-range-clear="all"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('commits selections, input and presets immediately when confirmation is disabled', async () => {
    const wrapper = mountPicker({
      defaultValue: ['09:00:00', '10:00:00'],
      defaultOpen: true,
      needConfirm: false,
      order: false,
      presets: [{ label: '工作时段', value: ['08:00:00', '18:00:00'] }]
    })
    expect(wrapper.find('.aheart-time-range-picker__confirm').exists()).toBe(false)
    await wrapper.get('[data-hour="11"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['11:00:00', '10:00:00']])
    await wrapper.get('[data-range-part="end"]').setValue('12:30:00')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['11:00:00', '12:30:00']])
    await wrapper.get('[data-preset-index="0"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['08:00:00', '18:00:00']])
  })

  it('does not keep an optimistic range when a controlled owner rejects an immediate update', async () => {
    const wrapper = mountPicker({
      modelValue: ['09:00:00', '10:00:00'], defaultOpen: true, needConfirm: false, order: false
    })

    await wrapper.get('[data-hour="11"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['11:00:00', '10:00:00']])
    expect(wrapper.findAll('input').map((input) => input.element.value)).toEqual(['09:00:00', '10:00:00'])
    expect(wrapper.get('[data-hour="9"]').classes()).toContain('is-selected')
  })

  it('blocks confirmation, presets and now after an open range becomes disabled', async () => {
    const wrapper = mountPicker({
      defaultValue: ['09:00:00', '10:00:00'], defaultOpen: true,
      presets: [{ label: '工作时段', value: ['08:00:00', '18:00:00'] }]
    })
    await wrapper.get('[data-hour="11"]').trigger('click')
    await wrapper.setProps({ disabled: true })

    await wrapper.get('.aheart-time-range-picker__confirm').trigger('click')
    await wrapper.get('[data-preset-index="0"]').trigger('click')
    await wrapper.get('.aheart-time-range-picker__footer button').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('accepts an empty endpoint from keyboard input when allowEmpty permits it', async () => {
    const wrapper = mountPicker({
      defaultValue: ['09:00:00', '10:00:00'], defaultOpen: true, allowEmpty: [false, true]
    })
    await wrapper.get('[data-range-part="end"]').setValue('')
    expect(wrapper.emitted('invalid')).toBeUndefined()
    await wrapper.get('.aheart-time-range-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['09:00:00', undefined]])
  })

  it('provides complete tab semantics and only references rendered options', async () => {
    const wrapper = mountPicker({
      defaultValue: ['09:07:00', '10:00:00'], defaultOpen: true, minuteStep: 5
    })
    const tabs = wrapper.findAll('[role="tab"]')
    const panel = wrapper.get('[role="tabpanel"]')
    expect(tabs[0].attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(tabs[0].attributes('id'))
    expect(tabs.map((tab) => tab.attributes('tabindex'))).toEqual(['0', '-1'])
    await tabs[0].trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true')

    await wrapper.get('[data-range-part="start"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.get('[data-range-part="start"]').attributes('aria-activedescendant')).toBeUndefined()
  })

  it('applies inherited input labels, ids and a custom clear icon', () => {
    const wrapper = mount(TimeRangePicker, {
      props: { id: 'shift', labelledBy: 'shift-label', describedBy: 'shift-error', status: 'error', defaultValue: ['09:00:00', '10:00:00'] },
      slots: { clearIcon: '<span data-clear-icon>清</span>' },
      global: { stubs: { Teleport: true } }
    })
    const inputs = wrapper.findAll('input')
    expect(inputs.map((input) => input.attributes('id'))).toEqual(['shift-start', 'shift-end'])
    expect(inputs.every((input) => input.attributes('aria-labelledby') === 'shift-label')).toBe(true)
    expect(inputs.every((input) => input.attributes('aria-describedby') === 'shift-error')).toBe(true)
    expect(inputs.every((input) => input.attributes('aria-invalid') === 'true')).toBe(true)
    expect(wrapper.get('[data-range-clear="all"] [data-clear-icon]').exists()).toBe(true)
    expect(wrapper.get('[data-range-clear="all"]').attributes('aria-label')).toBe('清除时间范围')
  })

  it('keeps the other endpoint draft when clearing one endpoint', async () => {
    const wrapper = mountPicker({
      defaultValue: ['09:00:00', '10:00:00'], defaultOpen: true, allowEmpty: [false, true]
    })
    await wrapper.get('[data-hour="11"]').trigger('click')
    expect(wrapper.get('[data-range-clear="end"]').attributes('aria-label')).toBe('清除结束时间')
    await wrapper.get('[data-range-clear="end"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('input').map((input) => input.element.value)).toEqual(['11:00:00', ''])
    await wrapper.get('.aheart-time-range-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['11:00:00', undefined]])
  })

  it('does not place a disabled current time into a range draft', async () => {
    const wrapper = mountPicker({
      defaultValue: ['09:00:00', '10:00:00'], defaultOpen: true,
      disabledTime: () => ({ disabledHours: () => Array.from({ length: 24 }, (_, hour) => hour) })
    })
    await wrapper.get('.aheart-time-range-picker__footer button').trigger('click')
    expect(wrapper.findAll('input').map((input) => input.element.value)).toEqual(['09:00:00', '10:00:00'])
  })
})
