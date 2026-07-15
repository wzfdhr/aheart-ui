import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import TimePicker from '../time-picker.vue'

const mountPicker = (options: Record<string, any> = {}) => mount(TimePicker, {
  ...options,
  global: {
    ...options.global,
    stubs: { ...options.global?.stubs, Teleport: true }
  }
})

describe('TimePicker', () => {
  it('uses seconds and one-minute steps by default', async () => {
    const wrapper = mountPicker({ props: { defaultValue: '09:30:00', defaultOpen: true } })

    expect(wrapper.get('[data-minute="1"]').exists()).toBe(true)
    expect(wrapper.get('[data-second="1"]').exists()).toBe(true)
    await wrapper.get('[data-hour="10"]').trigger('click')
    await wrapper.get('[data-minute="15"]').trigger('click')
    await wrapper.get('[data-second="20"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['10:15:20'])
    expect(wrapper.find('input').element.value).toBe('10:15:20')
  })

  it('supports independent hour, minute, and second steps', () => {
    const wrapper = mountPicker({
      props: { defaultOpen: true, format: 'HH:mm:ss', hourStep: 2, minuteStep: 5, secondStep: 10 }
    })

    expect(wrapper.findAll('[data-hour]')).toHaveLength(12)
    expect(wrapper.findAll('[data-minute]')).toHaveLength(12)
    expect(wrapper.findAll('[data-second]')).toHaveLength(6)
    expect(wrapper.find('[data-minute="1"]').exists()).toBe(false)
  })

  it('supports structured disabled time and the legacy string predicate', async () => {
    const structured = mountPicker({
      props: {
        defaultOpen: true,
        defaultValue: '09:30',
        disabledTime: {
          disabledHours: () => [10],
          disabledMinutes: (hour: number) => hour === 9 ? [35] : []
        }
      }
    })

    expect(structured.get('[data-hour="10"]').attributes()).toHaveProperty('disabled')
    expect(structured.get('[data-minute="35"]').attributes()).toHaveProperty('disabled')

    const callbackConfig = mountPicker({
      props: { defaultOpen: true, disabledTime: () => ({ disabledHours: () => [11] }) }
    })
    expect(callbackConfig.get('[data-hour="11"]').attributes()).toHaveProperty('disabled')

    const legacy = mountPicker({
      props: { defaultOpen: true, disabledTime: (value: string) => value === '10:15' }
    })
    await legacy.get('[data-hour="10"]').trigger('click')
    await legacy.get('[data-minute="15"]').trigger('click')
    expect(legacy.emitted('update:modelValue')).toEqual([['10:00:00']])
  })

  it('rejects manually entered values covered by structured disabled rules', async () => {
    const wrapper = mountPicker({
      props: {
        modelValue: '09:30', format: 'HH:mm', valueFormat: 'HH:mm',
        disabledTime: { disabledMinutes: (hour: number) => hour === 9 ? [35] : [] }
      }
    })
    const input = wrapper.get('.aheart-time-picker__input')

    input.element.value = '09:35'
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input.element.value).toBe('09:30')
  })

  it('delays value changes until confirmation when needConfirm is enabled', async () => {
    const wrapper = mountPicker({
      props: { modelValue: '09:30', defaultOpen: true, needConfirm: true, format: 'HH:mm', valueFormat: 'HH:mm' }
    })

    await wrapper.get('[data-hour="10"]').trigger('click')
    await wrapper.get('[data-minute="15"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('.aheart-time-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:15'])
  })

  it('supports 12-hour display and period selection', () => {
    const wrapper = mountPicker({
      props: { defaultValue: '02:30 PM', defaultOpen: true, format: 'hh:mm A', use12Hours: true }
    })

    expect(wrapper.get('.aheart-time-picker__input').element.value).toBe('02:30 下午')
    expect(wrapper.findAll('[data-period]').map((item) => item.text())).toEqual(['上午', '下午'])
  })

  it('clears values and keeps controlled value UI unchanged', async () => {
    const wrapper = mountPicker({ props: { modelValue: '09:30', allowClear: true, format: 'HH:mm' } })

    await wrapper.get('.aheart-time-picker__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    expect(wrapper.get('.aheart-time-picker__input').element.value).toBe('09:30')
  })

  it('does not restore a default for an explicitly undefined controlled value', async () => {
    const wrapper = mountPicker({ props: { modelValue: undefined, defaultValue: '09:30', format: 'HH:mm', valueFormat: 'HH:mm' } })

    expect(wrapper.get('.aheart-time-picker__input').element.value).toBe('')
    await wrapper.get('.aheart-time-picker__input').trigger('focus')
    await wrapper.get('[data-hour="10"]').trigger('click')
    await wrapper.get('[data-minute="15"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['00:15'])
    expect(wrapper.get('.aheart-time-picker__input').element.value).toBe('')
  })

  it('keeps a controlled popup closed when its owner rejects opening', async () => {
    const wrapper = mountPicker({ props: { open: false } })

    await wrapper.get('.aheart-time-picker__input').trigger('focus')

    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
    expect(wrapper.find('.aheart-time-picker__panel').exists()).toBe(false)
  })

  it('does not submit values after an open panel becomes disabled or readonly', async () => {
    for (const state of [{ disabled: true }, { readOnly: true }]) {
      const wrapper = mountPicker({ props: { defaultValue: '09:30', defaultOpen: true } })

      await wrapper.setProps(state)
      await wrapper.get('[data-hour="10"]').trigger('click')
      await wrapper.get('[data-minute="15"]').trigger('click')
      await wrapper.find('.aheart-time-picker__now').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await nextTick()
      expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])
    }
  })

  it('keeps manual input and scroll changes as drafts when confirmation is required', async () => {
    const wrapper = mountPicker({
      props: { modelValue: '09:30:00', defaultOpen: true, needConfirm: true, changeOnScroll: true }
    })
    const input = wrapper.get('.aheart-time-picker__input')
    input.element.value = '10:15:20'
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input.element.value).toBe('10:15:20')

    const minuteColumn = wrapper.get('[data-time-column="minute"]')
    Object.defineProperty(minuteColumn.element, 'scrollTop', { value: 20 * 28, configurable: true })
    await minuteColumn.trigger('scroll')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('.aheart-time-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['10:20:20'])
  })

  it('does not place a disabled current time into the draft', async () => {
    const wrapper = mountPicker({
      props: { modelValue: '09:30:00', defaultOpen: true, needConfirm: true, disabledTime: { disabledHours: () => Array.from({ length: 24 }, (_, hour) => hour) } }
    })
    await wrapper.get('.aheart-time-picker__now').trigger('click')
    expect(wrapper.get('.aheart-time-picker__input').element.value).toBe('09:30:00')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('uses zero-based hour steps in 12-hour mode and localizes column labels', () => {
    const wrapper = mountPicker({
      props: { defaultOpen: true, use12Hours: true, format: 'hh:mm A', hourStep: 2 }
    })
    expect(wrapper.findAll('[data-hour]').map((item) => item.attributes('data-hour'))).toEqual(['12', '2', '4', '6', '8', '10'])
    expect(wrapper.get('[data-time-column="hour"]').attributes('aria-label')).toBe('时')
    expect(wrapper.get('[data-period="AM"]').text()).toBe('上午')
  })

  it('commits every changed column immediately when confirmation is disabled', async () => {
    const wrapper = mountPicker({ props: { defaultValue: '09:30:00', defaultOpen: true } })
    await wrapper.get('[data-hour="10"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['10:30:00'])
    await wrapper.get('[data-minute="15"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['10:15:00'])

    const twelveHour = mountPicker({ props: { defaultValue: '02:30:00 AM', defaultOpen: true, use12Hours: true, format: 'hh:mm:ss A' } })
    await twelveHour.get('[data-period="PM"]').trigger('click')
    expect(twelveHour.emitted('update:modelValue')?.at(-1)).toEqual(['14:30:00'])
  })

  it('commits keyboard column changes immediately without optimistic controlled state', async () => {
    const wrapper = mountPicker({ props: { modelValue: '09:30:00', defaultOpen: true } })
    const input = wrapper.get('.aheart-time-picker__input')

    await input.trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['10:30:00'])
    expect(input.element.value).toBe('09:30:00')
    expect(wrapper.get('[data-hour="9"]').classes()).toContain('is-selected')
  })

  it('uses a localized 12-hour display by default and accepts localized input', async () => {
    const wrapper = mountPicker({ props: { modelValue: '14:30:00', use12Hours: true } })
    const input = wrapper.get('.aheart-time-picker__input')
    expect(input.element.value).toBe('02:30:00 下午')
    input.element.value = '03:15:00 上午'
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['03:15:00'])
  })

  it('omits aria-activedescendant when the current value has no rendered option', async () => {
    const wrapper = mountPicker({
      props: { defaultValue: '09:07:00', defaultOpen: true, minuteStep: 5, needConfirm: true }
    })
    await wrapper.get('.aheart-time-picker__input').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.get('.aheart-time-picker__input').attributes('aria-activedescendant')).toBeUndefined()
  })

  it('uses a roving keyboard model without tabbing through every option', async () => {
    const wrapper = mountPicker({ props: { defaultValue: '09:30', defaultOpen: true, needConfirm: true, format: 'HH:mm', valueFormat: 'HH:mm' } })
    const input = wrapper.get('.aheart-time-picker__input')

    expect(wrapper.findAll('[role="option"]').every((option) => option.attributes('tabindex') === '-1')).toBe(true)
    expect(wrapper.get('.aheart-time-picker__column.is-keyboard-active').attributes('aria-label')).toBe('时')
    await input.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.get('.aheart-time-picker__column.is-keyboard-active').attributes('aria-label')).toBe('分')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toContain('minute-31')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['09:31'])
  })

  it('uses unique popup and option ids across picker instances', () => {
    const Host = defineComponent({
      components: { TimePicker },
      template: '<div><TimePicker default-open /><TimePicker default-open /></div>'
    })
    const wrapper = mount(Host, { global: { stubs: { Teleport: true } } })
    const [firstInput, secondInput] = wrapper.findAll('.aheart-time-picker__input')
    const [firstPanel, secondPanel] = wrapper.findAll('.aheart-time-picker__panel')

    expect(firstInput.attributes('aria-controls')).toBe(firstPanel.attributes('id'))
    expect(firstPanel.attributes('id')).not.toBe(secondPanel.attributes('id'))
    expect(firstInput.attributes('aria-activedescendant')).not.toBe(secondInput.attributes('aria-activedescendant'))
  })

  it('disables a 12-hour period that would create a disabled time', () => {
    const wrapper = mountPicker({
      props: {
        defaultValue: '02:30 AM',
        defaultOpen: true,
        format: 'hh:mm A',
        use12Hours: true,
        needConfirm: true,
        disabledTime: { disabledHours: () => [14] }
      }
    })

    expect(wrapper.get('[data-period="PM"]').attributes('disabled')).toBeDefined()
  })

  it('opens from keyboard, closes on Escape, and applies floating placement', async () => {
    const wrapper = mountPicker({
      attachTo: document.body,
      props: { placement: 'topRight' }
    })
    const input = wrapper.get('.aheart-time-picker__input')
    input.element.focus()

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.get('.aheart-time-picker__panel').classes()).toContain('aheart-floating--topRight')

    await input.trigger('keydown', { key: 'Escape' })
    expect(wrapper.get('.aheart-time-picker__input').element).toBe(document.activeElement)
    wrapper.unmount()
  })

  it('scrolls each selected time column option into view after opening', async () => {
    const scrollIntoView = vi.fn()
    const original = HTMLElement.prototype.scrollIntoView
    HTMLElement.prototype.scrollIntoView = scrollIntoView

    const wrapper = mountPicker({ props: { defaultValue: '09:30:20', format: 'HH:mm:ss' } })
    await wrapper.get('.aheart-time-picker__input').trigger('focus')
    await nextTick()

    expect(scrollIntoView).toHaveBeenCalledTimes(3)
    wrapper.unmount()
    HTMLElement.prototype.scrollIntoView = original
  })

  it('separates display format from the emitted value format', async () => {
    const wrapper = mountPicker({
      props: { modelValue: '14:30:00', valueFormat: 'HH:mm:ss', format: 'hh:mm A', use12Hours: true, needConfirm: true, defaultOpen: true }
    })
    expect(wrapper.get('.aheart-time-picker__input').element.value).toBe('02:30 下午')
    await wrapper.get('[data-hour="3"]').trigger('click')
    await wrapper.get('[data-minute="15"]').trigger('click')
    await wrapper.get('[data-period="PM"]').trigger('click')
    await wrapper.get('.aheart-time-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['15:15:00'])
  })

  it('hides disabled options and renders appearance and footer extensions', () => {
    const wrapper = mountPicker({
      slots: { prefix: '<span data-prefix>时区</span>', footer: '<span data-footer>业务时区</span>' },
      props: {
        defaultOpen: true,
        hideDisabledOptions: true,
        disabledTime: { disabledHours: () => [10] },
        size: 'large',
        status: 'warning',
        variant: 'filled'
      }
    })
    expect(wrapper.find('[data-hour="10"]').exists()).toBe(false)
    expect(wrapper.classes()).toContain('aheart-time-picker--large')
    expect(wrapper.classes()).toContain('aheart-time-picker--warning')
    expect(wrapper.classes()).toContain('aheart-time-picker--filled')
    expect(wrapper.find('[data-prefix]').exists()).toBe(true)
    expect(wrapper.find('[data-footer]').exists()).toBe(true)
  })

  it('commits the centered option on scroll only when enabled', async () => {
    const wrapper = mountPicker({ props: { defaultValue: '09:30:00', defaultOpen: true, changeOnScroll: true } })
    const minuteColumn = wrapper.get('[data-time-column="minute"]')
    Object.defineProperty(minuteColumn.element, 'scrollTop', { value: 10 * 28, configurable: true })
    await minuteColumn.trigger('scroll')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['09:10:00'])
  })
})
