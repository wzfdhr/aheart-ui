# Ant Style Badge Ribbon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design Badge root controls, renderable count/text props, and an Ant-style Ribbon subcomponent.

**Architecture:** Extend `ABadge` in place for root hooks and render-node support. Add a separate `ribbon.vue` sibling with its own typed props, semantic hooks, styles, named export, global install entry, and docs.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `ABadge` `className`, `rootClassName`, and `style`.
- `ABadge` `count` and `text` as `VNodeChild`.
- `ABadgeRibbon` with `text`, `color`, `placement`, `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- Badge docs and generated `es` / `lib` outputs.

This plan does not add scroll-number animation or a complete named preset color palette.

## Files

- Modify: `packages/components/src/badge/types.ts`
- Modify: `packages/components/src/badge/badge.vue`
- Create: `packages/components/src/badge/ribbon.vue`
- Modify: `packages/components/src/badge/style.css`
- Modify: `packages/components/src/badge/index.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `packages/components/src/badge/__tests__/badge.test.ts`
- Modify: `docs/components/badge.md`
- Generated after build: `packages/components/es/badge/*`
- Generated after build: `packages/components/lib/badge/*`
- Generated after build: `packages/components/es/index.*`
- Generated after build: `packages/components/lib/index.*`

## Task 1: Write Failing Badge Tests

- [ ] **Step 1: Add tests in `packages/components/src/badge/__tests__/badge.test.ts`**

Add imports:

```ts
import { h } from 'vue'
import Badge, { BadgeRibbon } from '../index'
```

Add this test for root Common props and renderable Badge content:

```ts
it('supports root hooks and vnode count and status text content', () => {
  const wrapper = mount(Badge, {
    props: {
      count: h('span', { class: 'count-node' }, 'hot'),
      status: 'processing',
      text: h('span', { class: 'status-node' }, 'Syncing'),
      className: 'badge-class',
      rootClassName: 'badge-root',
      style: { marginInlineStart: '6px' },
      classNames: {
        root: 'semantic-root',
        indicator: 'semantic-indicator'
      },
      styles: {
        root: { padding: '2px' },
        indicator: { boxShadow: '0 0 0 1px #fff' }
      }
    },
    slots: {
      default: '<span>Inbox</span>'
    }
  })

  expect(wrapper.classes()).toEqual(expect.arrayContaining(['badge-class', 'badge-root', 'semantic-root']))
  expect(wrapper.attributes('style')).toContain('margin-inline-start: 6px')
  expect(wrapper.attributes('style')).toContain('padding: 2px')
  expect(wrapper.find('.count-node').text()).toBe('hot')
  expect(wrapper.find('.aheart-badge__count').classes()).toContain('semantic-indicator')
  expect(wrapper.find('.aheart-badge__count').attributes('style')).toContain('box-shadow: 0 0 0 1px #fff')
  expect(wrapper.find('.status-node').text()).toBe('Syncing')
})
```

Add this test for Ribbon behavior:

```ts
it('renders ribbon with placement color root hooks and semantic content hooks', () => {
  const wrapper = mount(BadgeRibbon, {
    props: {
      text: h('strong', { class: 'ribbon-text' }, 'Limited'),
      color: '#722ed1',
      placement: 'start',
      className: 'legacy-ribbon',
      rootClassName: 'root-ribbon',
      style: { marginTop: '8px' },
      classNames: {
        root: 'semantic-ribbon-root',
        indicator: 'semantic-ribbon-indicator',
        content: 'semantic-ribbon-content'
      },
      styles: {
        root: { padding: '4px' },
        indicator: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        content: { fontWeight: '700' }
      }
    },
    slots: {
      default: '<div class="card-body">Card</div>'
    }
  })

  expect(wrapper.classes()).toEqual(
    expect.arrayContaining(['legacy-ribbon', 'root-ribbon', 'semantic-ribbon-root', 'aheart-ribbon--start'])
  )
  expect(wrapper.attributes('style')).toContain('margin-top: 8px')
  expect(wrapper.attributes('style')).toContain('padding: 4px')
  expect(wrapper.find('.card-body').text()).toBe('Card')
  expect(wrapper.find('.aheart-ribbon__indicator').classes()).toContain('semantic-ribbon-indicator')
  expect(wrapper.find('.aheart-ribbon__indicator').attributes('style')).toContain('background-color: rgb(114, 46, 209)')
  expect(wrapper.find('.aheart-ribbon__indicator').attributes('style')).toContain('box-shadow: 0 2px 4px rgba(0,0,0,0.1)')
  expect(wrapper.find('.aheart-ribbon__content').classes()).toContain('semantic-ribbon-content')
  expect(wrapper.find('.aheart-ribbon__content').attributes('style')).toContain('font-weight: 700')
  expect(wrapper.find('.ribbon-text').text()).toBe('Limited')
})
```

Add this export parity test:

```ts
it('exposes BadgeRibbon as a named export and Badge.Ribbon helper', () => {
  expect(BadgeRibbon).toBeTruthy()
  expect((Badge as typeof Badge & { Ribbon?: unknown }).Ribbon).toBe(BadgeRibbon)
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- badge
```

Expected: the new tests fail because root Common props, VNode prop rendering, and `BadgeRibbon` are not implemented.

## Task 2: Implement Badge And Ribbon APIs

- [ ] **Step 1: Extend `packages/components/src/badge/types.ts`**

Add `VNodeChild`, root hook props, and ribbon prop types:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type BadgeRenderable = VNodeChild
export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'
export type BadgeSize = 'default' | 'medium' | 'small'
export type BadgeOffset = [number, number]
export type BadgeSemanticPart = 'root' | 'indicator'
export type BadgeClassNames = Partial<Record<BadgeSemanticPart, string>>
export type BadgeStyles = Partial<Record<BadgeSemanticPart, StyleValue>>

export type BadgeRibbonPlacement = 'start' | 'end'
export type BadgeRibbonSemanticPart = 'root' | 'indicator' | 'content'
export type BadgeRibbonClassNames = Partial<Record<BadgeRibbonSemanticPart, string>>
export type BadgeRibbonStyles = Partial<Record<BadgeRibbonSemanticPart, StyleValue>>
```

Use `BadgeRenderable` for `count`, `text`, and `BadgeRibbon` `text`. Add `className`, `rootClassName`, and `style` to `badgeProps`. Add a `badgeRibbonProps` export with default `placement: 'end'`.

- [ ] **Step 2: Update `packages/components/src/badge/badge.vue`**

Render VNode props through a local `ARenderNode`, merge root styles as `[props.style, props.styles?.root]`, include `className` and `rootClassName` in `badgeClass`, and render status `text` with `ARenderNode`.

- [ ] **Step 3: Create `packages/components/src/badge/ribbon.vue`**

Create a component that renders:

```vue
<template>
  <div class="aheart-ribbon-wrapper" :class="wrapperClass" :style="wrapperStyle">
    <slot />
    <div :class="indicatorClass" :style="indicatorStyle">
      <span class="aheart-ribbon__content" :class="contentClass" :style="contentStyle">
        <ARenderNode :node="text" />
      </span>
      <span class="aheart-ribbon__corner" :style="cornerStyle" aria-hidden="true" />
    </div>
  </div>
</template>
```

Use computed classes and styles for root, indicator, content, custom color, and corner color.

- [ ] **Step 4: Update `packages/components/src/badge/style.css`**

Add ribbon wrapper, indicator, placement, content, and corner styles. Keep the existing Badge styles unchanged except where root style support requires no CSS changes.

- [ ] **Step 5: Update exports**

Update `packages/components/src/badge/index.ts` to export `BadgeRibbon`, `ABadgeRibbon`, type exports, and attach `Badge.Ribbon`.

Update `packages/components/src/index.ts` to import `BadgeRibbon`, include it in `components`, and export it.

- [ ] **Step 6: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- badge
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: Badge tests and package typecheck pass.

## Task 3: Document And Build

- [ ] **Step 1: Update `docs/components/badge.md`**

Add examples for root controls, renderable content, and Ribbon. Expand the API tables and Semantic DOM sections.

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

Expected: Badge `es` / `lib` outputs and top-level exports update.

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
