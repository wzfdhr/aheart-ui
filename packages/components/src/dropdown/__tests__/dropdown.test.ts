import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Dropdown, { DropdownButton } from '../index'
import DropdownBase from '../dropdown.vue'

const menu = {
  items: [
    { key: 'edit', label: 'Edit' },
    { key: 'archive', label: 'Archive' }
  ]
}

const createRect = ({ left, top, width, height }: { left: number; top: number; width: number; height: number }) =>
  ({
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({})
  }) as DOMRect

const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height })
}

const mockDropdownRects = ({
  trigger,
  overlay
}: {
  trigger: DOMRect
  overlay: DOMRect
}) =>
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getDropdownRect() {
    const element = this as HTMLElement

    if (element.classList.contains('aheart-dropdown__trigger')) {
      return trigger
    }

    if (element.classList.contains('aheart-dropdown__overlay')) {
      return overlay
    }

    return createRect({ left: 0, top: 0, width: 0, height: 0 })
  })

const mountDropdown = (options: Record<string, any> = {}) =>
  mount(DropdownBase, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ...options.global?.stubs,
        Teleport: true
      }
    }
  })

const mountDropdownButton = (options: Record<string, any> = {}) =>
  mount(DropdownButton, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ...options.global?.stubs,
        Teleport: true
      }
    }
  })

describe('Dropdown', () => {
  it('exports the Dropdown.Button split button component', () => {
    expect((Dropdown as any).Button).toBe(DropdownButton)
  })

  it('renders Dropdown.Button as a split button and forwards dropdown overlay props', async () => {
    const wrapper = mountDropdownButton({
      props: {
        menu,
        trigger: ['click'],
        type: 'primary',
        overlayClassName: 'split-overlay',
        overlayStyle: { minWidth: '240px' },
        classNames: { popup: 'semantic-popup' },
        styles: { popup: { maxWidth: '280px' } }
      },
      slots: { default: 'Actions' }
    })

    expect(wrapper.find('.aheart-dropdown-button').exists()).toBe(true)
    expect(wrapper.find('.aheart-dropdown-button__main').text()).toContain('Actions')
    expect(wrapper.find('.aheart-dropdown-button__main').classes()).toContain('aheart-button--primary')
    expect(wrapper.find('.aheart-dropdown-button__toggle').exists()).toBe(true)

    await wrapper.find('.aheart-dropdown-button__main').trigger('click')
    expect(wrapper.emitted('click')?.[0]?.[0]).toBeInstanceOf(MouseEvent)

    await wrapper.find('.aheart-dropdown-button__toggle').trigger('click')

    const overlay = wrapper.find('.aheart-dropdown__overlay')
    expect(overlay.exists()).toBe(true)
    expect(overlay.classes()).toEqual(expect.arrayContaining(['split-overlay', 'semantic-popup']))
    expect(overlay.attributes('style')).toContain('min-width: 240px')
    expect(overlay.attributes('style')).toContain('max-width: 280px')
    expect(wrapper.text()).toContain('Edit')
  })

  it('keeps Dropdown.Button popup closed while loading disables the toggle', async () => {
    const wrapper = mountDropdownButton({
      props: {
        menu,
        trigger: ['click'],
        loading: true
      },
      slots: { default: 'Loading actions' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')

    expect(wrapper.find('.aheart-dropdown-button__main').classes()).toContain('is-loading')
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)
  })

  it('honors ConfigProvider disabled for Dropdown.Button', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: h(DropdownButton, { menu, trigger: ['click'] }, { default: () => 'Disabled actions' })
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')

    expect(wrapper.find('.aheart-dropdown-button__main').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)
  })

  it('lets Dropdown.Button buttonsRender transform the two button nodes', () => {
    let receivedButtonCount = 0
    const wrapper = mountDropdownButton({
      props: {
        menu,
        buttonsRender: (buttons: any[]) => {
          receivedButtonCount = buttons.length
          return [
            h('span', { class: 'rendered-toggle' }, [buttons[1]]),
            h('span', { class: 'rendered-main' }, [buttons[0]])
          ]
        }
      },
      slots: { default: 'Rendered actions' }
    })

    expect(receivedButtonCount).toBe(2)
    expect(wrapper.find('.rendered-toggle .aheart-dropdown-button__toggle').exists()).toBe(true)
    expect(wrapper.find('.rendered-main .aheart-dropdown-button__main').exists()).toBe(true)
  })

  it('renders trigger slot and opens on click', async () => {
    const wrapper = mountDropdown({
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
    const wrapper = mountDropdown({
      props: { menu, mouseEnterDelay: 0 },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true, { source: 'trigger' }])
  })

  it('opens on hover when trigger includes hover', async () => {
    const wrapper = mountDropdown({
      props: { menu, trigger: ['hover'], mouseEnterDelay: 0 },
      slots: { default: '<button>More</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
  })

  it('respects hover open and close delays', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountDropdown({
        props: {
          menu,
          mouseEnterDelay: 0.2,
          mouseLeaveDelay: 0.3
        },
        slots: { default: '<button>Actions</button>' }
      })

      await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')
      expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)

      await vi.advanceTimersByTimeAsync(199)
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)

      await vi.advanceTimersByTimeAsync(1)
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
      expect(wrapper.emitted('openChange')?.[0]).toEqual([true, { source: 'trigger' }])

      await wrapper.find('.aheart-dropdown__trigger').trigger('mouseleave', { relatedTarget: document.body })
      await vi.advanceTimersByTimeAsync(299)
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').attributes('style') ?? '').not.toContain('display: none')

      await vi.advanceTimersByTimeAsync(1)
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('is-leave')
      expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false, { source: 'trigger' }])

      await vi.advanceTimersByTimeAsync(121)
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').attributes('style')).toContain('display: none')
    } finally {
      vi.useRealTimers()
    }
  })

  it('cancels a delayed hover close when the pointer returns', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountDropdown({
        props: {
          menu,
          mouseEnterDelay: 0,
          mouseLeaveDelay: 0.3
        },
        slots: { default: '<button>Actions</button>' }
      })

      await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)

      await wrapper.find('.aheart-dropdown__trigger').trigger('mouseleave', { relatedTarget: document.body })
      await vi.advanceTimersByTimeAsync(150)
      await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(200)
      await nextTick()

      expect(wrapper.find('.aheart-dropdown__overlay').attributes('style') ?? '').not.toContain('display: none')
      expect(wrapper.emitted('openChange')).toEqual([[true, { source: 'trigger' }], [true, { source: 'trigger' }]])
    } finally {
      vi.useRealTimers()
    }
  })

  it('forwards hover delays through Dropdown.Button', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountDropdownButton({
        props: {
          menu,
          mouseEnterDelay: 0.2,
          mouseLeaveDelay: 0.2
        },
        slots: { default: 'Actions' }
      })

      await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')
      expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)

      await vi.advanceTimersByTimeAsync(200)
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)

      await wrapper.find('.aheart-dropdown__trigger').trigger('mouseleave', { relatedTarget: document.body })
      await vi.advanceTimersByTimeAsync(199)
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').attributes('style') ?? '').not.toContain('display: none')

      await vi.advanceTimersByTimeAsync(1)
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('is-leave')

      await vi.advanceTimersByTimeAsync(120)
      await nextTick()
      expect(wrapper.find('.aheart-dropdown__overlay').attributes('style')).toContain('display: none')
    } finally {
      vi.useRealTimers()
    }
  })

  it('supports controlled open state', async () => {
    const wrapper = mountDropdown({
      props: { menu, open: false, trigger: ['click'] },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('opens from contextMenu trigger and prevents the native menu', async () => {
    const wrapper = mountDropdown({
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

  it('auto adjusts bottom placement to top when the popup would overflow below', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockDropdownRects({
      trigger: createRect({ left: 120, top: 760, width: 96, height: 24 }),
      overlay: createRect({ left: 120, top: 784, width: 180, height: 140 })
    })

    try {
      const wrapper = mountDropdown({
        props: { menu, trigger: ['click'], placement: 'bottomLeft' },
        slots: { default: '<button>Actions</button>' }
      })

      await wrapper.find('.aheart-dropdown__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('aheart-dropdown__overlay--topLeft')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('keeps configured placement when overflow adjustment is disabled', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockDropdownRects({
      trigger: createRect({ left: 120, top: 760, width: 96, height: 24 }),
      overlay: createRect({ left: 120, top: 784, width: 180, height: 140 })
    })

    try {
      const wrapper = mountDropdown({
        props: { menu, trigger: ['click'], placement: 'bottomLeft', autoAdjustOverflow: false },
        slots: { default: '<button>Actions</button>' }
      })

      await wrapper.find('.aheart-dropdown__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('aheart-dropdown__overlay--bottomLeft')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('keeps side placement when it fits the viewport', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockDropdownRects({
      trigger: createRect({ left: 260, top: 180, width: 96, height: 24 }),
      overlay: createRect({ left: 80, top: 180, width: 160, height: 120 })
    })

    try {
      const wrapper = mountDropdown({
        props: { menu, trigger: ['click'], placement: 'leftTop' },
        slots: { default: '<button>Actions</button>' }
      })

      await wrapper.find('.aheart-dropdown__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('aheart-dropdown__overlay--leftTop')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('auto adjusts left placement to right when the popup would overflow left', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockDropdownRects({
      trigger: createRect({ left: 6, top: 180, width: 96, height: 24 }),
      overlay: createRect({ left: -174, top: 130, width: 160, height: 120 })
    })

    try {
      const wrapper = mountDropdown({
        props: { menu, trigger: ['click'], placement: 'left' },
        slots: { default: '<button>Actions</button>' }
      })

      await wrapper.find('.aheart-dropdown__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('aheart-dropdown__overlay--right')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('forwards overflow adjustment through Dropdown.Button', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockDropdownRects({
      trigger: createRect({ left: 120, top: 760, width: 96, height: 24 }),
      overlay: createRect({ left: 120, top: 784, width: 180, height: 140 })
    })

    try {
      const wrapper = mountDropdownButton({
        props: { menu, trigger: ['click'], placement: 'bottomRight' },
        slots: { default: 'Actions' }
      })

      await wrapper.find('.aheart-dropdown-button__toggle').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('aheart-dropdown__overlay--topRight')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('emits menu click and closes after item click', async () => {
    const wrapper = mountDropdown({
      props: { menu, defaultOpen: true },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('[data-menu-key="edit"]').trigger('click')

    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ key: 'edit' })
    expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('is-leave')
  })

  it('applies root semantic and overlay class and style hooks', () => {
    const wrapper = mountDropdown({
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

  it('resolves semantic class and style functions with dropdown state info', () => {
    const seenClassInfos: Array<{ open: boolean; placement: string }> = []
    const seenStyleInfos: Array<{ open: boolean; placement: string }> = []
    const wrapper = mountDropdown({
      props: {
        open: true,
        menu,
        placement: 'topRight',
        arrow: true,
        classNames: (info: { open: boolean; placement: string }) => {
          seenClassInfos.push(info)
          return {
            root: 'fn-root',
            trigger: 'fn-trigger',
            popup: 'fn-popup',
            menu: 'fn-menu',
            arrow: 'fn-arrow'
          }
        },
        styles: (info: { open: boolean; placement: string }) => {
          seenStyleInfos.push(info)
          return {
            root: { color: 'red' },
            trigger: { outlineColor: 'blue' },
            popup: { minWidth: '240px' },
            menu: { padding: '6px' },
            arrow: { backgroundColor: 'white' }
          }
        }
      },
      slots: { default: '<button>Actions</button>' }
    })

    expect(seenClassInfos[0]).toMatchObject({ open: true, placement: 'topRight' })
    expect(seenStyleInfos[0]).toMatchObject({ open: true, placement: 'topRight' })

    expect(wrapper.find('.aheart-dropdown').classes()).toContain('fn-root')
    expect(wrapper.find('.aheart-dropdown').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-dropdown__trigger').classes()).toContain('fn-trigger')
    expect(wrapper.find('.aheart-dropdown__trigger').attributes('style')).toContain('outline-color: blue')
    expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('fn-popup')
    expect(wrapper.find('.aheart-dropdown__overlay').attributes('style')).toContain('min-width: 240px')
    expect(wrapper.find('.aheart-dropdown__menu').classes()).toContain('fn-menu')
    expect(wrapper.find('.aheart-dropdown__menu').attributes('style')).toContain('padding: 6px')
    expect(wrapper.find('.aheart-dropdown__arrow').classes()).toContain('fn-arrow')
    expect(wrapper.find('.aheart-dropdown__arrow').attributes('style')).toContain('background-color: white')
  })

  it('forwards semantic class and style functions through Dropdown.Button', async () => {
    const wrapper = mountDropdownButton({
      props: {
        menu,
        trigger: ['click'],
        classNames: (info: { open: boolean }) => ({
          popup: info.open ? 'button-popup-open' : 'button-popup-closed'
        }),
        styles: () => ({
          popup: { maxWidth: '300px' }
        })
      },
      slots: { default: 'Actions' }
    })

    await wrapper.find('.aheart-dropdown-button__toggle').trigger('click')

    expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('button-popup-open')
    expect(wrapper.find('.aheart-dropdown__overlay').attributes('style')).toContain('max-width: 300px')
  })

  it('preserves or destroys hidden overlay according to destroy props', async () => {
    const preserved = mountDropdown({
      props: { menu, trigger: ['click'] },
      slots: { default: '<button>Actions</button>' }
    })

    await preserved.find('.aheart-dropdown__trigger').trigger('click')
    expect(preserved.find('.aheart-dropdown__overlay').exists()).toBe(true)

    vi.useFakeTimers()
    try {
      await preserved.find('.aheart-dropdown__trigger').trigger('click')
      const preservedOverlay = preserved.find('.aheart-dropdown__overlay')
      expect(preservedOverlay.exists()).toBe(true)
      expect(preservedOverlay.classes()).toContain('is-leave')

    } finally {
      vi.useRealTimers()
    }

    const destroyOnHidden = mountDropdown({
      props: { menu, trigger: ['click'], destroyOnHidden: true },
      slots: { default: '<button>Actions</button>' }
    })

    await destroyOnHidden.find('.aheart-dropdown__trigger').trigger('click')
    expect(destroyOnHidden.find('.aheart-dropdown__overlay').exists()).toBe(true)

    vi.useFakeTimers()
    try {
      await destroyOnHidden.find('.aheart-dropdown__trigger').trigger('click')
      expect(destroyOnHidden.find('.aheart-dropdown__overlay').exists()).toBe(true)

      await vi.advanceTimersByTimeAsync(121)
      expect(destroyOnHidden.find('.aheart-dropdown__overlay').exists()).toBe(false)
    } finally {
      vi.useRealTimers()
    }

    const destroyPopupOnHide = mountDropdown({
      props: { menu, trigger: ['click'], destroyPopupOnHide: true },
      slots: { default: '<button>Actions</button>' }
    })

    await destroyPopupOnHide.find('.aheart-dropdown__trigger').trigger('click')
    expect(destroyPopupOnHide.find('.aheart-dropdown__overlay').exists()).toBe(true)

    vi.useFakeTimers()
    try {
      await destroyPopupOnHide.find('.aheart-dropdown__trigger').trigger('click')
      expect(destroyPopupOnHide.find('.aheart-dropdown__overlay').exists()).toBe(true)

      await vi.advanceTimersByTimeAsync(121)
      expect(destroyPopupOnHide.find('.aheart-dropdown__overlay').exists()).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('menu click closes by default without openChange close event', async () => {
    const wrapper = mountDropdown({
      props: { menu, defaultOpen: true },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('[data-menu-key="edit"]').trigger('click')

    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ key: 'edit' })
    expect(wrapper.find('.aheart-dropdown__overlay').classes()).toContain('is-leave')
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('can keep dropdown open after menu click', async () => {
    const wrapper = mountDropdown({
      props: { menu: { ...menu, closeOnClick: false }, defaultOpen: true },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('[data-menu-key="edit"]').trigger('click')

    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ key: 'edit' })
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('customizes popup content with slot and popupRender', () => {
    const slotWrapper = mountDropdown({
      props: { open: true, menu },
      slots: {
        default: '<button>Actions</button>',
        popup: '<div class="slot-popup">Slot popup</div>'
      }
    })

    expect(slotWrapper.find('.slot-popup').exists()).toBe(true)
    expect(slotWrapper.text()).toContain('Slot popup')

    const renderWrapper = mountDropdown({
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

  it('teleports overlay to document body by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(DropdownBase, {
      attachTo: host,
      props: {
        open: true,
        menu
      },
      slots: {
        default: '<button>Actions</button>'
      }
    })

    await nextTick()

    expect(document.body.querySelector('.aheart-dropdown__overlay')).toBeTruthy()
    expect(host.querySelector('.aheart-dropdown__overlay')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('teleports overlay to getPopupContainer target', async () => {
    const container = document.createElement('section')
    let triggerNode: HTMLElement | undefined
    document.body.appendChild(container)

    const wrapper = mount(DropdownBase, {
      props: {
        open: true,
        menu,
        getPopupContainer: (node: HTMLElement) => {
          triggerNode = node
          return container
        }
      },
      slots: {
        default: '<button>Actions</button>'
      }
    })

    await nextTick()

    expect(triggerNode?.classList.contains('aheart-dropdown__trigger')).toBe(true)
    expect(container.querySelector('.aheart-dropdown__overlay')).toBeTruthy()
    expect(container.textContent).toContain('Edit')
    expect(container.textContent).toContain('Archive')

    wrapper.unmount()
    container.remove()
  })

  it('keeps hover dropdown open when moving from trigger to overlay', async () => {
    const container = document.createElement('section')
    document.body.appendChild(container)

    const wrapper = mount(Dropdown, {
      props: {
        menu,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        getPopupContainer: () => container
      },
      slots: {
        default: '<button>Actions</button>'
      }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')
    await nextTick()

    const overlay = container.querySelector('.aheart-dropdown__overlay') as HTMLElement
    expect(overlay).toBeTruthy()

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseleave', { relatedTarget: overlay })
    expect(container.querySelector('.aheart-dropdown__overlay')).toBeTruthy()

    overlay.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }))
    await nextTick()

    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false, { source: 'trigger' }])

    wrapper.unmount()
    container.remove()
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
