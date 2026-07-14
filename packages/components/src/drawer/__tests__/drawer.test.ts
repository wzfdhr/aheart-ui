import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Drawer from '../drawer.vue'

const mountDrawer = (options: Record<string, any> = {}) =>
  mount(Drawer, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ...options.global?.stubs,
        Teleport: true
      }
    }
  })

describe('Drawer', () => {
  it('renders title content extra placement and width when open', () => {
    const wrapper = mountDrawer({
      props: { open: true, title: 'Filters', placement: 'left', width: 320 },
      slots: {
        default: 'Filter form',
        extra: '<button class="extra-action">Reset</button>'
      }
    })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(true)
    expect(wrapper.find('.aheart-drawer__panel').classes()).toContain('aheart-drawer__panel--left')
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('width: 320px')
    expect(wrapper.text()).toContain('Filters')
    expect(wrapper.text()).toContain('Filter form')
    expect(wrapper.find('.extra-action').text()).toBe('Reset')
  })

  it('uses height for top and bottom placements', () => {
    const wrapper = mountDrawer({
      props: { open: true, placement: 'bottom', height: '42vh' }
    })

    expect(wrapper.find('.aheart-drawer__panel').classes()).toContain('aheart-drawer__panel--bottom')
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('height: 42vh')
  })

  it('resolves preset and custom size while preserving width and height overrides', () => {
    const large = mountDrawer({ props: { open: true, size: 'large' } })
    expect(large.find('.aheart-drawer__panel').attributes('style')).toContain('width: 736px')

    const customBottom = mountDrawer({ props: { open: true, placement: 'bottom', size: '48vh' } })
    expect(customBottom.find('.aheart-drawer__panel').attributes('style')).toContain('height: 48vh')

    const widthOverride = mountDrawer({ props: { open: true, size: 'large', width: 320 } })
    expect(widthOverride.find('.aheart-drawer__panel').attributes('style')).toContain('width: 320px')
  })

  it('renders a loading skeleton in the body and hides default content', () => {
    const wrapper = mountDrawer({
      props: { open: true, loading: true },
      slots: { default: 'Loaded content' }
    })

    expect(wrapper.find('.aheart-skeleton').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Loaded content')
  })

  it('renders extra prop when no extra slot is provided', () => {
    const wrapper = mountDrawer({
      props: { open: true, title: 'Members', extra: 'Refresh' }
    })

    expect(wrapper.find('.aheart-drawer__extra').text()).toBe('Refresh')
  })

  it('renders VNode title extra and footer props', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: h('span', { class: 'render-title' }, 'Render title'),
        extra: h('button', { class: 'render-extra' }, 'Render extra'),
        footer: h('div', { class: 'render-footer' }, 'Render footer')
      }
    })

    expect(wrapper.find('.render-title').text()).toBe('Render title')
    expect(wrapper.find('.render-extra').text()).toBe('Render extra')
    expect(wrapper.find('.render-footer').text()).toBe('Render footer')
  })

  it('renders drawerRender result around the panel node', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Rendered drawer',
        drawerRender: (node: unknown) => h('div', { class: 'drawer-render-shell' }, [node])
      },
      slots: {
        default: '<button class="wrapped-action">Wrapped action</button>'
      }
    })

    expect(wrapper.find('.drawer-render-shell').exists()).toBe(true)
    expect(wrapper.find('.drawer-render-shell .aheart-drawer__panel').exists()).toBe(true)
    expect(wrapper.find('.drawer-render-shell .wrapped-action').text()).toBe('Wrapped action')
    expect(wrapper.find('.drawer-render-shell .aheart-drawer__mask').exists()).toBe(false)
  })

  it('preserves close interactions inside drawerRender', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Rendered close',
        drawerRender: (node: unknown) => h('div', { class: 'drawer-render-shell' }, [node])
      }
    })

    await wrapper.find('.drawer-render-shell .aheart-drawer__close').trigger('click')

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('lets title extra and footer slots override renderable props', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: h('span', { class: 'prop-title' }, 'Prop title'),
        extra: h('span', { class: 'prop-extra' }, 'Prop extra'),
        footer: h('span', { class: 'prop-footer' }, 'Prop footer')
      },
      slots: {
        title: '<span class="slot-title">Slot title</span>',
        extra: '<span class="slot-extra">Slot extra</span>',
        footer: '<span class="slot-footer">Slot footer</span>'
      }
    })

    expect(wrapper.find('.slot-title').text()).toBe('Slot title')
    expect(wrapper.find('.slot-extra').text()).toBe('Slot extra')
    expect(wrapper.find('.slot-footer').text()).toBe('Slot footer')
    expect(wrapper.find('.prop-title').exists()).toBe(false)
    expect(wrapper.find('.prop-extra').exists()).toBe(false)
    expect(wrapper.find('.prop-footer').exists()).toBe(false)
  })

  it('renders numeric zero title extra and footer props', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 0,
        extra: 0,
        footer: 0
      }
    })

    expect(wrapper.find('.aheart-drawer__title').text()).toBe('0')
    expect(wrapper.find('.aheart-drawer__extra').text()).toBe('0')
    expect(wrapper.find('.aheart-drawer__footer').text()).toBe('0')
  })

  it('hides footer slot when footer is null', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        footer: null
      },
      slots: {
        footer: '<span class="hidden-footer">Hidden footer</span>'
      }
    })

    expect(wrapper.find('.aheart-drawer__footer').exists()).toBe(false)
    expect(wrapper.find('.hidden-footer').exists()).toBe(false)
  })

  it('applies root panel semantic classes styles and z-index', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Styled drawer',
        footer: true,
        rootClassName: 'custom-root',
        className: 'custom-panel',
        zIndex: 1420,
        rootStyle: { color: 'rgb(1, 2, 3)' },
        style: { backgroundColor: 'rgb(4, 5, 6)' },
        classNames: {
          mask: 'custom-mask',
          section: 'custom-section',
          body: 'custom-body',
          footer: 'custom-footer'
        },
        styles: {
          mask: { opacity: '0.7' },
          body: { padding: '24px' },
          footer: { justifyContent: 'flex-start' }
        }
      },
      slots: {
        default: 'Styled body',
        footer: 'Styled footer'
      }
    })

    expect(wrapper.find('.aheart-drawer').classes()).toContain('custom-root')
    expect(wrapper.find('.aheart-drawer').attributes('style')).toContain('z-index: 1420')
    expect(wrapper.find('.aheart-drawer').attributes('style')).toContain('color: rgb(1, 2, 3)')
    expect(wrapper.find('.aheart-drawer__panel').classes()).toEqual(
      expect.arrayContaining(['custom-panel', 'custom-section'])
    )
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('background-color: rgb(4, 5, 6)')
    expect(wrapper.find('.aheart-drawer__mask').classes()).toContain('custom-mask')
    expect(wrapper.find('.aheart-drawer__mask').attributes('style')).toContain('opacity: 0.7')
    expect(wrapper.find('.aheart-drawer__body').classes()).toContain('custom-body')
    expect(wrapper.find('.aheart-drawer__body').attributes('style')).toContain('padding: 24px')
    expect(wrapper.find('.aheart-drawer__footer').classes()).toContain('custom-footer')
    expect(wrapper.find('.aheart-drawer__footer').attributes('style')).toContain('justify-content: flex-start')
  })

  it('resolves semantic class and style functions with drawer props', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Function drawer',
        placement: 'left',
        classNames: ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
          root: props.placement === 'left' ? 'semantic-left-root' : 'semantic-other-root',
          body: props.open ? 'semantic-open-body' : 'semantic-closed-body'
        }),
        styles: ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
          root: props.placement === 'left' ? { color: 'rgb(9, 8, 7)' } : { color: 'rgb(1, 1, 1)' },
          body: props.open ? { padding: '32px' } : { padding: '4px' }
        })
      },
      slots: {
        default: 'Function styled body'
      }
    })

    expect(wrapper.find('.aheart-drawer').classes()).toContain('semantic-left-root')
    expect(wrapper.find('.aheart-drawer').attributes('style')).toContain('color: rgb(9, 8, 7)')
    expect(wrapper.find('.aheart-drawer__body').classes()).toContain('semantic-open-body')
    expect(wrapper.find('.aheart-drawer__body').attributes('style')).toContain('padding: 32px')
  })

  it('applies deprecated Ant style aliases to drawer elements', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Alias styled drawer',
        footer: true,
        width: 320,
        maskStyle: { opacity: '0.3' },
        headerStyle: { padding: '12px' },
        bodyStyle: { backgroundColor: 'rgb(10, 11, 12)' },
        footerStyle: { justifyContent: 'flex-start' },
        drawerStyle: { borderInlineStart: '2px solid rgb(1, 2, 3)' },
        contentWrapperStyle: { maxWidth: '80vw' }
      },
      slots: {
        default: 'Alias body',
        footer: 'Alias footer'
      }
    })

    expect(wrapper.find('.aheart-drawer__mask').attributes('style')).toContain('opacity: 0.3')
    expect(wrapper.find('.aheart-drawer__header').attributes('style')).toContain('padding: 12px')
    expect(wrapper.find('.aheart-drawer__body').attributes('style')).toContain('background-color: rgb(10, 11, 12)')
    expect(wrapper.find('.aheart-drawer__footer').attributes('style')).toContain('justify-content: flex-start')
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain(
      'border-inline-start: 2px solid rgb(1, 2, 3)'
    )
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('max-width: 80vw')
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('width: 320px')
  })

  it('lets semantic styles override deprecated style aliases', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Override styled drawer',
        footer: true,
        maskStyle: { opacity: '0.2' },
        headerStyle: { padding: '4px' },
        bodyStyle: { padding: '4px' },
        footerStyle: { justifyContent: 'flex-start' },
        drawerStyle: { maxWidth: '70vw' },
        styles: {
          mask: { opacity: '0.8' },
          header: { padding: '16px' },
          body: { padding: '28px' },
          footer: { justifyContent: 'flex-end' },
          section: { maxWidth: '90vw' }
        }
      },
      slots: {
        default: 'Override body',
        footer: 'Override footer'
      }
    })

    expect(wrapper.find('.aheart-drawer__mask').attributes('style')).toContain('opacity: 0.8')
    expect(wrapper.find('.aheart-drawer__header').attributes('style')).toContain('padding: 16px')
    expect(wrapper.find('.aheart-drawer__body').attributes('style')).toContain('padding: 28px')
    expect(wrapper.find('.aheart-drawer__footer').attributes('style')).toContain('justify-content: flex-end')
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('max-width: 90vw')
  })

  it('pushes a parent drawer when a nested drawer opens', async () => {
    const wrapper = mountDrawer({
      props: { open: true, title: 'Parent drawer' },
      slots: {
        default: () =>
          h(Drawer, { open: true, title: 'Child drawer', getContainer: false }, { default: () => 'Child body' })
      }
    })

    await nextTick()

    const panels = wrapper.findAll('.aheart-drawer__panel')

    expect(panels[0].attributes('style')).toContain('transform: translateX(-180px)')
    expect(panels[1].attributes('style')).not.toContain('translateX(-180px)')
  })

  it('does not push a parent drawer when push is false', async () => {
    const wrapper = mountDrawer({
      props: { open: true, title: 'Static parent', push: false },
      slots: {
        default: () =>
          h(Drawer, { open: true, title: 'Child drawer', getContainer: false }, { default: () => 'Child body' })
      }
    })

    await nextTick()

    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).not.toContain('transform:')
  })

  it('uses push distance with parent placement direction', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Left parent',
        placement: 'left',
        push: { distance: 96 }
      },
      slots: {
        default: () =>
          h(Drawer, { open: true, title: 'Child drawer', getContainer: false }, { default: () => 'Child body' })
      }
    })

    await nextTick()

    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('transform: translateX(96px)')
  })

  it('preserves custom panel transforms before the push transform', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Transformed parent',
        style: { transform: 'scale(0.98)' },
        push: { distance: '12vw' }
      },
      slots: {
        default: () =>
          h(Drawer, { open: true, title: 'Child drawer', getContainer: false }, { default: () => 'Child body' })
      }
    })

    await nextTick()

    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain(
      'transform: scale(0.98) translateX(calc(0px - 12vw))'
    )
  })

  it('resizes a right drawer with callbacks and maxSize', async () => {
    const onResizeStart = vi.fn()
    const onResize = vi.fn()
    const onResizeEnd = vi.fn()
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Resizable drawer',
        width: 320,
        maxSize: 360,
        resizable: {
          onResizeStart,
          onResize,
          onResizeEnd
        },
        classNames: {
          dragger: 'custom-dragger'
        },
        styles: {
          dragger: { backgroundColor: 'rgb(1, 2, 3)' }
        }
      }
    })

    const dragger = wrapper.find('.aheart-drawer__dragger')

    expect(dragger.exists()).toBe(true)
    expect(dragger.classes()).toEqual(expect.arrayContaining(['aheart-drawer__dragger--right', 'custom-dragger']))
    expect(dragger.attributes('style')).toContain('background-color: rgb(1, 2, 3)')

    await dragger.trigger('pointerdown', { clientX: 100, clientY: 0 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 20, clientY: 0 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 20, clientY: 0 }))
    await nextTick()

    expect(onResizeStart).toHaveBeenCalledTimes(1)
    expect(onResize).toHaveBeenCalledWith(360)
    expect(onResizeEnd).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('width: 360px')
  })

  it('resizes a bottom drawer by dragging upward', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Bottom resizable drawer',
        placement: 'bottom',
        height: 200,
        resizable: true
      }
    })

    const dragger = wrapper.find('.aheart-drawer__dragger')

    await dragger.trigger('pointerdown', { clientX: 0, clientY: 100 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 0, clientY: 40 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 0, clientY: 40 }))
    await nextTick()

    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('height: 260px')
  })

  it('uses the shared drag shield and removes it when resize is cancelled or the drawer unmounts', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Shielded drawer',
        width: 320,
        resizable: true
      }
    })
    const dragger = wrapper.find('.aheart-drawer__dragger')

    await dragger.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 0 })
    expect(document.querySelector('[data-aheart-drag-shield]')).not.toBeNull()

    document.dispatchEvent(new Event('pointercancel'))
    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()

    await dragger.trigger('pointerdown', { button: 0, pointerId: 2, clientX: 100, clientY: 0 })
    expect(document.querySelector('[data-aheart-drag-shield]')).not.toBeNull()

    wrapper.unmount()
    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()
  })

  it('does not render a resize dragger when resizable is disabled', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Static drawer'
      }
    })

    expect(wrapper.find('.aheart-drawer__dragger').exists()).toBe(false)
  })

  it('supports afterOpenChange forceRender and destroyOnHidden', async () => {
    const persistent = mountDrawer({
      props: { open: false, forceRender: true, title: 'Pre-rendered' }
    })

    expect(persistent.find('.aheart-drawer').exists()).toBe(true)
    expect(persistent.find('.aheart-drawer').isVisible()).toBe(false)

    await persistent.setProps({ open: true })
    expect(persistent.emitted('afterOpenChange')?.[0]).toEqual([true])

    await persistent.setProps({ open: false })
    expect(persistent.emitted('afterOpenChange')?.[1]).toEqual([false])
    expect(persistent.find('.aheart-drawer').exists()).toBe(true)

    const destroyable = mountDrawer({
      props: { open: true, destroyOnHidden: true, title: 'Destroyable' }
    })

    await destroyable.setProps({ open: false })

    expect(destroyable.emitted('afterOpenChange')?.[0]).toEqual([false])
    expect(destroyable.find('.aheart-drawer').exists()).toBe(false)
  })

  it('treats destroyInactivePanel as a destroyOnHidden alias', async () => {
    const wrapper = mountDrawer({
      props: { open: true, destroyInactivePanel: true, title: 'Legacy destroy' },
      slots: {
        default: '<button class="legacy-destroy-control">Legacy control</button>'
      }
    })

    expect(wrapper.find('.legacy-destroy-control').exists()).toBe(true)

    await wrapper.setProps({ open: false })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(false)
    expect(wrapper.emitted('afterOpenChange')?.[0]).toEqual([false])
  })

  it('keeps forceRender ahead of destroyInactivePanel', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        forceRender: true,
        destroyInactivePanel: true,
        title: 'Forced legacy destroy'
      },
      slots: {
        default: '<button class="forced-legacy-control">Forced control</button>'
      }
    })

    await wrapper.setProps({ open: false })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(true)
    expect(wrapper.find('.forced-legacy-control').exists()).toBe(true)
  })

  it('restores focus to the trigger after close by default', async () => {
    const trigger = document.createElement('button')
    const outside = document.createElement('button')
    document.body.append(trigger, outside)
    trigger.focus()

    const wrapper = mountDrawer({
      attachTo: document.body,
      props: {
        open: false,
        title: 'Focusable drawer'
      }
    })

    await wrapper.setProps({ open: true })
    outside.focus()
    await wrapper.setProps({ open: false })
    await nextTick()

    expect(document.activeElement).toBe(trigger)

    wrapper.unmount()
    trigger.remove()
    outside.remove()
  })

  it('keeps focus in place when focus restoration is disabled', async () => {
    const trigger = document.createElement('button')
    const outside = document.createElement('button')
    document.body.append(trigger, outside)
    trigger.focus()

    const wrapper = mountDrawer({
      attachTo: document.body,
      props: {
        open: false,
        title: 'Focusable drawer',
        focusable: {
          focusTriggerAfterClose: false
        }
      }
    })

    await wrapper.setProps({ open: true })
    outside.focus()
    await wrapper.setProps({ open: false })
    await nextTick()

    expect(document.activeElement).toBe(outside)

    wrapper.unmount()
    trigger.remove()
    outside.remove()
  })

  it('traps tab focus inside masked drawers by default', async () => {
    const wrapper = mountDrawer({
    attachTo: document.body,
    props: {
      open: true,
      title: 'Trap drawer',
      closable: false
    },
      slots: {
        default: '<button class="first-control">First</button><button class="last-control">Last</button>'
      }
    })

    const first = wrapper.find('.first-control').element as HTMLElement
    const last = wrapper.find('.last-control').element as HTMLElement
    last.focus()

    await wrapper.find('.aheart-drawer').trigger('keydown', { key: 'Tab' })

    expect(document.activeElement).toBe(first)

    wrapper.unmount()
  })

  it('traps shift tab focus back to the last drawer control', async () => {
    const wrapper = mountDrawer({
    attachTo: document.body,
    props: {
      open: true,
      title: 'Reverse trap',
      closable: false
    },
      slots: {
        default: '<button class="first-control">First</button><button class="last-control">Last</button>'
      }
    })

    const first = wrapper.find('.first-control').element as HTMLElement
    const last = wrapper.find('.last-control').element as HTMLElement
    first.focus()

    await wrapper.find('.aheart-drawer').trigger('keydown', { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(last)

    wrapper.unmount()
  })

  it('lets focusable trap config override the mask default', async () => {
    const wrapper = mountDrawer({
    attachTo: document.body,
    props: {
      open: true,
      title: 'No trap',
      closable: false,
      focusable: {
        trap: false
      }
      },
      slots: {
        default: '<button class="first-control">First</button><button class="last-control">Last</button>'
      }
    })

    const last = wrapper.find('.last-control').element as HTMLElement
    last.focus()

    await wrapper.find('.aheart-drawer').trigger('keydown', { key: 'Tab' })

    expect(document.activeElement).toBe(last)

    wrapper.unmount()
  })

  it('can trap focus without a mask when focusable trap is true', async () => {
    const wrapper = mountDrawer({
      attachTo: document.body,
    props: {
      open: true,
      title: 'Forced trap',
      closable: false,
      mask: false,
      focusable: {
        trap: true
        }
      },
      slots: {
        default: '<button class="first-control">First</button><button class="last-control">Last</button>'
      }
    })

    const first = wrapper.find('.first-control').element as HTMLElement
    const last = wrapper.find('.last-control').element as HTMLElement
    last.focus()

    await wrapper.find('.aheart-drawer').trigger('keydown', { key: 'Tab' })

    expect(document.activeElement).toBe(first)

    wrapper.unmount()
  })

  it('emits close and update events from the close button', async () => {
    const wrapper = mountDrawer({ props: { open: true, title: 'Details' } })

    await wrapper.find('.aheart-drawer__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('renders a custom top-level closeIcon', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Custom close',
        closeIcon: h('span', { class: 'custom-close-icon' }, 'Close panel')
      }
    })

    expect(wrapper.find('.aheart-drawer__close').exists()).toBe(true)
    expect(wrapper.find('.custom-close-icon').text()).toBe('Close panel')
  })

  it('hides the close button when closeIcon is false', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Hidden close',
        closeIcon: false
      }
    })

    expect(wrapper.find('.aheart-drawer__close').exists()).toBe(false)
  })

  it('lets closable config override closeIcon and place the button at the end', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Config close',
        extra: 'Actions',
        closeIcon: h('span', { class: 'top-level-close-icon' }, 'Top close'),
        closable: {
          closeIcon: h('span', { class: 'config-close-icon' }, 'Config close'),
          placement: 'end'
        }
      }
    })

    const closeButton = wrapper.find('.aheart-drawer__close')
    expect(closeButton.exists()).toBe(true)
    expect(closeButton.classes()).toContain('is-end')
    expect(wrapper.find('.config-close-icon').text()).toBe('Config close')
    expect(wrapper.find('.top-level-close-icon').exists()).toBe(false)
    expect(wrapper.find('.aheart-drawer__header').element.lastElementChild).toBe(closeButton.element)
  })

  it('does not emit close events from a disabled closable config button', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Disabled close',
        closable: {
          disabled: true,
          closeIcon: h('span', { class: 'disabled-close-icon' }, 'Locked')
        }
      }
    })

    const closeButton = wrapper.find('.aheart-drawer__close')
    expect(closeButton.attributes('disabled')).toBeDefined()

    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('teleports to document body by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Drawer, {
      attachTo: host,
      props: { open: true, title: 'Body drawer' }
    })

    await nextTick()

    expect(document.body.querySelector('.aheart-drawer')).toBeTruthy()
    expect(host.querySelector('.aheart-drawer')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('renders inline when getContainer is false', () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Inline drawer', getContainer: false }
    })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(true)
    expect(wrapper.text()).toContain('Inline drawer')
  })

  it('teleports to a getContainer function target', async () => {
    const container = document.createElement('section')
    document.body.appendChild(container)

    const wrapper = mount(Drawer, {
      props: {
        open: true,
        title: 'Function container',
        getContainer: () => container
      }
    })

    await nextTick()

    expect(container.querySelector('.aheart-drawer')).toBeTruthy()
    expect(container.textContent).toContain('Function container')

    wrapper.unmount()
    container.remove()
  })

  it('teleports to a selector container target', async () => {
    const container = document.createElement('section')
    container.id = 'drawer-selector-root'
    document.body.appendChild(container)

    const wrapper = mount(Drawer, {
      props: {
        open: true,
        title: 'Selector container',
        getContainer: '#drawer-selector-root'
      }
    })

    await nextTick()

    expect(container.querySelector('.aheart-drawer')).toBeTruthy()
    expect(container.textContent).toContain('Selector container')

    wrapper.unmount()
    container.remove()
  })

  it('closes from the mask only when maskClosable is true', async () => {
    const closable = mountDrawer({ props: { open: true } })
    await closable.find('.aheart-drawer__mask').trigger('click')
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mountDrawer({ props: { open: true, maskClosable: false } })
    await locked.find('.aheart-drawer__mask').trigger('click')
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('supports mask config enabled and blur options', () => {
    const hidden = mountDrawer({
      props: {
        open: true,
        mask: { enabled: false }
      }
    })
    expect(hidden.find('.aheart-drawer__mask').exists()).toBe(false)

    const blurred = mountDrawer({
      props: {
        open: true,
        mask: { blur: true }
      }
    })
    expect(blurred.find('.aheart-drawer__mask').exists()).toBe(true)
    expect(blurred.find('.aheart-drawer__mask').classes()).toContain('is-blur')
  })

  it('lets mask config closable override maskClosable', async () => {
    const locked = mountDrawer({
      props: {
        open: true,
        mask: { closable: false }
      }
    })
    await locked.find('.aheart-drawer__mask').trigger('click')
    expect(locked.emitted('update:open')).toBeUndefined()

    const closable = mountDrawer({
      props: {
        open: true,
        maskClosable: false,
        mask: { closable: true }
      }
    })
    await closable.find('.aheart-drawer__mask').trigger('click')
    expect(closable.emitted('update:open')?.[0]).toEqual([false])
  })

  it('closes from Escape only when keyboard is true', async () => {
    const closable = mountDrawer({ props: { open: true } })
    await closable.find('.aheart-drawer').trigger('keydown', { key: 'Escape' })
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mountDrawer({ props: { open: true, keyboard: false } })
    await locked.find('.aheart-drawer').trigger('keydown', { key: 'Escape' })
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('does not render overlay nodes when closed', () => {
    const wrapper = mountDrawer({ props: { open: false, title: 'Hidden' } })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Hidden')
  })
})
