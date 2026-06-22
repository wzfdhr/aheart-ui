import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Alert from '../alert.vue'

describe('Alert', () => {
  it('renders role alert with type class and content', () => {
    const wrapper = mount(Alert, {
      props: {
        type: 'success',
        message: 'Saved',
        description: 'The record has been saved.',
        showIcon: true
      }
    })

    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.classes()).toContain('aheart-alert--success')
    expect(wrapper.find('.aheart-alert__icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('The record has been saved.')
  })

  it('emits close when closable close button is clicked', async () => {
    const wrapper = mount(Alert, {
      props: {
        closable: true,
        message: 'Closable'
      }
    })

    await wrapper.find('.aheart-alert__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
