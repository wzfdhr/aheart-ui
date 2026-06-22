# Ant Style Breadcrumb Separator Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design Breadcrumb `SeparatorType` item support and cumulative route `path` resolution.

**Architecture:** Extend `ABreadcrumb` in place. Types split route items from separator items; the Vue component renders route and separator entries from the same `items` array, calculates the last route item for current-page semantics, and resolves cumulative path segments for generated links and `itemRender`.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `BreadcrumbSeparatorItem` with `type: 'separator'`.
- `BreadcrumbRouteItem` as the existing route item shape.
- `BreadcrumbItem = BreadcrumbRouteItem | BreadcrumbSeparatorItem`.
- Explicit separator item rendering.
- Cumulative path segment href generation.
- Docs and generated `es` / `lib` outputs.

This plan does not add dropdown menu breadcrumb items or Vue Router integration.

## Files

- Modify: `packages/components/src/breadcrumb/types.ts`
- Modify: `packages/components/src/breadcrumb/breadcrumb.vue`
- Modify: `packages/components/src/breadcrumb/__tests__/breadcrumb.test.ts`
- Modify: `docs/components/breadcrumb.md`
- Generated after build: `packages/components/es/breadcrumb/*`
- Generated after build: `packages/components/lib/breadcrumb/*`

## Task 1: Write Failing Breadcrumb Tests

- [ ] **Step 1: Add tests in `packages/components/src/breadcrumb/__tests__/breadcrumb.test.ts`**

Add this test for separator items:

```ts
it('renders explicit separator items without duplicate automatic separators', () => {
  const wrapper = mount(Breadcrumb, {
    props: {
      separator: '/',
      items: [
        { title: 'Location', href: '/' },
        { type: 'separator', separator: ':', className: 'custom-separator-item', style: { color: 'red' } },
        { title: 'Application Center', path: 'application' },
        { title: 'Application List' }
      ]
    }
  })

  expect(wrapper.find('.custom-separator-item').attributes('style')).toContain('color: red')
  expect(wrapper.findAll('.aheart-breadcrumb__separator').map((item) => item.text())).toEqual([':', '/'])
  expect(wrapper.find('a[href="/"]').text()).toBe('Location')
  expect(wrapper.find('a[href="/application"]').text()).toBe('Application Center')
})
```

Add this test for cumulative paths:

```ts
it('joins route path segments cumulatively for links and itemRender paths', () => {
  const calls: unknown[] = []
  const items = [
    { title: 'Projects', path: 'projects' },
    { title: 'Aheart', path: ':projectId' },
    { title: 'Settings', path: 'settings' }
  ]

  const wrapper = mount(Breadcrumb, {
    props: {
      items,
      params: { projectId: 'aheart' },
      itemRender: (item, params, allItems, paths, index) => {
        calls.push({ item, params, allItems, paths, index })
        return h('span', { class: 'path-node', 'data-paths': paths.join('|') }, item.title)
      }
    }
  })

  expect(wrapper.findAll('.path-node').map((item) => item.attributes('data-paths'))).toEqual([
    'projects',
    'projects|aheart',
    'projects|aheart|settings'
  ])
  expect(calls).toHaveLength(3)
  expect(calls[1]).toMatchObject({
    params: { projectId: 'aheart' },
    allItems: items,
    paths: ['projects', 'aheart'],
    index: 1
  })

  const linkedWrapper = mount(Breadcrumb, {
    props: {
      items,
      params: { projectId: 'aheart' }
    }
  })
  expect(linkedWrapper.find('a[href="/projects"]').text()).toBe('Projects')
  expect(linkedWrapper.find('a[href="/projects/aheart"]').text()).toBe('Aheart')
  expect(linkedWrapper.find('a[href="/projects/aheart/settings"]').exists()).toBe(false)
})
```

- [ ] **Step 2: Run focused test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- breadcrumb
```

Expected: the new tests fail because separator items and cumulative path hrefs are not implemented yet.

## Task 2: Implement Breadcrumb Separator And Path Support

- [ ] **Step 1: Extend `packages/components/src/breadcrumb/types.ts`**

Split the item type:

```ts
export interface BreadcrumbRouteItem {
  key?: string | number
  type?: 'item'
  title: VNodeChild
  href?: string
  path?: string
  className?: string
  style?: StyleValue
  disabled?: boolean
  onClick?: (event: MouseEvent, item: BreadcrumbRouteItem, index: number) => void
}

export interface BreadcrumbSeparatorItem {
  key?: string | number
  type: 'separator'
  separator?: VNodeChild
  className?: string
  style?: StyleValue
}

export type BreadcrumbItem = BreadcrumbRouteItem | BreadcrumbSeparatorItem
```

Update `BreadcrumbItemRender` so its `item` argument is `BreadcrumbRouteItem` and `items` remains `BreadcrumbItem[]`.

- [ ] **Step 2: Update `packages/components/src/breadcrumb/breadcrumb.vue`**

Add `isSeparatorItem` / `isRouteItem` guards, render separator items in the template, calculate last route index, suppress automatic separators before explicit separator items, and calculate cumulative path segments.

- [ ] **Step 3: Run focused tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- breadcrumb
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: focused Breadcrumb tests and package typecheck pass.

## Task 3: Document And Build

- [ ] **Step 1: Update `docs/components/breadcrumb.md`**

Add examples for explicit separator items and connected path segments. Update the API section with route item and separator item tables.

- [ ] **Step 2: Build docs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build passes.

- [ ] **Step 3: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: Breadcrumb `es` / `lib` outputs update.

- [ ] **Step 4: Final verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git status --short --branch
```

Expected: all commands pass and the worktree is clean after committing.

## Self-Review

- Spec coverage: every Breadcrumb separator and cumulative path requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: `BreadcrumbRouteItem`, `BreadcrumbSeparatorItem`, `BreadcrumbItem`, and `BreadcrumbItemRender` names match the design document.
