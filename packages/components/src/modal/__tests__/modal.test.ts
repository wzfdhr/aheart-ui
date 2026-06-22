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

  it('renders a loading skeleton in the body and hides default content', () => {
    const wrapper = mount(Modal, {
      props: { open: true, loading: true },
      slots: { default: 'Loaded content' }
    })

    expect(wrapper.find('.aheart-skeleton').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Loaded content')
  })

  it('passes okButtonProps and cancelButtonProps to default footer buttons', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        okText: 'Save',
        cancelText: 'Back',
        okButtonProps: { danger: true, disabled: true },
        cancelButtonProps: { type: 'dashed', disabled: true }
      }
    })

    const ok = wrapper.find('.aheart-modal__ok')
    const cancel = wrapper.find('.aheart-modal__cancel')

    expect(ok.classes()).toContain('is-danger')
    expect(ok.attributes()).toHaveProperty('disabled')
    expect(cancel.classes()).toContain('aheart-button--dashed')
    expect(cancel.attributes()).toHaveProperty('disabled')
  })

  it('applies root dialog semantic classes styles and z-index', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        title: 'Styled modal',
        rootClassName: 'custom-root',
        className: 'custom-dialog',
        zIndex: 1410,
        rootStyle: { color: 'rgb(1, 2, 3)' },
        style: { backgroundColor: 'rgb(4, 5, 6)' },
        classNames: {
          mask: 'custom-mask',
          wrap: 'custom-wrap',
          dialog: 'custom-section',
          body: 'custom-body',
          footer: 'custom-footer'
        },
        styles: {
          mask: { opacity: '0.7' },
          body: { padding: '24px' },
          footer: { justifyContent: 'flex-start' }
        }
      },
      slots: { default: 'Styled body' }
    })

    expect(wrapper.find('.aheart-modal').classes()).toContain('custom-root')
    expect(wrapper.find('.aheart-modal').attributes('style')).toContain('z-index: 1410')
    expect(wrapper.find('.aheart-modal').attributes('style')).toContain('color: rgb(1, 2, 3)')
    expect(wrapper.find('.aheart-modal__wrap').classes()).toContain('custom-wrap')
    expect(wrapper.find('.aheart-modal__dialog').classes()).toEqual(
      expect.arrayContaining(['custom-dialog', 'custom-section'])
    )
    expect(wrapper.find('.aheart-modal__dialog').attributes('style')).toContain('background-color: rgb(4, 5, 6)')
    expect(wrapper.find('.aheart-modal__mask').classes()).toContain('custom-mask')
    expect(wrapper.find('.aheart-modal__mask').attributes('style')).toContain('opacity: 0.7')
    expect(wrapper.find('.aheart-modal__body').classes()).toContain('custom-body')
    expect(wrapper.find('.aheart-modal__body').attributes('style')).toContain('padding: 24px')
    expect(wrapper.find('.aheart-modal__footer').classes()).toContain('custom-footer')
    expect(wrapper.find('.aheart-modal__footer').attributes('style')).toContain('justify-content: flex-start')
  })

  it('supports afterOpenChange forceRender and destroyOnHidden', async () => {
    const persistent = mount(Modal, {
      props: { open: false, forceRender: true, title: 'Pre-rendered' }
    })

    expect(persistent.find('.aheart-modal').exists()).toBe(true)
    expect(persistent.find('.aheart-modal').isVisible()).toBe(false)

    await persistent.setProps({ open: true })
    expect(persistent.emitted('afterOpenChange')?.[0]).toEqual([true])

    await persistent.setProps({ open: false })
    expect(persistent.emitted('afterOpenChange')?.[1]).toEqual([false])
    expect(persistent.find('.aheart-modal').exists()).toBe(true)

    const destroyable = mount(Modal, {
      props: { open: true, destroyOnHidden: true, title: 'Destroyable' }
    })

    await destroyable.setProps({ open: false })

    expect(destroyable.emitted('afterOpenChange')?.[0]).toEqual([false])
    expect(destroyable.find('.aheart-modal').exists()).toBe(false)
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
