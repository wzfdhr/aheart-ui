# Ant Style Drawer Mask Config Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style object-form mask configuration to Drawer.

**Architecture:** Keep mask behavior inside `drawer.vue`. Widen the `mask` prop type in `types.ts`, derive mask visibility/blur/closability through computed values, and leave `maskClosable` as the compatibility fallback when object-form `mask.closable` is not supplied.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vue Test Utils, Vite, VitePress.

---

## File Structure

- Modify `packages/components/src/drawer/types.ts`: add `DrawerMaskConfig`, `DrawerMask`, and widen `mask`.
- Modify `packages/components/src/drawer/drawer.vue`: resolve mask visibility, blur class, and click closability.
- Modify `packages/components/src/drawer/style.css`: add blur mask styling.
- Modify `packages/components/src/drawer/__tests__/drawer.test.ts`: add failing mask config tests.
- Modify `docs/components/drawer.md`: document mask config example and types.
- Update generated Drawer outputs under `packages/components/es/drawer`, `packages/components/lib/drawer`, and bundle CSS with `vite build`.

## Task 1: Add Failing Mask Config Tests

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Add mask object visibility and blur tests**

Insert after `closes from the mask only when maskClosable is true`:

```ts
  it('supports mask config enabled and blur options', () => {
    const hidden = mountDrawer({
      props: {
        open: true,
        mask: { enabled: false }
      }
    })
    expect(hidden.find('.aheart-drawer__mask').exists()).toBe(false)

    const blurred = mountDrawer({
      props: {
        open: true,
        mask: { blur: true }
      }
    })
    expect(blurred.find('.aheart-drawer__mask').exists()).toBe(true)
    expect(blurred.find('.aheart-drawer__mask').classes()).toContain('is-blur')
  })
```

- [ ] **Step 2: Add mask closable override tests**

```ts
  it('lets mask config closable override maskClosable', async () => {
    const locked = mountDrawer({
      props: {
        open: true,
        mask: { closable: false }
      }
    })
    await locked.find('.aheart-drawer__mask').trigger('click')
    expect(locked.emitted('update:open')).toBeUndefined()

    const closable = mountDrawer({
      props: {
        open: true,
        maskClosable: false,
        mask: { closable: true }
      }
    })
    await closable.find('.aheart-drawer__mask').trigger('click')
    expect(closable.emitted('update:open')?.[0]).toEqual([false])
  })
```

- [ ] **Step 3: Run focused tests and verify RED**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: the new tests fail because `mask` only accepts booleans, object masks are always truthy, blur class is absent, and mask click still uses `maskClosable` only.

## Task 2: Implement Mask Config Behavior

**Files:**
- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`
- Modify: `packages/components/src/drawer/style.css`

- [ ] **Step 1: Add mask types and widen prop**

In `packages/components/src/drawer/types.ts`, add:

```ts
export interface DrawerMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}

export type DrawerMask = boolean | DrawerMaskConfig
```

Replace the `mask` prop with:

```ts
  mask: {
    type: [Boolean, Object] as PropType<DrawerMask>,
    default: true
  },
```

- [ ] **Step 2: Derive mask state**

In `packages/components/src/drawer/drawer.vue`, import `DrawerMaskConfig`:

```ts
import { drawerEmits, drawerProps, type DrawerClosableConfig, type DrawerMaskConfig, type DrawerSemanticPart } from './types'
```

Add near `isClosableConfig`:

```ts
const isMaskConfig = (value: typeof props.mask): value is DrawerMaskConfig =>
  typeof value === 'object' && value !== null
const maskConfig = computed(() => (isMaskConfig(props.mask) ? props.mask : undefined))
const showMask = computed(() => props.mask !== false && maskConfig.value?.enabled !== false)
const isMaskBlurred = computed(() => maskConfig.value?.blur === true)
const isMaskClosable = computed(() => maskConfig.value?.closable ?? props.maskClosable)
```

Replace `maskStyle` and `maskClass`:

```ts
const maskStyle = computed(() => semanticStyle('mask'))
```

```ts
const maskClass = computed(() => [
  'aheart-drawer__mask',
  { 'is-blur': isMaskBlurred.value },
  semanticClass('mask')
])
```

Change `handleMaskClick`:

```ts
const handleMaskClick = () => {
  if (isMaskClosable.value) {
    close()
  }
}
```

Replace the template mask condition:

```vue
      <div v-if="showMask" :class="maskClass" :style="maskStyle" @click="handleMaskClick" />
```

- [ ] **Step 3: Add blur styling**

In `packages/components/src/drawer/style.css`, add after `.aheart-drawer__mask`:

```css
.aheart-drawer__mask.is-blur {
  backdrop-filter: blur(6px);
}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: all Drawer tests pass.

## Task 3: Update Docs and Generated Output

**Files:**
- Modify: `docs/components/drawer.md`
- Modify: `packages/components/es/drawer/*`
- Modify: `packages/components/lib/drawer/*`
- Modify: `packages/components/es/style.css`
- Modify: `packages/components/lib/style.css`

- [ ] **Step 1: Add docs state**

Add to `docs/components/drawer.md` script setup:

```ts
const maskConfigOpen = ref(false)
```

- [ ] **Step 2: Add mask config docs section**

Insert before `## 语义化样式`:

````md
## 遮罩配置

<div class="aheart-demo-panel">
  <AButton @click="maskConfigOpen = true">Blurred mask drawer</AButton>
  <ADrawer
    v-model:open="maskConfigOpen"
    title="Mask config"
    :mask="{ blur: true, closable: false }"
  >
    This drawer uses a blurred mask and ignores mask clicks.
  </ADrawer>
</div>

```vue
<template>
  <ADrawer
    v-model:open="open"
    title="Mask config"
    :mask="{ blur: true, closable: false }"
  >
    This drawer uses a blurred mask and ignores mask clicks.
  </ADrawer>
</template>
```
````

- [ ] **Step 3: Update API row and type section**

Set the mask row to:

```md
| mask | 是否显示遮罩；对象形式可配置显示、模糊和点击关闭 | `boolean` \| `DrawerMaskConfig` | `true` |
```

Add after `### DrawerRenderable`:

````md
### DrawerMaskConfig

```ts
interface DrawerMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}
```
````

- [ ] **Step 4: Generate package output**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build completes and generated Drawer files plus bundled CSS include the new mask config behavior.

## Task 4: Verify, Commit, Push, and Merge

**Files:**
- Stage only Drawer source/tests/styles, Drawer docs, this stage's spec/plan, and generated Drawer/package CSS outputs.

- [ ] **Step 1: Run verification**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
```

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src
```

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Run from `docs`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node_modules/.bin/vitepress build .
```

Run from repo root:

```bash
git diff --check
```

- [ ] **Step 2: Stage intended files**

Run from repo root:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-mask-config-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-mask-config.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer packages/components/es/style.css packages/components/lib/style.css
```

- [ ] **Step 3: Commit this phase**

Run:

```bash
git commit -m "feat: align drawer mask config"
```

- [ ] **Step 4: Push and fast-forward merge to master**

Run:

```bash
git push origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: `master`, `origin/master`, `codex/consolidated-ant-style-foundation`, and `origin/codex/consolidated-ant-style-foundation` point to the new commit.

## Self-Review

- Spec coverage: tests cover mask enabled, blur, object closable false, and object closable true overriding `maskClosable`.
- Type consistency: `DrawerMaskConfig` and `DrawerMask` names match the spec and code snippets.
- Verification scope: focused tests, type check, full tests, component build, docs build, and diff whitespace checks are included before commit.
