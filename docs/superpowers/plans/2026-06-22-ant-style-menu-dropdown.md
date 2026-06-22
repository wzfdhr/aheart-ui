# Ant Style Menu Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Menu and Dropdown as Ready Navigation components.

**Architecture:** Menu renders Ant-style item trees through a focused recursive menu node component and manages selected/open key state. Dropdown wraps a trigger and uses Menu as its overlay, supporting click/hover triggers, placement classes, controlled open state, and ConfigProvider disabled fallback.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Menu`
- `Dropdown`
- package root exports and plugin install
- docs pages and Ready status
- package build output refresh

This plan does not cover portal rendering, motion choreography, keyboard roving focus, horizontal overflow measurement, cascading context menus, or arbitrary overlay content.

## Task 1: Write Failing Tests

**Files:**
- Create: `packages/components/src/menu/__tests__/menu.test.ts`
- Create: `packages/components/src/dropdown/__tests__/dropdown.test.ts`

- [ ] **Step 1: Create Menu tests**

Create `packages/components/src/menu/__tests__/menu.test.ts`:

```ts
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
```

- [ ] **Step 2: Create Dropdown tests**

Create `packages/components/src/dropdown/__tests__/dropdown.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Dropdown from '../dropdown.vue'

const menu = {
  items: [
    { key: 'edit', label: 'Edit' },
    { key: 'archive', label: 'Archive' }
  ]
}

describe('Dropdown', () => {
  it('renders trigger slot and opens on click', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu },
      slots: { default: '<button>Actions</button>' }
    })

    expect(wrapper.text()).toContain('Actions')
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
  })

  it('opens on hover when trigger includes hover', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, trigger: ['hover'] },
      slots: { default: '<button>More</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
  })

  it('supports controlled open state', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, open: false },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('emits menu click and closes after item click', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, defaultOpen: true },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('[data-menu-key="edit"]').trigger('click')

    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ key: 'edit' })
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)
  })

  it('uses ConfigProvider disabled fallback', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Dropdown, { menu }, () => h('button', 'Actions'))
          }
        }
      }
    })

    const dropdown = wrapper.findComponent(Dropdown)
    await dropdown.find('.aheart-dropdown__trigger').trigger('click')

    expect(dropdown.classes()).toContain('is-disabled')
    expect(dropdown.find('.aheart-dropdown__overlay').exists()).toBe(false)
  })
})
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- menu dropdown
```

Expected: FAIL because Menu and Dropdown implementation files do not exist.

## Task 2: Implement Menu And Dropdown

**Files:**
- Create: `packages/components/src/menu/menu.vue`
- Create: `packages/components/src/menu/menu-node.vue`
- Create: `packages/components/src/menu/types.ts`
- Create: `packages/components/src/menu/style.css`
- Create: `packages/components/src/menu/index.ts`
- Create: `packages/components/src/dropdown/dropdown.vue`
- Create: `packages/components/src/dropdown/types.ts`
- Create: `packages/components/src/dropdown/style.css`
- Create: `packages/components/src/dropdown/index.ts`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Create component files**

Create component files matching `docs/superpowers/specs/2026-06-22-ant-style-menu-dropdown-design.md`.

The implementation must:

- render Menu item, submenu, group, and divider nodes
- support Menu `selectedKeys`, `defaultSelectedKeys`, `openKeys`, `defaultOpenKeys`, `multiple`, `selectable`, `mode`, `theme`, `inlineCollapsed`, and `disabled`
- emit Menu `click`, `select`, `deselect`, `openChange`, `update:selectedKeys`, and `update:openKeys`
- render Dropdown trigger and Menu overlay
- support Dropdown `menu`, `trigger`, `placement`, `open`, `defaultOpen`, `disabled`, and `arrow`
- emit Dropdown `update:open`, `openChange`, and `click`
- use ConfigProvider disabled fallback in both components

- [ ] **Step 2: Update package root exports**

Modify `packages/components/src/index.ts` so Menu and Dropdown are imported, registered, and exported by name.

- [ ] **Step 3: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- menu dropdown
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit source**

```bash
git add packages/components/src/menu packages/components/src/dropdown packages/components/src/index.ts
git commit -m "feat: add menu and dropdown components"
```

## Task 3: Add Documentation

**Files:**
- Modify: `docs/.vitepress/data/components.ts`
- Modify: `docs/.vitepress/config.ts`
- Create: `docs/components/menu.md`
- Create: `docs/components/dropdown.md`

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Dropdown` -> Ready with `/components/dropdown`
- `Menu` -> Ready with `/components/menu`

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add:

- `Dropdown 下拉菜单`
- `Menu 导航菜单`

- [ ] **Step 3: Create component docs**

Create `docs/components/menu.md` and `docs/components/dropdown.md` with:

- Ready badge
- basic usage demos
- controlled state demos
- nested/disabled demos
- API tables
- event tables
- item shape tables
- theme token notes

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

Then commit:

```bash
git add docs/.vitepress/data/components.ts docs/.vitepress/config.ts docs/components/menu.md docs/components/dropdown.md
git commit -m "docs: add menu and dropdown documentation"
```

## Task 4: Full Verification And Build Output

**Files:**
- Modify generated package output under `packages/components/es`
- Modify generated package output under `packages/components/lib`

- [ ] **Step 1: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: all commands exit 0.

- [ ] **Step 2: Check declaration output and docs exclusions**

Run:

```bash
test -f packages/components/es/menu/index.d.ts && test -f packages/components/es/dropdown/index.d.ts && test -f packages/components/lib/menu/index.d.ts && test -f packages/components/lib/dropdown/index.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo declarations-and-docs-ok
```

Expected: `declarations-and-docs-ok`

- [ ] **Step 3: Remove generated VitePress cache**

Run:

```bash
test ! -d docs/.vitepress/cache || rm -rf docs/.vitepress/cache
```

- [ ] **Step 4: Commit build output**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update menu and dropdown outputs"
```

## Self-Review

- Spec coverage: all Menu and Dropdown design requirements map to tests, implementation, docs, and build output tasks.
- Placeholder scan: the plan contains no TBD/TODO/fill-in placeholders.
- Type consistency: `MenuItem`, `DropdownMenuConfig`, `selectedKeys`, `openKeys`, and Dropdown open events are consistent across the plan.
