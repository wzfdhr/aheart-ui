import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Tabs from '../tabs.vue'

const items = [
  { key: 'overview', label: 'Overview', children: 'Overview panel' },
  { key: 'settings', label: 'Settings', children: 'Settings panel' },
  { key: 'disabled', label: 'Disabled', children: 'Disabled panel', disabled: true }
]

describe('Tabs', () => {
  it('renders the first tab as active by default', () => {
    const wrapper = mount(Tabs, {
      props: { items }
    })

    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    expect(wrapper.find('[aria-selected="true"]').text()).toContain('Overview')
    expect(wrapper.find('[role="tabpanel"]').text()).toContain('Overview panel')
  })

  it('emits update and change when an enabled tab is clicked', async () => {
    const wrapper = mount(Tabs, {
      props: { items }
    })

    await wrapper.findAll('[role="tab"]')[1].trigger('click')

    expect(wrapper.emitted('update:activeKey')?.[0]).toEqual(['settings'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['settings'])
    expect(wrapper.find('[aria-selected="true"]').text()).toContain('Settings')
  })

  it('does not switch or emit when a disabled tab is clicked', async () => {
    const wrapper = mount(Tabs, {
      props: { items }
    })

    await wrapper.findAll('[role="tab"]')[2].trigger('click')

    expect(wrapper.emitted('update:activeKey')).toBeUndefined()
    expect(wrapper.find('[aria-selected="true"]').text()).toContain('Overview')
  })

  it('uses controlled activeKey and ConfigProvider size fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large' },
      slots: {
        default: {
          render() {
            return h(Tabs, { items, activeKey: 'settings' })
          }
        }
      }
    })

    const tabs = wrapper.findComponent(Tabs)
    expect(tabs.classes()).toContain('aheart-tabs--large')
    expect(tabs.find('[aria-selected="true"]').text()).toContain('Settings')
  })
})
