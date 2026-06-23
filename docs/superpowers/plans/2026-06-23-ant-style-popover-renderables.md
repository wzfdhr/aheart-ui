# Ant Style Popover Renderables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Ant-style Popover title and content props as Vue nodes and render functions.

**Architecture:** Keep `APopover` as one Vue SFC backed by `types.ts`. Broaden content prop types, add a local render helper, replace string interpolation with helper rendering, and use explicit renderable presence checks instead of truthiness.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Renderable `title`.
- Renderable `content`.
- Numeric renderable values such as `0`.
- Slot override priority for renderable prop fallbacks.
- Docs and generated package output refresh.

This plan does not change trigger timing, controlled state, `destroyOnHidden`, `fresh`, portal/container behavior, placement alignment, arrow geometry, or semantic class/style contracts.

## Files

- Modify: `packages/components/src/popover/types.ts`
- Modify: `packages/components/src/popover/popover.vue`
- Modify: `packages/components/src/popover/__tests__/popover.test.ts`
- Modify: `docs/components/popover.md`
- Generated after build: `packages/components/es/popover/*`
- Generated after build: `packages/components/lib/popover/*`

## Task 1: Write Failing Popover Tests

- [ ] **Step 1: Add renderable Popover tests**

In `packages/components/src/popover/__tests__/popover.test.ts`, update the imports:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
```

Add these tests after `renders title and content props when open`:

```ts
it('renders vnode and function title and content props', () => {
  const wrapper = mount(Popover, {
    props: {
      open: true,
      title: () => h('span', { class: 'title-node' }, 'Account node'),
      content: h('span', { class: 'content-node' }, 'VNode body')
    },
    slots: { default: '<button>Details</button>' }
  })

  expect(wrapper.find('.title-node').text()).toBe('Account node')
  expect(wrapper.find('.content-node').text()).toBe('VNode body')
})

it('renders numeric renderables without treating zero as empty', () => {
  const wrapper = mount(Popover, {
    props: {
      open: true,
      title: 0,
      content: 0
    },
    slots: { default: '<button>Counts</button>' }
  })

  expect(wrapper.find('.aheart-popover__title').text()).toBe('0')
  expect(wrapper.find('.aheart-popover__content').text()).toBe('0')
})

it('lets content slots override renderable prop fallbacks', () => {
  const wrapper = mount(Popover, {
    props: {
      open: true,
      title: h('span', { class: 'prop-title-node' }, 'Prop title'),
      content: h('span', { class: 'prop-content-node' }, 'Prop content')
    },
    slots: {
      default: '<button>Details</button>',
      title: '<span class="slot-title-node">Slot title</span>',
      content: '<span class="slot-content-node">Slot content</span>'
    }
  })

  expect(wrapper.find('.slot-title-node').text()).toBe('Slot title')
  expect(wrapper.find('.slot-content-node').text()).toBe('Slot content')
  expect(wrapper.find('.prop-title-node').exists()).toBe(false)
  expect(wrapper.find('.prop-content-node').exists()).toBe(false)
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- popover
```

Expected: the new tests fail because current Popover prop validators and template output do not support object/function/number renderables.

## Task 2: Extend Popover Types

- [ ] **Step 1: Add renderable types and prop helper**

In `packages/components/src/popover/types.ts`, update the import:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
```

Add after `PopoverArrow`:

```ts
export type PopoverRenderable = VNodeChild
export type PopoverRenderableFactory = () => VNodeChild
export type PopoverContent = PopoverRenderable | PopoverRenderableFactory
```

Add before `popoverProps`:

```ts
const renderableProp = {
  type: null as unknown as PropType<PopoverContent>,
  default: undefined
}
```

- [ ] **Step 2: Broaden content props**

Update `popoverProps`:

```ts
title: renderableProp,
content: renderableProp,
```

## Task 3: Render Popover Nodes

- [ ] **Step 1: Add render helper**

In `packages/components/src/popover/popover.vue`, update imports:

```ts
import { computed, defineComponent, onBeforeUnmount, ref, useSlots, watch, type PropType } from 'vue'
```

Update the type import:

```ts
import { popoverEmits, popoverProps, type PopoverContent } from './types'
```

Add after `defineOptions`:

```ts
const ARenderNode = defineComponent({
  name: 'APopoverRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<PopoverContent>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => (typeof renderProps.node === 'function' ? renderProps.node() : renderProps.node)
  }
})

const hasRenderable = (value: PopoverContent | undefined | null) => value !== undefined && value !== null && value !== false
```

- [ ] **Step 2: Replace truthy content presence checks**

Update the computed presence checks:

```ts
const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title))
const hasContent = computed(() => Boolean(slots.content) || hasRenderable(props.content))
```

- [ ] **Step 3: Replace string interpolation in template**

Render title:

```vue
<span v-if="hasTitle" class="aheart-popover__title" :class="titleClass" :style="titleStyle">
  <slot name="title">
    <ARenderNode :node="title" />
  </slot>
</span>
```

Render content:

```vue
<span v-if="hasContent" class="aheart-popover__content" :class="contentClass" :style="contentStyle">
  <slot name="content">
    <ARenderNode :node="content" />
  </slot>
</span>
```

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- popover
```

Expected: all Popover tests pass.

## Task 4: Update Popover Documentation

- [ ] **Step 1: Update docs demo and API**

In `docs/components/popover.md`:

- Add a renderable content demo using `h`.
- Document `title` and `content` as `VNodeChild | () => VNodeChild`.
- Mention `title` and `content` slots override prop fallbacks.

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

- [ ] **Step 4: Clean known generated drift for non-Popover components**

Run:

```bash
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/radio packages/components/lib/radio packages/components/es/steps packages/components/lib/steps packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer packages/components/es/pagination packages/components/lib/pagination packages/components/es/table packages/components/lib/table packages/components/es/tabs packages/components/lib/tabs packages/components/es/popconfirm packages/components/lib/popconfirm | git apply -R
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
git add docs/superpowers/specs/2026-06-23-ant-style-popover-renderables-design.md docs/superpowers/plans/2026-06-23-ant-style-popover-renderables.md packages/components/src/popover/types.ts packages/components/src/popover/popover.vue packages/components/src/popover/__tests__/popover.test.ts docs/components/popover.md packages/components/es/popover packages/components/lib/popover
git commit -m "feat: align popover renderable content"
```

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `PopoverRenderable`, `PopoverRenderableFactory`, and `PopoverContent` names are consistent across tasks.
