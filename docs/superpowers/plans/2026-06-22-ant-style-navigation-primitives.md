# Ant Style Navigation Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first Ant-style Navigation primitives: Breadcrumb, Tabs, and Steps.

**Architecture:** Follow the existing Aheart component pattern with one directory per component, typed runtime props, local CSS, install wrapper, package root export, Vitest coverage, VitePress docs, and tracked `es` / `lib` outputs. Tabs and Steps consume ConfigProvider size so the global configuration layer continues to expand across categories.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Breadcrumb`
- `Tabs`
- `Steps`
- package root exports and plugin install registration
- docs pages and Ready status for these three components
- package build output refresh

This plan does not cover Dropdown, Menu, Anchor, or Pagination. Those need richer overlay, keyboard, routing, and data behavior and should be handled in later slices.

## References

- Ant Design Breadcrumb: `https://ant.design/components/breadcrumb/`
- Ant Design Tabs: `https://ant.design/components/tabs/`
- Ant Design Steps: `https://ant.design/components/steps/`

The implementation should mirror the useful API shape and documentation organization without copying Ant Design source code or prose.

## Files

- Create: `packages/components/src/breadcrumb/breadcrumb.vue`
- Create: `packages/components/src/breadcrumb/types.ts`
- Create: `packages/components/src/breadcrumb/style.css`
- Create: `packages/components/src/breadcrumb/index.ts`
- Create: `packages/components/src/breadcrumb/__tests__/breadcrumb.test.ts`
- Create: `packages/components/src/tabs/tabs.vue`
- Create: `packages/components/src/tabs/types.ts`
- Create: `packages/components/src/tabs/style.css`
- Create: `packages/components/src/tabs/index.ts`
- Create: `packages/components/src/tabs/__tests__/tabs.test.ts`
- Create: `packages/components/src/steps/steps.vue`
- Create: `packages/components/src/steps/types.ts`
- Create: `packages/components/src/steps/style.css`
- Create: `packages/components/src/steps/index.ts`
- Create: `packages/components/src/steps/__tests__/steps.test.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Modify: `docs/.vitepress/config.ts`
- Create: `docs/components/breadcrumb.md`
- Create: `docs/components/tabs.md`
- Create: `docs/components/steps.md`
- Modify: `packages/components/es/**`
- Modify: `packages/components/lib/**`

## Public API

### Breadcrumb

```ts
export interface BreadcrumbItem {
  title: string
  href?: string
  disabled?: boolean
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  separator?: string
}
```

Behavior:

- Render semantic `nav[aria-label="breadcrumb"]` with ordered list.
- Last item gets `aria-current="page"`.
- Items with `href` render links unless disabled or current.
- Disabled items render text with disabled styling.
- Separator defaults to `/`.

### Tabs

```ts
export interface TabItem {
  key: string
  label: string
  children?: string
  disabled?: boolean
}

export type TabsType = 'line' | 'card'

export interface TabsProps {
  items?: TabItem[]
  activeKey?: string
  defaultActiveKey?: string
  type?: TabsType
  size?: AheartSize
  centered?: boolean
}
```

Behavior:

- Render `role="tablist"`, tab buttons, and active `role="tabpanel"`.
- Support controlled `activeKey` and uncontrolled `defaultActiveKey`.
- Clicking an enabled tab emits `update:activeKey` and `change`.
- Disabled tabs do not emit or switch internal state.
- `size` resolves from local prop, then ConfigProvider, then `middle`.
- Active panel renders named slot `tab-${activeKey}` first, then `children`.

### Steps

```ts
export type StepStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepsDirection = 'horizontal' | 'vertical'

export interface StepItem {
  title: string
  description?: string
  status?: StepStatus
  disabled?: boolean
}

export interface StepsProps {
  items?: StepItem[]
  current?: number
  status?: StepStatus
  direction?: StepsDirection
  size?: AheartSize
}
```

Behavior:

- Render `role="list"` and `role="listitem"`.
- Derive item status from explicit item status, current index, and root `status`.
- Current step gets `aria-current="step"`.
- Clicking enabled non-current steps emits `change`.
- `size` resolves from local prop, then ConfigProvider, then `middle`.

## Task 1: Write Failing Navigation Tests

- [ ] **Step 1: Create Breadcrumb tests**

Create `packages/components/src/breadcrumb/__tests__/breadcrumb.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Breadcrumb from '../breadcrumb.vue'

describe('Breadcrumb', () => {
  it('renders linked items and marks the last item as current page', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home', href: '/' },
          { title: 'Components', href: '/components' },
          { title: 'Breadcrumb' }
        ]
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('breadcrumb')
    expect(wrapper.findAll('.aheart-breadcrumb__item')).toHaveLength(3)
    expect(wrapper.find('a[href="/"]').text()).toBe('Home')
    expect(wrapper.find('[aria-current="page"]').text()).toContain('Breadcrumb')
  })

  it('supports custom separators and disabled items', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        separator: '>',
        items: [
          { title: 'Home', href: '/' },
          { title: 'Admin', href: '/admin', disabled: true },
          { title: 'Users' }
        ]
      }
    })

    expect(wrapper.findAll('.aheart-breadcrumb__separator').map((item) => item.text())).toEqual(['>', '>'])
    expect(wrapper.find('.is-disabled').text()).toContain('Admin')
    expect(wrapper.findAll('a')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Create Tabs tests**

Create `packages/components/src/tabs/__tests__/tabs.test.ts`:

```ts
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
```

- [ ] **Step 3: Create Steps tests**

Create `packages/components/src/steps/__tests__/steps.test.ts`:

```ts
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
```

- [ ] **Step 4: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- breadcrumb tabs steps
```

Expected: FAIL because the three component implementations do not exist yet.

## Task 2: Implement Navigation Components

- [ ] **Step 1: Create Breadcrumb implementation**

Create `types.ts`, `breadcrumb.vue`, `style.css`, and `index.ts`. The implementation must use the public API in this plan, semantic navigation markup, disabled item handling, and `withInstall(Breadcrumb, 'ABreadcrumb')`.

- [ ] **Step 2: Create Tabs implementation**

Create `types.ts`, `tabs.vue`, `style.css`, and `index.ts`. The implementation must support controlled and uncontrolled active keys, disabled tabs, `update:activeKey`, `change`, ConfigProvider size fallback, `line` and `card` styles, and `withInstall(Tabs, 'ATabs')`.

- [ ] **Step 3: Create Steps implementation**

Create `types.ts`, `steps.vue`, `style.css`, and `index.ts`. The implementation must derive statuses, respect disabled items, emit `change`, support horizontal and vertical layouts, use ConfigProvider size fallback, and register `withInstall(Steps, 'ASteps')`.

- [ ] **Step 4: Update package root exports**

Modify `packages/components/src/index.ts` so `Breadcrumb`, `Tabs`, and `Steps` are imported, included in the `components` install array, and exported by name.

- [ ] **Step 5: Run tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- breadcrumb tabs steps
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit source**

```bash
git add packages/components/src/breadcrumb packages/components/src/tabs packages/components/src/steps packages/components/src/index.ts
git commit -m "feat: add navigation primitives"
```

## Task 3: Add Documentation

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Breadcrumb` becomes `Ready` with `link: '/components/breadcrumb'`.
- `Tabs` becomes `Ready` with `link: '/components/tabs'`.
- `Steps` becomes `Ready` with `link: '/components/steps'`.

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add:

- `Tabs 标签页`
- `Breadcrumb 面包屑`
- `Steps 步骤条`

- [ ] **Step 3: Create component docs**

Create:

- `docs/components/breadcrumb.md`
- `docs/components/tabs.md`
- `docs/components/steps.md`

Each page must include a Ready badge, short description, at least two demo panels, Vue code blocks, API table, events/slots when applicable, and theme token notes.

- [ ] **Step 4: Build docs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

- [ ] **Step 5: Commit docs**

Remove `docs/.vitepress/cache` if generated, then run:

```bash
git add docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/breadcrumb.md docs/components/tabs.md docs/components/steps.md
git commit -m "docs: add navigation primitive documentation"
```

## Task 4: Full Verification And Build Outputs

- [ ] **Step 1: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: all commands exit 0.

- [ ] **Step 2: Check declarations and docs exclusions**

Run:

```bash
test -f packages/components/es/breadcrumb/index.d.ts
test -f packages/components/es/tabs/index.d.ts
test -f packages/components/es/steps/index.d.ts
test -f packages/components/lib/breadcrumb/index.d.ts
test -f packages/components/lib/tabs/index.d.ts
test -f packages/components/lib/steps/index.d.ts
test ! -e docs/.vitepress/dist/superpowers
```

Expected: all commands exit 0.

- [ ] **Step 3: Commit build outputs**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update navigation component outputs"
```

- [ ] **Step 4: Final status**

Run:

```bash
git status --short --branch
```

Expected: clean branch.

## Self-Review

- Spec coverage: The plan advances the long-term Navigation category by making Breadcrumb, Tabs, and Steps real, documented, installable components.
- Placeholder scan: No `TBD`, `TODO`, or incomplete paths are present.
- Type consistency: API names are consistent across tests, implementation notes, and docs tasks.
