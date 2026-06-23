# Ant Style Drawer Closable Config Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Drawer close-button configuration through `closeIcon` and object-form `closable`.

**Architecture:** Keep the Drawer component as the single rendering owner for header close controls. Extend Drawer prop types, derive close-button state through computed values, render arbitrary Vue `VNodeChild` content through a local render-node helper, and keep close-event emission in the existing `close()` function.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vue Test Utils, Vite, Markdown docs.

---

## File Structure

- Modify `packages/components/src/drawer/types.ts`: add close-button types, change `closable`, and add `closeIcon`.
- Modify `packages/components/src/drawer/drawer.vue`: resolve close-button visibility, icon content, disabled state, and start/end placement.
- Modify `packages/components/src/drawer/style.css`: add disabled and end-placement close-button styling.
- Modify `packages/components/src/drawer/__tests__/drawer.test.ts`: add failing tests for close icon and object-form `closable`.
- Modify `docs/components/drawer.md`: document close controls and type aliases.
- Update generated Drawer declaration/runtime files under `packages/components/es/drawer` and `packages/components/lib/drawer` with `vite build`.

## Task 1: Add Failing Drawer Close-Control Tests

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Import `h` for VNode close icons**

```ts
import { h, nextTick } from 'vue'
```

- [ ] **Step 2: Add close-icon and closable object tests**

Insert these tests after `emits close and update events from the close button`:

```ts
  it('renders a custom top-level closeIcon', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Custom close',
        closeIcon: h('span', { class: 'custom-close-icon' }, 'Close panel')
      }
    })

    expect(wrapper.find('.aheart-drawer__close').exists()).toBe(true)
    expect(wrapper.find('.custom-close-icon').text()).toBe('Close panel')
  })

  it('hides the close button when closeIcon is false', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Hidden close',
        closeIcon: false
      }
    })

    expect(wrapper.find('.aheart-drawer__close').exists()).toBe(false)
  })

  it('lets closable config override closeIcon and place the button at the end', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Config close',
        extra: 'Actions',
        closeIcon: h('span', { class: 'top-level-close-icon' }, 'Top close'),
        closable: {
          closeIcon: h('span', { class: 'config-close-icon' }, 'Config close'),
          placement: 'end'
        }
      }
    })

    const closeButton = wrapper.find('.aheart-drawer__close')
    expect(closeButton.exists()).toBe(true)
    expect(closeButton.classes()).toContain('is-end')
    expect(wrapper.find('.config-close-icon').text()).toBe('Config close')
    expect(wrapper.find('.top-level-close-icon').exists()).toBe(false)
    expect(wrapper.find('.aheart-drawer__header').element.lastElementChild).toBe(closeButton.element)
  })

  it('does not emit close events from a disabled closable config button', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Disabled close',
        closable: {
          disabled: true,
          closeIcon: h('span', { class: 'disabled-close-icon' }, 'Locked')
        }
      }
    })

    const closeButton = wrapper.find('.aheart-drawer__close')
    expect(closeButton.attributes('disabled')).toBeDefined()

    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })
```

- [ ] **Step 3: Run focused tests and verify RED**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: the new tests fail because `closeIcon` is not a Drawer prop and object-form `closable` is not implemented.

## Task 2: Implement Drawer Close-Control Props and Rendering

**Files:**
- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`
- Modify: `packages/components/src/drawer/style.css`

- [ ] **Step 1: Extend Drawer types**

In `packages/components/src/drawer/types.ts`, change the import and add close-control types:

```ts
import type { CSSProperties, ExtractPropTypes, PropType, VNodeChild } from 'vue'
```

```ts
export type DrawerClosePlacement = 'start' | 'end'
export type DrawerCloseIcon = VNodeChild

export interface DrawerClosableConfig {
  closeIcon?: DrawerCloseIcon
  disabled?: boolean
  placement?: DrawerClosePlacement
}

export type DrawerClosable = boolean | DrawerClosableConfig
```

Replace the `closable` prop and add `closeIcon`:

```ts
  closable: {
    type: [Boolean, Object] as PropType<DrawerClosable>,
    default: true
  },
  closeIcon: {
    type: null as unknown as PropType<DrawerCloseIcon>,
    default: undefined
  },
```

- [ ] **Step 2: Add a render-node helper and close-control computed values**

In `packages/components/src/drawer/drawer.vue`, update imports:

```ts
import { computed, defineComponent, ref, useSlots, watch, type CSSProperties, type PropType, type VNodeChild } from 'vue'
import { drawerEmits, drawerProps, type DrawerClosableConfig, type DrawerSemanticPart } from './types'
```

Add the helper near `defineOptions`:

```ts
const ADrawerRenderNode = defineComponent({
  name: 'ADrawerRenderNode',
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

Add computed close-control state before `hasHeader`:

```ts
const isClosableConfig = (value: typeof props.closable): value is DrawerClosableConfig =>
  typeof value === 'object' && value !== null
const closableConfig = computed(() => (isClosableConfig(props.closable) ? props.closable : undefined))
const resolvedCloseIcon = computed(() => {
  if (closableConfig.value?.closeIcon !== undefined) {
    return closableConfig.value.closeIcon
  }

  if (props.closeIcon !== undefined) {
    return props.closeIcon
  }

  return '×'
})
const showCloseButton = computed(
  () => props.closable !== false && resolvedCloseIcon.value !== false && resolvedCloseIcon.value !== null
)
const isCloseButtonDisabled = computed(() => closableConfig.value?.disabled === true)
const closePlacement = computed(() => closableConfig.value?.placement ?? 'start')
const isCloseAtEnd = computed(() => closePlacement.value === 'end')
```

Change `hasHeader`:

```ts
const hasHeader = computed(() => Boolean(props.title || slots.title || hasExtra.value || showCloseButton.value))
```

Change `closeClass`:

```ts
const closeClass = computed(() => [
  'aheart-drawer__close',
  { 'is-end': isCloseAtEnd.value },
  semanticClass('close')
])
```

Add a guarded close-button handler:

```ts
const handleCloseButtonClick = () => {
  if (isCloseButtonDisabled.value) {
    return
  }

  close()
}
```

- [ ] **Step 3: Render start and end close buttons**

Replace the existing close button in the header with start and end variants:

```vue
          <button
            v-if="showCloseButton && !isCloseAtEnd"
            :class="closeClass"
            :style="semanticStyle('close')"
            :disabled="isCloseButtonDisabled"
            type="button"
            aria-label="Close"
            @click="handleCloseButtonClick"
          >
            <ADrawerRenderNode :node="resolvedCloseIcon" />
          </button>
```

Render the end variant after the `extra` block:

```vue
          <button
            v-if="showCloseButton && isCloseAtEnd"
            :class="closeClass"
            :style="semanticStyle('close')"
            :disabled="isCloseButtonDisabled"
            type="button"
            aria-label="Close"
            @click="handleCloseButtonClick"
          >
            <ADrawerRenderNode :node="resolvedCloseIcon" />
          </button>
```

- [ ] **Step 4: Add close-button disabled styling**

In `packages/components/src/drawer/style.css`, add:

```css
.aheart-drawer__close:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.aheart-drawer__close:disabled:hover {
  background: transparent;
  color: var(--aheart-color-text-secondary);
}

.aheart-drawer__close.is-end {
  flex: none;
}
```

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: all Drawer tests pass.

## Task 3: Update Drawer Docs and Generated Output

**Files:**
- Modify: `docs/components/drawer.md`
- Modify: `packages/components/es/drawer/*`
- Modify: `packages/components/lib/drawer/*`

- [ ] **Step 1: Add docs demo state**

Add to the existing `<script setup>`:

```ts
const closeControlsOpen = ref(false)
```

- [ ] **Step 2: Add a closable controls docs section**

Insert before `## 语义化样式`:

````md
## 关闭按钮

<div class="aheart-demo-panel">
  <AButton @click="closeControlsOpen = true">Custom close control</AButton>
  <ADrawer
    v-model:open="closeControlsOpen"
    title="Close controls"
    :closable="{ closeIcon: 'Close', placement: 'end' }"
  >
    The close button can use custom content and move to the end of the header.
  </ADrawer>
</div>

```vue
<template>
  <ADrawer
    v-model:open="open"
    title="Close controls"
    :closable="{ closeIcon: 'Close', placement: 'end' }"
  >
    The close button can use custom content and move to the end of the header.
  </ADrawer>
</template>
```
````

- [ ] **Step 3: Update API rows and type section**

Set the API rows to:

```md
| closable | 是否显示关闭按钮；对象形式可配置图标、禁用状态和位置 | `boolean` \| `DrawerClosableConfig` | `true` |
| closeIcon | 自定义关闭图标；传入 `false` 或 `null` 隐藏关闭按钮 | `VNodeChild` | `×` |
```

Add after `### DrawerGetContainer`:

````md
### DrawerClosableConfig

```ts
type DrawerClosePlacement = 'start' | 'end'
type DrawerCloseIcon = VNodeChild

interface DrawerClosableConfig {
  closeIcon?: DrawerCloseIcon
  disabled?: boolean
  placement?: DrawerClosePlacement
}
```
````

- [ ] **Step 4: Generate declaration and runtime outputs**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" npm run build
```

from `packages/components`.

Expected: build completes and Drawer generated outputs reflect the new prop/types.

## Task 4: Verify, Commit, Push, and Merge

**Files:**
- Stage only Drawer source, Drawer generated outputs, Drawer docs, and this stage's spec/plan.

- [ ] **Step 1: Run verification commands**

Run:

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
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" npm run build
```

Run from repo root:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" npm run docs:build
```

Run from repo root:

```bash
git diff --check
```

- [ ] **Step 2: Stage intended files**

Run from repo root:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-closable-config-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-closable-config.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer
```

- [ ] **Step 3: Commit this phase**

Run:

```bash
git commit -m "feat: align drawer closable config"
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

- Spec coverage: tests cover custom icon, hidden icon, object override, disabled behavior, and end placement.
- Type consistency: `DrawerClosableConfig`, `DrawerCloseIcon`, and `DrawerClosePlacement` names match the spec and code snippets.
- Verification scope: focused tests, type check, full component tests, component build, docs build, and whitespace diff check are included before commit.
