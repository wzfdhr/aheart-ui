# Ant Style Pagination Size Changer and Quick Jumper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style automatic size changer boundary behavior and object-form quick jumper go buttons to `APagination`.

**Architecture:** Keep `APagination` as one Vue SFC backed by `types.ts`. Add narrow type support for `totalBoundaryShowSizeChanger` and `showQuickJumper` config, compute effective size changer visibility, and reuse the existing quick jump action for custom go buttons.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `totalBoundaryShowSizeChanger`.
- Automatic size changer display when `total` exceeds the boundary.
- Explicit `showSizeChanger={false}` override.
- `showQuickJumper={{ goButton }}` custom button content.
- Docs and generated package output refresh.

This plan does not add Select props passthrough for `showSizeChanger`, locale customization, responsive mode, or jump-prev / jump-next ellipsis buttons.

## Files

- Modify: `packages/components/src/pagination/types.ts`
- Modify: `packages/components/src/pagination/pagination.vue`
- Modify: `packages/components/src/pagination/__tests__/pagination.test.ts`
- Modify: `docs/components/pagination.md`
- Generated after build: `packages/components/es/pagination/*`
- Generated after build: `packages/components/lib/pagination/*`

## Task 1: Write Failing Pagination Tests

- [ ] **Step 1: Add automatic size changer and quick jumper tests**

In `packages/components/src/pagination/__tests__/pagination.test.ts`, add these tests after `renders a page-size changer and emits size-change events`:

```ts
it('shows the size changer automatically when total exceeds the boundary', () => {
  const wrapper = mount(Pagination, {
    props: {
      total: 80,
      pageSize: 10
    }
  })

  expect(wrapper.find('.aheart-pagination__size-changer').exists()).toBe(true)
})

it('lets explicit showSizeChanger false override automatic boundary behavior', () => {
  const wrapper = mount(Pagination, {
    props: {
      total: 80,
      pageSize: 10,
      showSizeChanger: false
    }
  })

  expect(wrapper.find('.aheart-pagination__size-changer').exists()).toBe(false)
})

it('uses totalBoundaryShowSizeChanger to control automatic size changer display', () => {
  const hiddenWrapper = mount(Pagination, {
    props: {
      total: 80,
      pageSize: 10,
      totalBoundaryShowSizeChanger: 100
    }
  })
  const shownWrapper = mount(Pagination, {
    props: {
      total: 80,
      pageSize: 10,
      totalBoundaryShowSizeChanger: 70
    }
  })

  expect(hiddenWrapper.find('.aheart-pagination__size-changer').exists()).toBe(false)
  expect(shownWrapper.find('.aheart-pagination__size-changer').exists()).toBe(true)
})
```

Add this test after `quick jumper normalizes input from Enter and Go button`:

```ts
it('renders object quick jumper custom go button content', async () => {
  const wrapper = mount(Pagination, {
    props: {
      total: 95,
      defaultCurrent: 1,
      pageSize: 10,
      showQuickJumper: { goButton: 'Jump' }
    }
  })

  await wrapper.find('.aheart-pagination__quick-jumper-input').setValue('4')

  const goButton = wrapper.find('.aheart-pagination__quick-jumper-go')
  expect(goButton.text()).toBe('Jump')

  await goButton.trigger('click')

  expect(wrapper.emitted('update:current')?.[0]).toEqual([4])
  expect(wrapper.emitted('change')?.[0]).toEqual([4, 10])
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- pagination
```

Expected: the new tests fail because automatic size changer boundary behavior and object-form quick jumper are not implemented.

## Task 2: Extend Pagination Types

- [ ] **Step 1: Add renderable and quick jumper config types**

In `packages/components/src/pagination/types.ts`, update imports and add:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
```

```ts
export type PaginationRenderable = VNodeChild
export interface PaginationQuickJumperConfig {
  goButton?: PaginationRenderable
}
```

- [ ] **Step 2: Update props**

Change `showSizeChanger` to preserve omitted state:

```ts
showSizeChanger: {
  type: Boolean,
  default: undefined
},
totalBoundaryShowSizeChanger: {
  type: Number,
  default: 50
},
showQuickJumper: {
  type: [Boolean, Object] as PropType<boolean | PaginationQuickJumperConfig>,
  default: false
},
```

- [ ] **Step 3: Export the new types**

Ensure `PaginationRenderable` and `PaginationQuickJumperConfig` are exported through `packages/components/src/pagination/index.ts` if the local index already exports Pagination types.

## Task 3: Implement Boundary and Quick Jumper Rendering

- [ ] **Step 1: Add a render helper**

In `packages/components/src/pagination/pagination.vue`, update the import:

```ts
import { computed, defineComponent, ref, watch, type PropType, type VNodeChild } from 'vue'
```

Add this local render component near the top of `<script setup>`:

```ts
const ARenderNode = defineComponent({
  name: 'APaginationRenderNode',
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

- [ ] **Step 2: Compute effective size changer visibility**

After `normalizedPageSizeOptions`, add:

```ts
const normalizedSizeChangerBoundary = computed(() => Math.max(0, props.totalBoundaryShowSizeChanger))
const shouldShowSizeChanger = computed(
  () => props.showSizeChanger ?? props.total > normalizedSizeChangerBoundary.value
)
```

Change the template size changer guard from:

```vue
v-if="showSizeChanger"
```

to:

```vue
v-if="shouldShowSizeChanger"
```

- [ ] **Step 3: Add object quick jumper support**

Add helpers after `shouldShowSizeChanger`:

```ts
const isQuickJumperConfig = (
  value: boolean | import('./types').PaginationQuickJumperConfig
): value is import('./types').PaginationQuickJumperConfig => typeof value === 'object' && value !== null

const hasRenderable = (value: unknown) => value !== undefined && value !== null && value !== false && value !== ''
const quickJumperConfig = computed(() => (isQuickJumperConfig(props.showQuickJumper) ? props.showQuickJumper : undefined))
const quickJumperGoButton = computed(() => quickJumperConfig.value?.goButton ?? 'Go')
const showQuickJumperGoButton = computed(
  () => props.showQuickJumper === true || hasRenderable(quickJumperConfig.value?.goButton)
)
```

Change the quick jumper go button from always rendering to:

```vue
<button
  v-if="showQuickJumperGoButton"
  class="aheart-pagination__quick-jumper-go"
  type="button"
  :disabled="isDisabled"
  @click="jumpToQuickPage"
>
  <ARenderNode :node="quickJumperGoButton" />
</button>
```

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- pagination
```

Expected: all Pagination tests pass.

## Task 4: Update Pagination Documentation

- [ ] **Step 1: Update demos and API**

In `docs/components/pagination.md`:

- Mention automatic size changer behavior in the page-size changer section.
- Add a custom quick jumper go button demo.
- Add `totalBoundaryShowSizeChanger` to the API table.
- Change `showSizeChanger` default docs from `false` to `total > 50`.
- Change `showQuickJumper` type to `boolean | { goButton?: VNodeChild }`.

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

- [ ] **Step 4: Build docs and clean cache**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
```

- [ ] **Step 5: Check diff hygiene**

Run:

```bash
git diff --check
git status --short --branch
```

- [ ] **Step 6: Commit slice**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-pagination-size-quick-jumper-design.md docs/superpowers/plans/2026-06-23-ant-style-pagination-size-quick-jumper.md packages/components/src/pagination/types.ts packages/components/src/pagination/pagination.vue packages/components/src/pagination/__tests__/pagination.test.ts docs/components/pagination.md packages/components/es/pagination packages/components/lib/pagination
git commit -m "feat: align pagination size changer controls"
```

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `PaginationQuickJumperConfig`, `PaginationRenderable`, and `totalBoundaryShowSizeChanger` names are consistent across tasks.
