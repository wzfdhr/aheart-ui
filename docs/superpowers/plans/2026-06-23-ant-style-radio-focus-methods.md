# Ant Style Radio Focus Methods Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style imperative focus methods to `ARadio`.

**Architecture:** Keep `ARadio` as one Vue SFC backed by `types.ts`. Add a ref for the native radio input and expose `focus` and `blur` methods that delegate to that input without changing checked-state or RadioGroup behavior.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Exposed `focus()` method on `ARadio`.
- Exposed `blur()` method on `ARadio`.
- Docs and generated package output refresh.

This plan does not add focus/blur events, `nativeElement`, RadioGroup option typing changes, group orientation changes, checked priority changes, disabled behavior changes, or semantic part changes.

## Files

- Modify: `packages/components/src/radio/radio.vue`
- Modify: `packages/components/src/radio/__tests__/radio.test.ts`
- Modify: `docs/components/radio.md`
- Generated after build: `packages/components/es/radio/*`
- Generated after build: `packages/components/lib/radio/*`

## Task 1: Write Failing Radio Focus Method Test

- [ ] **Step 1: Add focus method test**

In `packages/components/src/radio/__tests__/radio.test.ts`, add `nextTick` to the Vue import:

```ts
import { h, nextTick } from 'vue'
```

Add this test after `emits true when selected`:

```ts
it('exposes focus and blur methods', async () => {
  const host = document.createElement('div')
  document.body.appendChild(host)

  const wrapper = mount(Radio, {
    attachTo: host,
    props: { label: 'Focusable' }
  })
  const radioVm = wrapper.vm as unknown as {
    focus: () => void
    blur: () => void
  }
  const input = wrapper.find('input').element

  radioVm.focus()
  await nextTick()
  expect(document.activeElement).toBe(input)

  radioVm.blur()
  await nextTick()
  expect(document.activeElement).not.toBe(input)

  wrapper.unmount()
  host.remove()
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- radio
```

Expected: the new test fails because `radioVm.focus` is not a function.

## Task 2: Implement Radio Focus Methods

- [ ] **Step 1: Add native input ref**

In `packages/components/src/radio/radio.vue`, after config setup add:

```ts
const inputRef = ref<HTMLInputElement>()
```

- [ ] **Step 2: Bind the native input ref**

Add `ref="inputRef"` to the native radio input:

```vue
<input
  ref="inputRef"
  class="aheart-radio__input"
  type="radio"
```

- [ ] **Step 3: Expose focus and blur methods**

Add this block after `handleChange`:

```ts
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur
})
```

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- radio
```

Expected: all Radio tests pass.

- [ ] **Step 5: Run targeted typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: typecheck exits 0.

- [ ] **Step 6: Commit implementation**

Run:

```bash
git add packages/components/src/radio/radio.vue packages/components/src/radio/__tests__/radio.test.ts
git commit -m "feat: add radio focus methods"
```

## Task 3: Update Radio Documentation

- [ ] **Step 1: Update docs demo and API table**

In `docs/components/radio.md`:

- Add `<script setup lang="ts"> import { ref } from 'vue'; const radioRef = ref<{ focus: () => void; blur: () => void }>() </script>`.
- Add a focus controls demo using `ref="radioRef"` and two `AButton` controls calling `focus()` and `blur()`.
- Add a Methods section with `focus()` and `blur()`.

- [ ] **Step 2: Build docs once**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

- [ ] **Step 3: Commit docs**

Run:

```bash
git add docs/components/radio.md
git commit -m "docs: document radio focus methods"
```

## Task 4: Refresh Generated Outputs and Verify

- [ ] **Step 1: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: package build exits 0 and updates `packages/components/es/radio/*` and `packages/components/lib/radio/*`.

- [ ] **Step 2: Remove unrelated generated declaration drift**

Run:

```bash
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/steps packages/components/lib/steps packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer | git apply -R
```

Expected: only Radio generated files remain modified.

- [ ] **Step 3: Commit generated outputs**

Run:

```bash
git add packages/components/es/radio packages/components/lib/radio
git commit -m "build: update radio focus method outputs"
```

- [ ] **Step 4: Run final verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/steps packages/components/lib/steps packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer | git apply -R
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git diff --check
git status --short --branch
git log --oneline -16
```

Expected: typecheck, tests, package build, docs build, and diff check all exit 0; the working tree is clean.

## Self-Review

- Spec coverage: the plan covers `focus()`, `blur()`, docs, generated outputs, and verification.
- Placeholder scan: no `TBD`, `TODO`, or vague implementation-only instructions remain.
- Type consistency: all exposed method signatures use `focus: () => void` and `blur: () => void`.
