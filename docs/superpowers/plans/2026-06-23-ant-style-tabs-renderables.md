# Ant Style Tabs Renderables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Ant-style Tabs labels, icons, panel children, and extra content as VNodes.

**Architecture:** Keep `ATabs` as one Vue SFC backed by `types.ts`. Broaden item and extra-content types to `VNodeChild`, add a local render helper, and replace mustache interpolation for tab and extra content with helper rendering.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Renderable `TabItem.label`.
- Renderable `TabItem.icon`.
- Renderable `TabItem.children`.
- Renderable `tabBarExtraContent`.
- Docs and generated package output refresh.

This plan does not add `destroyOnHidden`, `forceRender`, editable-card tabs, overflow menus, custom tab bar rendering, or inactive pane caching.

## Files

- Modify: `packages/components/src/tabs/types.ts`
- Modify: `packages/components/src/tabs/tabs.vue`
- Modify: `packages/components/src/tabs/__tests__/tabs.test.ts`
- Modify: `docs/components/tabs.md`
- Generated after build: `packages/components/es/tabs/*`
- Generated after build: `packages/components/lib/tabs/*`

## Task 1: Write Failing Tabs Tests

- [ ] **Step 1: Add renderable Tabs tests**

In `packages/components/src/tabs/__tests__/tabs.test.ts`, add these tests after `renders the first tab as active by default`:

```ts
it('renders vnode item labels icons and children', () => {
  const wrapper = mount(Tabs, {
    props: {
      items: [
        {
          key: 'overview',
          label: h('span', { class: 'label-node' }, 'Overview node'),
          icon: h('span', { class: 'icon-node' }, 'O'),
          children: h('span', { class: 'panel-node' }, 'Overview panel node')
        }
      ]
    }
  })

  expect(wrapper.find('.label-node').text()).toBe('Overview node')
  expect(wrapper.find('.icon-node').text()).toBe('O')
  expect(wrapper.find('.panel-node').text()).toBe('Overview panel node')
})

it('renders vnode tab bar extra content on both sides', () => {
  const wrapper = mount(Tabs, {
    props: {
      items,
      tabBarExtraContent: {
        left: h('span', { class: 'extra-left-node' }, 'Filters'),
        right: h('button', { class: 'extra-right-node' }, 'Action')
      }
    }
  })

  expect(wrapper.find('.extra-left-node').text()).toBe('Filters')
  expect(wrapper.find('.extra-right-node').text()).toBe('Action')
})

it('lets named panel slots override vnode item children', () => {
  const wrapper = mount(Tabs, {
    props: {
      items: [
        {
          key: 'overview',
          label: 'Overview',
          children: h('span', { class: 'item-panel-node' }, 'Item panel')
        }
      ]
    },
    slots: {
      'tab-overview': '<span class="slot-panel-node">Slot panel</span>'
    }
  })

  expect(wrapper.find('.slot-panel-node').text()).toBe('Slot panel')
  expect(wrapper.find('.item-panel-node').exists()).toBe(false)
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tabs
```

Expected: the new tests fail because VNode item and extra content is not rendered as DOM.

## Task 2: Extend Tabs Types

- [ ] **Step 1: Add renderable type**

In `packages/components/src/tabs/types.ts`, update the import:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
```

Add:

```ts
export type TabsRenderable = VNodeChild
```

- [ ] **Step 2: Broaden item and extra content types**

Update `TabItem` and `TabsExtraContentConfig`:

```ts
export interface TabItem {
  key: string
  label: TabsRenderable
  icon?: TabsRenderable
  children?: TabsRenderable
  disabled?: boolean
}

export interface TabsExtraContentConfig {
  left?: TabsRenderable
  right?: TabsRenderable
}

export type TabsExtraContent = TabsRenderable | TabsExtraContentConfig
```

## Task 3: Render Tabs Nodes

- [ ] **Step 1: Add render helper**

In `packages/components/src/tabs/tabs.vue`, update imports:

```ts
import { computed, defineComponent, ref, watch, type PropType, type VNodeChild } from 'vue'
```

Add this helper after `defineOptions`:

```ts
const ARenderNode = defineComponent({
  name: 'ATabsRenderNode',
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

- [ ] **Step 2: Replace item and extra content mustache output**

Render extra content:

```vue
<slot name="extraLeft">
  <ARenderNode :node="leftExtraContent" />
</slot>
```

```vue
<slot name="extraRight">
  <ARenderNode :node="rightExtraContent" />
</slot>
```

Render icon and label:

```vue
<span v-if="item.icon" :class="tabIconClass" :style="tabIconStyle" aria-hidden="true">
  <ARenderNode :node="item.icon" />
</span>
<span :class="tabLabelClass" :style="tabLabelStyle">
  <ARenderNode :node="item.label" />
</span>
```

Render active item children inside the existing slot fallback:

```vue
<slot v-if="activeSlotName" :name="activeSlotName">
  <ARenderNode :node="activeItem.children" />
</slot>
```

- [ ] **Step 3: Update extra content config parsing**

Replace string-only parsing with:

```ts
const isExtraContentConfig = (value: TabsExtraContent | undefined): value is TabsExtraContentConfig =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && ('left' in value || 'right' in value)
const extraContentConfig = computed<TabsExtraContentConfig>(() => {
  if (isExtraContentConfig(props.tabBarExtraContent)) {
    return props.tabBarExtraContent
  }

  return props.tabBarExtraContent !== undefined ? { right: props.tabBarExtraContent } : {}
})
```

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tabs
```

Expected: all Tabs tests pass.

## Task 4: Update Tabs Documentation

- [ ] **Step 1: Update docs demos and API**

In `docs/components/tabs.md`:

- Add a custom renderable content demo.
- Document `tabBarExtraContent` as `VNodeChild | { left?: VNodeChild; right?: VNodeChild }`.
- Update `TabItem.label`, `icon`, and `children` types to `VNodeChild`.

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

- [ ] **Step 4: Clean known generated drift for non-Tabs components**

Run:

```bash
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/radio packages/components/lib/radio packages/components/es/steps packages/components/lib/steps packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer packages/components/es/pagination packages/components/lib/pagination packages/components/es/table packages/components/lib/table | git apply -R
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
git add docs/superpowers/specs/2026-06-23-ant-style-tabs-renderables-design.md docs/superpowers/plans/2026-06-23-ant-style-tabs-renderables.md packages/components/src/tabs/types.ts packages/components/src/tabs/tabs.vue packages/components/src/tabs/__tests__/tabs.test.ts docs/components/tabs.md packages/components/es/tabs packages/components/lib/tabs
git commit -m "feat: align tabs renderable content"
```

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `TabsRenderable`, `TabsExtraContent`, and `TabsExtraContentConfig` names are consistent across tasks.
