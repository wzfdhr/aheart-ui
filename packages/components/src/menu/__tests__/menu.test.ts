import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Menu from '../menu.vue'
import type { MenuItem } from '../types'

const items: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard' },
  {
    key: 'workspace',
    label: 'Workspace',
    children: [
      { key: 'projects', label: 'Projects' },
      { key: 'reports', label: 'Reports', disabled: true }
    ]
  },
  { type: 'group', key: 'manage', label: 'Manage', children: [{ key: 'users', label: 'Users' }] },
  { type: 'divider', key: 'divider' },
  { key: 'danger', label: 'Delete', danger: true }
]

describe('Menu', () => {
  it('renders items, groups, dividers, and submenu children', () => {
    const wrapper = mount(Menu, {
      props: { items, defaultOpenKeys: ['workspace'] }
    })

    expect(wrapper.classes()).toContain('aheart-menu')
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Projects')
    expect(wrapper.text()).toContain('Manage')
    expect(wrapper.find('.aheart-menu__divider').exists()).toBe(true)
  })

  it('selects an item and emits click and select', async () => {
    const wrapper = mount(Menu, {
      props: { items }
    })

    await wrapper.find('[data-menu-key="dashboard"]').trigger('click')

    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ key: 'dashboard' })
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ key: 'dashboard', selectedKeys: ['dashboard'] })
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['dashboard']])
  })

  it('supports multiple selection and deselect', async () => {
    const wrapper = mount(Menu, {
      props: { items, multiple: true, defaultSelectedKeys: ['dashboard'] }
    })

    await wrapper.find('[data-menu-key="users"]').trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['dashboard', 'users']])

    await wrapper.find('[data-menu-key="dashboard"]').trigger('click')
    expect(wrapper.emitted('deselect')?.[0]?.[0]).toMatchObject({ key: 'dashboard', selectedKeys: ['users'] })
  })

  it('toggles submenu open keys', async () => {
    const wrapper = mount(Menu, {
      props: { items }
    })

    await wrapper.find('[data-submenu-key="workspace"]').trigger('click')

    expect(wrapper.emitted('openChange')?.[0]).toEqual([['workspace']])
    expect(wrapper.emitted('update:openKeys')?.[0]).toEqual([['workspace']])
  })

  it('uses ConfigProvider disabled fallback', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Menu, { items })
          }
        }
      }
    })

    const menu = wrapper.findComponent(Menu)
    await menu.find('[data-menu-key="dashboard"]').trigger('click')

    expect(menu.classes()).toContain('is-disabled')
    expect(menu.emitted('click')).toBeUndefined()
  })
})
