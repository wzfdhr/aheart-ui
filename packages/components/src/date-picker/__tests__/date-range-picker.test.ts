import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DatePicker, { DateRangePicker } from '../index'

const mountPicker = (props: Record<string, unknown> = {}) =>
  mount(DateRangePicker, {
    attachTo: document.body,
    props: {
      getPopupContainer: (node: HTMLElement) => node.parentElement as HTMLElement,
      ...props
    }
  })

const openPart = async (wrapper: VueWrapper, part: 'start' | 'end' = 'start') => {
  await wrapper.find(`[data-range-part="${part}"]`).trigger('focus')
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('DateRangePicker', () => {
  it('applies inherited ids, labels and validation feedback to both range inputs', () => {
    const wrapper = mountPicker({ id: 'delivery', labelledBy: 'delivery-label', describedBy: 'delivery-error', status: 'error' })
    const inputs = wrapper.findAll('input')

    expect(inputs.map((input) => input.attributes('id'))).toEqual(['delivery-start', 'delivery-end'])
    expect(inputs.every((input) => input.attributes('aria-labelledby') === 'delivery-label')).toBe(true)
    expect(inputs.every((input) => input.attributes('aria-describedby') === 'delivery-error')).toBe(true)
    expect(inputs.every((input) => input.attributes('aria-invalid') === 'true')).toBe(true)
  })

  it('is available as a named and namespaced component', () => {
    expect(DateRangePicker).toBeTruthy()
    expect(DatePicker.RangePicker).toBe(DateRangePicker)
  })

  it('selects an ordered range through one shared popup', async () => {
    const wrapper = mountPicker({ defaultPickerValue: ['2026-07-01', '2026-08-01'] })
    await openPart(wrapper)
    expect(wrapper.findAll('[role="dialog"]')).toHaveLength(1)
    expect(wrapper.findAll('.aheart-date-range-picker__calendar')).toHaveLength(2)
    expect(wrapper.findAll('.aheart-date-range-picker__header strong').map((title) => title.text())).toEqual(['2026年7月', '2026年8月'])

    await wrapper.find('[data-value="2026-07-20"]').trigger('click')
    await wrapper.find('[data-value="2026-07-14"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[['2026-07-14', '2026-07-20']]])
    expect(wrapper.findAll('input').map((input) => input.element.value)).toEqual(['2026-07-14', '2026-07-20'])
    await nextTick()
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('does not optimistically update when a controlled parent rejects the range', async () => {
    const wrapper = mountPicker({
      modelValue: ['2026-07-10', '2026-07-12'],
      defaultPickerValue: ['2026-07-01', '2026-08-01']
    })
    await openPart(wrapper)
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')
    await wrapper.find('[data-value="2026-07-22"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[['2026-07-20', '2026-07-22']]])
    expect(wrapper.findAll('input').map((input) => input.element.value)).toEqual(['2026-07-10', '2026-07-12'])
  })

  it('keeps desktop panels consecutive when both committed dates share a month', async () => {
    const wrapper = mountPicker({ defaultValue: ['2026-07-10', '2026-07-12'] })
    await openPart(wrapper)
    expect(wrapper.findAll('.aheart-date-range-picker__header strong').map((title) => title.text())).toEqual(['2026年7月', '2026年8月'])
  })

  it('reports the range draft and previews the hovered interval', async () => {
    const wrapper = mountPicker({ defaultPickerValue: ['2026-07-01', '2026-08-01'] })
    await openPart(wrapper)
    await wrapper.find('[data-value="2026-07-10"]').trigger('click')
    await wrapper.find('[data-value="2026-07-14"]').trigger('mouseenter')

    expect(wrapper.emitted('calendarChange')?.[0]).toEqual([['2026-07-10', undefined], { range: 'start' }])
    expect(wrapper.find('[data-value="2026-07-12"]').classes()).toContain('is-in-range')
  })

  it('supports callback presets and an explicitly empty endpoint', async () => {
    const preset = vi.fn(() => ['2026-07-01', '2026-07-31'])
    const wrapper = mountPicker({
      allowEmpty: [false, true],
      defaultValue: ['2026-07-10', '2026-07-12'],
      presets: [{ label: '本月', value: preset }]
    })
    await openPart(wrapper, 'end')
    await wrapper.find('[data-preset-index="0"]').trigger('click')
    expect(preset).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-07-01', '2026-07-31']])

    await openPart(wrapper, 'end')
    await wrapper.find('[data-range-clear="end"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['2026-07-01', undefined]])
  })

  it('keeps date-time values as drafts until confirmation', async () => {
    const wrapper = mountPicker({
      showTime: { defaultValue: '09:30:00' },
      defaultPickerValue: ['2026-07-01', '2026-08-01']
    })
    await openPart(wrapper)
    await wrapper.find('[data-value="2026-07-10"]').trigger('click')
    await wrapper.find('[data-value="2026-07-12"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.find('[data-time-part="end-hour"]').setValue(17)
    await wrapper.find('.aheart-date-range-picker__ok').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[['2026-07-10 09:30:00', '2026-07-12 17:30:00']]])
  })

  it('keeps a controlled popup closed until open is accepted', async () => {
    const wrapper = mountPicker({ open: false })
    await openPart(wrapper)
    expect(wrapper.emitted('openChange')).toEqual([[true]])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('preserves reverse selection when order is disabled', async () => {
    const wrapper = mountPicker({ order: false, defaultPickerValue: ['2026-07-01', '2026-08-01'] })
    await openPart(wrapper)
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')
    await wrapper.find('[data-value="2026-07-14"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['2026-07-20', '2026-07-14']]])
  })

  it('emits panel changes without moving a controlled panel', async () => {
    const wrapper = mountPicker({ pickerValue: ['2026-07-01', '2026-08-01'] })
    await openPart(wrapper)
    const title = wrapper.find('.aheart-date-range-picker__header strong').text()
    await wrapper.find('.aheart-date-range-picker__header button').trigger('click')
    expect(wrapper.emitted('panelChange')).toEqual([[['2025-07-01', '2026-08-01'], 'date']])
    expect(wrapper.find('.aheart-date-range-picker__header strong').text()).toBe(title)
  })

  it('supports month ranges and part-aware disabled dates', async () => {
    const disabledDate = vi.fn((current: string, info: { from?: string }) => Boolean(info.from && current === '2026-09-01'))
    const wrapper = mountPicker({ picker: 'month', defaultPickerValue: ['2026-01', '2027-01'], disabledDate })
    await openPart(wrapper)
    await wrapper.find('[data-value="2026-07"]').trigger('click')
    const blocked = wrapper.find('[data-value="2026-09"]')
    expect(blocked.attributes('disabled')).toBeDefined()
    expect(disabledDate).toHaveBeenCalledWith('2026-09-01', { from: '2026-07', type: 'month' })
  })

  it('supports 12-hour date-time range editing', async () => {
    const wrapper = mountPicker({
      showTime: { defaultValue: '21:30:00', use12Hours: true, hourStep: 2 },
      defaultPickerValue: ['2026-07-01', '2026-08-01']
    })
    await openPart(wrapper)
    await wrapper.find('[data-value="2026-07-10"]').trigger('click')
    await wrapper.find('[data-value="2026-07-12"]').trigger('click')
    const hour = wrapper.find('[data-time-part="end-hour"]')
    expect((hour.element as HTMLInputElement).value).toBe('9')
    expect((wrapper.find('[data-time-part="end-period"]').element as HTMLSelectElement).value).toBe('PM')
    ;(hour.element as HTMLInputElement).stepUp()
    await hour.trigger('input')
    await wrapper.find('.aheart-date-range-picker__ok').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['2026-07-10 21:30:00', '2026-07-12 23:30:00']]])
  })

  it('completes a range with grid keyboard navigation', async () => {
    const wrapper = mountPicker({ defaultPickerValue: ['2026-07-01', '2026-08-01'] })
    const input = wrapper.find('[data-range-part="start"]')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowRight' })
    expect(input.attributes('aria-activedescendant')).toContain('20260702')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keydown', { key: 'ArrowRight' })
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[['2026-07-02', '2026-07-03']]])
  })

  it('keeps keyboard confirmation on the active right panel', async () => {
    const wrapper = mountPicker({ defaultValue: ['2026-07-31', undefined], defaultPickerValue: ['2026-07-01', '2026-08-01'] })
    const input = wrapper.find('[data-range-part="start"]')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowRight' })
    expect(input.attributes('aria-activedescendant')).toContain('-1-20260801')
    await input.trigger('keydown', { key: 'Enter' })
    expect(input.attributes('aria-activedescendant')).toContain('-1-20260801')
    expect(wrapper.findAll('[role="gridcell"].is-active')).toHaveLength(1)
  })

  it('uses one unique active grid cell across adjacent panels', async () => {
    const wrapper = mountPicker({ defaultValue: ['2026-07-31', undefined], defaultPickerValue: ['2026-07-01', '2026-08-01'] })
    const input = wrapper.find('[data-range-part="start"]')
    await input.trigger('focus')

    const cells = wrapper.findAll('[role="gridcell"]')
    const ids = cells.map((cell) => cell.attributes('id'))
    expect(new Set(ids).size).toBe(ids.length)
    expect(cells.filter((cell) => cell.classes('is-active'))).toHaveLength(1)
    expect(input.attributes('aria-activedescendant')).toBe(cells.find((cell) => cell.classes('is-active'))?.attributes('id'))
  })

  it('rejects disabled text input and preset values', async () => {
    const wrapper = mountPicker({
      minDate: '2026-07-10',
      maxDate: '2026-07-31',
      defaultValue: ['2026-07-12', '2026-07-20'],
      presets: [{ label: '越界范围', value: ['2026-07-01', '2026-07-15'] }]
    })
    const start = wrapper.find('[data-range-part="start"]')
    await start.setValue('2026-07-01')
    expect(wrapper.emitted('invalid')).toEqual([['2026-07-01', 'start']])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await openPart(wrapper)
    await wrapper.find('[data-preset-index="0"]').trigger('click')
    expect(wrapper.emitted('invalid')?.[1]).toEqual(['2026-07-01', 'start'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('rejects preset endpoints that cannot be parsed', async () => {
    const wrapper = mountPicker({ presets: [{ label: '非法范围', value: ['not-a-date', '2026-07-15'] }] })
    await openPart(wrapper)
    await wrapper.find('[data-preset-index="0"]').trigger('click')
    expect(wrapper.emitted('invalid')).toEqual([['not-a-date', 'start']])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders selected and preview states with a custom value format', async () => {
    const wrapper = mountPicker({
      valueFormat: 'DD/MM/YYYY',
      defaultValue: ['10/07/2026', undefined],
      defaultPickerValue: ['01/07/2026', '01/08/2026']
    })
    await openPart(wrapper, 'end')
    expect(wrapper.find('[data-value="2026-07-10"]').classes()).toContain('is-selected')
    await wrapper.find('[data-value="2026-07-14"]').trigger('mouseenter')
    expect(wrapper.find('[data-value="2026-07-12"]').classes()).toContain('is-in-range')
  })

  it('syncs controlled panel and draft values accepted by the parent', async () => {
    const wrapper = mountPicker({
      open: true,
      modelValue: ['2026-07-10', '2026-07-12'],
      pickerValue: ['2026-07-01', '2026-08-01'],
      needConfirm: true
    })
    expect(wrapper.findAll('.aheart-date-range-picker__header strong').map((title) => title.text())).toEqual(['2026年7月', '2026年8月'])
    await wrapper.setProps({ pickerValue: ['2026-09-01', '2026-10-01'], modelValue: ['2026-09-10', '2026-09-12'] })
    expect(wrapper.findAll('.aheart-date-range-picker__header strong').map((title) => title.text())).toEqual(['2026年9月', '2026年10月'])
    await wrapper.find('.aheart-date-range-picker__ok').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['2026-09-10', '2026-09-12']])
  })

  it('confirms an allowed empty endpoint from the calendar flow', async () => {
    const wrapper = mountPicker({ allowEmpty: [false, true], defaultPickerValue: ['2026-07-01', '2026-08-01'] })
    await openPart(wrapper)
    await wrapper.find('[data-value="2026-07-10"]').trigger('click')
    const ok = wrapper.find('.aheart-date-range-picker__ok')
    expect(ok.exists()).toBe(true)
    expect(ok.attributes('disabled')).toBeUndefined()
    await ok.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['2026-07-10', undefined]]])
  })

  it('does not enable confirmation for a completely empty range', async () => {
    const wrapper = mountPicker({ allowEmpty: [true, true] })
    await openPart(wrapper)
    expect(wrapper.find('.aheart-date-range-picker__ok').attributes('disabled')).toBeDefined()
  })

  it('renders and navigates year ranges by decade', async () => {
    const wrapper = mountPicker({ picker: 'year', defaultPickerValue: ['2026', '2027'] })
    await openPart(wrapper)
    expect(wrapper.findAll('.aheart-date-range-picker__header strong').map((title) => title.text())).toEqual(['2020 - 2029', '2030 - 2039'])
    expect(wrapper.findAll('.aheart-date-range-picker__header button').map((button) => button.attributes('aria-label'))).toEqual([
      '上一个十年', '下一个十年', '上一个十年', '下一个十年'
    ])
    await wrapper.findAll('.aheart-date-range-picker__header button').at(3)?.trigger('click')
    expect(wrapper.findAll('.aheart-date-range-picker__header strong').at(1)?.text()).toBe('2040 - 2049')
  })

  it('provides keyboard-operable mobile part tabs', async () => {
    const wrapper = mountPicker({ defaultPickerValue: ['2026-07-01', '2026-08-01'] })
    await openPart(wrapper)
    const tabs = wrapper.findAll('.aheart-date-range-picker__mobile-parts [role="tab"]')
    expect(tabs[0]?.attributes('aria-controls')).toBeTruthy()
    expect(wrapper.find('[role="tabpanel"]').attributes('aria-labelledby')).toBe(tabs[0]?.attributes('id'))
    await tabs[0]?.trigger('keydown', { key: 'ArrowRight' })
    expect(tabs[1]?.attributes('aria-selected')).toBe('true')
    expect(tabs[1]?.attributes('tabindex')).toBe('0')
  })
})
