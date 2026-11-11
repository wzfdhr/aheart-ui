import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Combobox from '../combobox.vue'

const options = [
  { value: 1, label: 'First' },
  { value: 2, label: 'Second' }
]

describe('Combobox', () => {
  it('returns to the controlled value if the owner does not accept a selection', async () => {
    const wrapper = mount(Combobox, { props: { options, modelValue: 1 } })
    try {
      const input = wrapper.get('input')
      await input.setValue('second')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await input.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
      expect(input.element.value).toBe('First')
      expect(input.attributes('aria-expanded')).toBe('false')
      await wrapper.setProps({ modelValue: 2 })
      expect(input.element.value).toBe('Second')
    } finally {
      wrapper.unmount()
    }
  })

  it('leaves modified navigation keys to the text input', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    try {
      const input = wrapper.get('input')
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, cancelable: true, bubbles: true })
      input.element.dispatchEvent(event)
      await wrapper.vm.$nextTick()
      expect(event.defaultPrevented).toBe(false)
      expect(input.attributes('aria-expanded')).toBe('false')
    } finally {
      wrapper.unmount()
    }
  })

  it('renders into the custom container and removes it from the dismiss stack on unmount', async () => {
    const container = document.createElement('div')
    document.body.append(container)
    const wrapper = mount(Combobox, {
      attachTo: document.body,
      props: { options, getPopupContainer: () => container }
    })
    try {
      await wrapper.get('input').trigger('click')
      expect(container.querySelector('[role="listbox"]')).not.toBeNull()
    } finally {
      wrapper.unmount()
      container.remove()
    }

    const escape = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
    document.dispatchEvent(escape)
    expect(escape.defaultPrevented).toBe(false)
  })
})
