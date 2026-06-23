# Ant Style Modal Focus Trigger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Modal focus restoration through `focusable.focusTriggerAfterClose` with deprecated prop compatibility.

**Architecture:** Keep focus behavior inside `modal.vue`. Store the active trigger element when `open` changes from false to true, resolve the focus restoration setting from `focusable` first and the deprecated prop second, and restore focus after the close transition is queued.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest with Vue Test Utils, Vite library build, VitePress docs.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` for `ModalFocusableConfig`, `focusable`, and `focusTriggerAfterClose`.
- Modify `packages/components/src/modal/modal.vue` for trigger capture and focus restoration.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` for red/green focus coverage.
- Modify `docs/components/modal.md` for the example and API docs.
- Regenerate `packages/components/es/**` and `packages/components/lib/**` through the component build.

### Task 1: Add Failing Focus Restoration Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Import `nextTick`**

Change the Vue import to:

```ts
import { h, nextTick } from 'vue'
```

- [ ] **Step 2: Add focus restoration tests**

Add these tests after the `afterClose` tests:

```ts
it('restores focus to the trigger after close by default', async () => {
  const trigger = document.createElement('button')
  const outside = document.createElement('button')
  document.body.append(trigger, outside)
  trigger.focus()

  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: {
      open: false,
      title: 'Focusable modal'
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
it('lets focusable config control trigger focus restoration', async () => {
  const trigger = document.createElement('button')
  const outside = document.createElement('button')
  document.body.append(trigger, outside)
  trigger.focus()

  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: {
      open: false,
      title: 'Focusable modal',
      focusTriggerAfterClose: false,
      focusable: {
        focusTriggerAfterClose: true
      }
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

  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: {
      open: false,
      title: 'Focusable modal',
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

- [ ] **Step 3: Run Modal tests to verify red**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: FAIL because default restoration and `focusable` precedence are not implemented.

### Task 2: Implement Focus Trigger Restoration

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Add focusable types and props**

In `packages/components/src/modal/types.ts`, add:

```ts
export interface ModalFocusableConfig {
  focusTriggerAfterClose?: boolean
}
```

Add these props:

```ts
focusable: Object as PropType<ModalFocusableConfig>,
focusTriggerAfterClose: {
  type: Boolean as PropType<boolean | undefined>,
  default: undefined
},
```

- [ ] **Step 2: Add focus state and resolver**

In `packages/components/src/modal/modal.vue`, import `nextTick` and `ModalFocusableConfig`, then add:

```ts
const triggerElement = ref<HTMLElement | null>(null)

const isFocusableConfig = (value: typeof props.focusable): value is ModalFocusableConfig =>
  typeof value === 'object' && value !== null

const focusableConfig = computed(() => (isFocusableConfig(props.focusable) ? props.focusable : undefined))
const shouldFocusTriggerAfterClose = computed(
  () => focusableConfig.value?.focusTriggerAfterClose ?? props.focusTriggerAfterClose ?? true
)
```

- [ ] **Step 3: Capture and restore focus**

Add:

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

Update the `open` watcher so `false -> true` captures the trigger, and `true -> false` schedules restoration:

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
      emit('afterClose')
      void nextTick(() => restoreTriggerFocus())
    }
  }
)
```

- [ ] **Step 4: Run Modal tests to verify green**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: all Modal tests pass.

### Task 3: Update Docs and Generated Outputs

**Files:**
- Modify: `docs/components/modal.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] **Step 1: Add docs demo**

Add a `focusOpen` ref and a demo:

```vue
<AButton @click="focusOpen = true">Focus restore</AButton>
<AModal
  v-model:open="focusOpen"
  title="Focus restore"
  :focusable="{ focusTriggerAfterClose: true }"
>
  Closing this modal restores focus to the button that opened it.
</AModal>
```

- [ ] **Step 2: Update API table and type section**

Add rows:

```markdown
| focusable | 焦点管理配置 | `{ focusTriggerAfterClose?: boolean }` | - |
| focusTriggerAfterClose | 关闭后是否聚焦触发元素；兼容旧命名，优先使用 `focusable.focusTriggerAfterClose` | `boolean` | `true` |
```

Add:

```ts
interface ModalFocusableConfig {
  focusTriggerAfterClose?: boolean
}
```

- [ ] **Step 3: Build generated outputs**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Modal outputs include focusable types and runtime behavior.

### Task 4: Verify, Commit, Push, and Merge

**Files:**
- All files changed by Tasks 1-3.

- [ ] **Step 1: Run full component tests**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
```

Expected: all component tests pass.

- [ ] **Step 2: Run typecheck**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
```

Expected: exit 0.

- [ ] **Step 3: Run docs build**

Run from `docs`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
```

Expected: docs build succeeds.

- [ ] **Step 4: Run diff hygiene**

Run:

```bash
git diff --check
```

Expected: no whitespace errors.

- [ ] **Step 5: Commit and publish**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-modal-focus-trigger-design.md docs/superpowers/plans/2026-06-23-ant-style-modal-focus-trigger.md docs/components/modal.md packages/components/src/modal packages/components/es/modal packages/components/lib/modal
git commit -m "feat: align modal focus trigger"
git push origin codex/consolidated-ant-style-foundation
```

- [ ] **Step 6: Fast-forward merge to master**

Run:

```bash
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: `master`, `origin/master`, current branch, and its remote all point at the new commit.

## Self-Review

- Spec coverage: Task 1 covers focus behavior tests, Task 2 covers typed behavior, Task 3 covers docs and generated outputs, Task 4 covers verification and GitHub publication.
- Placeholder scan: no unfinished placeholders.
- Type consistency: `ModalFocusableConfig`, `focusable`, and `focusTriggerAfterClose` names match between spec, tests, source, and docs.
