import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Message, { message } from '../index'

afterEach(() => {
  vi.useRealTimers()
  message.destroy()
  document.body.querySelectorAll('.custom-message-container').forEach((node) => node.remove())
})

describe('Message', () => {
  it('renders notices and emits close', async () => {
    const wrapper = mount(Message, {
      props: {
        notices: [
          { key: 'saved', type: 'success', content: 'Saved' },
          { key: 'failed', type: 'error', content: 'Failed' }
        ]
      }
    })

    expect(wrapper.classes()).toContain('aheart-message')
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('Failed')
    expect(wrapper.find('.aheart-message-notice--success').exists()).toBe(true)

    await wrapper.find('.aheart-message-notice__close').trigger('click')

    expect(wrapper.emitted('close')?.[0]).toEqual(['saved'])
  })

  it('message.success mounts a global persistent notice', async () => {
    message.success('Saved', 0)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(document.body.querySelector('.aheart-message')).toBeTruthy()
    expect(document.body.textContent).toContain('Saved')
  })

  it('updates notices by key', async () => {
    message.loading({ key: 'upload', content: 'Uploading', duration: 0 })
    message.success({ key: 'upload', content: 'Uploaded', duration: 0 })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(document.body.textContent).not.toContain('Uploading')
    expect(document.body.textContent).toContain('Uploaded')
    expect(document.body.querySelectorAll('.aheart-message-notice')).toHaveLength(1)
  })

  it('applies top and maxCount config', async () => {
    message.config({ top: 32, maxCount: 1 })
    message.info('First', 0)
    message.warning('Second', 0)
    await new Promise((resolve) => setTimeout(resolve, 0))

    const host = document.body.querySelector('.aheart-message') as HTMLElement
    expect(host.getAttribute('style')).toContain('top: 32px')
    expect(document.body.textContent).not.toContain('First')
    expect(document.body.textContent).toContain('Second')
  })

  it('destroys notices by key or all notices', async () => {
    message.info({ key: 'one', content: 'One', duration: 0 })
    message.info({ key: 'two', content: 'Two', duration: 0 })
    await new Promise((resolve) => setTimeout(resolve, 0))

    message.destroy('one')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(document.body.textContent).not.toContain('One')
    expect(document.body.textContent).toContain('Two')

    message.destroy()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(document.body.querySelectorAll('.aheart-message-notice')).toHaveLength(0)
  })

  it('renders custom content icon classes styles and click handlers', async () => {
    const handleClick = vi.fn()
    const wrapper = mount(Message, {
      props: {
        notices: [
          {
            key: 'custom',
            type: 'info',
            content: h('strong', { class: 'custom-content-node' }, 'VNode content'),
            icon: h('span', { class: 'custom-icon-node' }, 'Icon'),
            className: 'custom-notice',
            style: { width: '240px' },
            onClick: handleClick
          }
        ]
      }
    })

    const notice = wrapper.find('.aheart-message-notice')
    expect(notice.classes()).toContain('custom-notice')
    expect(notice.attributes('style')).toContain('width: 240px')
    expect(wrapper.find('.custom-content-node').text()).toBe('VNode content')
    expect(wrapper.find('.custom-icon-node').text()).toBe('Icon')

    await notice.trigger('click')

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies semantic classes and styles', () => {
    const wrapper = mount(Message, {
      props: {
        classNames: {
          root: 'semantic-root',
          notice: 'semantic-notice',
          icon: 'semantic-icon',
          content: 'semantic-content',
          close: 'semantic-close'
        },
        styles: {
          root: { top: '24px' },
          notice: { minWidth: '180px' },
          icon: { fontSize: '18px' },
          content: { fontWeight: '600' },
          close: { color: 'rgb(1, 2, 3)' }
        },
        notices: [{ key: 'semantic', type: 'success', content: 'Semantic' }]
      }
    })

    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('top: 24px')
    expect(wrapper.find('.aheart-message-notice').classes()).toContain('semantic-notice')
    expect(wrapper.find('.aheart-message-notice').attributes('style')).toContain('min-width: 180px')
    expect(wrapper.find('.aheart-message-notice__icon').classes()).toContain('semantic-icon')
    expect(wrapper.find('.aheart-message-notice__icon').attributes('style')).toContain('font-size: 18px')
    expect(wrapper.find('.aheart-message-notice__content').classes()).toContain('semantic-content')
    expect(wrapper.find('.aheart-message-notice__content').attributes('style')).toContain('font-weight: 600')
    expect(wrapper.find('.aheart-message-notice__close').classes()).toContain('semantic-close')
    expect(wrapper.find('.aheart-message-notice__close').attributes('style')).toContain('color: rgb(1, 2, 3)')
  })

  it('returns a thenable handle that resolves after close', async () => {
    vi.useFakeTimers()
    const afterClose = vi.fn()

    const handle = message.success('Saved', 0.1)
    handle.then(afterClose)
    await nextTick()

    expect(afterClose).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)
    await nextTick()

    expect(afterClose).toHaveBeenCalledTimes(1)
    expect(document.body.textContent).not.toContain('Saved')
  })

  it('supports custom container prefixCls and rtl config', async () => {
    const container = document.createElement('section')
    container.className = 'custom-message-container'
    document.body.appendChild(container)

    message.config({
      getContainer: () => container,
      prefixCls: 'custom-message',
      rtl: true
    })
    message.info('Custom host', 0)
    await nextTick()

    expect(container.querySelector('.aheart-message')).toBeTruthy()
    expect(container.querySelector('.custom-message')).toBeTruthy()
    expect(container.querySelector('.custom-message-notice')).toBeTruthy()
    expect(container.querySelector('.aheart-message')?.classList.contains('is-rtl')).toBe(true)
    expect(document.body.textContent).toContain('Custom host')
  })

  it('pauses auto close while hovered', async () => {
    vi.useFakeTimers()

    message.config({ pauseOnHover: true })
    message.info('Hover me', 0.2)
    await nextTick()

    const notice = document.body.querySelector('.aheart-message-notice') as HTMLElement
    notice.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(250)
    await nextTick()

    expect(document.body.textContent).toContain('Hover me')

    notice.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(250)
    await nextTick()

    expect(document.body.textContent).not.toContain('Hover me')
  })

  it('pauses auto close while hovered by default', async () => {
    vi.useFakeTimers()

    message.info('Default hover pause', 0.2)
    await nextTick()

    const notice = document.body.querySelector('.aheart-message-notice') as HTMLElement
    notice.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(250)
    await nextTick()

    expect(document.body.textContent).toContain('Default hover pause')

    notice.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(250)
    await nextTick()

    expect(document.body.textContent).not.toContain('Default hover pause')
  })
})
