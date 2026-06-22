import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Drawer from '../drawer.vue'

describe('Drawer', () => {
  it('renders title content extra placement and width when open', () => {
    const wrapper = mount(Drawer, {
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
    const wrapper = mount(Drawer, {
      props: { open: true, placement: 'bottom', height: '42vh' }
    })

    expect(wrapper.find('.aheart-drawer__panel').classes()).toContain('aheart-drawer__panel--bottom')
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('height: 42vh')
  })

  it('resolves preset and custom size while preserving width and height overrides', () => {
    const large = mount(Drawer, { props: { open: true, size: 'large' } })
    expect(large.find('.aheart-drawer__panel').attributes('style')).toContain('width: 736px')

    const customBottom = mount(Drawer, { props: { open: true, placement: 'bottom', size: '48vh' } })
    expect(customBottom.find('.aheart-drawer__panel').attributes('style')).toContain('height: 48vh')

    const widthOverride = mount(Drawer, { props: { open: true, size: 'large', width: 320 } })
    expect(widthOverride.find('.aheart-drawer__panel').attributes('style')).toContain('width: 320px')
  })

  it('renders a loading skeleton in the body and hides default content', () => {
    const wrapper = mount(Drawer, {
      props: { open: true, loading: true },
      slots: { default: 'Loaded content' }
    })

    expect(wrapper.find('.aheart-skeleton').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Loaded content')
  })

  it('renders extra prop when no extra slot is provided', () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Members', extra: 'Refresh' }
    })

    expect(wrapper.find('.aheart-drawer__extra').text()).toBe('Refresh')
  })

  it('applies root panel semantic classes styles and z-index', () => {
    const wrapper = mount(Drawer, {
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

  it('supports afterOpenChange forceRender and destroyOnHidden', async () => {
    const persistent = mount(Drawer, {
      props: { open: false, forceRender: true, title: 'Pre-rendered' }
    })

    expect(persistent.find('.aheart-drawer').exists()).toBe(true)
    expect(persistent.find('.aheart-drawer').isVisible()).toBe(false)

    await persistent.setProps({ open: true })
    expect(persistent.emitted('afterOpenChange')?.[0]).toEqual([true])

    await persistent.setProps({ open: false })
    expect(persistent.emitted('afterOpenChange')?.[1]).toEqual([false])
    expect(persistent.find('.aheart-drawer').exists()).toBe(true)

    const destroyable = mount(Drawer, {
      props: { open: true, destroyOnHidden: true, title: 'Destroyable' }
    })

    await destroyable.setProps({ open: false })

    expect(destroyable.emitted('afterOpenChange')?.[0]).toEqual([false])
    expect(destroyable.find('.aheart-drawer').exists()).toBe(false)
  })

  it('emits close and update events from the close button', async () => {
    const wrapper = mount(Drawer, { props: { open: true, title: 'Details' } })

    await wrapper.find('.aheart-drawer__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('closes from the mask only when maskClosable is true', async () => {
    const closable = mount(Drawer, { props: { open: true } })
    await closable.find('.aheart-drawer__mask').trigger('click')
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mount(Drawer, { props: { open: true, maskClosable: false } })
    await locked.find('.aheart-drawer__mask').trigger('click')
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('closes from Escape only when keyboard is true', async () => {
    const closable = mount(Drawer, { props: { open: true } })
    await closable.find('.aheart-drawer').trigger('keydown', { key: 'Escape' })
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mount(Drawer, { props: { open: true, keyboard: false } })
    await locked.find('.aheart-drawer').trigger('keydown', { key: 'Escape' })
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('does not render overlay nodes when closed', () => {
    const wrapper = mount(Drawer, { props: { open: false, title: 'Hidden' } })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Hidden')
  })
})
