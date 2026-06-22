# Ant Style Select API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Select with Ant-style search, variants, adornments, tags mode, typed values, and max-count behavior while preserving the existing native-select foundation.

**Architecture:** Keep `select.vue` as a native select wrapper. Add typed option value mapping, a conditional search input, filtered option computation, variant classes, prefix/suffix rendering, and limited multi-select emission. Update tests first, then docs and build outputs.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `SelectValue` and `SelectOption.value` as `string | number`.
- `mode="multiple"` and `mode="tags"`.
- `id`, `name`, `variant`, `bordered`, `prefix`, `suffixIcon`, `showSearch`, `searchValue`, `filterOption`, `notFoundContent`, and `maxCount`.
- `search` event.
- docs and package build output refresh.

This plan does not cover a custom popup, virtualization, `labelInValue`, free-form custom tag creation, async loading, or open-state control.

## Task 1: Write Failing Select Tests

**Files:**
- Modify: `packages/components/src/select/__tests__/select.test.ts`

- [ ] **Step 1: Add tests for search, variants, typed values, and maxCount**

Append to `packages/components/src/select/__tests__/select.test.ts`:

```ts
it('filters options when showSearch is enabled and emits search', async () => {
  const wrapper = mount(Select, {
    props: {
      options,
      showSearch: true,
      notFoundContent: 'No fruit'
    }
  })

  await wrapper.find('.aheart-select__search').setValue('ban')

  expect(wrapper.emitted('search')?.[0]).toEqual(['ban'])
  expect(wrapper.findAll('option').map((option) => option.text())).toEqual(['Banana'])

  await wrapper.find('.aheart-select__search').setValue('zzz')

  expect(wrapper.findAll('option')).toHaveLength(1)
  expect(wrapper.find('option').text()).toBe('No fruit')
})

it('supports variant adornments native attributes and numeric values', async () => {
  const numericOptions = [
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 }
  ]
  const wrapper = mount(Select, {
    props: {
      options: numericOptions,
      modelValue: 1,
      id: 'level',
      name: 'level',
      prefix: 'Level',
      suffixIcon: '⌄',
      variant: 'filled'
    }
  })

  expect(wrapper.classes()).toContain('aheart-select--filled')
  expect(wrapper.find('.aheart-select__prefix').text()).toBe('Level')
  expect(wrapper.find('.aheart-select__suffix').text()).toBe('⌄')
  expect(wrapper.find('select').attributes('id')).toBe('level')
  expect(wrapper.find('select').attributes('name')).toBe('level')

  await wrapper.find('select').setValue('2')

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
})

it('maps bordered false to borderless and limits tags values with maxCount', async () => {
  const wrapper = mount(Select, {
    props: {
      options,
      mode: 'tags',
      maxCount: 1,
      bordered: false
    }
  })

  expect(wrapper.classes()).toContain('aheart-select--borderless')

  const select = wrapper.find('select').element
  Array.from(select.options).forEach((option) => {
    option.selected = ['apple', 'banana'].includes(option.value)
  })
  await wrapper.find('select').trigger('change')

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple']])
})
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- select
```

Expected: FAIL because the new props, search input, typed value mapping, and variant classes are missing.

## Task 2: Implement Select API Additions

**Files:**
- Modify: `packages/components/src/select/types.ts`
- Modify: `packages/components/src/select/select.vue`
- Modify: `packages/components/src/select/style.css`

- [ ] **Step 1: Extend Select types**

Add:

```ts
export type SelectPrimitiveValue = string | number
export type SelectMode = 'multiple' | 'tags'
export type SelectValue = SelectPrimitiveValue | SelectPrimitiveValue[]
export type SelectVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'

export interface SelectOption {
  label: string
  value: SelectPrimitiveValue
  disabled?: boolean
}
```

Add props for `id`, `name`, `prefix`, `suffixIcon`, `variant`, `bordered`, `showSearch`, `searchValue`, `filterOption`, `notFoundContent`, and `maxCount`. Add `search` to emits.

- [ ] **Step 2: Render search and adornments**

Add wrapper spans for prefix/suffix and an input with class `aheart-select__search` when `showSearch` is true. Use slots `prefix` and `suffixIcon` as overrides.

- [ ] **Step 3: Add filtered options and typed value parsing**

Compute `filteredOptions`; map native selected strings back to the original option values; cap arrays with `maxCount`.

- [ ] **Step 4: Add variant styles**

Add `aheart-select--outlined`, `aheart-select--borderless`, `aheart-select--filled`, and `aheart-select--underlined` classes plus search/adornment layout CSS.

- [ ] **Step 5: Run targeted verification**

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- select
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit source**

```bash
git add packages/components/src/select
git commit -m "feat: expand select component APIs"
```

## Task 3: Update Docs and Build Output

**Files:**
- Modify: `docs/components/select.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] **Step 1: Update docs**

Add examples for search, variants, prefix/suffixIcon, tags mode, and maxCount. Expand API/event tables.

- [ ] **Step 2: Verify docs build**

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

- [ ] **Step 3: Commit docs**

```bash
git add docs/components/select.md
git commit -m "docs: document expanded select APIs"
```

- [ ] **Step 4: Run full verification**

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
test -f packages/components/es/select/index.d.ts && test -f packages/components/lib/select/index.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo select-api-build-ok
```

Expected: every command exits 0 and the final check prints `select-api-build-ok`.

- [ ] **Step 5: Commit generated output**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update select api outputs"
```
