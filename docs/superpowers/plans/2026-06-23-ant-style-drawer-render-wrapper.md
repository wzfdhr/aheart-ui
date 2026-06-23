# Ant Style Drawer Render Wrapper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align Aheart Drawer with Ant-style `drawerRender` support for custom panel content rendering.

**Architecture:** Add a typed render-function prop to `types.ts`. Keep the existing Drawer root and mask structure, but route the panel section through a local render-wrapper component that calls `drawerRender` with the default slot node and renders the returned node without adding DOM when the prop is omitted.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest with Vue Test Utils, Vite library build, VitePress docs.

---

## File Structure

- Modify `packages/components/src/drawer/types.ts`: add `DrawerRender` and `drawerRender`.
- Modify `packages/components/src/drawer/drawer.vue`: add `ADrawerRenderWrapper` and wrap the existing panel section.
- Modify `packages/components/src/drawer/__tests__/drawer.test.ts`: add red-green coverage for render wrapping and interaction preservation.
- Modify `docs/components/drawer.md`: add demo and API row.
- Regenerate Drawer outputs under `packages/components/es/drawer` and `packages/components/lib/drawer`.

### Task 1: Add Failing Render Wrapper Tests

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Add wrapper rendering test**

Add after `renders VNode title extra and footer props`:

```ts
it('renders drawerRender result around the panel node', () => {
  const wrapper = mountDrawer({
    props: {
      open: true,
      title: 'Rendered drawer',
      drawerRender: (node: unknown) => h('div', { class: 'drawer-render-shell' }, [node])
    },
    slots: {
      default: '<button class="wrapped-action">Wrapped action</button>'
    }
  })

  expect(wrapper.find('.drawer-render-shell').exists()).toBe(true)
  expect(wrapper.find('.drawer-render-shell .aheart-drawer__panel').exists()).toBe(true)
  expect(wrapper.find('.drawer-render-shell .wrapped-action').text()).toBe('Wrapped action')
  expect(wrapper.find('.drawer-render-shell .aheart-drawer__mask').exists()).toBe(false)
})
```

- [ ] **Step 2: Add interaction preservation test**

Add after the wrapper rendering test:

```ts
it('preserves close interactions inside drawerRender', async () => {
  const wrapper = mountDrawer({
    props: {
      open: true,
      title: 'Rendered close',
      drawerRender: (node: unknown) => h('div', { class: 'drawer-render-shell' }, [node])
    }
  })

  await wrapper.find('.drawer-render-shell .aheart-drawer__close').trigger('click')

  expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  expect(wrapper.emitted('close')).toHaveLength(1)
})
```

- [ ] **Step 3: Run Drawer tests to verify red**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: FAIL because `drawerRender` is not yet a prop and the shell is not rendered.

### Task 2: Implement Drawer Render Wrapper

**Files:**
- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`

- [ ] **Step 1: Add render type and prop**

In `packages/components/src/drawer/types.ts`, add after `DrawerRenderable`:

```ts
export type DrawerRender = (node: DrawerRenderable) => DrawerRenderable
```

Add this prop after `getContainer`:

```ts
drawerRender: Function as PropType<DrawerRender>,
```

- [ ] **Step 2: Import `DrawerRender` and add wrapper component**

In `packages/components/src/drawer/drawer.vue`, import `type DrawerRender`.

Add after `ADrawerRenderNode`:

```ts
const ADrawerRenderWrapper = defineComponent({
  name: 'ADrawerRenderWrapper',
  props: {
    renderer: Function as PropType<DrawerRender>
  },
  setup(renderProps, { slots }) {
    return () => {
      const node = slots.default?.() ?? null
      return renderProps.renderer ? renderProps.renderer(node) : node
    }
  }
})
```

- [ ] **Step 3: Wrap the panel section**

Change the template so the existing `<section ...>` node is the default slot of:

```vue
<ADrawerRenderWrapper :renderer="drawerRender">
  <section
    ref="panelRef"
    :class="panelClass"
    :style="panelStyle"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    ...
  </section>
</ADrawerRenderWrapper>
```

Keep the mask before the wrapper and keep the section markup unchanged inside the wrapper.

- [ ] **Step 4: Run Drawer tests to verify green**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: all Drawer tests pass, including the new `drawerRender` coverage.

### Task 3: Update Documentation

**Files:**
- Modify: `docs/components/drawer.md`

- [ ] **Step 1: Add imports and demo state**

Change the import to include `type VNodeChild`:

```ts
import { h, ref, type VNodeChild } from 'vue'
```

Add:

```ts
const drawerRenderOpen = ref(false)
const drawerRender = (node: VNodeChild) => h('div', { class: 'docs-drawer-render-shell' }, [node])
```

- [ ] **Step 2: Add render wrapper example**

Add after the renderable content section:

```md
## 自定义渲染面板

<div class="aheart-demo-panel">
  <AButton @click="drawerRenderOpen = true">Rendered drawer shell</AButton>
  <ADrawer
    v-model:open="drawerRenderOpen"
    title="Rendered shell"
    :drawer-render="drawerRender"
  >
    drawerRender can wrap the default drawer panel while preserving close and focus behavior.
  </ADrawer>
</div>

```vue
<script setup lang="ts">
import { h, ref, type VNodeChild } from 'vue'

const open = ref(false)
const drawerRender = (node: VNodeChild) =>
  h('div', { class: 'workspace-drawer-shell' }, [node])
</script>

<template>
  <ADrawer v-model:open="open" title="Rendered shell" :drawer-render="drawerRender">
    drawerRender can wrap the default drawer panel while preserving close and focus behavior.
  </ADrawer>
</template>
```
```

- [ ] **Step 3: Add API row**

Add this row after `getContainer`:

```md
| drawerRender | 自定义渲染抽屉面板内容 | `(node: VNodeChild) => VNodeChild` | - |
```

### Task 4: Build and Commit

**Files:**
- Generated: `packages/components/es/drawer/**`
- Generated: `packages/components/lib/drawer/**`

- [ ] **Step 1: Run typecheck**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
```

Expected: exit 0.

- [ ] **Step 2: Run full component tests**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
```

Expected: exit 0 with all component tests passing.

- [ ] **Step 3: Run component build**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build completes and generated Drawer outputs include `drawerRender`.

- [ ] **Step 4: Remove known unrelated generated noise**

Run from the repository root:

```bash
git diff -- packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal | git apply -R
```

Expected: only Drawer-related generated files remain changed.

- [ ] **Step 5: Run docs build**

Run from `docs`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node_modules/.bin/vitepress build .
```

Expected: VitePress build completes.

- [ ] **Step 6: Run final diff checks**

Run from the repository root:

```bash
git status -sb
git diff --check
git diff --name-only
git diff --stat
```

Expected: no whitespace errors; changed files are limited to Drawer source/tests/docs, this phase's spec/plan, and generated Drawer outputs.

- [ ] **Step 7: Stage and commit**

Run from the repository root:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-render-wrapper-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-render-wrapper.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer
git diff --cached --check
git commit -m "feat: align drawer render wrapper"
```

Expected: commit succeeds with only intended files.

- [ ] **Step 8: Push and fast-forward master**

Run from the repository root:

```bash
git push origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: both the work branch and `master` point at the new commit locally and on origin.

## Self-Review

- Spec coverage: the plan includes type, runtime wrapper, tests, docs, generated outputs, and merge workflow.
- Placeholder scan: no unfinished placeholders or vague implementation steps.
- Type consistency: `DrawerRender`, `drawerRender`, and generated Drawer output paths match between spec, plan, source, tests, and docs.
