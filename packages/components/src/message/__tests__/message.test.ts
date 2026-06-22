import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Message, { message } from '../index'

afterEach(() => {
  message.destroy()
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
})
