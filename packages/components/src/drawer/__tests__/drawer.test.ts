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
