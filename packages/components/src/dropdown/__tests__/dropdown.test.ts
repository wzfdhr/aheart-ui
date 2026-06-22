import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Dropdown from '../dropdown.vue'

const menu = {
  items: [
    { key: 'edit', label: 'Edit' },
    { key: 'archive', label: 'Archive' }
  ]
}

describe('Dropdown', () => {
  it('renders trigger slot and opens on click', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, trigger: ['click'] },
      slots: { default: '<button>Actions</button>' }
    })

    expect(wrapper.text()).toContain('Actions')
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true, { source: 'trigger' }])
  })

  it('uses hover as the default trigger', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true, { source: 'trigger' }])
  })

  it('opens on hover when trigger includes hover', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, trigger: ['hover'] },
      slots: { default: '<button>More</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
  })

  it('supports controlled open state', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, open: false, trigger: ['click'] },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('opens from contextMenu trigger and prevents the native menu', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, trigger: ['contextMenu'] },
      slots: { default: '<button>Actions</button>' }
    })

    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
    wrapper.find('.aheart-dropdown__trigger').element.dispatchEvent(event)
    await wrapper.vm.$nextTick()

    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true, { source: 'trigger' }])
  })

  it('emits menu click and closes after item click', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, defaultOpen: true },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('[data-menu-key="edit"]').trigger('click')

    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ key: 'edit' })
    expect(wrapper.find('.aheart-dropdown__overlay').attributes('style')).toContain('display: none')
  })

  it('applies root semantic and overlay class and style hooks', () => {
    const wrapper = mount(Dropdown, {
      props: {
        open: true,
        menu,
        arrow: { pointAtCenter: true },
        className: 'dropdown-class',
        rootClassName: 'dropdown-root',
        style: 'color: red;',
        overlayClassName: 'overlay-class',
        overlayStyle: { minWidth: '220px' },
        classNames: {
          root: 'semantic-root',
          trigger: 'semantic-trigger',
          popup: 'semantic-popup',
          menu: 'semantic-menu',
          arrow: 'semantic-arrow'
        },
        styles: {
          root: { backgroundColor: 'blue' },
          trigger: { outlineColor: 'red' },
          popup: { maxWidth: '260px' },
          menu: { padding: '4px' },
          arrow: { backgroundColor: 'yellow' }
        }
      },
      slots: { default: '<button>Actions</button>' }
    })

    const root = wrapper.find('.aheart-dropdown')
    expect(root.classes()).toEqual(
      expect.arrayContaining(['dropdown-class', 'dropdown-root', 'semantic-root'])
    )
    expect(root.attributes('style')).toContain('color: red')
    expect(root.attributes('style')).toContain('background-color: blue')

    const trigger = wrapper.find('.aheart-dropdown__trigger')
    expect(trigger.classes()).toContain('semantic-trigger')
    expect(trigger.attributes('style')).toContain('outline-color: red')

    const overlay = wrapper.find('.aheart-dropdown__overlay')
    expect(overlay.classes()).toEqual(
      expect.arrayContaining(['aheart-dropdown__overlay--bottomLeft', 'overlay-class', 'semantic-popup'])
    )
    expect(overlay.attributes('style')).toContain('min-width: 220px')
    expect(overlay.attributes('style')).toContain('max-width: 260px')

    const menuNode = wrapper.find('.aheart-dropdown__menu')
    expect(menuNode.classes()).toContain('semantic-menu')
    expect(menuNode.attributes('style')).toContain('padding: 4px')

    const arrow = wrapper.find('.aheart-dropdown__arrow')
    expect(arrow.classes()).toEqual(
      expect.arrayContaining(['semantic-arrow', 'aheart-dropdown__arrow--point-at-center'])
    )
    expect(arrow.attributes('style')).toContain('background-color: yellow')
  })

  it('preserves or destroys hidden overlay according to destroy props', async () => {
    const preserved = mount(Dropdown, {
      props: { menu, trigger: ['click'] },
      slots: { default: '<button>Actions</button>' }
    })

    await preserved.find('.aheart-dropdown__trigger').trigger('click')
    expect(preserved.find('.aheart-dropdown__overlay').exists()).toBe(true)

    await preserved.find('.aheart-dropdown__trigger').trigger('click')
    const preservedOverlay = preserved.find('.aheart-dropdown__overlay')
    expect(preservedOverlay.exists()).toBe(true)
    expect(preservedOverlay.attributes('style')).toContain('display: none')

    const destroyOnHidden = mount(Dropdown, {
      props: { menu, trigger: ['click'], destroyOnHidden: true },
      slots: { default: '<button>Actions</button>' }
    })

    await destroyOnHidden.find('.aheart-dropdown__trigger').trigger('click')
    expect(destroyOnHidden.find('.aheart-dropdown__overlay').exists()).toBe(true)

    await destroyOnHidden.find('.aheart-dropdown__trigger').trigger('click')
    expect(destroyOnHidden.find('.aheart-dropdown__overlay').exists()).toBe(false)

    const destroyPopupOnHide = mount(Dropdown, {
      props: { menu, trigger: ['click'], destroyPopupOnHide: true },
      slots: { default: '<button>Actions</button>' }
    })

    await destroyPopupOnHide.find('.aheart-dropdown__trigger').trigger('click')
    expect(destroyPopupOnHide.find('.aheart-dropdown__overlay').exists()).toBe(true)

    await destroyPopupOnHide.find('.aheart-dropdown__trigger').trigger('click')
    expect(destroyPopupOnHide.find('.aheart-dropdown__overlay').exists()).toBe(false)
  })

  it('menu click closes by default without openChange close event', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, defaultOpen: true },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('[data-menu-key="edit"]').trigger('click')

    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ key: 'edit' })
    expect(wrapper.find('.aheart-dropdown__overlay').attributes('style')).toContain('display: none')
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('can keep dropdown open after menu click', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu: { ...menu, closeOnClick: false }, defaultOpen: true },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('[data-menu-key="edit"]').trigger('click')

    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ key: 'edit' })
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('customizes popup content with slot and popupRender', () => {
    const slotWrapper = mount(Dropdown, {
      props: { open: true, menu },
      slots: {
        default: '<button>Actions</button>',
        popup: '<div class="slot-popup">Slot popup</div>'
      }
    })

    expect(slotWrapper.find('.slot-popup').exists()).toBe(true)
    expect(slotWrapper.text()).toContain('Slot popup')

    const renderWrapper = mount(Dropdown, {
      props: {
        open: true,
        menu,
        popupRender: () => h('div', { class: 'custom-popup' }, ['Wrapped'])
      },
      slots: { default: '<button>Actions</button>' }
    })

    expect(renderWrapper.find('.custom-popup').exists()).toBe(true)
    expect(renderWrapper.text()).toContain('Wrapped')
  })

  it('uses ConfigProvider disabled fallback', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Dropdown, { menu }, () => h('button', 'Actions'))
          }
        }
      }
    })

    const dropdown = wrapper.findComponent(Dropdown)
    await dropdown.find('.aheart-dropdown__trigger').trigger('click')

    expect(dropdown.classes()).toContain('is-disabled')
    expect(dropdown.find('.aheart-dropdown__overlay').exists()).toBe(false)
  })
})
