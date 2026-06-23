import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Popover from '../popover.vue'

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
    await preserved.find('.aheart-popover__trigger').trigger('click')

    expect(preserved.find('.aheart-popover__popup').exists()).toBe(true)
    expect(preserved.find('.aheart-popover__popup').isVisible()).toBe(false)

    const destroyed = mountPopover({
      props: { content: 'Destroyed', trigger: 'click', destroyOnHidden: true },
      slots: { default: '<button>Details</button>' }
    })

    await destroyed.find('.aheart-popover__trigger').trigger('click')
    await destroyed.find('.aheart-popover__trigger').trigger('click')

    expect(destroyed.find('.aheart-popover__popup').exists()).toBe(false)
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
