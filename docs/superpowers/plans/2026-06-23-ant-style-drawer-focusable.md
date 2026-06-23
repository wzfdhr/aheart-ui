# Ant Style Drawer Focusable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Drawer focus management through `focusable.trap` and `focusable.focusTriggerAfterClose`.

**Architecture:** Keep focus management inside `drawer.vue`. Store the active trigger element when `open` changes from false to true, restore it after close when enabled, and intercept Tab keydown events to cycle focus within the drawer panel when trapping is enabled.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest with Vue Test Utils, Vite library build, VitePress docs.

---

## File Structure

- Modify `packages/components/src/drawer/types.ts`: add `DrawerFocusableConfig` and the `focusable` prop.
- Modify `packages/components/src/drawer/drawer.vue`: add panel ref, trigger capture, trigger restore, focusable element collection, trap resolution, and Tab handling.
- Modify `packages/components/src/drawer/__tests__/drawer.test.ts`: add red-green coverage for focus restoration and focus trapping.
- Modify `docs/components/drawer.md`: add focus management example and API docs.
- Regenerate Drawer outputs under `packages/components/es/drawer`, `packages/components/lib/drawer`, and bundled CSS if the build updates it.

### Task 1: Add Failing Focus Tests

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Add focus restoration tests**

Add these tests after `supports afterOpenChange forceRender and destroyOnHidden`:

```ts
it('restores focus to the trigger after close by default', async () => {
  const trigger = document.createElement('button')
  const outside = document.createElement('button')
  document.body.append(trigger, outside)
  trigger.focus()

  const wrapper = mountDrawer({
    attachTo: document.body,
    props: {
      open: false,
      title: 'Focusable drawer'
    }
  })

  await wrapper.setProps({ open: true })
  outside.focus()
  await wrapper.setProps({ open: false })
  await nextTick()

  expect(document.activeElement).toBe(trigger)

  wrapper.unmount()
  trigger.remove()
  outside.remove()
})
```

```ts
it('keeps focus in place when focus restoration is disabled', async () => {
  const trigger = document.createElement('button')
  const outside = document.createElement('button')
  document.body.append(trigger, outside)
  trigger.focus()

  const wrapper = mountDrawer({
    attachTo: document.body,
    props: {
      open: false,
      title: 'Focusable drawer',
      focusable: {
        focusTriggerAfterClose: false
      }
    }
  })

  await wrapper.setProps({ open: true })
  outside.focus()
  await wrapper.setProps({ open: false })
  await nextTick()

  expect(document.activeElement).toBe(outside)

  wrapper.unmount()
  trigger.remove()
  outside.remove()
})
```

- [ ] **Step 2: Add focus trap tests**

Add these tests after the focus restoration tests:

```ts
it('traps tab focus inside masked drawers by default', async () => {
  const wrapper = mountDrawer({
    attachTo: document.body,
    props: {
      open: true,
      title: 'Trap drawer',
      closable: false
    },
    slots: {
      default: '<button class="first-control">First</button><button class="last-control">Last</button>'
    }
  })

  const first = wrapper.find('.first-control').element as HTMLElement
  const last = wrapper.find('.last-control').element as HTMLElement
  last.focus()

  await wrapper.find('.aheart-drawer').trigger('keydown', { key: 'Tab' })

  expect(document.activeElement).toBe(first)

  wrapper.unmount()
})
```

```ts
it('traps shift tab focus back to the last drawer control', async () => {
  const wrapper = mountDrawer({
    attachTo: document.body,
    props: {
      open: true,
      title: 'Reverse trap',
      closable: false
    },
    slots: {
      default: '<button class="first-control">First</button><button class="last-control">Last</button>'
    }
  })

  const first = wrapper.find('.first-control').element as HTMLElement
  const last = wrapper.find('.last-control').element as HTMLElement
  first.focus()

  await wrapper.find('.aheart-drawer').trigger('keydown', { key: 'Tab', shiftKey: true })

  expect(document.activeElement).toBe(last)

  wrapper.unmount()
})
```

```ts
it('lets focusable trap config override the mask default', async () => {
  const wrapper = mountDrawer({
    attachTo: document.body,
    props: {
      open: true,
      title: 'No trap',
      closable: false,
      focusable: {
        trap: false
      }
    },
    slots: {
      default: '<button class="first-control">First</button><button class="last-control">Last</button>'
    }
  })

  const last = wrapper.find('.last-control').element as HTMLElement
  last.focus()

  await wrapper.find('.aheart-drawer').trigger('keydown', { key: 'Tab' })

  expect(document.activeElement).toBe(last)

  wrapper.unmount()
})
```

```ts
it('can trap focus without a mask when focusable trap is true', async () => {
  const wrapper = mountDrawer({
    attachTo: document.body,
    props: {
      open: true,
      title: 'Forced trap',
      closable: false,
      mask: false,
      focusable: {
        trap: true
      }
    },
    slots: {
      default: '<button class="first-control">First</button><button class="last-control">Last</button>'
    }
  })

  const first = wrapper.find('.first-control').element as HTMLElement
  const last = wrapper.find('.last-control').element as HTMLElement
  last.focus()

  await wrapper.find('.aheart-drawer').trigger('keydown', { key: 'Tab' })

  expect(document.activeElement).toBe(first)

  wrapper.unmount()
})
```

- [ ] **Step 3: Run Drawer tests to verify red**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: FAIL because Drawer does not yet capture/restore triggers or trap Tab focus.

### Task 2: Implement Focusable Config

**Files:**
- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`

- [ ] **Step 1: Add focusable type and prop**

In `packages/components/src/drawer/types.ts`, add:

```ts
export interface DrawerFocusableConfig {
  trap?: boolean
  focusTriggerAfterClose?: boolean
}
```

Add this prop near `keyboard`:

```ts
focusable: Object as PropType<DrawerFocusableConfig>,
```

- [ ] **Step 2: Add panel ref and type import**

In `packages/components/src/drawer/drawer.vue`, add `nextTick` to the Vue import and import `DrawerFocusableConfig` from `./types`.

Change the panel section to:

```vue
<section
  ref="panelRef"
  :class="panelClass"
  :style="panelStyle"
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
```

Add state and selector constants:

```ts
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const triggerElement = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
```

- [ ] **Step 3: Resolve focusable behavior**

Add:

```ts
const isFocusableConfig = (value: typeof props.focusable): value is DrawerFocusableConfig =>
  typeof value === 'object' && value !== null
const focusableConfig = computed(() => (isFocusableConfig(props.focusable) ? props.focusable : undefined))
const shouldFocusTriggerAfterClose = computed(() => focusableConfig.value?.focusTriggerAfterClose ?? true)
const shouldTrapFocus = computed(() => focusableConfig.value?.trap ?? showMask.value)
```

- [ ] **Step 4: Capture and restore trigger focus**

Update the `open` watcher to capture on open and restore on close:

```ts
watch(
  () => props.open,
  (open, previousOpen) => {
    if (open && !previousOpen) {
      captureTriggerElement()
    }

    if (open) {
      hasRendered.value = true
    } else if (shouldDestroy.value && !props.forceRender) {
      hasRendered.value = false
    }

    emit('afterOpenChange', open)

    if (!open) {
      void nextTick(() => restoreTriggerFocus())
    }
  }
)
```

Add helpers:

```ts
const captureTriggerElement = () => {
  triggerElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
}

const restoreTriggerFocus = () => {
  const target = triggerElement.value

  if (!shouldFocusTriggerAfterClose.value || !target || !document.contains(target)) {
    return
  }

  target.focus()
}
```

- [ ] **Step 5: Trap Tab focus**

Add:

```ts
const isFocusableElementAvailable = (element: HTMLElement) =>
  !element.hasAttribute('hidden') &&
  element.getAttribute('aria-hidden') !== 'true' &&
  element.tabIndex >= 0 &&
  !(element instanceof HTMLInputElement && element.type === 'hidden')

const getFocusableElements = () => {
  const panel = panelRef.value

  if (!panel) {
    return []
  }

  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusableElementAvailable)
}

const handleTrapTab = (event: KeyboardEvent) => {
  if (!props.open || !shouldTrapFocus.value || event.key !== 'Tab') {
    return
  }

  const panel = panelRef.value

  if (!panel) {
    return
  }

  const focusableElements = getFocusableElements()
  const firstElement = focusableElements[0] ?? panel
  const lastElement = focusableElements[focusableElements.length - 1] ?? panel
  const activeElement = document.activeElement

  if (event.shiftKey) {
    if (activeElement === firstElement || !panel.contains(activeElement)) {
      event.preventDefault()
      lastElement.focus()
    }

    return
  }

  if (activeElement === lastElement || !panel.contains(activeElement)) {
    event.preventDefault()
    firstElement.focus()
  }
}
```

Call it before Escape handling:

```ts
const handleKeydown = (event: KeyboardEvent) => {
  handleTrapTab(event)

  if (props.keyboard && event.key === 'Escape') {
    close()
  }
}
```

- [ ] **Step 6: Run Drawer tests to verify green**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: all Drawer tests pass, including focusable coverage.

### Task 3: Update Documentation

**Files:**
- Modify: `docs/components/drawer.md`

- [ ] **Step 1: Add demo state**

Add:

```ts
const focusOpen = ref(false)
```

- [ ] **Step 2: Add focus management example**

Add after the mask config section:

```md
## 焦点管理

<div class="aheart-demo-panel">
  <AButton @click="focusOpen = true">Focus management</AButton>
  <ADrawer
    v-model:open="focusOpen"
    title="Focus management"
    :focusable="{ trap: true, focusTriggerAfterClose: true }"
  >
    This drawer keeps Tab focus inside the panel and restores focus to the opener after close.
    <button type="button">Focusable control</button>
  </ADrawer>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AButton @click="open = true">Focus management</AButton>
  <ADrawer
    v-model:open="open"
    title="Focus management"
    :focusable="{ trap: true, focusTriggerAfterClose: true }"
  >
    This drawer keeps Tab focus inside the panel and restores focus to the opener after close.
    <button type="button">Focusable control</button>
  </ADrawer>
</template>
```
```

- [ ] **Step 3: Update API docs**

Add this API row after `keyboard`:

```md
| focusable | 焦点管理配置 | `{ trap?: boolean; focusTriggerAfterClose?: boolean }` | - |
```

Add this reference section after `### DrawerMaskConfig`:

```md
### DrawerFocusableConfig

```ts
interface DrawerFocusableConfig {
  trap?: boolean
  focusTriggerAfterClose?: boolean
}
```
```

### Task 4: Build and Commit

**Files:**
- Generated: `packages/components/es/drawer/**`
- Generated: `packages/components/lib/drawer/**`
- Possibly generated: `packages/components/es/style.css`
- Possibly generated: `packages/components/lib/style.css`

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

Expected: build completes and generated Drawer outputs include focusable behavior.

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
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-focusable-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-focusable.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer packages/components/es/style.css packages/components/lib/style.css
git diff --cached --check
git commit -m "feat: align drawer focusable config"
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

- Spec coverage: the plan includes focusable type, trigger restore behavior, trap behavior, docs, generated outputs, and merge workflow.
- Placeholder scan: no unfinished placeholders or vague implementation steps.
- Type consistency: `DrawerFocusableConfig`, `focusable.trap`, and `focusable.focusTriggerAfterClose` match between spec, tests, source, and docs.
