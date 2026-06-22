# Ant Style Select Focus Methods Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style focus events and imperative focus methods to `ASelect`.

**Architecture:** Keep `ASelect` as one Vue SFC backed by `types.ts`. Add refs for the native select and optional search input, proxy focus/blur events from both focusable controls, and expose `focus`/`blur` methods without changing value mapping, filtering, clearing, or styling behavior.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `focus` and `blur` events on `ASelect`.
- Exposed `focus()` method.
- Exposed `blur()` method.
- Docs and generated package output refresh.

This plan does not add dropdown open state, virtual list behavior, option groups, label-in-value, token separators, custom tag rendering, dropdown rendering, popup placement, or new value modes.

## Files

- Modify: `packages/components/src/select/types.ts`
- Modify: `packages/components/src/select/select.vue`
- Modify: `packages/components/src/select/__tests__/select.test.ts`
- Modify: `docs/components/select.md`
- Generated after build: `packages/components/es/select/*`
- Generated after build: `packages/components/lib/select/*`

## Task 1: Write Failing Select Focus Tests

- [ ] **Step 1: Add focus tests**

In `packages/components/src/select/__tests__/select.test.ts`, add `nextTick` to the Vue import:

```ts
import { h, nextTick } from 'vue'
```

Add this test after `emits model update and change when selected`:

```ts
it('emits focus and blur events from the native selector', async () => {
  const wrapper = mount(Select, {
    props: { options }
  })
  const select = wrapper.find('select')

  await select.trigger('focus')
  await select.trigger('blur')

  expect(wrapper.emitted('focus')?.[0]?.[0]).toBeInstanceOf(FocusEvent)
  expect(wrapper.emitted('blur')?.[0]?.[0]).toBeInstanceOf(FocusEvent)
})
```

Add this test after the focus/blur event test:

```ts
it('exposes focus and blur methods for the native selector', async () => {
  const host = document.createElement('div')
  document.body.appendChild(host)

  const wrapper = mount(Select, {
    attachTo: host,
    props: { options }
  })
  const selectVm = wrapper.vm as unknown as {
    focus: () => void
    blur: () => void
  }
  const select = wrapper.find('select').element

  selectVm.focus()
  await nextTick()
  expect(document.activeElement).toBe(select)

  selectVm.blur()
  await nextTick()
  expect(document.activeElement).not.toBe(select)

  wrapper.unmount()
  host.remove()
})
```

Add this test after the native selector method test:

```ts
it('focuses the search input when showSearch is enabled', async () => {
  const host = document.createElement('div')
  document.body.appendChild(host)

  const wrapper = mount(Select, {
    attachTo: host,
    props: {
      options,
      showSearch: true
    }
  })
  const selectVm = wrapper.vm as unknown as {
    focus: () => void
    blur: () => void
  }
  const searchInput = wrapper.find('.aheart-select__search').element

  selectVm.focus()
  await nextTick()
  expect(document.activeElement).toBe(searchInput)

  selectVm.blur()
  await nextTick()
  expect(document.activeElement).not.toBe(searchInput)

  wrapper.unmount()
  host.remove()
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- select
```

Expected: the new tests fail because `focus`/`blur` events are not emitted and `selectVm.focus` is not a function.

## Task 2: Extend Select Types

- [ ] **Step 1: Add focus and blur emit validators**

In `packages/components/src/select/types.ts`, update `selectEmits`:

```ts
export const selectEmits = {
  'update:modelValue': (value: SelectValue) =>
    typeof value === 'string' || typeof value === 'number' || Array.isArray(value),
  change: (value: SelectValue) => typeof value === 'string' || typeof value === 'number' || Array.isArray(value),
  clear: () => true,
  search: (value: string) => typeof value === 'string',
  focus: (event: FocusEvent) => event instanceof FocusEvent,
  blur: (event: FocusEvent) => event instanceof FocusEvent
}
```

## Task 3: Implement Focus Events and Methods

- [ ] **Step 1: Add refs**

In `packages/components/src/select/select.vue`, after config setup add:

```ts
const searchRef = ref<HTMLInputElement>()
const selectRef = ref<HTMLSelectElement>()
```

- [ ] **Step 2: Bind refs and native events**

Add `ref="searchRef"` to the search input, plus:

```vue
@focus="handleFocus"
@blur="handleBlur"
```

Add `ref="selectRef"` to the native select, plus:

```vue
@focus="handleFocus"
@blur="handleBlur"
```

- [ ] **Step 3: Add focus handlers and exposed methods**

Add this block after `handleSearch`:

```ts
const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const focus = () => {
  const target = props.showSearch ? searchRef.value : selectRef.value
  target?.focus()
}

const blur = () => {
  searchRef.value?.blur()
  selectRef.value?.blur()
}

defineExpose({
  focus,
  blur
})
```

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- select
```

Expected: all Select tests pass.

- [ ] **Step 5: Run targeted typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: typecheck exits 0.

- [ ] **Step 6: Commit implementation**

Run:

```bash
git add packages/components/src/select/types.ts packages/components/src/select/select.vue packages/components/src/select/__tests__/select.test.ts
git commit -m "feat: add select focus methods"
```

## Task 4: Update Select Documentation

- [ ] **Step 1: Update docs demos and API tables**

In `docs/components/select.md`:

- Add `<script setup lang="ts"> import { ref } from 'vue'; const selectRef = ref<{ focus: () => void; blur: () => void }>() </script>`.
- Add a focus controls demo using `ref="selectRef"` and two `AButton` controls calling `focus()` and `blur()`.
- Add `focus` and `blur` rows to Events.
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
git add docs/components/select.md
git commit -m "docs: document select focus methods"
```

## Task 5: Refresh Generated Outputs and Verify

- [ ] **Step 1: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: package build exits 0 and updates `packages/components/es/select/*` and `packages/components/lib/select/*`.

- [ ] **Step 2: Remove unrelated generated declaration drift**

Run:

```bash
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/radio packages/components/lib/radio packages/components/es/steps packages/components/lib/steps packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer | git apply -R
```

Expected: only Select generated files remain modified.

- [ ] **Step 3: Commit generated outputs**

Run:

```bash
git add packages/components/es/select packages/components/lib/select
git commit -m "build: update select focus method outputs"
```

- [ ] **Step 4: Run final verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/radio packages/components/lib/radio packages/components/es/steps packages/components/lib/steps packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer | git apply -R
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git diff --check
git status --short --branch
git log --oneline -16
```

Expected: typecheck, tests, package build, docs build, and diff check all exit 0; the working tree is clean.

## Self-Review

- Spec coverage: the plan covers focus/blur events, `focus()`, `blur()`, docs, generated outputs, and verification.
- Placeholder scan: no `TBD`, `TODO`, or vague implementation-only instructions remain.
- Type consistency: all exposed method signatures use `focus: () => void` and `blur: () => void`; event signatures use `FocusEvent`.
