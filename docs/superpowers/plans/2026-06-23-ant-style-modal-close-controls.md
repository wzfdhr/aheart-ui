# Ant Style Modal Close Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align Aheart Modal close controls with Ant-style `closable` object and `closeIcon` behavior.

**Architecture:** Extend Modal type definitions with renderable close icon configuration, render the resolved icon through a local render-node helper, and keep close-button disabled behavior scoped to that button. Existing mask, keyboard, footer, destroy, semantic, and loading behavior remains unchanged.

**Tech Stack:** Vue 3 SFC, TypeScript, Vitest, Vue Test Utils, VitePress docs, package build output under `packages/components/es` and `packages/components/lib`.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` for `ModalClosableConfig`, `ModalClosable`, and `closeIcon`.
- Modify `packages/components/src/modal/modal.vue` for close icon resolution, close button rendering, and disabled click behavior.
- Modify `packages/components/src/modal/style.css` for disabled close-button styling.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` for TDD coverage.
- Modify `docs/components/modal.md` for examples and API docs.
- Generate `packages/components/es/modal/*` and `packages/components/lib/modal/*` with the component build.

### Task 1: Modal Close Control Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { h } from 'vue'

it('renders custom closeIcon content and hides the close button when closeIcon is false', () => {
  const custom = mount(Modal, {
    props: {
      open: true,
      closeIcon: h('span', { class: 'custom-close-icon' }, 'Close')
    }
  })

  expect(custom.find('.custom-close-icon').text()).toBe('Close')

  const hidden = mount(Modal, {
    props: {
      open: true,
      closeIcon: false
    }
  })

  expect(hidden.find('.aheart-modal__close').exists()).toBe(false)
})

it('supports object closable closeIcon and disabled close button', async () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      closable: {
        closeIcon: h('span', { class: 'object-close-icon' }, 'Dismiss'),
        disabled: true
      }
    }
  })

  const close = wrapper.find('.aheart-modal__close')
  expect(wrapper.find('.object-close-icon').text()).toBe('Dismiss')
  expect(close.attributes()).toHaveProperty('disabled')

  await close.trigger('click')

  expect(wrapper.emitted('update:open')).toBeUndefined()
  expect(wrapper.emitted('close')).toBeUndefined()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts`

Expected: FAIL because Modal does not yet accept or render `closeIcon` and does not support object `closable`.

### Task 2: Modal Close Control Implementation

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`
- Modify: `packages/components/src/modal/style.css`

- [ ] **Step 1: Add Modal close-control types**

Add `VNodeChild` import and define:

```ts
export interface ModalClosableConfig {
  closeIcon?: VNodeChild
  disabled?: boolean
}

export type ModalClosable = boolean | ModalClosableConfig
```

Update `closable` to use `[Boolean, Object]` with default `true`, and add `closeIcon`.

- [ ] **Step 2: Render the resolved close icon**

Add a local render-node component, compute close icon precedence, hide the close button for `null` or `false`, and render the icon through that helper.

- [ ] **Step 3: Keep disabled behavior scoped to the close button**

Use a `handleCloseButtonClick` function that returns when `closable.disabled` is true. Keep `close()` unchanged for mask, Escape, and Cancel behavior.

- [ ] **Step 4: Verify modal tests pass**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts`

Expected: PASS.

### Task 3: Docs and Generated Outputs

**Files:**
- Modify: `docs/components/modal.md`
- Modify generated output under `packages/components/es/modal/*`
- Modify generated output under `packages/components/lib/modal/*`

- [ ] **Step 1: Update Modal docs**

Add a close-controls example using `closeIcon` and document `closable` object form plus `closeIcon`.

- [ ] **Step 2: Run full verification**

Run component tests, typecheck, component build, docs build, and inspect `git diff`.

- [ ] **Step 3: Commit and publish**

Stage only this phase, commit as `feat: align modal close controls`, push `codex/consolidated-ant-style-foundation`, fast-forward merge into `master`, push `master`, then switch back to the work branch.

## Self-Review

- Spec coverage: all spec requirements map to Task 1, Task 2, or Task 3.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: `ModalClosableConfig`, `ModalClosable`, `closeIcon`, and `closable.disabled` are named consistently.
