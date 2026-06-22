# Ant Style Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Row and Col as Ready Grid layout components.

**Architecture:** Row is a flex container that normalizes gutter, justify, align, and wrap into classes and CSS variables. Col is a flex item that maps 24-grid layout props and responsive breakpoint props to classes and CSS variables; Grid's package entry installs and exports both components.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Row`
- `Col`
- package root exports and plugin install
- docs page and Ready status
- package build output refresh

This plan does not cover `useBreakpoint`, custom breakpoint token overrides, server-side layout measurement, CSS grid auto-placement, or layout designer utilities.

## Task 1: Write Failing Tests

**Files:**
- Create: `packages/components/src/grid/__tests__/grid.test.ts`

- [ ] **Step 1: Create Grid tests**

Create `packages/components/src/grid/__tests__/grid.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { describe, expect, it } from 'vitest'
import Grid, { Col, Row } from '../index'

describe('Grid', () => {
  it('renders Row classes with justify, align, and wrap', () => {
    const wrapper = mount(Row, {
      props: { justify: 'center', align: 'middle', wrap: false },
      slots: { default: '<div>content</div>' }
    })

    expect(wrapper.classes()).toContain('aheart-row')
    expect(wrapper.classes()).toContain('aheart-row--justify-center')
    expect(wrapper.classes()).toContain('aheart-row--align-middle')
    expect(wrapper.classes()).toContain('is-nowrap')
    expect(wrapper.text()).toContain('content')
  })

  it('normalizes numeric and tuple gutters into CSS variables', () => {
    const wrapper = mount(Row, {
      props: { gutter: [16, 24] }
    })

    expect(wrapper.attributes('style')).toContain('--aheart-row-gutter-horizontal: 16px')
    expect(wrapper.attributes('style')).toContain('--aheart-row-gutter-vertical: 24px')
  })

  it('renders Col span and layout classes', () => {
    const wrapper = mount(Col, {
      props: { span: 8, offset: 4, order: 2, push: 1, pull: 3 },
      slots: { default: 'column' }
    })

    expect(wrapper.classes()).toContain('aheart-col')
    expect(wrapper.classes()).toContain('aheart-col-8')
    expect(wrapper.classes()).toContain('aheart-col-offset-4')
    expect(wrapper.classes()).toContain('aheart-col-order-2')
    expect(wrapper.classes()).toContain('aheart-col-push-1')
    expect(wrapper.classes()).toContain('aheart-col-pull-3')
    expect(wrapper.text()).toBe('column')
  })

  it('renders numeric and string flex styles', () => {
    const numeric = mount(Col, { props: { flex: 160 } })
    const string = mount(Col, { props: { flex: 'auto' } })

    expect(numeric.attributes('style')).toContain('--aheart-col-flex: 0 0 160px')
    expect(string.attributes('style')).toContain('--aheart-col-flex: auto')
  })

  it('renders responsive classes and variables', () => {
    const wrapper = mount(Col, {
      props: {
        xs: 24,
        md: { span: 12, offset: 6 },
        xl: { span: 8, order: 3, flex: '1 1 0' }
      }
    })

    expect(wrapper.classes()).toContain('aheart-col-xs')
    expect(wrapper.classes()).toContain('aheart-col-md')
    expect(wrapper.classes()).toContain('aheart-col-xl')
    expect(wrapper.attributes('style')).toContain('--aheart-col-xs-span: 24')
    expect(wrapper.attributes('style')).toContain('--aheart-col-md-offset: 6')
    expect(wrapper.attributes('style')).toContain('--aheart-col-xl-flex: 1 1 0')
  })

  it('installs Row and Col from Grid plugin', () => {
    const app = createApp({})

    app.use(Grid)

    expect(app.component('ARow')).toBeTruthy()
    expect(app.component('ACol')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- grid
```

Expected: FAIL because `packages/components/src/grid/index.ts` does not exist.

## Task 2: Implement Grid

**Files:**
- Create: `packages/components/src/grid/row.vue`
- Create: `packages/components/src/grid/col.vue`
- Create: `packages/components/src/grid/types.ts`
- Create: `packages/components/src/grid/style.css`
- Create: `packages/components/src/grid/index.ts`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Create component files**

Create component files matching `docs/superpowers/specs/2026-06-22-ant-style-grid-design.md`.

The implementation must:

- render Row as an `ARow` flex container
- render Col as an `ACol` flex item
- support Row `gutter`, `justify`, `align`, and `wrap`
- support Col `span`, `offset`, `order`, `pull`, `push`, `flex`, and responsive props
- export a default Grid plugin that installs both Row and Col
- export named `Row`, `Col`, `ARow`, and `ACol`

- [ ] **Step 2: Update package root exports**

Modify `packages/components/src/index.ts` so Grid, Row, and Col are imported, registered, and exported by name.

- [ ] **Step 3: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- grid
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit source**

```bash
git add packages/components/src/grid packages/components/src/index.ts
git commit -m "feat: add grid components"
```

## Task 3: Add Documentation

**Files:**
- Modify: `docs/.vitepress/data/components.ts`
- Modify: `docs/.vitepress/config.ts`
- Create: `docs/components/grid.md`

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Grid` -> Ready with `/components/grid`

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add `Grid 栅格` under Layout.

- [ ] **Step 3: Create component docs**

Create `docs/components/grid.md` with:

- Ready badge
- basic Row/Col demo
- gutter demo
- offset/order demo
- flex column demo
- responsive demo
- Row API table
- Col API table
- responsive config table
- theme token notes

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

Then commit:

```bash
git add docs/.vitepress/data/components.ts docs/.vitepress/config.ts docs/components/grid.md
git commit -m "docs: add grid documentation"
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
test -f packages/components/es/grid/index.d.ts && test -f packages/components/lib/grid/index.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo declarations-and-docs-ok
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
git commit -m "build: update grid outputs"
```

## Self-Review

- Spec coverage: all Grid design requirements map to tests, implementation, docs, and build output tasks.
- Placeholder scan: the plan contains no TBD/TODO/fill-in placeholders.
- Type consistency: `GridGutter`, `GridResponsiveGutter`, `ColSpanConfig`, `Row`, and `Col` names are consistent across the plan.
