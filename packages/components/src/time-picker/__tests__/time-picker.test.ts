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
  it('uses one-minute steps by default and commits from hour and minute columns', async () => {
    const wrapper = mountPicker({ props: { defaultValue: '09:30', defaultOpen: true } })

    expect(wrapper.get('[data-minute="1"]').exists()).toBe(true)
    await wrapper.get('[data-hour="10"]').trigger('click')
    await wrapper.get('[data-minute="15"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['10:15'])
    expect(wrapper.find('input').element.value).toBe('10:15')
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

    const legacy = mountPicker({
      props: { defaultOpen: true, disabledTime: (value: string) => value === '10:15' }
    })
    await legacy.get('[data-hour="10"]').trigger('click')
    await legacy.get('[data-minute="15"]').trigger('click')
    expect(legacy.emitted('update:modelValue')).toBeUndefined()
  })

  it('rejects manually entered values covered by structured disabled rules', async () => {
    const wrapper = mountPicker({
      props: {
        modelValue: '09:30',
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
      props: { modelValue: '09:30', defaultOpen: true, needConfirm: true }
    })

    await wrapper.get('[data-hour="10"]').trigger('click')
    await wrapper.get('[data-minute="15"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('.aheart-time-picker__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:15'])
  })

  it('supports 12-hour display and period selection', () => {
    const wrapper = mountPicker({
      props: { defaultValue: '14:30 PM', defaultOpen: true, format: 'hh:mm A', use12Hours: true }
    })

    expect(wrapper.get('.aheart-time-picker__input').element.value).toBe('02:30 PM')
    expect(wrapper.findAll('[data-period]').map((item) => item.text())).toEqual(['AM', 'PM'])
  })

  it('clears values and keeps controlled value UI unchanged', async () => {
    const wrapper = mountPicker({ props: { modelValue: '09:30', allowClear: true } })

    await wrapper.get('.aheart-time-picker__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    expect(wrapper.get('.aheart-time-picker__input').element.value).toBe('09:30')
  })

  it('does not restore a default for an explicitly undefined controlled value', async () => {
    const wrapper = mountPicker({ props: { modelValue: undefined, defaultValue: '09:30' } })

    expect(wrapper.get('.aheart-time-picker__input').element.value).toBe('')
    await wrapper.get('.aheart-time-picker__input').trigger('focus')
    await wrapper.get('[data-hour="10"]').trigger('click')
    await wrapper.get('[data-minute="15"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['10:15'])
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
    }
  })

  it('uses a roving keyboard model without tabbing through every option', async () => {
    const wrapper = mountPicker({ props: { defaultValue: '09:30', defaultOpen: true, needConfirm: true } })
    const input = wrapper.get('.aheart-time-picker__input')

    expect(wrapper.findAll('[role="option"]').every((option) => option.attributes('tabindex') === '-1')).toBe(true)
    expect(wrapper.get('.aheart-time-picker__column.is-keyboard-active').attributes('aria-label')).toBe('Hour')
    await input.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.get('.aheart-time-picker__column.is-keyboard-active').attributes('aria-label')).toBe('Minute')
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
})
