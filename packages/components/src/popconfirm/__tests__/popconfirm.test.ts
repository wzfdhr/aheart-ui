import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Popconfirm from '../popconfirm.vue'

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

const mockPopconfirmRects = ({
  trigger,
  popup
}: {
  trigger: DOMRect
  popup: DOMRect
}) =>
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getPopconfirmRect() {
    const element = this as HTMLElement

    if (element.classList.contains('aheart-popconfirm__trigger')) {
      return trigger
    }

    if (element.classList.contains('aheart-popconfirm__popup')) {
      return popup
    }

    return createRect({ left: 0, top: 0, width: 0, height: 0 })
  })

const mountPopconfirm = (options: Record<string, any> = {}) =>
  mount(Popconfirm, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ...options.global?.stubs,
        Teleport: true
      }
    }
  })

describe('Popconfirm', () => {
  it('opens from click trigger with title description icon and buttons', async () => {
    const wrapper = mountPopconfirm({
      props: { title: 'Delete item?', description: 'This cannot be undone.' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__trigger').trigger('click')

    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(true)
    expect(wrapper.text()).toContain('Delete item?')
    expect(wrapper.text()).toContain('This cannot be undone.')
    expect(wrapper.text()).toContain('OK')
    expect(wrapper.text()).toContain('Cancel')
    expect(wrapper.find('.aheart-popconfirm__icon').exists()).toBe(true)
  })

  it('renders vnode and function title description and icon props', () => {
    const wrapper = mountPopconfirm({
      props: {
        defaultOpen: true,
        title: () => h('span', { class: 'title-node' }, 'Delete node?'),
        description: h('span', { class: 'description-node' }, 'VNode details'),
        icon: h('span', { class: 'icon-node' }, '?')
      },
      slots: { default: '<button>Delete</button>' }
    })

    expect(wrapper.find('.title-node').text()).toBe('Delete node?')
    expect(wrapper.find('.description-node').text()).toBe('VNode details')
    expect(wrapper.find('.icon-node').text()).toBe('?')
  })

  it('renders numeric renderables without treating zero as empty', () => {
    const wrapper = mountPopconfirm({
      props: {
        defaultOpen: true,
        title: 0,
        description: 0,
        icon: 0
      },
      slots: { default: '<button>Count</button>' }
    })

    expect(wrapper.find('.aheart-popconfirm__title').text()).toBe('0')
    expect(wrapper.find('.aheart-popconfirm__description').text()).toBe('0')
    expect(wrapper.find('.aheart-popconfirm__icon').text()).toBe('0')
  })

  it('auto adjusts top placement to bottom when the popup would overflow above', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockPopconfirmRects({
      trigger: createRect({ left: 120, top: 8, width: 96, height: 24 }),
      popup: createRect({ left: 90, top: -132, width: 180, height: 140 })
    })

    try {
      const wrapper = mountPopconfirm({
        props: { title: 'Adjusted', trigger: 'click', placement: 'top' },
        slots: { default: '<button>Delete</button>' }
      })

      await wrapper.find('.aheart-popconfirm__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-popconfirm__popup').classes()).toContain('aheart-floating--bottom')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('keeps configured placement when overflow adjustment is disabled', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockPopconfirmRects({
      trigger: createRect({ left: 120, top: 8, width: 96, height: 24 }),
      popup: createRect({ left: 90, top: -132, width: 180, height: 140 })
    })

    try {
      const wrapper = mountPopconfirm({
        props: { title: 'Fixed', trigger: 'click', placement: 'top', autoAdjustOverflow: false },
        slots: { default: '<button>Delete</button>' }
      })

      await wrapper.find('.aheart-popconfirm__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-popconfirm__popup').classes()).toContain('aheart-floating--top')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('auto adjusts left placement to right when the popup would overflow left', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockPopconfirmRects({
      trigger: createRect({ left: 6, top: 180, width: 96, height: 24 }),
      popup: createRect({ left: -194, top: 120, width: 180, height: 120 })
    })

    try {
      const wrapper = mountPopconfirm({
        props: { title: 'Adjusted side', trigger: 'click', placement: 'left' },
        slots: { default: '<button>Delete</button>' }
      })

      await wrapper.find('.aheart-popconfirm__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-popconfirm__popup').classes()).toContain('aheart-floating--right')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('hides icon when icon is false', () => {
    const wrapper = mountPopconfirm({
      props: {
        defaultOpen: true,
        title: 'No icon',
        icon: false
      },
      slots: { default: '<button>No icon</button>' }
    })

    expect(wrapper.find('.aheart-popconfirm__title').text()).toBe('No icon')
    expect(wrapper.find('.aheart-popconfirm__icon').exists()).toBe(false)
  })

  it('lets content slots override renderable prop fallbacks', () => {
    const wrapper = mountPopconfirm({
      props: {
        defaultOpen: true,
        title: h('span', { class: 'prop-title-node' }, 'Prop title'),
        description: h('span', { class: 'prop-description-node' }, 'Prop description'),
        icon: h('span', { class: 'prop-icon-node' }, 'P')
      },
      slots: {
        default: '<button>Delete</button>',
        title: '<span class="slot-title-node">Slot title</span>',
        description: '<span class="slot-description-node">Slot description</span>',
        icon: '<span class="slot-icon-node">S</span>'
      }
    })

    expect(wrapper.find('.slot-title-node').text()).toBe('Slot title')
    expect(wrapper.find('.slot-description-node').text()).toBe('Slot description')
    expect(wrapper.find('.slot-icon-node').text()).toBe('S')
    expect(wrapper.find('.prop-title-node').exists()).toBe(false)
    expect(wrapper.find('.prop-description-node').exists()).toBe(false)
    expect(wrapper.find('.prop-icon-node').exists()).toBe(false)
  })

  it('emits confirm and closes from OK', async () => {
    const wrapper = mountPopconfirm({
      props: { defaultOpen: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__ok').trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([false])
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(true)
    expect(wrapper.find('.aheart-popconfirm__popup').attributes('style')).toContain('display: none')
  })

  it('emits cancel and closes from Cancel', async () => {
    const wrapper = mountPopconfirm({
      props: { defaultOpen: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(true)
    expect(wrapper.find('.aheart-popconfirm__popup').attributes('style')).toContain('display: none')
  })

  it('respects disabled and showCancel options', async () => {
    const disabled = mountPopconfirm({
      props: { disabled: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await disabled.find('.aheart-popconfirm__trigger').trigger('click')
    expect(disabled.find('.aheart-popconfirm__popup').exists()).toBe(false)

    const withoutCancel = mountPopconfirm({
      props: { defaultOpen: true, title: 'Delete item?', showCancel: false },
      slots: { default: '<button>Delete</button>' }
    })

    expect(withoutCancel.find('.aheart-popconfirm__cancel').exists()).toBe(false)
    expect(withoutCancel.find('.aheart-popconfirm__ok').exists()).toBe(true)
  })

  it('renders icon color and action button prop bags', () => {
    const wrapper = mountPopconfirm({
      props: {
        defaultOpen: true,
        title: 'Archive item?',
        description: 'This can be restored later.',
        icon: '?',
        color: 'rgb(1, 2, 3)',
        okText: 'Archive',
        okButtonProps: {
          danger: true,
          ghost: true,
          className: 'ok-extra'
        },
        cancelButtonProps: {
          disabled: true,
          className: 'cancel-extra'
        }
      },
      slots: { default: '<button>Archive</button>' }
    })

    expect(wrapper.find('.aheart-popconfirm__icon').text()).toBe('?')
    expect(wrapper.find('.aheart-popconfirm__popup').attributes('style')).toContain('background: rgb(1, 2, 3)')
    expect(wrapper.find('.aheart-popconfirm__ok').classes()).toEqual(
      expect.arrayContaining(['ok-extra', 'is-danger', 'is-ghost'])
    )
    expect(wrapper.find('.aheart-popconfirm__cancel').classes()).toContain('cancel-extra')
    expect(wrapper.find('.aheart-popconfirm__cancel').attributes('disabled')).toBeDefined()
  })

  it('applies root and semantic class and style hooks', () => {
    const wrapper = mountPopconfirm({
      props: {
        defaultOpen: true,
        title: 'Archive item?',
        description: 'This can be restored later.',
        className: 'popconfirm-class',
        rootClassName: 'popconfirm-root',
        style: 'color: red;',
        overlayClassName: 'overlay-class',
        overlayStyle: { minWidth: '260px' },
        overlayInnerStyle: { padding: '4px' },
        classNames: {
          root: 'semantic-root',
          trigger: 'semantic-trigger',
          popup: 'semantic-popup',
          container: 'semantic-container',
          arrow: 'semantic-arrow',
          message: 'semantic-message',
          icon: 'semantic-icon',
          text: 'semantic-text',
          title: 'semantic-title',
          description: 'semantic-description',
          actions: 'semantic-actions',
          cancelButton: 'semantic-cancel',
          okButton: 'semantic-ok'
        },
        styles: {
          root: { backgroundColor: 'blue' },
          trigger: { outline: '1px solid red' },
          popup: { borderColor: 'green' },
          container: { maxWidth: '280px' },
          arrow: { backgroundColor: 'yellow' },
          message: { columnGap: '8px' },
          icon: { color: 'purple' },
          text: { lineHeight: '20px' },
          title: { letterSpacing: '1px' },
          description: { marginTop: '4px' },
          actions: { paddingTop: '4px' },
          cancelButton: { marginRight: '2px' },
          okButton: { marginLeft: '2px' }
        }
      },
      slots: { default: '<button>Archive</button>' }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['popconfirm-class', 'popconfirm-root', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.attributes('style')).toContain('background-color: blue')
    expect(wrapper.find('.aheart-popconfirm__trigger').classes()).toContain('semantic-trigger')
    expect(wrapper.find('.aheart-popconfirm__trigger').attributes('style')).toContain('outline: 1px solid red')
    expect(wrapper.find('.aheart-popconfirm__popup').classes()).toEqual(
      expect.arrayContaining(['overlay-class', 'semantic-popup'])
    )
    expect(wrapper.find('.aheart-popconfirm__popup').attributes('style')).toContain('min-width: 260px')
    expect(wrapper.find('.aheart-popconfirm__popup').attributes('style')).toContain('border-color: green')
    expect(wrapper.find('.aheart-popconfirm__container').classes()).toContain('semantic-container')
    expect(wrapper.find('.aheart-popconfirm__container').attributes('style')).toContain('padding: 4px')
    expect(wrapper.find('.aheart-popconfirm__container').attributes('style')).toContain('max-width: 280px')
    expect(wrapper.find('.aheart-popconfirm__arrow').classes()).toContain('semantic-arrow')
    expect(wrapper.find('.aheart-popconfirm__message').classes()).toContain('semantic-message')
    expect(wrapper.find('.aheart-popconfirm__icon').classes()).toContain('semantic-icon')
    expect(wrapper.find('.aheart-popconfirm__text').classes()).toContain('semantic-text')
    expect(wrapper.find('.aheart-popconfirm__title').classes()).toContain('semantic-title')
    expect(wrapper.find('.aheart-popconfirm__description').classes()).toContain('semantic-description')
    expect(wrapper.find('.aheart-popconfirm__actions').classes()).toContain('semantic-actions')
    expect(wrapper.find('.aheart-popconfirm__cancel').classes()).toContain('semantic-cancel')
    expect(wrapper.find('.aheart-popconfirm__cancel').attributes('style')).toContain('margin-right: 2px')
    expect(wrapper.find('.aheart-popconfirm__ok').classes()).toContain('semantic-ok')
    expect(wrapper.find('.aheart-popconfirm__ok').attributes('style')).toContain('margin-left: 2px')
  })

  it('teleports popup to document body by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Popconfirm, {
      attachTo: host,
      props: {
        open: true,
        title: 'Body confirm'
      },
      slots: {
        default: '<button>Delete</button>'
      }
    })

    await nextTick()

    expect(document.body.querySelector('.aheart-popconfirm__popup')).toBeTruthy()
    expect(host.querySelector('.aheart-popconfirm__popup')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('teleports popup to getPopupContainer target', async () => {
    const container = document.createElement('section')
    let triggerNode: HTMLElement | undefined
    document.body.appendChild(container)

    const wrapper = mount(Popconfirm, {
      props: {
        open: true,
        title: 'Target title',
        description: 'Target description',
        getPopupContainer: (node: HTMLElement) => {
          triggerNode = node
          return container
        }
      },
      slots: {
        default: '<button>Delete</button>'
      }
    })

    await nextTick()

    expect(triggerNode?.classList.contains('aheart-popconfirm__trigger')).toBe(true)
    expect(container.querySelector('.aheart-popconfirm__popup')).toBeTruthy()
    expect(container.textContent).toContain('Target title')
    expect(container.textContent).toContain('Target description')

    wrapper.unmount()
    container.remove()
  })

  it('keeps hover popconfirm open when moving from trigger to popup', async () => {
    const container = document.createElement('section')
    document.body.appendChild(container)

    const wrapper = mount(Popconfirm, {
      props: {
        trigger: 'hover',
        title: 'Hover confirm',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        getPopupContainer: () => container
      },
      slots: {
        default: '<button>Delete</button>'
      }
    })

    await wrapper.find('.aheart-popconfirm__trigger').trigger('mouseenter')
    await nextTick()

    const popup = container.querySelector('.aheart-popconfirm__popup') as HTMLElement
    expect(popup).toBeTruthy()

    await wrapper.find('.aheart-popconfirm__trigger').trigger('mouseleave', { relatedTarget: popup })
    expect(container.querySelector('.aheart-popconfirm__popup')).toBeTruthy()

    popup.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }))
    await nextTick()

    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])

    wrapper.unmount()
    container.remove()
  })

  it('emits popupClick without closing', async () => {
    const wrapper = mountPopconfirm({
      props: { defaultOpen: true, title: 'Archive item?' },
      slots: { default: '<button>Archive</button>' }
    })

    await wrapper.find('.aheart-popconfirm__popup').trigger('click')

    expect(wrapper.emitted('popupClick')?.[0][0]).toBeInstanceOf(MouseEvent)
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(true)
  })

  it('respects hover enter and leave delays', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountPopconfirm({
        props: {
          title: 'Delayed confirm',
          trigger: 'hover',
          mouseEnterDelay: 0.2,
          mouseLeaveDelay: 0.3
        },
        slots: { default: '<button>Delete</button>' }
      })

      await wrapper.find('.aheart-popconfirm__trigger').trigger('mouseenter')
      expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(false)

      await vi.advanceTimersByTimeAsync(199)
      expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(false)

      await vi.advanceTimersByTimeAsync(1)
      await nextTick()
      expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(true)
      expect(wrapper.find('.aheart-popconfirm__popup').attributes('style') ?? '').not.toContain('display: none')

      await wrapper.find('.aheart-popconfirm__trigger').trigger('mouseleave')
      await vi.advanceTimersByTimeAsync(299)
      await nextTick()
      expect(wrapper.find('.aheart-popconfirm__popup').attributes('style') ?? '').not.toContain('display: none')

      await vi.advanceTimersByTimeAsync(1)
      await nextTick()
      expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(true)
      expect(wrapper.find('.aheart-popconfirm__popup').attributes('style')).toContain('display: none')

      wrapper.unmount()
    } finally {
      vi.useRealTimers()
    }
  })

  it('renders object arrow point at center class', () => {
    const wrapper = mountPopconfirm({
      props: { defaultOpen: true, title: 'Arrow confirm', arrow: { pointAtCenter: true } },
      slots: { default: '<button>Delete</button>' }
    })

    expect(wrapper.find('.aheart-popconfirm__arrow').classes()).toContain(
      'aheart-popconfirm__arrow--point-at-center'
    )
  })

  it('preserves hidden popup by default and destroys it when requested', async () => {
    const preserved = mountPopconfirm({
      props: { title: 'Preserved popup' },
      slots: { default: '<button>Delete</button>' }
    })

    await preserved.find('.aheart-popconfirm__trigger').trigger('click')
    await preserved.find('.aheart-popconfirm__trigger').trigger('click')

    expect(preserved.find('.aheart-popconfirm__popup').exists()).toBe(true)
    expect(preserved.find('.aheart-popconfirm__popup').attributes('style')).toContain('display: none')

    const destroyed = mountPopconfirm({
      props: { title: 'Destroyed popup', destroyOnHidden: true },
      slots: { default: '<button>Delete</button>' }
    })

    await destroyed.find('.aheart-popconfirm__trigger').trigger('click')
    await destroyed.find('.aheart-popconfirm__trigger').trigger('click')

    expect(destroyed.find('.aheart-popconfirm__popup').exists()).toBe(false)

    const aliasDestroyed = mountPopconfirm({
      props: { title: 'Alias destroyed popup', destroyTooltipOnHide: true },
      slots: { default: '<button>Delete</button>' }
    })

    await aliasDestroyed.find('.aheart-popconfirm__trigger').trigger('click')
    await aliasDestroyed.find('.aheart-popconfirm__trigger').trigger('click')

    expect(aliasDestroyed.find('.aheart-popconfirm__popup').exists()).toBe(false)
  })

  it('accepts fresh without forwarding it as a DOM attribute', () => {
    const wrapper = mountPopconfirm({
      props: { defaultOpen: true, title: 'Fresh popup', fresh: true },
      slots: { default: '<button>Delete</button>' }
    })

    expect(wrapper.attributes('fresh')).toBeUndefined()
    expect(wrapper.find('.aheart-popconfirm__title').text()).toBe('Fresh popup')
  })
})
