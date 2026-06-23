import { mount } from '@vue/test-utils'
import { h } from 'vue'
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

  it('applies wrapClassName alongside semantic wrap class', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        wrapClassName: 'custom-wrap-name',
        classNames: {
          wrap: 'semantic-wrap'
        }
      }
    })

    expect(wrapper.find('.aheart-modal__wrap').classes()).toEqual(
      expect.arrayContaining(['custom-wrap-name', 'semantic-wrap'])
    )
  })

  it('renders modalRender result around the dialog node', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        title: 'Wrapped modal',
        modalRender: (node: unknown) => h('div', { class: 'modal-render-shell' }, [node])
      },
      slots: { default: 'Wrapped body' }
    })

    expect(wrapper.find('.modal-render-shell').exists()).toBe(true)
    expect(wrapper.find('.modal-render-shell .aheart-modal__dialog').exists()).toBe(true)
    expect(wrapper.text()).toContain('Wrapped modal')
    expect(wrapper.text()).toContain('Wrapped body')
  })

  it('preserves footer interactions inside modalRender', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        modalRender: (node: unknown) => h('div', { class: 'modal-render-shell' }, [node])
      }
    })

    await wrapper.find('.aheart-modal__ok').trigger('click')
    await wrapper.find('.aheart-modal__cancel').trigger('click')

    expect(wrapper.emitted('ok')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
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

  it('emits afterClose when open changes to false', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: 'Closable' }
    })

    await wrapper.setProps({ open: false })

    expect(wrapper.emitted('afterOpenChange')?.[0]).toEqual([false])
    expect(wrapper.emitted('afterClose')).toHaveLength(1)
  })

  it('does not emit afterClose when open changes to true', async () => {
    const wrapper = mount(Modal, {
      props: { open: false, forceRender: true, title: 'Opening' }
    })

    await wrapper.setProps({ open: true })

    expect(wrapper.emitted('afterOpenChange')?.[0]).toEqual([true])
    expect(wrapper.emitted('afterClose')).toBeUndefined()
  })

  it('emits afterClose when destroyOnHidden removes the modal', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, destroyOnHidden: true, title: 'Destroyable' }
    })

    await wrapper.setProps({ open: false })

    expect(wrapper.find('.aheart-modal').exists()).toBe(false)
    expect(wrapper.emitted('afterClose')).toHaveLength(1)
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

  it('renders custom closeIcon content and hides the close button when closeIcon is false', () => {
    const custom = mount(Modal, {
      props: {
        open: true,
        closeIcon: h('span', { class: 'custom-close-icon' }, 'Close')
      }
    })

    expect(custom.find('.custom-close-icon').text()).toBe('Close')

    const hidden = mount(Modal, {
      props: {
        open: true,
        closeIcon: false
      }
    })

    expect(hidden.find('.aheart-modal__close').exists()).toBe(false)
  })

  it('supports object closable closeIcon and disabled close button', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        closable: {
          closeIcon: h('span', { class: 'object-close-icon' }, 'Dismiss'),
          disabled: true
        }
      }
    })

    const close = wrapper.find('.aheart-modal__close')
    expect(wrapper.find('.object-close-icon').text()).toBe('Dismiss')
    expect(close.attributes()).toHaveProperty('disabled')

    await close.trigger('click')

    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('renders vnode title and action text props', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        title: h('span', { class: 'title-node' }, 'Rich title'),
        okText: h('span', { class: 'ok-node' }, 'Confirm'),
        cancelText: h('span', { class: 'cancel-node' }, 'Dismiss')
      }
    })

    expect(wrapper.find('.title-node').text()).toBe('Rich title')
    expect(wrapper.find('.ok-node').text()).toBe('Confirm')
    expect(wrapper.find('.cancel-node').text()).toBe('Dismiss')

    await wrapper.find('.aheart-modal__ok').trigger('click')
    await wrapper.find('.aheart-modal__cancel').trigger('click')

    expect(wrapper.emitted('ok')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('renders numeric zero title and action text props', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        title: 0,
        okText: 0,
        cancelText: 0
      }
    })

    expect(wrapper.find('.aheart-modal__title').text()).toBe('0')
    expect(wrapper.find('.aheart-modal__ok').text()).toBe('0')
    expect(wrapper.find('.aheart-modal__cancel').text()).toBe('0')
  })

  it('keeps title slot above renderable title prop', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        title: h('span', { class: 'title-prop' }, 'Prop title')
      },
      slots: {
        title: '<span class="title-slot">Slot title</span>'
      }
    })

    expect(wrapper.find('.title-slot').text()).toBe('Slot title')
    expect(wrapper.find('.title-prop').exists()).toBe(false)
  })

  it('renders footer prop content instead of default buttons', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        footer: h('div', { class: 'footer-node' }, 'Custom footer')
      }
    })

    expect(wrapper.find('.footer-node').text()).toBe('Custom footer')
    expect(wrapper.find('.aheart-modal__ok').exists()).toBe(false)
    expect(wrapper.find('.aheart-modal__cancel').exists()).toBe(false)
  })

  it('lets footer render function compose default action buttons', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        footer: (_originNode: unknown, { cancelButton, okButton }: { cancelButton: unknown; okButton: unknown }) =>
          h('div', { class: 'footer-render' }, [cancelButton, okButton])
      }
    })

    expect(wrapper.find('.footer-render').exists()).toBe(true)

    await wrapper.find('.aheart-modal__ok').trigger('click')
    await wrapper.find('.aheart-modal__cancel').trigger('click')

    expect(wrapper.emitted('ok')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('hides the default footer when footer is null', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        footer: null
      }
    })

    expect(wrapper.find('.aheart-modal__footer').exists()).toBe(false)
  })

  it('does not render overlay nodes when closed', () => {
    const wrapper = mount(Modal, { props: { open: false, title: 'Hidden' } })

    expect(wrapper.find('.aheart-modal').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Hidden')
  })
})
