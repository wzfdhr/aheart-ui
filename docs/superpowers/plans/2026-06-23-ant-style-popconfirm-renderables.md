# Ant Style Popconfirm Renderables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Ant-style Popconfirm title, description, and icon props as Vue nodes and render functions.

**Architecture:** Keep `APopconfirm` as one Vue SFC backed by `types.ts`. Broaden content prop types, add a local render helper, replace string interpolation with helper rendering, and use explicit renderable presence checks instead of truthiness.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Renderable `title`.
- Renderable `description`.
- Renderable `icon`.
- Numeric renderable values such as `0`.
- Explicit `false` / `null` icon hiding.
- Docs and generated package output refresh.

This plan does not add async close loading behavior, `destroyOnHidden`, `fresh`, portal container selection, placement auto-adjustment, or align configuration.

## Files

- Modify: `packages/components/src/popconfirm/types.ts`
- Modify: `packages/components/src/popconfirm/popconfirm.vue`
- Modify: `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`
- Modify: `docs/components/popconfirm.md`
- Generated after build: `packages/components/es/popconfirm/*`
- Generated after build: `packages/components/lib/popconfirm/*`

## Task 1: Write Failing Popconfirm Tests

- [ ] **Step 1: Add renderable Popconfirm tests**

In `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`, update the imports:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
```

Add these tests after `opens from click trigger with title description icon and buttons`:

```ts
it('renders vnode and function title description and icon props', () => {
  const wrapper = mount(Popconfirm, {
    props: {
      defaultOpen: true,
      title: () => h('span', { class: 'title-node' }, 'Delete node?'),
      description: h('span', { class: 'description-node' }, 'VNode details'),
      icon: h('span', { class: 'icon-node' }, '?')
    },
    slots: { default: '<button>Delete</button>' }
  })

  expect(wrapper.find('.title-node').text()).toBe('Delete node?')
  expect(wrapper.find('.description-node').text()).toBe('VNode details')
  expect(wrapper.find('.icon-node').text()).toBe('?')
})

it('renders numeric renderables without treating zero as empty', () => {
  const wrapper = mount(Popconfirm, {
    props: {
      defaultOpen: true,
      title: 0,
      description: 0,
      icon: 0
    },
    slots: { default: '<button>Count</button>' }
  })

  expect(wrapper.find('.aheart-popconfirm__title').text()).toBe('0')
  expect(wrapper.find('.aheart-popconfirm__description').text()).toBe('0')
  expect(wrapper.find('.aheart-popconfirm__icon').text()).toBe('0')
})

it('hides icon when icon is false', () => {
  const wrapper = mount(Popconfirm, {
    props: {
      defaultOpen: true,
      title: 'No icon',
      icon: false
    },
    slots: { default: '<button>No icon</button>' }
  })

  expect(wrapper.find('.aheart-popconfirm__title').text()).toBe('No icon')
  expect(wrapper.find('.aheart-popconfirm__icon').exists()).toBe(false)
})

it('lets content slots override renderable prop fallbacks', () => {
  const wrapper = mount(Popconfirm, {
    props: {
      defaultOpen: true,
      title: h('span', { class: 'prop-title-node' }, 'Prop title'),
      description: h('span', { class: 'prop-description-node' }, 'Prop description'),
      icon: h('span', { class: 'prop-icon-node' }, 'P')
    },
    slots: {
      default: '<button>Delete</button>',
      title: '<span class="slot-title-node">Slot title</span>',
      description: '<span class="slot-description-node">Slot description</span>',
      icon: '<span class="slot-icon-node">S</span>'
    }
  })

  expect(wrapper.find('.slot-title-node').text()).toBe('Slot title')
  expect(wrapper.find('.slot-description-node').text()).toBe('Slot description')
  expect(wrapper.find('.slot-icon-node').text()).toBe('S')
  expect(wrapper.find('.prop-title-node').exists()).toBe(false)
  expect(wrapper.find('.prop-description-node').exists()).toBe(false)
  expect(wrapper.find('.prop-icon-node').exists()).toBe(false)
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- popconfirm
```

Expected: the new tests fail because current Popconfirm prop validators and template output do not support object/function/number renderables.

## Task 2: Extend Popconfirm Types

- [ ] **Step 1: Add renderable types and prop helper**

In `packages/components/src/popconfirm/types.ts`, update the import:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
```

Add after `PopconfirmButtonProps`:

```ts
export type PopconfirmRenderable = VNodeChild
export type PopconfirmRenderableFactory = () => VNodeChild
export type PopconfirmContent = PopconfirmRenderable | PopconfirmRenderableFactory
```

Add before `popconfirmProps`:

```ts
const renderableProp = [String, Number, Boolean, Object, Array, Function] as PropType<PopconfirmContent>
const iconProp = [String, Number, Boolean, Object, Array, Function] as PropType<PopconfirmRenderable>
```

- [ ] **Step 2: Broaden content props**

Update `popconfirmProps`:

```ts
title: renderableProp,
description: renderableProp,
icon: iconProp,
```

Keep `okText` and `cancelText` as strings.

## Task 3: Render Popconfirm Nodes

- [ ] **Step 1: Add render helper**

In `packages/components/src/popconfirm/popconfirm.vue`, update imports:

```ts
import { computed, defineComponent, ref, useSlots, watch, type PropType, type VNodeChild } from 'vue'
```

Update the type import:

```ts
import { popconfirmEmits, popconfirmProps, type PopconfirmContent } from './types'
```

Add after `defineOptions`:

```ts
const ARenderNode = defineComponent({
  name: 'APopconfirmRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<PopconfirmContent>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => (typeof renderProps.node === 'function' ? renderProps.node() : renderProps.node)
  }
})

const hasRenderable = (value: VNodeChild | (() => VNodeChild) | undefined | null) =>
  value !== undefined && value !== null && value !== false
```

Add slots access:

```ts
const slots = useSlots()
```

- [ ] **Step 2: Add computed content presence**

Add after `visible`:

```ts
const resolvedIcon = computed(() => (props.icon === undefined ? '!' : props.icon))
const hasIcon = computed(() => Boolean(slots.icon) || hasRenderable(resolvedIcon.value))
const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title))
const hasDescription = computed(() => Boolean(slots.description) || hasRenderable(props.description))
```

- [ ] **Step 3: Replace string interpolation in template**

Render icon:

```vue
<span v-if="hasIcon" class="aheart-popconfirm__icon" :class="iconClass" :style="iconStyle" aria-hidden="true">
  <slot name="icon">
    <ARenderNode :node="resolvedIcon" />
  </slot>
</span>
```

Render title:

```vue
<span v-if="hasTitle" class="aheart-popconfirm__title" :class="titleClass" :style="titleStyle">
  <slot name="title">
    <ARenderNode :node="title" />
  </slot>
</span>
```

Render description:

```vue
<span
  v-if="hasDescription"
  class="aheart-popconfirm__description"
  :class="descriptionClass"
  :style="descriptionStyle"
>
  <slot name="description">
    <ARenderNode :node="description" />
  </slot>
</span>
```

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- popconfirm
```

Expected: all Popconfirm tests pass.

## Task 4: Update Popconfirm Documentation

- [ ] **Step 1: Update docs demo and API**

In `docs/components/popconfirm.md`:

- Add a renderable content demo using `h`.
- Document `title` and `description` as `VNodeChild | () => VNodeChild`.
- Document `icon` as `VNodeChild`.
- Mention the `icon` slot priority and default/hide behavior.

- [ ] **Step 2: Build docs once**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

## Task 5: Refresh Generated Outputs and Verify

- [ ] **Step 1: Run full typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
```

- [ ] **Step 2: Run full tests**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
```

- [ ] **Step 3: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

- [ ] **Step 4: Clean known generated drift for non-Popconfirm components**

Run:

```bash
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/radio packages/components/lib/radio packages/components/es/steps packages/components/lib/steps packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer packages/components/es/pagination packages/components/lib/pagination packages/components/es/table packages/components/lib/table packages/components/es/tabs packages/components/lib/tabs | git apply -R
```

- [ ] **Step 5: Build docs and clean cache**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
```

- [ ] **Step 6: Check diff hygiene**

Run:

```bash
git diff --check
git status --short --branch
git log --oneline -16
```

- [ ] **Step 7: Commit slice**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-popconfirm-renderables-design.md docs/superpowers/plans/2026-06-23-ant-style-popconfirm-renderables.md packages/components/src/popconfirm/types.ts packages/components/src/popconfirm/popconfirm.vue packages/components/src/popconfirm/__tests__/popconfirm.test.ts docs/components/popconfirm.md packages/components/es/popconfirm packages/components/lib/popconfirm
git commit -m "feat: align popconfirm renderable content"
```

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `PopconfirmRenderable`, `PopconfirmRenderableFactory`, and `PopconfirmContent` names are consistent across tasks.
