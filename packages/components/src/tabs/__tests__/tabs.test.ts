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

const iconItems = [
  { key: 'overview', label: 'Overview', icon: 'O', children: 'Overview panel' },
  { key: 'settings', label: 'Settings', icon: 'S', children: 'Settings panel' },
  { key: 'disabled', label: 'Disabled', icon: 'D', children: 'Disabled panel', disabled: true }
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

  it('renders placement alias gutter extra content and item icons', () => {
    const wrapper = mount(Tabs, {
      props: {
        items: iconItems,
        tabPosition: 'left',
        tabBarGutter: 18,
        tabBarExtraContent: { left: 'Filters', right: 'Actions' }
      }
    })

    expect(wrapper.classes()).toContain('aheart-tabs--placement-start')
    expect(wrapper.find('.aheart-tabs__nav-list').attributes('style')).toContain('--aheart-tabs-gutter: 18px')
    expect(wrapper.find('.aheart-tabs__extra--left').text()).toBe('Filters')
    expect(wrapper.find('.aheart-tabs__extra--right').text()).toBe('Actions')
    expect(wrapper.findAll('.aheart-tabs__tab-icon').map((icon) => icon.text())).toEqual(['O', 'S', 'D'])
  })

  it('renders animated and indicator configuration', () => {
    const wrapper = mount(Tabs, {
      props: {
        items,
        activeKey: 'settings',
        animated: { inkBar: true, tabPane: true },
        indicator: { size: 24, align: 'center' }
      }
    })

    expect(wrapper.classes()).toContain('is-ink-bar-animated')
    expect(wrapper.classes()).toContain('is-tab-pane-animated')
    const activeTab = wrapper.find('.aheart-tabs__tab.is-active')
    expect(activeTab.classes()).toContain('aheart-tabs__tab--indicator-center')
    expect(activeTab.attributes('style')).toContain('--aheart-tabs-indicator-size: 24px')
  })

  it('emits tabClick for enabled tabs including active tabs', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultActiveKey: 'overview' }
    })

    await wrapper.findAll('[role="tab"]')[0].trigger('click')
    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    await wrapper.findAll('[role="tab"]')[2].trigger('click')

    expect(wrapper.emitted('tabClick')?.[0]?.[0]).toBe('overview')
    expect(wrapper.emitted('tabClick')?.[1]?.[0]).toBe('settings')
    expect(wrapper.emitted('tabClick')).toHaveLength(2)
    expect(wrapper.emitted('update:activeKey')?.[0]).toEqual(['settings'])
  })

  it('applies root and semantic class and style hooks', () => {
    const wrapper = mount(Tabs, {
      props: {
        items: iconItems,
        activeKey: 'settings',
        tabBarExtraContent: { left: 'Filters', right: 'Actions' },
        className: 'tabs-class',
        rootClassName: 'tabs-root',
        style: 'color: red;',
        classNames: {
          root: 'semantic-root',
          nav: 'semantic-nav',
          navList: 'semantic-nav-list',
          tab: 'semantic-tab',
          activeTab: 'semantic-active-tab',
          tabIcon: 'semantic-tab-icon',
          tabLabel: 'semantic-tab-label',
          panel: 'semantic-panel',
          extra: 'semantic-extra',
          extraLeft: 'semantic-extra-left',
          extraRight: 'semantic-extra-right'
        },
        styles: {
          root: { backgroundColor: 'blue' },
          nav: { marginBottom: '8px' },
          navList: { gap: '12px' },
          tab: { minWidth: '80px' },
          activeTab: { fontWeight: 700 },
          tabIcon: { color: 'green' },
          tabLabel: { letterSpacing: '1px' },
          panel: { paddingTop: '16px' },
          extra: { color: 'purple' },
          extraLeft: { order: -1 },
          extraRight: { order: 2 }
        }
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['tabs-class', 'tabs-root', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.attributes('style')).toContain('background-color: blue')
    expect(wrapper.find('.aheart-tabs__nav').classes()).toContain('semantic-nav')
    expect(wrapper.find('.aheart-tabs__nav').attributes('style')).toContain('margin-bottom: 8px')
    expect(wrapper.find('.aheart-tabs__nav-list').classes()).toContain('semantic-nav-list')
    expect(wrapper.find('.aheart-tabs__tab').classes()).toContain('semantic-tab')
    expect(wrapper.find('.aheart-tabs__tab.is-active').classes()).toContain('semantic-active-tab')
    expect(wrapper.find('.aheart-tabs__tab-icon').classes()).toContain('semantic-tab-icon')
    expect(wrapper.find('.aheart-tabs__tab-label').classes()).toContain('semantic-tab-label')
    expect(wrapper.find('.aheart-tabs__panel').classes()).toContain('semantic-panel')
    expect(wrapper.find('.aheart-tabs__extra--left').classes()).toEqual(expect.arrayContaining(['semantic-extra', 'semantic-extra-left']))
    expect(wrapper.find('.aheart-tabs__extra--right').classes()).toEqual(expect.arrayContaining(['semantic-extra', 'semantic-extra-right']))
  })
})
