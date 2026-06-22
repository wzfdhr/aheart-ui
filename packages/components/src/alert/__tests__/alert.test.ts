import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Alert from '../alert.vue'

describe('Alert', () => {
  it('renders role alert with type class and content', () => {
    const wrapper = mount(Alert, {
      props: {
        type: 'success',
        message: 'Saved',
        description: 'The record has been saved.',
        showIcon: true
      }
    })

    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.classes()).toContain('aheart-alert--success')
    expect(wrapper.find('.aheart-alert__icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('The record has been saved.')
  })

  it('emits close when closable close button is clicked', async () => {
    const wrapper = mount(Alert, {
      props: {
        closable: true,
        message: 'Closable'
      }
    })

    await wrapper.find('.aheart-alert__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('renders title before message when both are provided', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Preferred title',
        message: 'Legacy message'
      }
    })

    expect(wrapper.find('.aheart-alert__message').text()).toBe('Preferred title')
    expect(wrapper.text()).not.toContain('Legacy message')
  })

  it('uses warning type and icon by default in banner mode', () => {
    const wrapper = mount(Alert, {
      props: {
        banner: true,
        title: 'Maintenance window'
      }
    })

    expect(wrapper.classes()).toContain('aheart-alert--warning')
    expect(wrapper.classes()).toContain('aheart-alert--banner')
    expect(wrapper.find('.aheart-alert__icon').exists()).toBe(true)
  })

  it('applies variant role and root class and style hooks', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Styled alert',
        variant: 'filled',
        role: 'status',
        className: 'legacy-alert-class',
        rootClassName: 'root-alert-class',
        style: { marginBlockStart: '12px' },
        classNames: {
          root: 'semantic-alert-root'
        },
        styles: {
          root: { borderRadius: '2px' }
        }
      }
    })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.classes()).toContain('aheart-alert--variant-filled')
    expect(wrapper.classes()).toContain('legacy-alert-class')
    expect(wrapper.classes()).toContain('root-alert-class')
    expect(wrapper.classes()).toContain('semantic-alert-root')
    expect(wrapper.attributes('style')).toContain('margin-block-start: 12px')
    expect(wrapper.attributes('style')).toContain('border-radius: 2px')
  })

  it('renders action prop and lets action slot override it', () => {
    const propWrapper = mount(Alert, {
      props: {
        title: 'Update available',
        action: 'Restart'
      }
    })
    const slotWrapper = mount(Alert, {
      props: {
        title: 'Update available',
        action: 'Restart'
      },
      slots: {
        action: '<button class="custom-action">Install</button>'
      }
    })

    expect(propWrapper.find('.aheart-alert__action').text()).toBe('Restart')
    expect(slotWrapper.find('.custom-action').text()).toBe('Install')
    expect(slotWrapper.text()).not.toContain('Restart')
  })

  it('renders custom icon and close icon content', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Custom controls',
        showIcon: true,
        icon: '?',
        closable: true,
        closeIcon: 'dismiss'
      }
    })

    expect(wrapper.find('.aheart-alert__icon').text()).toBe('?')
    expect(wrapper.find('.aheart-alert__close').text()).toBe('dismiss')
  })

  it('hides after close and emits close and afterClose', async () => {
    const wrapper = mount(Alert, {
      props: {
        closable: true,
        title: 'Dismiss me'
      }
    })

    await wrapper.find('.aheart-alert__close').trigger('click')

    expect(wrapper.find('.aheart-alert').exists()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('afterClose')).toHaveLength(1)
  })

  it('applies semantic class and style hooks to internal parts', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Semantic title',
        description: 'Semantic description',
        showIcon: true,
        action: 'Act',
        closable: true,
        classNames: {
          icon: 'semantic-icon',
          title: 'semantic-title',
          description: 'semantic-description',
          action: 'semantic-action',
          close: 'semantic-close'
        },
        styles: {
          icon: { color: 'rgb(22, 119, 255)' },
          title: { fontWeight: '700' },
          description: { marginTop: '4px' },
          action: { marginInlineStart: '16px' },
          close: { opacity: '0.5' }
        }
      }
    })

    expect(wrapper.find('.aheart-alert__icon').classes()).toContain('semantic-icon')
    expect(wrapper.find('.aheart-alert__icon').attributes('style')).toContain('color: rgb(22, 119, 255)')
    expect(wrapper.find('.aheart-alert__message').classes()).toContain('semantic-title')
    expect(wrapper.find('.aheart-alert__message').attributes('style')).toContain('font-weight: 700')
    expect(wrapper.find('.aheart-alert__description').classes()).toContain('semantic-description')
    expect(wrapper.find('.aheart-alert__description').attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.find('.aheart-alert__action').classes()).toContain('semantic-action')
    expect(wrapper.find('.aheart-alert__action').attributes('style')).toContain('margin-inline-start: 16px')
    expect(wrapper.find('.aheart-alert__close').classes()).toContain('semantic-close')
    expect(wrapper.find('.aheart-alert__close').attributes('style')).toContain('opacity: 0.5')
  })

  it('renders vnode content props for message description action icon and close icon', () => {
    const wrapper = mount(Alert, {
      props: {
        message: h('span', { class: 'message-node' }, 'Node message'),
        description: h('span', { class: 'description-node' }, 'Node description'),
        action: h('button', { class: 'action-node' }, 'Act'),
        icon: h('span', { class: 'icon-node' }, '?'),
        closeIcon: h('span', { class: 'close-node' }, 'Dismiss'),
        showIcon: true,
        closable: true
      }
    })

    expect(wrapper.find('.message-node').text()).toBe('Node message')
    expect(wrapper.find('.description-node').text()).toBe('Node description')
    expect(wrapper.find('.action-node').text()).toBe('Act')
    expect(wrapper.find('.icon-node').text()).toBe('?')
    expect(wrapper.find('.close-node').text()).toBe('Dismiss')
  })

  it('supports closable config callbacks aria attributes and close icon', async () => {
    const onClose = vi.fn()
    const afterClose = vi.fn()
    const wrapper = mount(Alert, {
      props: {
        message: 'Closable config',
        closable: {
          closeIcon: h('span', { class: 'configured-close' }, 'Close'),
          ariaLabel: 'Dismiss alert',
          ariaDescribedby: 'alert-help',
          onClose,
          afterClose
        }
      }
    })

    const button = wrapper.find('.aheart-alert__close')
    expect(button.attributes('aria-label')).toBe('Dismiss alert')
    expect(button.attributes('aria-describedby')).toBe('alert-help')
    expect(button.find('.configured-close').text()).toBe('Close')

    await button.trigger('click')

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(afterClose).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('afterClose')).toHaveLength(1)
    expect(wrapper.find('.aheart-alert').exists()).toBe(false)
  })

  it('supports Ant section and actions semantic aliases alongside local aliases', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Semantic alert',
        action: 'Details',
        classNames: {
          content: 'local-content',
          section: 'ant-section',
          action: 'local-action',
          actions: 'ant-actions'
        },
        styles: {
          content: { paddingInlineStart: '2px' },
          section: { paddingInlineEnd: '4px' },
          action: { marginInlineStart: '8px' },
          actions: { marginInlineEnd: '10px' }
        }
      }
    })

    const content = wrapper.find('.aheart-alert__content')
    expect(content.classes()).toEqual(expect.arrayContaining(['local-content', 'ant-section']))
    expect(content.attributes('style')).toContain('padding-inline-start: 2px')
    expect(content.attributes('style')).toContain('padding-inline-end: 4px')

    const action = wrapper.find('.aheart-alert__action')
    expect(action.classes()).toEqual(expect.arrayContaining(['local-action', 'ant-actions']))
    expect(action.attributes('style')).toContain('margin-inline-start: 8px')
    expect(action.attributes('style')).toContain('margin-inline-end: 10px')
  })
})
