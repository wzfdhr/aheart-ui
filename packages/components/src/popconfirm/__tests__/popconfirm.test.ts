import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import Popconfirm from '../popconfirm.vue'

describe('Popconfirm', () => {
  it('opens from click trigger with title description icon and buttons', async () => {
    const wrapper = mount(Popconfirm, {
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
    const wrapper = mount(Popconfirm, {
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
    const wrapper = mount(Popconfirm, {
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

  it('hides icon when icon is false', () => {
    const wrapper = mount(Popconfirm, {
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
    const wrapper = mount(Popconfirm, {
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
    const wrapper = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__ok').trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([false])
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(false)
  })

  it('emits cancel and closes from Cancel', async () => {
    const wrapper = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(false)
  })

  it('respects disabled and showCancel options', async () => {
    const disabled = mount(Popconfirm, {
      props: { disabled: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await disabled.find('.aheart-popconfirm__trigger').trigger('click')
    expect(disabled.find('.aheart-popconfirm__popup').exists()).toBe(false)

    const withoutCancel = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Delete item?', showCancel: false },
      slots: { default: '<button>Delete</button>' }
    })

    expect(withoutCancel.find('.aheart-popconfirm__cancel').exists()).toBe(false)
    expect(withoutCancel.find('.aheart-popconfirm__ok').exists()).toBe(true)
  })

  it('renders icon color and action button prop bags', () => {
    const wrapper = mount(Popconfirm, {
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
    const wrapper = mount(Popconfirm, {
      props: {
        defaultOpen: true,
        title: 'Archive item?',
        description: 'This can be restored later.',
        className: 'popconfirm-class',
        rootClassName: 'popconfirm-root',
        style: 'color: red;',
        classNames: {
          root: 'semantic-root',
          trigger: 'semantic-trigger',
          popup: 'semantic-popup',
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
    expect(wrapper.find('.aheart-popconfirm__popup').classes()).toContain('semantic-popup')
    expect(wrapper.find('.aheart-popconfirm__popup').attributes('style')).toContain('border-color: green')
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

  it('emits popupClick without closing', async () => {
    const wrapper = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Archive item?' },
      slots: { default: '<button>Archive</button>' }
    })

    await wrapper.find('.aheart-popconfirm__popup').trigger('click')

    expect(wrapper.emitted('popupClick')?.[0][0]).toBeInstanceOf(MouseEvent)
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(true)
  })
})
