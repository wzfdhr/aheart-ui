import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Steps from '../steps.vue'

const items = [
  { title: 'Finished', description: 'This step is complete.' },
  { title: 'In Progress', description: 'This step is active.' },
  { title: 'Waiting', description: 'This step is upcoming.' }
]

describe('Steps', () => {
  it('derives finish, process, and wait statuses from current', () => {
    const wrapper = mount(Steps, {
      props: { items, current: 1 }
    })

    const steps = wrapper.findAll('.aheart-steps__item')
    expect(wrapper.attributes('role')).toBe('list')
    expect(steps[0].classes()).toContain('aheart-steps__item--finish')
    expect(steps[1].classes()).toContain('aheart-steps__item--process')
    expect(steps[1].attributes('aria-current')).toBe('step')
    expect(steps[2].classes()).toContain('aheart-steps__item--wait')
  })

  it('emits change when an enabled non-current step is clicked', async () => {
    const wrapper = mount(Steps, {
      props: { items, current: 0 }
    })

    await wrapper.findAll('.aheart-steps__button')[1].trigger('click')

    expect(wrapper.emitted('change')?.[0]).toEqual([1])
  })

  it('respects disabled items and explicit error status', async () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        items: [
          { title: 'Account' },
          { title: 'Billing', status: 'error' },
          { title: 'Confirm', disabled: true }
        ]
      }
    })

    await wrapper.findAll('.aheart-steps__button')[2].trigger('click')

    expect(wrapper.findAll('.aheart-steps__item')[1].classes()).toContain('aheart-steps__item--error')
    expect(wrapper.findAll('.aheart-steps__item')[2].classes()).toContain('is-disabled')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('uses vertical direction and ConfigProvider size fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: {
        default: {
          render() {
            return h(Steps, { items, current: 1, direction: 'vertical' })
          }
        }
      }
    })

    const steps = wrapper.findComponent(Steps)
    expect(steps.classes()).toContain('aheart-steps--vertical')
    expect(steps.classes()).toContain('aheart-steps--small')
  })
})
