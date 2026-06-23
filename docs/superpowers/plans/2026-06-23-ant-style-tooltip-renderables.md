# Ant Style Tooltip Renderables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Ant-style Tooltip `title` as a Vue node or render function.

**Architecture:** Keep `ATooltip` as one Vue SFC backed by `types.ts`. Broaden the title prop type, add a local render helper, replace string interpolation with helper rendering, and use an explicit title presence check that still treats empty strings as absent.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Renderable `title`.
- Numeric renderable values such as `0`.
- Slot override priority for renderable prop fallback.
- Empty string title preserving no-popup behavior.
- Docs and generated package output refresh.

This plan does not change trigger timing, controlled state, `destroyOnHidden`, `fresh`, portal/container behavior, placement alignment, arrow geometry, or semantic class/style contracts.

## Files

- Modify: `packages/components/src/tooltip/types.ts`
- Modify: `packages/components/src/tooltip/tooltip.vue`
- Modify: `packages/components/src/tooltip/__tests__/tooltip.test.ts`
- Modify: `docs/components/tooltip.md`
- Generated after build: `packages/components/es/tooltip/*`
- Generated after build: `packages/components/lib/tooltip/*`

## Task 1: Write Failing Tooltip Tests

- [x] **Step 1: Add renderable Tooltip tests**

In `packages/components/src/tooltip/__tests__/tooltip.test.ts`, update the imports:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
```

Add these tests after `renders title from hover trigger`:

```ts
it('renders vnode and function title props', () => {
  const wrapper = mount(Tooltip, {
    props: {
      open: true,
      title: () => h('span', { class: 'title-node' }, 'Helpful node')
    },
    slots: { default: '<button>Help</button>' }
  })

  expect(wrapper.find('.title-node').text()).toBe('Helpful node')
})

it('renders numeric title without treating zero as empty', () => {
  const wrapper = mount(Tooltip, {
    props: {
      open: true,
      title: 0
    },
    slots: { default: '<button>Count</button>' }
  })

  expect(wrapper.find('.aheart-tooltip__content').text()).toBe('0')
})

it('lets title slot override renderable prop fallback', () => {
  const wrapper = mount(Tooltip, {
    props: {
      open: true,
      title: h('span', { class: 'prop-title-node' }, 'Prop title')
    },
    slots: {
      default: '<button>Help</button>',
      title: '<span class="slot-title-node">Slot title</span>'
    }
  })

  expect(wrapper.find('.slot-title-node').text()).toBe('Slot title')
  expect(wrapper.find('.prop-title-node').exists()).toBe(false)
})

it('does not render popup for an empty title string', async () => {
  const wrapper = mount(Tooltip, {
    props: {
      title: '',
      mouseEnterDelay: 0
    },
    slots: { default: '<button>Help</button>' }
  })

  await wrapper.find('.aheart-tooltip__trigger').trigger('mouseenter')

  expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)
})
```

- [x] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tooltip
```

Expected: the new renderable tests fail because current Tooltip prop validators and template output do not support object/function/number renderables.

## Task 2: Extend Tooltip Types

- [x] **Step 1: Add renderable types and prop helper**

In `packages/components/src/tooltip/types.ts`, update the import:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
```

Add after `TooltipArrow`:

```ts
export type TooltipRenderable = VNodeChild
export type TooltipRenderableFactory = () => VNodeChild
export type TooltipTitle = TooltipRenderable | TooltipRenderableFactory
```

Add before `tooltipProps`:

```ts
const titleProp = {
  type: null as unknown as PropType<TooltipTitle>,
  default: undefined
}
```

- [x] **Step 2: Broaden title prop**

Update `tooltipProps`:

```ts
title: titleProp,
```

## Task 3: Render Tooltip Title Node

- [x] **Step 1: Add render helper**

In `packages/components/src/tooltip/tooltip.vue`, update imports:

```ts
import { computed, defineComponent, onBeforeUnmount, ref, useSlots, watch, type PropType } from 'vue'
```

Update the type import:

```ts
import { tooltipEmits, tooltipProps, type TooltipTitle } from './types'
```

Add after `defineOptions`:

```ts
const ARenderNode = defineComponent({
  name: 'ATooltipRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<TooltipTitle>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => (typeof renderProps.node === 'function' ? renderProps.node() : renderProps.node)
  }
})

const hasTitleContent = (value: TooltipTitle | undefined | null) =>
  value !== undefined && value !== null && value !== false && value !== ''
```

- [x] **Step 2: Replace truthy title presence check**

Update the computed presence check:

```ts
const hasTitle = computed(() => Boolean(slots.title) || hasTitleContent(props.title))
```

- [x] **Step 3: Replace string interpolation in template**

Render title:

```vue
<span class="aheart-tooltip__content" :class="contentClass" :style="contentStyle">
  <slot name="title">
    <ARenderNode :node="title" />
  </slot>
</span>
```

- [x] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tooltip
```

Expected: all Tooltip tests pass.

## Task 4: Update Tooltip Documentation

- [x] **Step 1: Update docs demo and API**

In `docs/components/tooltip.md`:

- Add a renderable title demo using `h`.
- Document `title` as `VNodeChild | () => VNodeChild`.
- Mention `title` slot priority and empty title behavior.

- [x] **Step 2: Build docs once**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

## Task 5: Refresh Generated Outputs and Verify

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

- [x] **Step 4: Clean known generated drift for non-Tooltip components**

Run:

```bash
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/radio packages/components/lib/radio packages/components/es/steps packages/components/lib/steps packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer packages/components/es/pagination packages/components/lib/pagination packages/components/es/table packages/components/lib/table packages/components/es/tabs packages/components/lib/tabs packages/components/es/popconfirm packages/components/lib/popconfirm packages/components/es/popover packages/components/lib/popover | git apply -R
```

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
git log --oneline -16
```

- [x] **Step 7: Commit slice**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-tooltip-renderables-design.md docs/superpowers/plans/2026-06-23-ant-style-tooltip-renderables.md packages/components/src/tooltip/types.ts packages/components/src/tooltip/tooltip.vue packages/components/src/tooltip/__tests__/tooltip.test.ts docs/components/tooltip.md packages/components/es/tooltip packages/components/lib/tooltip
git commit -m "feat: align tooltip renderable title"
```

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `TooltipRenderable`, `TooltipRenderableFactory`, and `TooltipTitle` names are consistent across tasks.
