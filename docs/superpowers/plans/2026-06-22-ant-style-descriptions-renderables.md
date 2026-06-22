# Ant Style Descriptions Renderables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style renderable node support to `ADescriptions` header and item fields.

**Architecture:** Keep the current `items`-driven `ADescriptions` implementation. Add a local render helper to render `VNodeChild` values, widen the TypeScript prop and item types, and preserve all row/span/style behavior.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `DescriptionRenderable`
- renderable `title`
- renderable `extra`
- renderable `DescriptionItem.label`
- renderable `DescriptionItem.content`
- renderable `DescriptionItem.children`
- `title` and `extra` slots
- docs and generated package output refresh

This plan does not cover `<ADescriptionsItem>`, responsive breakpoint `column` objects, or screen-based span maps.

## Files

- Modify: `packages/components/src/descriptions/types.ts`
- Modify: `packages/components/src/descriptions/descriptions.vue`
- Modify: `packages/components/src/descriptions/__tests__/descriptions.test.ts`
- Modify: `docs/components/descriptions.md`
- Generated after build: `packages/components/es/descriptions/*`
- Generated after build: `packages/components/lib/descriptions/*`

## Task 1: Write Failing Descriptions Renderable Tests

- [ ] **Step 1: Add tests in `packages/components/src/descriptions/__tests__/descriptions.test.ts`**

Add these tests before the existing metadata/span test:

```ts
it('renders VNode title extra label and item content', () => {
  const wrapper = mount(Descriptions, {
    props: {
      title: h('strong', { class: 'title-node' }, 'Profile node'),
      extra: h('button', { class: 'extra-node' }, 'Refresh'),
      items: [
        {
          label: h('span', { class: 'label-node' }, 'Owner'),
          content: h('em', { class: 'content-node' }, 'Design System')
        }
      ]
    }
  })

  expect(wrapper.find('.title-node').text()).toBe('Profile node')
  expect(wrapper.find('.extra-node').text()).toBe('Refresh')
  expect(wrapper.find('.label-node').text()).toBe('Owner')
  expect(wrapper.find('.content-node').text()).toBe('Design System')
})

it('lets title and extra slots override renderable props', () => {
  const wrapper = mount(Descriptions, {
    props: {
      title: h('span', { class: 'prop-title' }, 'Prop title'),
      extra: h('span', { class: 'prop-extra' }, 'Prop extra'),
      items: [{ label: 'User', content: 'Ada' }]
    },
    slots: {
      title: '<span class="slot-title">Slot title</span>',
      extra: '<button class="slot-extra">Slot extra</button>'
    }
  })

  expect(wrapper.find('.slot-title').text()).toBe('Slot title')
  expect(wrapper.find('.slot-extra').text()).toBe('Slot extra')
  expect(wrapper.find('.prop-title').exists()).toBe(false)
  expect(wrapper.find('.prop-extra').exists()).toBe(false)
})

it('prefers content over children when both are renderable', () => {
  const wrapper = mount(Descriptions, {
    props: {
      items: [
        {
          label: 'Priority',
          content: h('span', { class: 'content-value' }, 'Content wins'),
          children: h('span', { class: 'children-value' }, 'Children fallback')
        }
      ]
    }
  })

  expect(wrapper.find('.content-value').text()).toBe('Content wins')
  expect(wrapper.find('.children-value').exists()).toBe(false)
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- descriptions
```

Expected: the new tests fail because VNode item values are stringified and header slots are not rendered.

## Task 2: Implement Renderable Descriptions

- [ ] **Step 1: Extend `packages/components/src/descriptions/types.ts`**

Add `VNodeChild`, define `DescriptionRenderable`, widen `title`, `extra`, `label`, `content`, and `children`.

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type DescriptionRenderable = VNodeChild

const renderableProp = [String, Number, Boolean, Object, Array, Function] as PropType<DescriptionRenderable>

export interface DescriptionItem {
  key?: string | number
  label: DescriptionRenderable
  content?: DescriptionRenderable
  children?: DescriptionRenderable
  span?: DescriptionItemSpan
  className?: string
  style?: StyleValue
  labelStyle?: StyleValue
  contentStyle?: StyleValue
}

export const descriptionsProps = {
  title: renderableProp,
  extra: renderableProp,
  // existing props remain unchanged
} as const
```

- [ ] **Step 2: Update `packages/components/src/descriptions/descriptions.vue`**

Add a local render helper and slot-aware header/content rendering.

```vue
<div v-if="hasHeader" class="aheart-descriptions__header" :class="classNames.header" :style="styles.header">
  <div v-if="hasTitle" class="aheart-descriptions__title" :class="classNames.title" :style="styles.title">
    <slot name="title">
      <ARenderNode :node="title" />
    </slot>
  </div>
  <div v-if="hasExtra" class="aheart-descriptions__extra" :class="classNames.extra" :style="styles.extra">
    <slot name="extra">
      <ARenderNode :node="extra" />
    </slot>
  </div>
</div>
```

Render labels and content with:

```vue
<ARenderNode :node="item.label" />
<ARenderNode :node="item.resolvedContent" />
```

Use:

```ts
const hasRenderable = (value: unknown) => value !== undefined && value !== null && value !== false && value !== ''
const resolveItemContent = (item: DescriptionItem) => item.content ?? item.children ?? ''
```

- [ ] **Step 3: Run targeted tests and component typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- descriptions
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: all targeted Descriptions tests pass and component typecheck exits 0.

- [ ] **Step 4: Commit source and tests**

```bash
git add packages/components/src/descriptions/types.ts packages/components/src/descriptions/descriptions.vue packages/components/src/descriptions/__tests__/descriptions.test.ts
git commit -m "feat: add descriptions renderable parity"
```

## Task 3: Update Documentation

- [ ] **Step 1: Update `docs/components/descriptions.md`**

Add a renderable content example using VNodes through slots and inline item content descriptions. Update API tables so `title`, `extra`, `label`, `content`, and `children` use `VNodeChild`. Add Slots:

```md
## Slots

| 名称 | 说明 |
| --- | --- |
| title | 自定义标题，优先于 `title` 属性 |
| extra | 自定义额外内容，优先于 `extra` 属性 |
```

- [ ] **Step 2: Run docs build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

- [ ] **Step 3: Commit docs**

```bash
git add docs/components/descriptions.md
git commit -m "docs: document descriptions renderable APIs"
```

## Task 4: Refresh Generated Outputs and Verify

- [ ] **Step 1: Run package build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: package build exits 0 and generated `es/descriptions` / `lib/descriptions` files update.

- [ ] **Step 2: Remove unrelated declaration-order drift**

If the known Checkbox, Radio, Steps, Form, Modal, or Drawer `.d.ts` files change only by declaration ordering, restore those unrelated changes before committing.

- [ ] **Step 3: Commit generated outputs**

```bash
git add packages/components/es/descriptions packages/components/lib/descriptions
git commit -m "build: update descriptions renderable outputs"
```

- [ ] **Step 4: Full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git status --short --branch
git diff --stat
git diff --check
```

Expected: all commands exit 0 and the final worktree is clean.

## Self-Review

- Spec coverage: each renderable prop/field and both slots are covered by tests, docs, and implementation steps.
- Placeholder scan: no placeholder tasks remain.
- Type consistency: `DescriptionRenderable`, `DescriptionItem`, `VNodeChild`, `title`, and `extra` names match the spec.
