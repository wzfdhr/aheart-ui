# Ant Style Steps Renderables and Dot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style renderable Step item fields and dot indicator behavior to `ASteps`.

**Architecture:** Keep `ASteps` as one Vue SFC backed by `types.ts`. Broaden `StepItem` fields to `VNodeChild`, render them through a local render helper, and make dot mode suppress generated numeric/status text while preserving explicit item icons.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Renderable `StepItem.title`.
- Renderable `StepItem.description`.
- Renderable `StepItem.icon`.
- Renderable `StepItem.subTitle`.
- Renderable `StepItem.content`.
- Dot mode without generated numeric/status text.
- Docs and generated package output refresh.

This plan does not add responsive layout, custom progress dot render callbacks, item-level percent, or new statuses.

## Files

- Modify: `packages/components/src/steps/types.ts`
- Modify: `packages/components/src/steps/steps.vue`
- Modify: `packages/components/src/steps/__tests__/steps.test.ts`
- Modify: `docs/components/steps.md`
- Generated after build: `packages/components/es/steps/*`
- Generated after build: `packages/components/lib/steps/*`

## Task 1: Write Failing Steps Tests

- [ ] **Step 1: Add renderable item and dot tests**

In `packages/components/src/steps/__tests__/steps.test.ts`, add these tests after `renders item icons subtitles and content`:

```ts
it('renders vnode item title description icon subtitle and content', () => {
  const wrapper = mount(Steps, {
    props: {
      current: 1,
      items: [
        {
          title: h('span', { class: 'title-node' }, 'Account node'),
          icon: h('span', { class: 'icon-node' }, 'A'),
          subTitle: h('span', { class: 'subtitle-node' }, 'Ready'),
          description: h('span', { class: 'description-node' }, 'Account description'),
          content: h('span', { class: 'content-node' }, 'Account content')
        }
      ]
    }
  })

  expect(wrapper.find('.title-node').text()).toBe('Account node')
  expect(wrapper.find('.icon-node').text()).toBe('A')
  expect(wrapper.find('.subtitle-node').text()).toBe('Ready')
  expect(wrapper.find('.description-node').text()).toBe('Account description')
  expect(wrapper.find('.content-node').text()).toBe('Account content')
})

it('renders dot type without generated numeric text', () => {
  const wrapper = mount(Steps, {
    props: {
      type: 'dot',
      current: 1,
      initial: 3,
      items
    }
  })

  expect(wrapper.findAll('.aheart-steps__icon-text')).toHaveLength(0)
  expect(wrapper.findAll('.aheart-steps__icon').map((icon) => icon.text())).toEqual(['', '', ''])
})

it('keeps explicit item icons in dot type', () => {
  const wrapper = mount(Steps, {
    props: {
      type: 'dot',
      current: 0,
      items: [{ title: 'Custom', icon: h('span', { class: 'dot-icon-node' }, 'C') }]
    }
  })

  expect(wrapper.find('.dot-icon-node').text()).toBe('C')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- steps
```

Expected: the new tests fail because VNode fields are rendered as escaped text or not at all, and dot mode still contains generated numeric text.

## Task 2: Extend Steps Types

- [ ] **Step 1: Add renderable type**

In `packages/components/src/steps/types.ts`, update the import:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
```

Add:

```ts
export type StepRenderable = VNodeChild
```

- [ ] **Step 2: Broaden StepItem fields**

Update `StepItem`:

```ts
export interface StepItem {
  title: StepRenderable
  description?: StepRenderable
  status?: StepStatus
  disabled?: boolean
  icon?: StepRenderable
  subTitle?: StepRenderable
  content?: StepRenderable
}
```

## Task 3: Render StepItem Nodes and Fix Dot Text

- [ ] **Step 1: Add render helper imports and component**

In `packages/components/src/steps/steps.vue`, update imports:

```ts
import { computed, defineComponent, type PropType, type VNodeChild } from 'vue'
```

Add this helper after `defineOptions`:

```ts
const ARenderNode = defineComponent({
  name: 'AStepsRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})
```

- [ ] **Step 2: Replace mustache item rendering**

Use `ARenderNode` for `item.title`, `item.subTitle`, `item.description`, and `item.content`:

```vue
<ARenderNode :node="item.title" />
```

Use `ARenderNode` for generated indicator text:

```vue
<span v-if="showIconText(item, index)" class="aheart-steps__icon-text">
  <ARenderNode :node="getIndicatorText(item, index)" />
</span>
```

- [ ] **Step 3: Add dot text guard**

Replace `shouldUseNumericIndicator` with:

```ts
const isDotType = computed(() => props.type === 'dot')
const showIconText = (item: StepItem, index: number) =>
  !hasPercent(item, index) && (!isDotType.value || item.icon !== undefined)
```

Keep `getIndicatorText` returning explicit `item.icon` first. For dot type without explicit icon, `showIconText` prevents generated numbers from rendering.

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- steps
```

Expected: all Steps tests pass.

## Task 4: Update Steps Documentation

- [ ] **Step 1: Update docs API tables**

In `docs/components/steps.md`:

- Update `initial` wording to say it affects generated numeric indicators in non-dot modes.
- Update `StepItem.title`, `description`, `icon`, `subTitle`, and `content` types to `VNodeChild`.
- Adjust the progress/content section copy to mention renderable item content.

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

- [ ] **Step 4: Clean known generated drift for non-Steps components**

Run:

```bash
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/radio packages/components/lib/radio packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer packages/components/es/pagination packages/components/lib/pagination | git apply -R
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
```

- [ ] **Step 7: Commit slice**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-steps-renderables-dot-design.md docs/superpowers/plans/2026-06-23-ant-style-steps-renderables-dot.md packages/components/src/steps/types.ts packages/components/src/steps/steps.vue packages/components/src/steps/__tests__/steps.test.ts docs/components/steps.md packages/components/es/steps packages/components/lib/steps
git commit -m "feat: align steps renderable items"
```

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `StepRenderable`, `StepItem`, and dot mode wording are consistent across tasks.
