# Ant Style Card Renderable Header Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Ant-style Card `title`, `extra`, and `actions` props as Vue nodes.

**Architecture:** Keep `ACard` as one Vue SFC backed by `types.ts`. Broaden header/action prop types, replace text interpolation with the existing local render helper, and use explicit renderable presence checks so numeric `0` renders while empty strings remain absent.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Renderable `title`.
- Renderable `extra`.
- Renderable `actions`.
- Numeric `0` title and extra values.
- Slot override priority for `title`, `extra`, and `actions`.
- Empty string title and extra preserving no-header behavior.
- Docs and generated package output refresh.

This plan does not change Card tabs, Card.Meta, Card.Grid, loading skeletons, size resolution, variants, cover rendering, semantic class/style names, or tab panel behavior.

## Files

- Modify: `packages/components/src/card/types.ts`
- Modify: `packages/components/src/card/card.vue`
- Modify: `packages/components/src/card/__tests__/card.test.ts`
- Modify: `docs/components/card.md`
- Generated after build: `packages/components/es/card/*`
- Generated after build: `packages/components/lib/card/*`

## Task 1: Write Failing Card Tests

- [x] **Step 1: Add renderable Card tests**

In `packages/components/src/card/__tests__/card.test.ts`, add these tests after `renders actions prop when no actions slot is provided`:

```ts
it('renders vnode title extra and actions props', () => {
  const wrapper = mount(Card, {
    props: {
      title: h('span', { class: 'card-title-node' }, 'Node title'),
      extra: h('a', { class: 'card-extra-node' }, 'More'),
      actions: [
        h('button', { class: 'card-action-node' }, 'Open')
      ]
    },
    slots: {
      default: 'Body'
    }
  })

  expect(wrapper.find('.card-title-node').text()).toBe('Node title')
  expect(wrapper.find('.card-extra-node').text()).toBe('More')
  expect(wrapper.find('.card-action-node').text()).toBe('Open')
})

it('renders numeric zero title and extra as header content', () => {
  const wrapper = mount(Card, {
    props: {
      title: 0,
      extra: 0
    }
  })

  expect(wrapper.find('.aheart-card__header').exists()).toBe(true)
  expect(wrapper.find('.aheart-card__title').text()).toBe('0')
  expect(wrapper.find('.aheart-card__extra').text()).toBe('0')
})

it('lets title extra and actions slots override renderable prop fallbacks', () => {
  const wrapper = mount(Card, {
    props: {
      title: h('span', { class: 'prop-title-node' }, 'Prop title'),
      extra: h('span', { class: 'prop-extra-node' }, 'Prop extra'),
      actions: [h('button', { class: 'prop-action-node' }, 'Prop action')]
    },
    slots: {
      title: '<span class="slot-title-node">Slot title</span>',
      extra: '<span class="slot-extra-node">Slot extra</span>',
      actions: '<button class="slot-action-node">Slot action</button>'
    }
  })

  expect(wrapper.find('.slot-title-node').text()).toBe('Slot title')
  expect(wrapper.find('.slot-extra-node').text()).toBe('Slot extra')
  expect(wrapper.find('.slot-action-node').text()).toBe('Slot action')
  expect(wrapper.find('.prop-title-node').exists()).toBe(false)
  expect(wrapper.find('.prop-extra-node').exists()).toBe(false)
  expect(wrapper.find('.prop-action-node').exists()).toBe(false)
})

it('does not render header for empty string title and extra props', () => {
  const wrapper = mount(Card, {
    props: {
      title: '',
      extra: ''
    }
  })

  expect(wrapper.find('.aheart-card__header').exists()).toBe(false)
})
```

- [x] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
```

Expected: FAIL because current Card prop validators and text interpolation do not render object VNodes in `title`, `extra`, or `actions`.

## Task 2: Extend Card Types

- [x] **Step 1: Add renderable prop helper**

In `packages/components/src/card/types.ts`, add after `export type CardType`:

```ts
export type CardRenderable = VNodeChild
```

Add before `cardProps`:

```ts
const renderableProp = [String, Number, Boolean, Object, Array] as PropType<CardRenderable>
```

- [x] **Step 2: Broaden header and action props**

Update these definitions:

```ts
export type CardAction = CardRenderable
```

```ts
title: renderableProp,
extra: renderableProp,
actions: Array as PropType<CardAction[]>,
```

## Task 3: Render Card Header And Actions

- [x] **Step 1: Replace header interpolation**

In `packages/components/src/card/card.vue`, replace the header template:

```vue
<div :class="titleClass" :style="titleStyle">
  <slot name="title">
    <ARenderNode :node="title" />
  </slot>
</div>
<div v-if="hasExtra" :class="extraClass" :style="extraStyle">
  <slot name="extra">
    <ARenderNode :node="extra" />
  </slot>
</div>
```

- [x] **Step 2: Render action nodes**

In the actions fallback, replace string interpolation:

```vue
<span v-for="(action, index) in actions" :key="index" class="aheart-card__action">
  <ARenderNode :node="action" />
</span>
```

- [x] **Step 3: Use explicit renderable presence checks**

Update the helper and header checks:

```ts
const hasRenderable = (value: VNodeChild | undefined) => value !== undefined && value !== null && value !== false && value !== ''
const hasHeader = computed(() => Boolean(slots.title) || hasRenderable(props.title) || Boolean(slots.extra) || hasRenderable(props.extra))
const hasExtra = computed(() => Boolean(slots.extra) || hasRenderable(props.extra))
```

- [x] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
```

Expected: all Card tests pass.

## Task 4: Update Card Documentation

- [x] **Step 1: Update docs demo and API**

In `docs/components/card.md`:

- Add `h` import in the script setup block if needed.
- Add a renderable header/actions demo using `h`.
- Document `title` and `extra` as `VNodeChild`.
- Document `actions` as `VNodeChild[]`.
- Mention slot priority and empty header behavior.

- [x] **Step 2: Build docs once**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

## Task 5: Refresh Generated Outputs And Verify

- [x] **Step 1: Run full typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
```

- [x] **Step 2: Run full tests**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
```

- [x] **Step 3: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

- [x] **Step 4: Clean known generated drift for non-Card components**

Run:

```bash
git status --short
```

If the package build refreshes unrelated component outputs, inspect them and revert only unrelated generated drift.

- [x] **Step 5: Build docs and clean cache**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
```

- [x] **Step 6: Check diff hygiene**

Run:

```bash
git diff --check
git status --short --branch
git log --oneline -12
```

- [x] **Step 7: Commit slice**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-card-renderable-header-actions-design.md docs/superpowers/plans/2026-06-23-ant-style-card-renderable-header-actions.md packages/components/src/card/types.ts packages/components/src/card/card.vue packages/components/src/card/__tests__/card.test.ts docs/components/card.md packages/components/es/card packages/components/lib/card
git commit -m "feat: align card renderable header actions"
```

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `CardRenderable`, `CardAction`, `title`, `extra`, and `actions` names are consistent across tasks.
