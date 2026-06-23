# Ant Style Modal Focus Trap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `AModal` focus trapping through `focusable.trap`.

**Architecture:** Keep the trap inside `packages/components/src/modal/modal.vue`. Add a dialog ref, resolve trap enablement from `focusable.trap` or visible mask state, and intercept Tab keydown events to cycle focus within the dialog.

**Tech Stack:** Vue 3 SFC, TypeScript, Vue Test Utils, Vitest jsdom, Vite package build, VitePress docs build.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` to add `trap?: boolean` to `ModalFocusableConfig`.
- Modify `packages/components/src/modal/modal.vue` to add `dialogRef`, focusable element collection, trap resolution, and Tab key handling.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` to add red-green focus trap behavior coverage.
- Modify `docs/components/modal.md` to document `focusable.trap`.
- Run package build to regenerate `packages/components/es/modal/**` and `packages/components/lib/modal/**`.

### Task 1: Add Failing Focus Trap Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Add focus trap tests**

Add these tests after the existing focus restoration tests:

```ts
it('traps tab focus inside masked modals by default', async () => {
  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: {
      open: true,
      title: 'Trapped modal',
      closable: false,
      footer: false
    },
    slots: {
      default: '<button class="first-field">First</button><button class="last-field">Last</button>'
    }
  })

  const first = wrapper.find('.first-field').element as HTMLElement
  const last = wrapper.find('.last-field').element as HTMLElement

  last.focus()
  await wrapper.find('.aheart-modal').trigger('keydown', { key: 'Tab' })

  expect(document.activeElement).toBe(first)

  wrapper.unmount()
})

it('traps shift tab focus back to the last dialog control', async () => {
  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: {
      open: true,
      title: 'Reverse trap',
      closable: false,
      footer: false
    },
    slots: {
      default: '<button class="first-field">First</button><button class="last-field">Last</button>'
    }
  })

  const first = wrapper.find('.first-field').element as HTMLElement
  const last = wrapper.find('.last-field').element as HTMLElement

  first.focus()
  await wrapper.find('.aheart-modal').trigger('keydown', { key: 'Tab', shiftKey: true })

  expect(document.activeElement).toBe(last)

  wrapper.unmount()
})

it('lets focusable trap config override the mask default', async () => {
  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: {
      open: true,
      title: 'Trap disabled',
      closable: false,
      footer: false,
      focusable: {
        trap: false
      }
    },
    slots: {
      default: '<button class="first-field">First</button><button class="last-field">Last</button>'
    }
  })

  const last = wrapper.find('.last-field').element as HTMLElement

  last.focus()
  await wrapper.find('.aheart-modal').trigger('keydown', { key: 'Tab' })

  expect(document.activeElement).toBe(last)

  wrapper.unmount()
})

it('does not trap focus by default when the mask is disabled', async () => {
  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: {
      open: true,
      title: 'No default trap',
      closable: false,
      footer: false,
      mask: {
        enabled: false
      }
    },
    slots: {
      default: '<button class="first-field">First</button><button class="last-field">Last</button>'
    }
  })

  const last = wrapper.find('.last-field').element as HTMLElement

  last.focus()
  await wrapper.find('.aheart-modal').trigger('keydown', { key: 'Tab' })

  expect(document.activeElement).toBe(last)

  wrapper.unmount()
})

it('can trap focus without a mask when focusable trap is true', async () => {
  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: {
      open: true,
      title: 'Trap without mask',
      closable: false,
      footer: false,
      mask: false,
      focusable: {
        trap: true
      }
    },
    slots: {
      default: '<button class="first-field">First</button><button class="last-field">Last</button>'
    }
  })

  const first = wrapper.find('.first-field').element as HTMLElement
  const last = wrapper.find('.last-field').element as HTMLElement

  last.focus()
  await wrapper.find('.aheart-modal').trigger('keydown', { key: 'Tab' })

  expect(document.activeElement).toBe(first)

  wrapper.unmount()
})
```

- [ ] **Step 2: Run Modal tests to verify red**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: the new Tab trapping tests fail because Tab key handling only closes on Escape today.

### Task 2: Implement Focus Trap

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Extend focusable config type**

Change `ModalFocusableConfig` to:

```ts
export interface ModalFocusableConfig {
  trap?: boolean
  focusTriggerAfterClose?: boolean
}
```

- [ ] **Step 2: Add dialog ref in the template**

Change the dialog section opening tag to include `ref` and a fallback tab stop:

```vue
<section
  ref="dialogRef"
  :class="dialogClass"
  :style="dialogStyle"
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
```

- [ ] **Step 3: Add focus trap constants and state**

Add near the existing refs and helpers:

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

const dialogRef = ref<HTMLElement | null>(null)
```

- [ ] **Step 4: Resolve trap enablement**

Add after `shouldFocusTriggerAfterClose`:

```ts
const shouldTrapFocus = computed(() => focusableConfig.value?.trap ?? isMaskVisible.value)
```

- [ ] **Step 5: Add focusable collection and trap handler**

Add before `close`:

```ts
const isFocusableElementAvailable = (element: HTMLElement) =>
  !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true' && element.tabIndex >= 0

const getFocusableElements = () => {
  const dialog = dialogRef.value

  if (!dialog) {
    return []
  }

  return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusableElementAvailable)
}

const handleTrapTab = (event: KeyboardEvent) => {
  if (!props.open || !shouldTrapFocus.value || event.key !== 'Tab') {
    return
  }

  const dialog = dialogRef.value

  if (!dialog) {
    return
  }

  const focusableElements = getFocusableElements()
  const firstElement = focusableElements[0] ?? dialog
  const lastElement = focusableElements[focusableElements.length - 1] ?? dialog
  const activeElement = document.activeElement

  if (event.shiftKey) {
    if (activeElement === firstElement || !dialog.contains(activeElement)) {
      event.preventDefault()
      lastElement.focus()
    }

    return
  }

  if (activeElement === lastElement || !dialog.contains(activeElement)) {
    event.preventDefault()
    firstElement.focus()
  }
}
```

- [ ] **Step 6: Call trap handler from root keydown**

Change `handleKeydown` to:

```ts
const handleKeydown = (event: KeyboardEvent) => {
  handleTrapTab(event)

  if (props.keyboard && event.key === 'Escape') {
    close()
  }
}
```

- [ ] **Step 7: Run Modal tests to verify green**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: Modal tests pass, including the new focus trap coverage.

### Task 3: Document Focus Trap

**Files:**
- Modify: `docs/components/modal.md`

- [ ] **Step 1: Update the focus demo copy**

Change the focus demo body copy to:

```vue
This modal keeps Tab focus inside the dialog and restores focus to the opener after close.
```

- [ ] **Step 2: Update the focus demo prop**

Change the demo `focusable` object to:

```vue
:focusable="{ trap: true, focusTriggerAfterClose: true }"
```

- [ ] **Step 3: Update API table and config snippet**

Use these docs entries:

```md
| focusable | 焦点管理配置 | `{ trap?: boolean; focusTriggerAfterClose?: boolean }` | - |
```

```ts
interface ModalFocusableConfig {
  trap?: boolean
  focusTriggerAfterClose?: boolean
}
```

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

Expected: build succeeds and generated Modal outputs include the new `trap` type and runtime behavior.

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
git add docs/superpowers/specs/2026-06-23-ant-style-modal-focus-trap-design.md docs/superpowers/plans/2026-06-23-ant-style-modal-focus-trap.md docs/components/modal.md packages/components/src/modal packages/components/es/modal packages/components/lib/modal
```

- [ ] **Step 3: Commit**

Run:

```bash
git diff --cached --check
git commit -m "feat: align modal focus trap"
```

Expected: commit succeeds with only the intended stage changes.

## Self Review

- Spec coverage: the plan includes config type, runtime focus cycle behavior, default mask-derived trap behavior, override behavior, docs, generated outputs, and verification.
- Placeholder scan: no placeholder markers or vague deferred implementation steps.
- Type consistency: `ModalFocusableConfig`, `focusable.trap`, and generated Modal output paths match between spec, plan, source, tests, and docs.
