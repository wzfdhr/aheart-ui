import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { enUS } from '../../config'
import DatePicker from '../date-picker.vue'

const mountPicker = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(DatePicker, {
    attachTo: document.body,
    props: {
      getPopupContainer: (node: HTMLElement) => node.parentElement as HTMLElement,
      ...props
    },
    slots
  })

const openPicker = async (wrapper: VueWrapper) => {
  await wrapper.find('input').trigger('focus')
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('DatePicker', () => {
  it('links the input to an external field label', () => {
    const wrapper = mountPicker({ id: 'due-date', labelledBy: 'due-date-label' })

    expect(wrapper.find('input').attributes('id')).toBe('due-date')
    expect(wrapper.find('input').attributes('aria-labelledby')).toBe('due-date-label')
  })

  it('opens a localized month grid and emits a value-format string', async () => {
    const wrapper = mountPicker({ defaultValue: '2026-07-14', format: 'DD/MM/YYYY', valueFormat: 'YYYY-MM-DD' })

    await openPicker(wrapper)
    expect(wrapper.find('[role="dialog"]').attributes('aria-label')).toBe('请选择日期')
    expect(wrapper.find('input').element.value).toBe('14/07/2026')
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-20']])
    expect(wrapper.find('input').element.value).toBe('20/07/2026')
  })

  it('does not optimistically update when a controlled parent rejects a value', async () => {
    const wrapper = mountPicker({ modelValue: '2026-07-14' })
    await openPicker(wrapper)
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-20']])
    expect(wrapper.find('input').element.value).toBe('2026-07-14')
  })

  it('keeps a controlled popup open until the parent accepts openChange', async () => {
    const wrapper = mountPicker({ open: false })
    await openPicker(wrapper)

    expect(wrapper.emitted('openChange')).toEqual([[true]])
    expect(wrapper.find('.aheart-date-picker__panel').exists()).toBe(false)
  })

  it('keeps the draft and focus in a controlled popup when the parent rejects closing', async () => {
    const wrapper = mountPicker({ open: true, modelValue: '2026-07-14', needConfirm: true })
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    await nextTick()

    expect(wrapper.emitted('openChange')).toEqual([[false]])
    expect(wrapper.find('.aheart-date-picker__panel').exists()).toBe(true)
    expect(wrapper.find('[data-value="2026-07-20"]').attributes('aria-selected')).toBe('true')
  })

  it('rejects invalid input and restores the committed display value', async () => {
    const wrapper = mountPicker({ defaultValue: '2026-07-14', format: ['DD/MM/YYYY', 'YYYY-MM-DD'] })
    const input = wrapper.find('input')
    await input.setValue('31/02/2026')
    await input.trigger('change')

    expect(wrapper.emitted('invalid')).toEqual([['31/02/2026']])
    expect(input.element.value).toBe('14/07/2026')
  })

  it('applies the first display format as a numeric input mask', async () => {
    const wrapper = mountPicker({ format: 'DD/MM/YYYY', valueFormat: 'YYYY-MM-DD' })
    const input = wrapper.find('input')
    await input.setValue('14072026')
    expect(input.element.value).toBe('14/07/2026')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-14']])
  })

  it('keeps formatting a mask across real character-by-character input', async () => {
    const wrapper = mountPicker({ format: 'DD/MM/YYYY', valueFormat: 'YYYY-MM-DD' })
    const input = wrapper.find('input')
    for (const value of ['1', '14', '14/0', '14/07', '14/07/2', '14/07/2026']) {
      ;(input.element as HTMLInputElement).value = value
      await input.trigger('input')
    }
    expect(input.element.value).toBe('14/07/2026')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-14']])
  })

  it('preserves alternative input formats instead of forcing the display mask', async () => {
    const wrapper = mountPicker({ format: ['DD/MM/YYYY', 'YYYY-MM-DD'], valueFormat: 'YYYY-MM-DD' })
    const input = wrapper.find('input')
    for (const value of ['2', '20', '2026', '2026-', '2026-07', '2026-07-14']) {
      ;(input.element as HTMLInputElement).value = value
      await input.trigger('input')
    }
    expect(input.element.value).toBe('2026-07-14')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-14']])
  })

  it('preserves alternative formats that share the display separator', async () => {
    const wrapper = mountPicker({ format: ['DD/MM/YYYY', 'YYYY/MM/DD'], valueFormat: 'YYYY-MM-DD' })
    const input = wrapper.find('input')
    for (const value of ['2', '20', '202', '2026', '2026/', '2026/07', '2026/07/14']) {
      ;(input.element as HTMLInputElement).value = value
      await input.trigger('input')
    }
    expect(input.element.value).toBe('2026/07/14')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-14']])
  })

  it.each([
    ['week', '2026W30', '2026-W30'],
    ['quarter', '2026Q4', '2026-Q4']
  ] as const)('masks and parses bracket literals for %s input', async (picker, typed, expected) => {
    const wrapper = mountPicker({ picker })
    const input = wrapper.find('input')
    ;(input.element as HTMLInputElement).value = typed
    await input.trigger('input')
    expect(input.element.value).toBe(expected)
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toEqual([[expected]])
  })

  it('keeps typed values as drafts when confirmation is required', async () => {
    const wrapper = mountPicker({ defaultValue: '2026-07-14', needConfirm: true })
    const input = wrapper.find('input')
    await input.setValue('2026-07-20')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('[data-value="2026-07-20"]').attributes('aria-selected')).toBe('true')
    await wrapper.find('.aheart-date-picker__ok').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-20']])
  })

  it('restores controlled input text when the parent rejects a parsed value or clear', async () => {
    const wrapper = mountPicker({ modelValue: '2026-07-14' })
    const input = wrapper.find('input')
    await input.setValue('2026-07-20')
    await input.trigger('change')
    await nextTick()
    expect(input.element.value).toBe('2026-07-14')

    await input.setValue('')
    await input.trigger('change')
    await nextTick()
    expect(input.element.value).toBe('2026-07-14')
  })

  it('enforces min, max and string-based disabled date rules', async () => {
    const wrapper = mountPicker({
      defaultValue: '2026-07-14',
      minDate: '2026-07-10',
      maxDate: '2026-07-20',
      disabledDate: (value: string) => value === '2026-07-18'
    })
    await openPicker(wrapper)

    expect(wrapper.find('[data-value="2026-07-09"]').attributes()).toHaveProperty('disabled')
    expect(wrapper.find('[data-value="2026-07-18"]').attributes()).toHaveProperty('disabled')
    expect(wrapper.find('[data-value="2026-07-21"]').attributes()).toHaveProperty('disabled')
  })

  it('rejects presets that are invalid or disabled', async () => {
    const wrapper = mountPicker({
      minDate: '2026-07-10',
      maxDate: '2026-07-20',
      presets: [{ label: '越界', value: '2026-07-31' }],
      defaultPickerValue: '2026-07-14'
    })
    await openPicker(wrapper)
    await wrapper.find('[data-preset-index="0"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('invalid')).toEqual([['2026-07-31']])
  })

  it.each([
    ['week', '2026-W29'],
    ['month', '2026-07'],
    ['quarter', '2026-Q3'],
    ['year', '2026']
  ] as const)('emits canonical %s values', async (picker, expected) => {
    const wrapper = mountPicker({ picker, defaultPickerValue: '2026-07-14' })
    await openPicker(wrapper)
    await wrapper.find(`[data-value="${expected}"]`).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[expected]])
  })

  it('toggles deduplicated multiple values and keeps the panel open', async () => {
    const wrapper = mountPicker({ multiple: true, defaultValue: ['2026-07-14'], defaultPickerValue: '2026-07-14' })
    await openPicker(wrapper)
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')
    await wrapper.find('[data-value="2026-07-14"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([
      [['2026-07-14', '2026-07-20']],
      [['2026-07-20']]
    ])
    expect(wrapper.find('.aheart-date-picker__panel').exists()).toBe(true)
  })

  it('warns and disables showTime when multiple is enabled', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const wrapper = mountPicker({ multiple: true, showTime: true })
    await openPicker(wrapper)

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('multiple'))
    expect(wrapper.find('.aheart-date-picker__time').exists()).toBe(false)
  })

  it('uses a showTime draft and commits only after confirmation', async () => {
    const wrapper = mountPicker({ showTime: true, defaultPickerValue: '2026-07-14 09:08:07' })
    await openPicker(wrapper)
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.find('[data-time-part="hour"]').setValue(11)
    await wrapper.find('.aheart-date-picker__ok').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-20 11:08:07']])
    expect(document.activeElement).toBe(wrapper.find('input').element)
  })

  it('provides a touch-friendly cancel action that discards an unconfirmed time draft', async () => {
    vi.useFakeTimers()
    const wrapper = mountPicker({ showTime: true, defaultValue: '2026-07-14 09:08:07' })
    await openPicker(wrapper)
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')
    await wrapper.find('[data-time-part="hour"]').setValue(11)

    const cancel = wrapper.find('.aheart-date-picker__cancel')
    expect(cancel.text()).toBe('取消')
    expect(cancel.attributes('type')).toBe('button')
    await cancel.trigger('click')
    await vi.advanceTimersByTimeAsync(120)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.aheart-date-picker__panel').exists()).toBe(false)
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2026-07-14 09:08:07')
    expect(document.activeElement).toBe(wrapper.find('input').element)
  })

  it('localizes the confirmation cancel action without committing an enUS draft', async () => {
    vi.useFakeTimers()
    const wrapper = mountPicker({ locale: enUS, showTime: true, defaultValue: '2026-07-14 09:08:07' })
    await openPicker(wrapper)
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')

    const cancel = wrapper.find('.aheart-date-picker__cancel')
    expect(cancel.text()).toBe('Cancel')
    await cancel.trigger('click')
    await vi.advanceTimersByTimeAsync(120)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.aheart-date-picker__panel').exists()).toBe(false)
  })

  it('supports showTime default values, steps and 12-hour periods', async () => {
    const wrapper = mountPicker({
      showTime: { defaultValue: '21:30:00', hourStep: 2, minuteStep: 5, use12Hours: true },
      defaultPickerValue: '2026-07-14'
    })
    await openPicker(wrapper)
    expect(wrapper.find('[data-time-part="hour"]').element.getAttribute('step')).toBe('2')
    expect((wrapper.find('[data-time-part="hour"]').element as HTMLInputElement).value).toBe('9')
    expect((wrapper.find('[data-time-part="period"]').element as HTMLSelectElement).value).toBe('PM')
    expect((wrapper.find('input').element as HTMLInputElement).inputMode).toBe('text')
    await wrapper.find('[data-time-part="minute"]').setValue(7)
    expect((wrapper.find('[data-time-part="minute"]').element as HTMLInputElement).value).toBe('5')
    await wrapper.find('[data-time-part="hour"]').setValue(12)
    expect((wrapper.find('[data-time-part="hour"]').element as HTMLInputElement).value).toBe('12')
  })

  it('preserves native 12-hour spinner increments without rounding backwards', async () => {
    const wrapper = mountPicker({
      showTime: { defaultValue: '21:30:00', hourStep: 2, use12Hours: true },
      defaultPickerValue: '2026-07-14'
    })
    await openPicker(wrapper)
    const hour = wrapper.find('[data-time-part="hour"]')
    ;(hour.element as HTMLInputElement).stepUp()
    await hour.trigger('input')

    expect((hour.element as HTMLInputElement).value).toBe('11')
    await wrapper.find('.aheart-date-picker__ok').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-14 23:30:00']])
  })

  it('keeps step values valid at upper boundaries and tolerates zero steps', async () => {
    const wrapper = mountPicker({
      showTime: { minuteStep: 10, secondStep: 0 },
      defaultPickerValue: '2026-07-14 09:30:00'
    })
    await openPicker(wrapper)
    await wrapper.find('[data-time-part="minute"]').setValue(59)
    await wrapper.find('[data-time-part="second"]').setValue(59)
    expect((wrapper.find('[data-time-part="minute"]').element as HTMLInputElement).value).toBe('50')
    expect((wrapper.find('[data-time-part="second"]').element as HTMLInputElement).value).toBe('59')
  })

  it('discards an unconfirmed draft when the popup closes', async () => {
    const wrapper = mountPicker({ defaultValue: '2026-07-14', needConfirm: true })
    await openPicker(wrapper)
    await wrapper.find('[data-value="2026-07-20"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    await openPicker(wrapper)
    expect(wrapper.find('[data-value="2026-07-14"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-value="2026-07-20"]').attributes('aria-selected')).toBe('false')
  })

  it('honors defaultOpen and emits panelChange without mutating controlled pickerValue', async () => {
    const wrapper = mountPicker({ defaultOpen: true, pickerValue: '2026-07-14' })
    await nextTick()
    expect(wrapper.find('.aheart-date-picker__panel').exists()).toBe(true)
    const title = wrapper.find('.aheart-date-picker__header strong').text()
    await wrapper.find('[aria-label="下一年"]').trigger('click')
    expect(wrapper.emitted('panelChange')).toEqual([['2027-07-14', 'date']])
    expect(wrapper.find('.aheart-date-picker__header strong').text()).toBe(title)
  })

  it('opens an empty mounted picker on the current month instead of the SSR fallback', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-15T08:00:00'))
    const wrapper = mountPicker()
    await openPicker(wrapper)
    expect(wrapper.find('.aheart-date-picker__header strong').text()).toContain('2026')
    expect(wrapper.find('[data-value="2026-07-15"]').exists()).toBe(true)
    vi.useRealTimers()
  })

  it('syncs a controlled value change into an open confirmation draft', async () => {
    const wrapper = mountPicker({ modelValue: '2026-07-14', open: true, needConfirm: true })
    await wrapper.setProps({ modelValue: '2026-07-20' })
    await nextTick()
    expect(wrapper.find('[data-value="2026-07-20"]').attributes('aria-selected')).toBe('true')
    await wrapper.find('.aheart-date-picker__ok').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-07-20'])
  })

  it('can close after becoming disabled or readonly while open', async () => {
    vi.useFakeTimers()
    const disabled = mountPicker({ defaultOpen: true })
    await disabled.setProps({ disabled: true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await vi.runAllTimersAsync()
    await nextTick()
    expect(disabled.find('.aheart-date-picker__panel').exists()).toBe(false)

    const readonly = mountPicker({ defaultOpen: true })
    await readonly.setProps({ readOnly: true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await vi.runAllTimersAsync()
    await nextTick()
    expect(readonly.find('.aheart-date-picker__panel').exists()).toBe(false)
  })

  it('does not let keyboard navigation bypass a controlled pickerValue', async () => {
    const wrapper = mountPicker({ defaultOpen: true, pickerValue: '2026-07-31' })
    const input = wrapper.find('input')
    const title = wrapper.find('.aheart-date-picker__header strong').text()
    await input.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('panelChange')).toEqual([['2026-08-01', 'date']])
    expect(wrapper.find('.aheart-date-picker__header strong').text()).toBe(title)
    expect(wrapper.find('[data-value="2026-07-31"]').classes()).toContain('is-active')
  })

  it.each([
    ['month', 'ArrowRight', '2026-08'],
    ['quarter', 'ArrowRight', '2026-Q4'],
    ['quarter', 'ArrowDown', '2027-Q1'],
    ['year', 'ArrowDown', '2029']
  ] as const)('moves %s keyboard focus by visible grid cells', async (picker, key, expected) => {
    const wrapper = mountPicker({ picker, defaultPickerValue: '2026-07-14' })
    const input = wrapper.find('input')
    await openPicker(wrapper)
    await input.trigger('keydown', { key })

    expect(wrapper.find(`[data-value="${expected}"]`).classes()).toContain('is-active')
  })

  it('emits one close request for Escape', async () => {
    const wrapper = mountPicker({ open: true })
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('renders size, status and variant states on the stable root', () => {
    const wrapper = mountPicker({ size: 'large', status: 'warning', variant: 'filled' })
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'aheart-date-picker--large',
      'aheart-date-picker--warning',
      'aheart-date-picker--filled'
    ]))
  })

  it('resolves preset callbacks when selected', async () => {
    const wrapper = mountPicker({
      presets: [{ label: '月底', value: () => '2026-07-31' }],
      defaultPickerValue: '2026-07-14'
    })
    await openPicker(wrapper)
    await wrapper.find('[data-preset-index="0"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-31']])
  })

  it('supports clear, custom prefix and custom cells', async () => {
    const wrapper = mountPicker(
      { defaultValue: '2026-07-14' },
      {
        prefix: () => h('span', { 'data-prefix': '' }, '日期'),
        cell: ({ text }: { text: string }) => h('b', { 'data-cell': '' }, text)
      }
    )
    expect(wrapper.find('[data-prefix]').exists()).toBe(true)
    await openPicker(wrapper)
    expect(wrapper.find('[data-cell]').exists()).toBe(true)
    await wrapper.find('.aheart-date-picker__clear').trigger('click')
    expect(wrapper.emitted('clear')).toEqual([[]])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
  })

  it('renders a component supplied as suffixIcon', () => {
    const SuffixIcon = defineComponent({
      name: 'TestSuffixIcon',
      setup: () => () => h('span', { 'data-component-suffix': '' }, 'icon')
    })
    const wrapper = mountPicker({ suffixIcon: SuffixIcon })
    expect(wrapper.find('[data-component-suffix]').exists()).toBe(true)
  })

  it('uses ConfigProvider runtime English copy', async () => {
    const wrapper = mountPicker({ locale: enUS })
    await openPicker(wrapper)

    expect(wrapper.find('[role="dialog"]').attributes('aria-label')).toBe('Select date')
    expect(wrapper.find('[aria-label="Previous month"]').exists()).toBe(true)
    expect(wrapper.find('.aheart-date-picker__header strong').text()).toBe('July 2026')
    expect(wrapper.find('.aheart-date-picker__time').exists()).toBe(false)
  })

  it('uses a natural Chinese month title', async () => {
    const wrapper = mountPicker({ defaultOpen: true, defaultPickerValue: '2026-07-14' })
    expect(wrapper.find('.aheart-date-picker__header strong').text()).toBe('2026年7月')
  })

  it('localizes presets, time fields and decade navigation', async () => {
    const timed = mountPicker({ locale: enUS, showTime: { use12Hours: true }, defaultValue: '2026-07-14 21:30:00', presets: [{ label: 'Today', value: '2026-07-14 09:00:00' }] })
    expect((timed.find('input').element as HTMLInputElement).value).toBe('2026-07-14 09:30:00 PM')
    await openPicker(timed)
    expect(timed.find('.aheart-date-picker__presets').attributes('aria-label')).toBe('Presets')
    expect(timed.find('.aheart-date-picker__time').attributes('aria-label')).toBe('Time')
    expect(timed.find('[data-time-part="hour"]').element.previousElementSibling?.textContent).toBe('Hour')

    const years = mountPicker({ locale: enUS, picker: 'year', defaultOpen: true, defaultPickerValue: '2026-07-14' })
    expect(years.find('[aria-label="Previous decade"]').exists()).toBe(true)
    expect(years.find('[aria-label="Next decade"]').exists()).toBe(true)
  })

  it('parses localized Chinese meridiem input and localizes period options', async () => {
    const wrapper = mountPicker({ showTime: { use12Hours: true }, defaultValue: '2026-07-14 09:30:00' })
    const input = wrapper.find('input')
    await input.setValue('2026-07-20 11:30:00 晚上')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.find('.aheart-date-picker__ok').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-20 23:30:00']])

    await openPicker(wrapper)
    expect(wrapper.find('[data-time-part="period"] option[value="AM"]').text()).toBe('上午')
    expect(wrapper.find('[data-time-part="period"] option[value="PM"]').text()).toBe('下午')
  })

  it('parses localized default and controlled model values', async () => {
    const wrapper = mountPicker({
      modelValue: '2026-07-20 03:30:00 下午',
      showTime: { use12Hours: true },
      valueFormat: 'YYYY-MM-DD hh:mm:ss A',
      format: 'DD/MM/YYYY hh:mm A'
    })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('20/07/2026 03:30 下午')

    await wrapper.setProps({ modelValue: '2026-08-21 09:15:00 上午' })
    await nextTick()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('21/08/2026 09:15 上午')
  })

  it('moves the active date with keyboard navigation and restores focus on Escape', async () => {
    const wrapper = mountPicker({ defaultValue: '2026-07-14' })
    const input = wrapper.find('input')
    await openPicker(wrapper)
    await input.trigger('keydown', { key: 'ArrowRight' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-07-15']])

    await openPicker(wrapper)
    await input.trigger('keydown', { key: 'Escape' })
    expect(document.activeElement).toBe(input.element)
  })

  it('exposes focus and blur methods', async () => {
    const wrapper = mountPicker()
    const vm = wrapper.vm as unknown as { focus: () => void; blur: () => void }
    vm.focus()
    expect(document.activeElement).toBe(wrapper.find('input').element)
    vm.blur()
    expect(document.activeElement).not.toBe(wrapper.find('input').element)
  })
})
