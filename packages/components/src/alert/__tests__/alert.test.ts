import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
})
