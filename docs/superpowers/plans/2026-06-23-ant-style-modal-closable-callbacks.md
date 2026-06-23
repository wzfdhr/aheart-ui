# Ant Style Modal Closable Callbacks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `closable.onClose` and `closable.afterClose` callbacks to `AModal`.

**Architecture:** Keep callbacks in the existing Modal close orchestration. Extend the closable config type, call `closable.onClose` from the shared `close` helper, and call `closable.afterClose` from the existing `open` watcher after the `afterClose` event.

**Tech Stack:** Vue 3 SFC, TypeScript, Vue Test Utils, Vitest jsdom, Vite package build, VitePress docs build.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` to add closable callback fields.
- Modify `packages/components/src/modal/modal.vue` to call the callbacks.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` to add red-green callback coverage.
- Modify `docs/components/modal.md` to document the new closable config fields.
- Run package build to regenerate `packages/components/es/modal/**` and `packages/components/lib/modal/**`.

### Task 1: Add Failing Closable Callback Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Import `vi`**

Change:

```ts
import { describe, expect, it } from 'vitest'
```

to:

```ts
import { describe, expect, it, vi } from 'vitest'
```

- [ ] **Step 2: Add close-path callback coverage**

Add this test after the existing disabled closable object test:

```ts
it('calls closable onClose when enabled close paths close the modal', async () => {
  const onClose = vi.fn()
  const wrapper = mount(Modal, {
    props: {
      open: true,
      closable: {
        onClose
      }
    }
  })

  await wrapper.find('.aheart-modal__close').trigger('click')
  await wrapper.find('.aheart-modal__mask').trigger('click')
  await wrapper.find('.aheart-modal__cancel').trigger('click')
  await wrapper.find('.aheart-modal').trigger('keydown', { key: 'Escape' })

  expect(onClose).toHaveBeenCalledTimes(4)
  expect(wrapper.emitted('close')).toHaveLength(4)
})
```

- [ ] **Step 3: Add after-close callback coverage**

Add this test after the close-path callback test:

```ts
it('calls closable afterClose when the modal finishes closing', async () => {
  const afterClose = vi.fn()
  const wrapper = mount(Modal, {
    props: {
      open: true,
      closable: {
        afterClose
      }
    }
  })

  await wrapper.setProps({ open: false })

  expect(wrapper.emitted('afterClose')).toHaveLength(1)
  expect(afterClose).toHaveBeenCalledTimes(1)
})
```

- [ ] **Step 4: Run Modal tests to verify red**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: the new callback tests fail because `ModalClosableConfig` does not yet call `onClose` or `afterClose`.

### Task 2: Implement Closable Callbacks

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Extend the closable config type**

Change:

```ts
export interface ModalClosableConfig {
  closeIcon?: ModalRenderable
  disabled?: boolean
}
```

to:

```ts
export interface ModalClosableConfig {
  closeIcon?: ModalRenderable
  disabled?: boolean
  onClose?: () => void
  afterClose?: () => void
}
```

- [ ] **Step 2: Call afterClose callback from the open watcher**

Change the `!open` branch to:

```ts
if (!open) {
  emit('afterClose')
  closableConfig.value?.afterClose?.()
  void nextTick(() => restoreTriggerFocus())
}
```

- [ ] **Step 3: Add and use an onClose helper**

Add before `close`:

```ts
const notifyClosableClose = () => {
  closableConfig.value?.onClose?.()
}
```

Change `close` to:

```ts
const close = () => {
  notifyClosableClose()
  emit('update:open', false)
  emit('close')
}
```

- [ ] **Step 4: Run Modal tests to verify green**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: Modal tests pass, including the new closable callback coverage.

### Task 3: Update Documentation

**Files:**
- Modify: `docs/components/modal.md`

- [ ] **Step 1: Update API table row**

Use this row:

```md
| closable | 是否显示右上角关闭按钮，可配置关闭图标、禁用状态和关闭回调 | `boolean` \| `ModalClosableConfig` | `true` |
```

- [ ] **Step 2: Add ModalClosableConfig section**

Add this section near the other config snippets:

````md
### ModalClosableConfig

```ts
interface ModalClosableConfig {
  closeIcon?: VNodeChild
  disabled?: boolean
  onClose?: () => void
  afterClose?: () => void
}
```
````

### Task 4: Build Generated Outputs and Verify

**Files:**
- Modify generated Modal outputs under `packages/components/es/modal/**`
- Modify generated Modal outputs under `packages/components/lib/modal/**`

- [ ] **Step 1: Run package build**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Modal outputs include the closable callback fields and runtime calls.

- [ ] **Step 2: Remove known unrelated Drawer/Form generated declaration noise if present**

Run:

```bash
cd /Users/start/Desktop/aheart-ui
git diff -- packages/components/es/drawer packages/components/lib/drawer packages/components/es/form packages/components/lib/form | git apply -R
```

Expected: only Modal-related generated files remain changed.

- [ ] **Step 3: Run full checks**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
```

Expected: all component tests and type checks pass.

- [ ] **Step 4: Run docs build and whitespace check**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/docs
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
cd /Users/start/Desktop/aheart-ui
git diff --check
```

Expected: docs build succeeds and diff check reports no whitespace errors.

### Task 5: Stage and Commit

**Files:**
- Stage the new spec and plan.
- Stage `docs/components/modal.md`.
- Stage `packages/components/src/modal/**`.
- Stage `packages/components/es/modal/**`.
- Stage `packages/components/lib/modal/**`.

- [ ] **Step 1: Inspect final diff**

Run:

```bash
cd /Users/start/Desktop/aheart-ui
git status --short
git diff --stat
```

Expected: changes are limited to Modal source, Modal docs, Modal generated outputs, and this phase's spec/plan files.

- [ ] **Step 2: Stage explicit paths**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-modal-closable-callbacks-design.md docs/superpowers/plans/2026-06-23-ant-style-modal-closable-callbacks.md docs/components/modal.md packages/components/src/modal packages/components/es/modal packages/components/lib/modal
```

- [ ] **Step 3: Commit**

Run:

```bash
git diff --cached --check
git commit -m "feat: align modal closable callbacks"
```

Expected: commit succeeds with only the intended stage changes.

## Self Review

- Spec coverage: the plan includes `onClose`, `afterClose`, source, tests, docs, generated outputs, full checks, and commit scope.
- Placeholder scan: no placeholder markers or vague deferred steps.
- Type consistency: `ModalClosableConfig`, `onClose`, and `afterClose` names match across source, tests, docs, and generated outputs.
