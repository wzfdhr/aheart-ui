# Ant Style Checkbox Focus Methods Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style focus events and imperative methods to `ACheckbox`.

**Architecture:** Keep `ACheckbox` as one Vue SFC backed by `types.ts`. Add refs for the root label and native input, proxy focus/blur events from the input, and expose `focus`, `blur`, and `nativeElement` without changing checked-state behavior.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `focus` and `blur` events on `ACheckbox`.
- Exposed `focus()` method.
- Exposed `blur()` method.
- Exposed `nativeElement` root label reference.
- Docs and generated package output refresh.

This plan does not change CheckboxGroup option typing, label rendering, checked priority, disabled behavior, or semantic part names.

## Files

- Modify: `packages/components/src/checkbox/types.ts`
- Modify: `packages/components/src/checkbox/checkbox.vue`
- Modify: `packages/components/src/checkbox/__tests__/checkbox.test.ts`
- Modify: `docs/components/checkbox.md`
- Generated after build: `packages/components/es/checkbox/*`
- Generated after build: `packages/components/lib/checkbox/*`

## Task 1: Write Failing Checkbox Focus Tests

- [ ] **Step 1: Add focus tests**

In `packages/components/src/checkbox/__tests__/checkbox.test.ts`, add `nextTick` to the Vue import:

```ts
import { h, nextTick } from 'vue'
```

Add this test after `emits model update and change when toggled`:

```ts
it('emits focus and blur events from the native input', async () => {
  const wrapper = mount(Checkbox)
  const input = wrapper.find('input')

  await input.trigger('focus')
  await input.trigger('blur')

  expect(wrapper.emitted('focus')?.[0]?.[0]).toBeInstanceOf(FocusEvent)
  expect(wrapper.emitted('blur')?.[0]?.[0]).toBeInstanceOf(FocusEvent)
})
```

Add this test after the focus/blur event test:

```ts
it('exposes focus blur and nativeElement methods', async () => {
  const host = document.createElement('div')
  document.body.appendChild(host)

  const wrapper = mount(Checkbox, {
    attachTo: host,
    props: { label: 'Focusable' }
  })
  const checkboxVm = wrapper.vm as unknown as {
    focus: () => void
    blur: () => void
    nativeElement?: HTMLLabelElement
  }
  const input = wrapper.find('input').element

  checkboxVm.focus()
  await nextTick()
  expect(document.activeElement).toBe(input)

  checkboxVm.blur()
  await nextTick()
  expect(document.activeElement).not.toBe(input)

  expect(checkboxVm.nativeElement).toBe(wrapper.element)

  wrapper.unmount()
  host.remove()
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- checkbox
```

Expected: new tests fail because Checkbox has no `focus`/`blur` emits and exposes no imperative methods.

## Task 2: Extend Checkbox Types

- [ ] **Step 1: Add focus and blur emit validators**

In `packages/components/src/checkbox/types.ts`, update `checkboxEmits`:

```ts
export const checkboxEmits = {
  'update:modelValue': (checked: boolean) => typeof checked === 'boolean',
  'update:checked': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean, event: Event) => typeof checked === 'boolean' && event instanceof Event,
  focus: (event: FocusEvent) => event instanceof FocusEvent,
  blur: (event: FocusEvent) => event instanceof FocusEvent
}
```

## Task 3: Implement Focus Events and Exposed Methods

- [ ] **Step 1: Add refs**

In `packages/components/src/checkbox/checkbox.vue`, after config setup add:

```ts
const rootRef = ref<HTMLLabelElement>()
const inputRef = ref<HTMLInputElement>()
```

- [ ] **Step 2: Bind refs and events in the template**

Add `ref="rootRef"` to the root `<label>`.

Add `ref="inputRef"` to the native input and add:

```vue
@focus="handleFocus"
@blur="handleBlur"
```

- [ ] **Step 3: Add event handlers and exposed methods**

Add:

```ts
const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur,
  nativeElement: rootRef
})
```

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- checkbox
```

Expected: all Checkbox tests pass.

- [ ] **Step 5: Run targeted typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: typecheck exits 0.

- [ ] **Step 6: Commit implementation**

Run:

```bash
git add packages/components/src/checkbox/types.ts packages/components/src/checkbox/checkbox.vue packages/components/src/checkbox/__tests__/checkbox.test.ts
git commit -m "feat: add checkbox focus methods"
```

## Task 4: Update Checkbox Documentation

- [ ] **Step 1: Update docs demos and API tables**

In `docs/components/checkbox.md`:

- Add `<script setup lang="ts"> import { ref } from 'vue'; const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLElement }>() </script>`.
- Add a focus controls demo using `ref="checkboxRef"` and two `AButton` controls calling `focus()` and `blur()`.
- Add `focus` and `blur` rows to Events.
- Add a Methods section with `focus()`, `blur()`, and `nativeElement`.

- [ ] **Step 2: Build docs once**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

- [ ] **Step 3: Commit docs**

Run:

```bash
git add docs/components/checkbox.md
git commit -m "docs: document checkbox focus methods"
```

## Task 5: Refresh Generated Outputs and Verify

- [ ] **Step 1: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: package build exits 0 and updates `packages/components/es/checkbox/*` and `packages/components/lib/checkbox/*`.

- [ ] **Step 2: Commit generated outputs**

Run:

```bash
git add packages/components/es/checkbox packages/components/lib/checkbox
git commit -m "build: update checkbox focus method outputs"
```

- [ ] **Step 3: Run final verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git diff --check
git status --short --branch
```

Expected: all commands exit 0 and final status is clean.

## Plan Self-Review

- Spec coverage: every scoped requirement maps to tests, implementation, docs, generated output, and final verification.
- Placeholder scan: no unfinished placeholders.
- Type consistency: `focus`, `blur`, `nativeElement`, `rootRef`, and `inputRef` names are consistent across tasks.
