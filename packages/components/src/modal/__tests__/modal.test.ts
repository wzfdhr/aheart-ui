import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Modal from '../modal.vue'

describe('Modal', () => {
  it('renders title content footer centered state and width when open', () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: 'Edit profile', centered: true, width: 480 },
      slots: { default: 'Profile form' }
    })

    expect(wrapper.find('.aheart-modal').exists()).toBe(true)
    expect(wrapper.find('.aheart-modal__dialog').classes()).toContain('is-centered')
    expect(wrapper.find('.aheart-modal__dialog').attributes('style')).toContain('width: 480px')
    expect(wrapper.text()).toContain('Edit profile')
    expect(wrapper.text()).toContain('Profile form')
    expect(wrapper.text()).toContain('OK')
    expect(wrapper.text()).toContain('Cancel')
  })

  it('emits ok cancel close and update events from footer buttons', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, okText: 'Save', cancelText: 'Back' }
    })

    await wrapper.find('.aheart-modal__ok').trigger('click')
    expect(wrapper.emitted('ok')).toHaveLength(1)

    await wrapper.find('.aheart-modal__cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('closes from the mask only when maskClosable is true', async () => {
    const closable = mount(Modal, { props: { open: true } })
    await closable.find('.aheart-modal__mask').trigger('click')
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mount(Modal, { props: { open: true, maskClosable: false } })
    await locked.find('.aheart-modal__mask').trigger('click')
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('closes from Escape only when keyboard is true', async () => {
    const closable = mount(Modal, { props: { open: true } })
    await closable.find('.aheart-modal').trigger('keydown', { key: 'Escape' })
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mount(Modal, { props: { open: true, keyboard: false } })
    await locked.find('.aheart-modal').trigger('keydown', { key: 'Escape' })
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('does not render overlay nodes when closed', () => {
    const wrapper = mount(Modal, { props: { open: false, title: 'Hidden' } })

    expect(wrapper.find('.aheart-modal').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Hidden')
  })
})
