# Ant Style Display Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Card, Descriptions, and Pagination as Ready Data Display components.

**Architecture:** Follow the established Aheart component layout with typed props, local CSS, install entries, package root exports, tests, VitePress docs, and tracked build outputs. Card and Descriptions consume ConfigProvider size; Pagination consumes ConfigProvider size and disabled state.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Card`
- `Descriptions`
- `Pagination`
- package root exports and plugin install
- docs pages and Ready status
- package build output refresh

This plan does not cover Table, Card.Grid, Card.Meta, editable descriptions, router integration, or pagination page-size changer UI.

## Task 1: Write Failing Tests

**Files:**
- Create: `packages/components/src/card/__tests__/card.test.ts`
- Create: `packages/components/src/descriptions/__tests__/descriptions.test.ts`
- Create: `packages/components/src/pagination/__tests__/pagination.test.ts`

- [ ] **Step 1: Create Card tests**

Create `packages/components/src/card/__tests__/card.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Card from '../card.vue'

describe('Card', () => {
  it('renders title, extra, default content, cover, and actions', () => {
    const wrapper = mount(Card, {
      props: { title: 'Project', extra: 'More' },
      slots: {
        cover: '<div class="cover">Cover</div>',
        default: '<p>Card body</p>',
        actions: '<button>Open</button>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-card')
    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.text()).toContain('Project')
    expect(wrapper.text()).toContain('More')
    expect(wrapper.find('.cover').exists()).toBe(true)
    expect(wrapper.text()).toContain('Card body')
    expect(wrapper.find('.aheart-card__actions button').text()).toBe('Open')
  })

  it('renders loading and variant classes with ConfigProvider size fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: {
        default: {
          render() {
            return h(Card, { loading: true, bordered: false, hoverable: true }, () => 'Hidden')
          }
        }
      }
    })

    const card = wrapper.findComponent(Card)
    expect(card.classes()).toContain('aheart-card--small')
    expect(card.classes()).toContain('is-borderless')
    expect(card.classes()).toContain('is-hoverable')
    expect(card.find('.aheart-card__loading').exists()).toBe(true)
    expect(card.text()).not.toContain('Hidden')
  })
})
```

- [ ] **Step 2: Create Descriptions tests**

Create `packages/components/src/descriptions/__tests__/descriptions.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Descriptions from '../descriptions.vue'

const items = [
  { label: 'User', content: 'Ada' },
  { label: 'Role', content: 'Admin' },
  { label: 'Status', content: 'Active', span: 2 }
]

describe('Descriptions', () => {
  it('renders title, extra, items, and table semantics', () => {
    const wrapper = mount(Descriptions, {
      props: { title: 'Profile', extra: 'Updated', items }
    })

    expect(wrapper.classes()).toContain('aheart-descriptions')
    expect(wrapper.find('[role="table"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="row"]').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Profile')
    expect(wrapper.text()).toContain('Updated')
    expect(wrapper.text()).toContain('Ada')
    expect(wrapper.text()).toContain('Active')
  })

  it('applies bordered, vertical, column, and ConfigProvider size classes', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large' },
      slots: {
        default: {
          render() {
            return h(Descriptions, { items, bordered: true, layout: 'vertical', column: 2 })
          }
        }
      }
    })

    const descriptions = wrapper.findComponent(Descriptions)
    expect(descriptions.classes()).toContain('aheart-descriptions--large')
    expect(descriptions.classes()).toContain('is-bordered')
    expect(descriptions.classes()).toContain('aheart-descriptions--vertical')
    expect(descriptions.attributes('style')).toContain('--aheart-descriptions-column: 2')
  })
})
```

- [ ] **Step 3: Create Pagination tests**

Create `packages/components/src/pagination/__tests__/pagination.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Pagination from '../pagination.vue'

describe('Pagination', () => {
  it('renders page buttons and total text', () => {
    const wrapper = mount(Pagination, {
      props: { total: 42, pageSize: 10, current: 2, showTotal: true }
    })

    expect(wrapper.attributes('aria-label')).toBe('pagination')
    expect(wrapper.text()).toContain('Total 42 items')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
    expect(wrapper.findAll('.aheart-pagination__page')).toHaveLength(5)
  })

  it('emits current updates when page and next buttons are clicked', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, defaultCurrent: 1, pageSize: 10 }
    })

    await wrapper.findAll('.aheart-pagination__page')[1].trigger('click')
    await wrapper.find('.aheart-pagination__next').trigger('click')

    expect(wrapper.emitted('update:current')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([2, 10])
    expect(wrapper.emitted('update:current')?.[1]).toEqual([3])
  })

  it('renders simple mode and respects ConfigProvider disabled and size', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true, size: 'small' },
      slots: {
        default: {
          render() {
            return h(Pagination, { total: 20, current: 1, pageSize: 10, simple: true })
          }
        }
      }
    })

    const pagination = wrapper.findComponent(Pagination)
    expect(pagination.classes()).toContain('aheart-pagination--small')
    expect(pagination.find('.aheart-pagination__simple').text()).toBe('1 / 2')
    expect(pagination.find('button').attributes()).toHaveProperty('disabled')
  })

  it('hides on single page when hideOnSinglePage is true', () => {
    const wrapper = mount(Pagination, {
      props: { total: 5, pageSize: 10, hideOnSinglePage: true }
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })
})
```

- [ ] **Step 4: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card descriptions pagination
```

Expected: FAIL because implementation files do not exist yet.

## Task 2: Implement Components

- [ ] **Step 1: Create component files**

Create typed props, Vue implementation, CSS, and install entry for:

- `packages/components/src/card`
- `packages/components/src/descriptions`
- `packages/components/src/pagination`

Each component must match the API in `docs/superpowers/specs/2026-06-22-ant-style-display-navigation-design.md`.

- [ ] **Step 2: Update package root exports**

Modify `packages/components/src/index.ts` so each new component is imported, registered in the `components` array, and exported by name.

- [ ] **Step 3: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card descriptions pagination
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit source**

```bash
git add packages/components/src/card packages/components/src/descriptions packages/components/src/pagination packages/components/src/index.ts
git commit -m "feat: add display navigation components"
```

## Task 3: Add Documentation

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Card` -> Ready with `/components/card`
- `Descriptions` -> Ready with `/components/descriptions`
- `Pagination` -> Ready with `/components/pagination`

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add:

- `Card 卡片`
- `Descriptions 描述列表`
- `Pagination 分页`

- [ ] **Step 3: Create component docs**

Create:

- `docs/components/card.md`
- `docs/components/descriptions.md`
- `docs/components/pagination.md`

Each page must include a Ready badge, description, demos, Vue code, API table, events or slots where applicable, and theme token notes.

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Remove `docs/.vitepress/cache` if generated, then commit:

```bash
git add docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/card.md docs/components/descriptions.md docs/components/pagination.md
git commit -m "docs: add display navigation documentation"
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
test -f packages/components/es/card/index.d.ts
test -f packages/components/es/descriptions/index.d.ts
test -f packages/components/es/pagination/index.d.ts
test -f packages/components/lib/card/index.d.ts
test -f packages/components/lib/descriptions/index.d.ts
test -f packages/components/lib/pagination/index.d.ts
test ! -e docs/.vitepress/dist/superpowers
```

Expected: all commands exit 0.

- [ ] **Step 3: Commit build outputs**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update display navigation outputs"
```

- [ ] **Step 4: Final status**

Run:

```bash
git status --short --branch
```

Expected: clean branch.

## Self-Review

- Spec coverage: Card, Descriptions, and Pagination are covered by tests, implementation, docs, and build output tasks.
- Placeholder scan: No unresolved placeholder markers are present.
- Type consistency: Component names, props, and event names match the design doc and tests.
