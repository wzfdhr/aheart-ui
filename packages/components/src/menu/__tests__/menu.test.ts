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

  it('applies root and semantic class/style hooks with inline indentation', () => {
    const wrapper = mount(Menu, {
      props: {
        items: [{ key: 'dashboard', label: 'Dashboard' }],
        inlineIndent: 32,
        className: 'custom-menu',
        style: { borderColor: 'red' },
        classNames: {
          root: 'semantic-root',
          list: 'semantic-list',
          item: 'semantic-item',
          itemButton: 'semantic-button',
          label: 'semantic-label'
        },
        styles: {
          root: { marginTop: '4px' },
          list: { gap: '6px' },
          itemButton: { minHeight: '36px' }
        }
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom-menu', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('--aheart-menu-inline-indent: 32px')
    expect(wrapper.attributes('style')).toContain('border-color: red')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.find('.aheart-menu__list').classes()).toContain('semantic-list')
    expect(wrapper.find('.aheart-menu__list').attributes('style')).toContain('gap: 6px')
    expect(wrapper.find('.aheart-menu__item').classes()).toContain('semantic-item')
    expect(wrapper.find('.aheart-menu__item-button').classes()).toContain('semantic-button')
    expect(wrapper.find('.aheart-menu__item-button').attributes('style')).toContain('min-height: 36px')
    expect(wrapper.find('.aheart-menu__label').classes()).toContain('semantic-label')
  })

  it('renders icon, extra, title, and dashed divider item fields', () => {
    const wrapper = mount(Menu, {
      props: {
        items: [
          {
            key: 'command',
            label: h('span', { class: 'custom-label' }, 'Command'),
            icon: h('span', { class: 'custom-icon' }, 'I'),
            extra: h('kbd', { class: 'custom-extra' }, 'Ctrl K'),
            title: 'Open command menu'
          },
          { type: 'divider', key: 'split', dashed: true }
        ]
      }
    })

    expect(wrapper.find('.aheart-menu__icon .custom-icon').text()).toBe('I')
    expect(wrapper.find('.aheart-menu__label .custom-label').text()).toBe('Command')
    expect(wrapper.find('.aheart-menu__extra .custom-extra').text()).toBe('Ctrl K')
    expect(wrapper.find('[data-menu-key="command"]').attributes('title')).toBe('Open command menu')
    expect(wrapper.find('.aheart-menu__divider').classes()).toContain('is-dashed')
  })

  it('keeps submenu DOM mounted when forceSubMenuRender is true', () => {
    const wrapper = mount(Menu, {
      props: {
        forceSubMenuRender: true,
        items: [
          {
            key: 'workspace',
            label: 'Workspace',
            children: [{ key: 'projects', label: 'Projects' }]
          }
        ]
      }
    })

    expect(wrapper.find('[data-menu-key="projects"]').exists()).toBe(true)
    expect(wrapper.find('.aheart-menu__submenu-list').attributes('style')).toContain('display: none')
  })

  it('can open and close submenus by hover instead of click', async () => {
    const wrapper = mount(Menu, {
      props: {
        triggerSubMenuAction: 'hover',
        forceSubMenuRender: true,
        items: [
          {
            key: 'workspace',
            label: 'Workspace',
            children: [{ key: 'projects', label: 'Projects' }]
          }
        ]
      }
    })

    await wrapper.find('[data-submenu-key="workspace"]').trigger('click')
    expect(wrapper.emitted('openChange')).toBeUndefined()

    await wrapper.find('.aheart-menu__submenu').trigger('mouseenter')
    expect(wrapper.emitted('openChange')?.[0]).toEqual([['workspace']])
    expect(wrapper.find('.aheart-menu__submenu-list').attributes('style') ?? '').not.toContain('display: none')

    await wrapper.find('.aheart-menu__submenu').trigger('mouseleave')
    expect(wrapper.emitted('openChange')?.[1]).toEqual([[]])
    expect(wrapper.find('.aheart-menu__submenu-list').attributes('style')).toContain('display: none')
  })

  it('renders custom expand icons with submenu state', async () => {
    const wrapper = mount(Menu, {
      props: {
        items: [
          {
            key: 'workspace',
            label: 'Workspace',
            children: [{ key: 'projects', label: 'Projects' }]
          }
        ],
        expandIcon: ({ isOpen }: { isOpen: boolean }) =>
          h('span', { class: 'custom-expand' }, isOpen ? 'open' : 'closed')
      }
    })

    expect(wrapper.find('.aheart-menu__expand-icon .custom-expand').text()).toBe('closed')

    await wrapper.find('[data-submenu-key="workspace"]').trigger('click')

    expect(wrapper.find('.aheart-menu__expand-icon .custom-expand').text()).toBe('open')
  })
})
