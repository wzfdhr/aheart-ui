import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Tooltip from '../tooltip.vue'

const mountTooltip = (options: Record<string, any> = {}) =>
  mount(Tooltip, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ...options.global?.stubs,
        Teleport: true
      }
    }
  })

describe('Tooltip', () => {
  it('renders title from hover trigger', async () => {
    const wrapper = mountTooltip({
      props: { title: 'Helpful text', mouseEnterDelay: 0 },
      slots: { default: '<button>Help</button>' }
    })

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)

    await wrapper.find('.aheart-tooltip__trigger').trigger('mouseenter')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)
    expect(wrapper.text()).toContain('Helpful text')
  })

  it('renders vnode and function title props', () => {
    const wrapper = mountTooltip({
      props: {
        open: true,
        title: () => h('span', { class: 'title-node' }, 'Helpful node')
      },
      slots: { default: '<button>Help</button>' }
    })

    expect(wrapper.find('.title-node').text()).toBe('Helpful node')
  })

  it('renders numeric title without treating zero as empty', () => {
    const wrapper = mountTooltip({
      props: {
        open: true,
        title: 0
      },
      slots: { default: '<button>Count</button>' }
    })

    expect(wrapper.find('.aheart-tooltip__content').text()).toBe('0')
  })

  it('lets title slot override renderable prop fallback', () => {
    const wrapper = mountTooltip({
      props: {
        open: true,
        title: h('span', { class: 'prop-title-node' }, 'Prop title')
      },
      slots: {
        default: '<button>Help</button>',
        title: '<span class="slot-title-node">Slot title</span>'
      }
    })

    expect(wrapper.find('.slot-title-node').text()).toBe('Slot title')
    expect(wrapper.find('.prop-title-node').exists()).toBe(false)
  })

  it('does not render popup for an empty title string', async () => {
    const wrapper = mountTooltip({
      props: {
        title: '',
        mouseEnterDelay: 0
      },
      slots: { default: '<button>Help</button>' }
    })

    await wrapper.find('.aheart-tooltip__trigger').trigger('mouseenter')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)
  })

  it('applies placement color arrow and zIndex', () => {
    const wrapper = mountTooltip({
      props: { open: true, title: 'Colored', placement: 'bottomRight', color: '#111827', zIndex: 2000 },
      slots: { default: '<button>Help</button>' }
    })

    const popup = wrapper.find('.aheart-tooltip__popup')
    expect(popup.classes()).toContain('aheart-floating--bottomRight')
    expect(popup.attributes('style')).toContain('background: rgb(17, 24, 39)')
    expect(popup.attributes('style')).toContain('z-index: 2000')
    expect(wrapper.find('.aheart-tooltip__arrow').exists()).toBe(true)
  })

  it('toggles from click trigger and emits open events', async () => {
    const wrapper = mountTooltip({
      props: { title: 'Clickable', trigger: 'click' },
      slots: { default: '<button>Help</button>' }
    })

    await wrapper.find('.aheart-tooltip__trigger').trigger('click')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
  })

  it('respects controlled open state', async () => {
    const wrapper = mountTooltip({
      props: { open: false, title: 'Controlled', trigger: 'click' },
      slots: { default: '<button>Help</button>' }
    })

    await wrapper.find('.aheart-tooltip__trigger').trigger('click')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('opens from Ant-style contextMenu trigger', async () => {
    const wrapper = mountTooltip({
      props: { title: 'Context help', trigger: 'contextMenu' },
      slots: { default: '<button>Help</button>' }
    })

    await wrapper.find('.aheart-tooltip__trigger').trigger('contextmenu')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('applies root semantic and overlay class and style hooks', () => {
    const wrapper = mountTooltip({
      props: {
        open: true,
        title: 'Helpful text',
        className: 'tooltip-class',
        rootClassName: 'tooltip-root',
        style: 'color: red;',
        overlayClassName: 'overlay-class',
        overlayStyle: { borderColor: 'green' },
        overlayInnerStyle: { padding: '4px' },
        classNames: {
          root: 'semantic-root',
          trigger: 'semantic-trigger',
          popup: 'semantic-popup',
          container: 'semantic-container',
          content: 'semantic-content',
          arrow: 'semantic-arrow'
        },
        styles: {
          root: { backgroundColor: 'blue' },
          trigger: { outlineColor: 'red' },
          popup: { minWidth: '240px' },
          container: { maxWidth: '260px' },
          content: { lineHeight: '18px' },
          arrow: { backgroundColor: 'yellow' }
        }
      },
      slots: { default: '<button>Help</button>' }
    })

    const root = wrapper.find('.aheart-tooltip')
    expect(root.classes()).toEqual(
      expect.arrayContaining(['tooltip-class', 'tooltip-root', 'semantic-root'])
    )
    expect(root.attributes('style')).toContain('color: red')
    expect(root.attributes('style')).toContain('background-color: blue')

    const trigger = wrapper.find('.aheart-tooltip__trigger')
    expect(trigger.classes()).toContain('semantic-trigger')
    expect(trigger.attributes('style')).toContain('outline-color: red')

    const popup = wrapper.find('.aheart-tooltip__popup')
    expect(popup.classes()).toEqual(
      expect.arrayContaining(['aheart-floating--top', 'overlay-class', 'semantic-popup'])
    )
    expect(popup.attributes('style')).toContain('border-color: green')
    expect(popup.attributes('style')).toContain('min-width: 240px')

    const container = wrapper.find('.aheart-tooltip__container')
    expect(container.classes()).toContain('semantic-container')
    expect(container.attributes('style')).toContain('padding: 4px')
    expect(container.attributes('style')).toContain('max-width: 260px')

    const content = wrapper.find('.aheart-tooltip__content')
    expect(content.classes()).toContain('semantic-content')
    expect(content.attributes('style')).toContain('line-height: 18px')

    const arrow = wrapper.find('.aheart-tooltip__arrow')
    expect(arrow.classes()).toContain('semantic-arrow')
    expect(arrow.attributes('style')).toContain('background-color: yellow')
  })

  it('uses Ant-style default hover delays', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountTooltip({
        props: { title: 'Delayed default' },
        slots: { default: '<button>Help</button>' }
      })

      await wrapper.find('.aheart-tooltip__trigger').trigger('mouseenter')
      vi.advanceTimersByTime(99)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)

      vi.advanceTimersByTime(1)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)

      await wrapper.trigger('mouseleave')
      vi.advanceTimersByTime(99)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)

      vi.advanceTimersByTime(1)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])
      expect(wrapper.find('.aheart-tooltip__popup').attributes('style')).toContain('display: none')
    } finally {
      vi.useRealTimers()
    }
  })

  it('respects custom hover enter and leave delays', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountTooltip({
        props: { title: 'Delayed custom', mouseEnterDelay: 0.2, mouseLeaveDelay: 0.3 },
        slots: { default: '<button>Help</button>' }
      })

      await wrapper.find('.aheart-tooltip__trigger').trigger('mouseenter')
      vi.advanceTimersByTime(199)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)

      vi.advanceTimersByTime(1)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)

      await wrapper.trigger('mouseleave')
      vi.advanceTimersByTime(299)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)

      vi.advanceTimersByTime(1)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])
      expect(wrapper.find('.aheart-tooltip__popup').attributes('style')).toContain('display: none')
    } finally {
      vi.useRealTimers()
    }
  })

  it('preserves or destroys hidden popup according to destroyOnHidden', async () => {
    const preserved = mountTooltip({
      props: { title: 'Preserved', trigger: 'click' },
      slots: { default: '<button>Help</button>' }
    })

    await preserved.find('.aheart-tooltip__trigger').trigger('click')
    expect(preserved.find('.aheart-tooltip__popup').exists()).toBe(true)

    await preserved.find('.aheart-tooltip__trigger').trigger('click')
    const preservedPopup = preserved.find('.aheart-tooltip__popup')
    expect(preservedPopup.exists()).toBe(true)
    expect(preservedPopup.attributes('style')).toContain('display: none')

    const destroyed = mountTooltip({
      props: { title: 'Destroyed', trigger: 'click', destroyOnHidden: true },
      slots: { default: '<button>Help</button>' }
    })

    await destroyed.find('.aheart-tooltip__trigger').trigger('click')
    expect(destroyed.find('.aheart-tooltip__popup').exists()).toBe(true)

    await destroyed.find('.aheart-tooltip__trigger').trigger('click')
    expect(destroyed.find('.aheart-tooltip__popup').exists()).toBe(false)
  })

  it('teleports popup to document body by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Tooltip, {
      attachTo: host,
      props: {
        open: true,
        title: 'Body tooltip'
      },
      slots: {
        default: '<button>Help</button>'
      }
    })

    await nextTick()

    expect(document.body.querySelector('.aheart-tooltip__popup')).toBeTruthy()
    expect(host.querySelector('.aheart-tooltip__popup')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('teleports popup to getPopupContainer target', async () => {
    const container = document.createElement('section')
    let triggerNode: HTMLElement | undefined
    document.body.appendChild(container)

    const wrapper = mount(Tooltip, {
      props: {
        open: true,
        title: 'Target tooltip',
        getPopupContainer: (node: HTMLElement) => {
          triggerNode = node
          return container
        }
      },
      slots: {
        default: '<button>Help</button>'
      }
    })

    await nextTick()

    expect(triggerNode?.classList.contains('aheart-tooltip__trigger')).toBe(true)
    expect(container.querySelector('.aheart-tooltip__popup')).toBeTruthy()
    expect(container.textContent).toContain('Target tooltip')

    wrapper.unmount()
    container.remove()
  })

  it('keeps hover tooltip open when moving from trigger to popup', async () => {
    const container = document.createElement('section')
    document.body.appendChild(container)

    const wrapper = mount(Tooltip, {
      props: {
        title: 'Hover tooltip',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        getPopupContainer: () => container
      },
      slots: {
        default: '<button>Help</button>'
      }
    })

    await wrapper.find('.aheart-tooltip__trigger').trigger('mouseenter')
    await nextTick()

    const popup = container.querySelector('.aheart-tooltip__popup') as HTMLElement
    expect(popup).toBeTruthy()

    await wrapper.find('.aheart-tooltip__trigger').trigger('mouseleave', { relatedTarget: popup })
    expect(container.querySelector('.aheart-tooltip__popup')).toBeTruthy()
    expect((container.querySelector('.aheart-tooltip__popup') as HTMLElement).style.display).not.toBe('none')

    popup.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }))
    await nextTick()

    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])

    wrapper.unmount()
    container.remove()
  })

  it('renders object arrow point at center class', () => {
    const wrapper = mountTooltip({
      props: { open: true, title: 'Arrow', arrow: { pointAtCenter: true } },
      slots: { default: '<button>Help</button>' }
    })

    expect(wrapper.find('.aheart-tooltip__arrow').classes()).toContain(
      'aheart-tooltip__arrow--point-at-center'
    )
  })
})
