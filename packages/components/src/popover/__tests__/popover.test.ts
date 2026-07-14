import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Popover from '../popover.vue'

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

const mockPopoverRects = ({
  trigger,
  popup
}: {
  trigger: DOMRect
  popup: DOMRect
}) =>
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getPopoverRect() {
    const element = this as HTMLElement

    if (element.classList.contains('aheart-popover__trigger')) {
      return trigger
    }

    if (element.classList.contains('aheart-popover__popup')) {
      return popup
    }

    return createRect({ left: 0, top: 0, width: 0, height: 0 })
  })

const mountPopover = (options: Record<string, any> = {}) =>
  mount(Popover, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ...options.global?.stubs,
        Teleport: true
      }
    }
  })

describe('Popover', () => {
  it('renders title and content props when open', () => {
    const wrapper = mountPopover({
      props: { open: true, title: 'Card title', content: 'Card content', placement: 'rightTop' },
      slots: { default: '<button>Details</button>' }
    })

    expect(wrapper.find('.aheart-popover__popup').exists()).toBe(true)
    expect(wrapper.find('.aheart-popover__popup').classes()).toContain('aheart-floating--rightTop')
    expect(wrapper.text()).toContain('Card title')
    expect(wrapper.text()).toContain('Card content')
  })

  it('renders vnode and function title and content props', () => {
    const wrapper = mountPopover({
      props: {
        open: true,
        title: () => h('span', { class: 'title-node' }, 'Account node'),
        content: h('span', { class: 'content-node' }, 'VNode body')
      },
      slots: { default: '<button>Details</button>' }
    })

    expect(wrapper.find('.title-node').text()).toBe('Account node')
    expect(wrapper.find('.content-node').text()).toBe('VNode body')
  })

  it('renders numeric renderables without treating zero as empty', () => {
    const wrapper = mountPopover({
      props: {
        open: true,
        title: 0,
        content: 0
      },
      slots: { default: '<button>Counts</button>' }
    })

    expect(wrapper.find('.aheart-popover__title').text()).toBe('0')
    expect(wrapper.find('.aheart-popover__content').text()).toBe('0')
  })

  it('lets content slots override renderable prop fallbacks', () => {
    const wrapper = mountPopover({
      props: {
        open: true,
        title: h('span', { class: 'prop-title-node' }, 'Prop title'),
        content: h('span', { class: 'prop-content-node' }, 'Prop content')
      },
      slots: {
        default: '<button>Details</button>',
        title: '<span class="slot-title-node">Slot title</span>',
        content: '<span class="slot-content-node">Slot content</span>'
      }
    })

    expect(wrapper.find('.slot-title-node').text()).toBe('Slot title')
    expect(wrapper.find('.slot-content-node').text()).toBe('Slot content')
    expect(wrapper.find('.prop-title-node').exists()).toBe(false)
    expect(wrapper.find('.prop-content-node').exists()).toBe(false)
  })

  it('renders title and content slots', () => {
    const wrapper = mountPopover({
      props: { open: true },
      slots: {
        default: '<button>Details</button>',
        title: '<strong class="custom-title">Slot title</strong>',
        content: '<div class="custom-content">Slot content</div>'
      }
    })

    expect(wrapper.find('.custom-title').text()).toBe('Slot title')
    expect(wrapper.find('.custom-content').text()).toBe('Slot content')
  })

  it('toggles from click trigger and emits open events', async () => {
    const wrapper = mountPopover({
      props: { content: 'Clickable', trigger: 'click' },
      slots: { default: '<button>Details</button>' }
    })

    await wrapper.find('.aheart-popover__trigger').trigger('click')

    expect(wrapper.find('.aheart-popover__popup').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
  })

  it('auto adjusts top placement to bottom when the popup would overflow above', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockPopoverRects({
      trigger: createRect({ left: 120, top: 8, width: 96, height: 24 }),
      popup: createRect({ left: 90, top: -132, width: 180, height: 140 })
    })

    try {
      const wrapper = mountPopover({
        props: { content: 'Adjusted', trigger: 'click', placement: 'top' },
        slots: { default: '<button>Details</button>' }
      })

      await wrapper.find('.aheart-popover__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-popover__popup').classes()).toContain('aheart-floating--bottom')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('keeps configured placement when overflow adjustment is disabled', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockPopoverRects({
      trigger: createRect({ left: 120, top: 8, width: 96, height: 24 }),
      popup: createRect({ left: 90, top: -132, width: 180, height: 140 })
    })

    try {
      const wrapper = mountPopover({
        props: { content: 'Fixed', trigger: 'click', placement: 'top', autoAdjustOverflow: false },
        slots: { default: '<button>Details</button>' }
      })

      await wrapper.find('.aheart-popover__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-popover__popup').classes()).toContain('aheart-floating--top')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('auto adjusts left placement to right when the popup would overflow left', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockPopoverRects({
      trigger: createRect({ left: 6, top: 180, width: 96, height: 24 }),
      popup: createRect({ left: -194, top: 120, width: 180, height: 120 })
    })

    try {
      const wrapper = mountPopover({
        props: { content: 'Adjusted side', trigger: 'click', placement: 'left' },
        slots: { default: '<button>Details</button>' }
      })

      await wrapper.find('.aheart-popover__trigger').trigger('click')
      await nextTick()

      expect(wrapper.find('.aheart-popover__popup').classes()).toContain('aheart-floating--right')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('applies root semantic and overlay class and style hooks', () => {
    const wrapper = mountPopover({
      props: {
        open: true,
        title: 'Card title',
        content: 'Card content',
        className: 'popover-class',
        rootClassName: 'popover-root',
        style: 'color: red;',
        overlayClassName: 'overlay-class',
        overlayStyle: { borderColor: 'green' },
        overlayInnerStyle: { padding: '4px' },
        classNames: {
          root: 'semantic-root',
          trigger: 'semantic-trigger',
          popup: 'semantic-popup',
          container: 'semantic-container',
          title: 'semantic-title',
          content: 'semantic-content',
          arrow: 'semantic-arrow'
        },
        styles: {
          root: { backgroundColor: 'blue' },
          trigger: { outline: '1px solid red' },
          popup: { minWidth: '240px' },
          container: { maxWidth: '260px' },
          title: { letterSpacing: '1px' },
          content: { lineHeight: '20px' },
          arrow: { backgroundColor: 'yellow' }
        }
      },
      slots: { default: '<button>Details</button>' }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['popover-class', 'popover-root', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.attributes('style')).toContain('background-color: blue')
    expect(wrapper.find('.aheart-popover__trigger').classes()).toContain('semantic-trigger')
    expect(wrapper.find('.aheart-popover__trigger').attributes('style')).toContain('outline: 1px solid red')
    expect(wrapper.find('.aheart-popover__popup').classes()).toEqual(
      expect.arrayContaining(['overlay-class', 'semantic-popup'])
    )
    expect(wrapper.find('.aheart-popover__popup').attributes('style')).toContain('border-color: green')
    expect(wrapper.find('.aheart-popover__popup').attributes('style')).toContain('min-width: 240px')
    expect(wrapper.find('.aheart-popover__container').classes()).toContain('semantic-container')
    expect(wrapper.find('.aheart-popover__container').attributes('style')).toContain('padding: 4px')
    expect(wrapper.find('.aheart-popover__container').attributes('style')).toContain('max-width: 260px')
    expect(wrapper.find('.aheart-popover__title').classes()).toContain('semantic-title')
    expect(wrapper.find('.aheart-popover__content').classes()).toContain('semantic-content')
    expect(wrapper.find('.aheart-popover__arrow').classes()).toContain('semantic-arrow')
    expect(wrapper.find('.aheart-popover__arrow').attributes('style')).toContain('background-color: yellow')
  })

  it('applies align offset variables to the popup', () => {
    const wrapper = mountPopover({
      props: {
        open: true,
        content: 'Offset popover',
        align: { offset: [8, -4] }
      },
      slots: { default: '<button>Details</button>' }
    })

    const popupStyle = wrapper.find('.aheart-popover__popup').attributes('style') ?? ''

    expect(popupStyle).toContain('--aheart-floating-align-x: 8px')
    expect(popupStyle).toContain('--aheart-floating-align-y: -4px')
    expect(wrapper.attributes('align')).toBeUndefined()
  })

  it('resolves function semantic hooks with open state and effective placement', async () => {
    setViewportSize(1024, 800)
    const rectSpy = mockPopoverRects({
      trigger: createRect({ left: 120, top: 8, width: 96, height: 24 }),
      popup: createRect({ left: 90, top: -132, width: 180, height: 140 })
    })
    const classInfos: Array<{ open: boolean; placement: string }> = []
    const styleInfos: Array<{ open: boolean; placement: string }> = []

    try {
      const wrapper = mountPopover({
        props: {
          title: 'Function title',
          content: 'Function content',
          trigger: 'click',
          placement: 'top',
          classNames: (info: { open: boolean; placement: string }) => {
            classInfos.push(info)
            return {
              root: info.open ? 'function-root-open' : 'function-root-closed',
              trigger: `function-trigger-${info.placement}`,
              popup: `function-popup-${info.placement}`,
              container: 'function-container',
              title: 'function-title',
              content: 'function-content',
              arrow: 'function-arrow'
            }
          },
          styles: (info: { open: boolean; placement: string }) => {
            styleInfos.push(info)
            return {
              root: { outlineColor: info.open ? 'green' : 'gray' },
              popup: { borderColor: info.placement === 'bottom' ? 'blue' : 'orange' },
              container: { maxWidth: '280px' },
              title: { fontWeight: '600' },
              content: { lineHeight: '22px' },
              arrow: { backgroundColor: 'pink' }
            }
          }
        },
        slots: { default: '<button>Details</button>' }
      })

      await wrapper.find('.aheart-popover__trigger').trigger('click')
      await nextTick()

      expect(classInfos.at(-1)).toMatchObject({ open: true, placement: 'bottom' })
      expect(styleInfos.at(-1)).toMatchObject({ open: true, placement: 'bottom' })

      expect(wrapper.classes()).toContain('function-root-open')
      expect(wrapper.attributes('style')).toContain('outline-color: green')
      expect(wrapper.find('.aheart-popover__trigger').classes()).toContain('function-trigger-bottom')

      const popup = wrapper.find('.aheart-popover__popup')
      expect(popup.classes()).toEqual(
        expect.arrayContaining(['aheart-floating--bottom', 'function-popup-bottom'])
      )
      expect(popup.attributes('style')).toContain('border-color: blue')

      const container = wrapper.find('.aheart-popover__container')
      expect(container.classes()).toContain('function-container')
      expect(container.attributes('style')).toContain('max-width: 280px')

      const title = wrapper.find('.aheart-popover__title')
      expect(title.classes()).toContain('function-title')
      expect(title.attributes('style')).toContain('font-weight: 600')

      const content = wrapper.find('.aheart-popover__content')
      expect(content.classes()).toContain('function-content')
      expect(content.attributes('style')).toContain('line-height: 22px')

      const arrow = wrapper.find('.aheart-popover__arrow')
      expect(arrow.classes()).toContain('function-arrow')
      expect(arrow.attributes('style')).toContain('background-color: pink')
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('respects hover enter and leave delays', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountPopover({
        props: { content: 'Delayed', mouseEnterDelay: 0.2, mouseLeaveDelay: 0.3 },
        slots: { default: '<button>Details</button>' }
      })

      await wrapper.find('.aheart-popover__trigger').trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(199)
      expect(wrapper.find('.aheart-popover__popup').exists()).toBe(false)

      await vi.advanceTimersByTimeAsync(1)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.aheart-popover__popup').exists()).toBe(true)

      await wrapper.trigger('mouseleave')
      await vi.advanceTimersByTimeAsync(299)
      expect(wrapper.find('.aheart-popover__popup').isVisible()).toBe(true)

      await vi.advanceTimersByTimeAsync(1)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])
      expect(wrapper.find('.aheart-popover__popup').classes()).toContain('is-leave')

      await vi.advanceTimersByTimeAsync(120)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.aheart-popover__popup').attributes('style')).toContain('display: none')
    } finally {
      vi.useRealTimers()
    }
  })

  it('preserves or destroys hidden popup according to destroyOnHidden', async () => {
    const preserved = mountPopover({
      props: { content: 'Preserved', trigger: 'click' },
      slots: { default: '<button>Details</button>' }
    })

    await preserved.find('.aheart-popover__trigger').trigger('click')
    vi.useFakeTimers()
    try {
      await preserved.find('.aheart-popover__trigger').trigger('click')

      expect(preserved.find('.aheart-popover__popup').exists()).toBe(true)
      expect(preserved.find('.aheart-popover__popup').classes()).toContain('is-leave')

      await vi.advanceTimersByTimeAsync(120)
      expect(preserved.find('.aheart-popover__popup').isVisible()).toBe(false)
    } finally {
      vi.useRealTimers()
    }

    const destroyed = mountPopover({
      props: { content: 'Destroyed', trigger: 'click', destroyOnHidden: true },
      slots: { default: '<button>Details</button>' }
    })

    await destroyed.find('.aheart-popover__trigger').trigger('click')
    vi.useFakeTimers()
    try {
      await destroyed.find('.aheart-popover__trigger').trigger('click')

      expect(destroyed.find('.aheart-popover__popup').exists()).toBe(true)

      await vi.advanceTimersByTimeAsync(121)
      expect(destroyed.find('.aheart-popover__popup').exists()).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('supports destroyTooltipOnHide as a hidden destroy alias', async () => {
    const wrapper = mountPopover({
      props: { content: 'Alias destroyed', trigger: 'click', destroyTooltipOnHide: true },
      slots: { default: '<button>Details</button>' }
    })

    await wrapper.find('.aheart-popover__trigger').trigger('click')
    expect(wrapper.find('.aheart-popover__popup').exists()).toBe(true)

    vi.useFakeTimers()
    try {
      await wrapper.find('.aheart-popover__trigger').trigger('click')
      expect(wrapper.find('.aheart-popover__popup').exists()).toBe(true)

      await vi.advanceTimersByTimeAsync(121)
      expect(wrapper.find('.aheart-popover__popup').exists()).toBe(false)
      expect(wrapper.attributes('destroytooltiponhide')).toBeUndefined()
    } finally {
      vi.useRealTimers()
    }
  })

  it('teleports popup to document body by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Popover, {
      attachTo: host,
      props: {
        open: true,
        content: 'Body popover'
      },
      slots: {
        default: '<button>Details</button>'
      }
    })

    await nextTick()

    expect(document.body.querySelector('.aheart-popover__popup')).toBeTruthy()
    expect(host.querySelector('.aheart-popover__popup')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('teleports popup to getPopupContainer target', async () => {
    const container = document.createElement('section')
    let triggerNode: HTMLElement | undefined
    document.body.appendChild(container)

    const wrapper = mount(Popover, {
      props: {
        open: true,
        title: 'Target title',
        content: 'Target content',
        getPopupContainer: (node: HTMLElement) => {
          triggerNode = node
          return container
        }
      },
      slots: {
        default: '<button>Details</button>'
      }
    })

    await nextTick()

    expect(triggerNode?.classList.contains('aheart-popover__trigger')).toBe(true)
    expect(container.querySelector('.aheart-popover__popup')).toBeTruthy()
    expect(container.textContent).toContain('Target title')
    expect(container.textContent).toContain('Target content')

    wrapper.unmount()
    container.remove()
  })

  it('keeps hover popover open when moving from trigger to popup', async () => {
    const container = document.createElement('section')
    document.body.appendChild(container)

    const wrapper = mount(Popover, {
      props: {
        trigger: 'hover',
        content: 'Hover content',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        getPopupContainer: () => container
      },
      slots: {
        default: '<button>Details</button>'
      }
    })

    await wrapper.find('.aheart-popover__trigger').trigger('mouseenter')
    await nextTick()

    const popup = container.querySelector('.aheart-popover__popup') as HTMLElement
    expect(popup).toBeTruthy()

    await wrapper.find('.aheart-popover__trigger').trigger('mouseleave', { relatedTarget: popup })
    expect(container.querySelector('.aheart-popover__popup')).toBeTruthy()
    expect((container.querySelector('.aheart-popover__popup') as HTMLElement).style.display).not.toBe('none')

    popup.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }))
    await nextTick()

    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])

    wrapper.unmount()
    container.remove()
  })

  it('renders object arrow point at center class', () => {
    const wrapper = mountPopover({
      props: { open: true, content: 'Arrow', arrow: { pointAtCenter: true } },
      slots: { default: '<button>Details</button>' }
    })

    expect(wrapper.find('.aheart-popover__arrow').classes()).toContain('aheart-popover__arrow--point-at-center')
  })
})
