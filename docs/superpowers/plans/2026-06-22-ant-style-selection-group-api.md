# Ant Style Selection Group API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style group APIs for Checkbox and Radio while preserving existing standalone controls.

**Architecture:** Add new sibling Vue components, `checkbox-group.vue` and `radio-group.vue`, that own grouped value state and render existing controls or button-style radio labels from `options`. Export and install the groups through the existing component plugin pattern, then document and rebuild generated output.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `ACheckboxGroup` with array model values, options, disabled inheritance, shared name, horizontal/vertical layout, and change events.
- `ARadioGroup` with scalar model values, options, disabled inheritance, shared name, horizontal/vertical layout, button mode, solid/outline button style, block layout, size, and change events.
- Named exports from `checkbox`, `radio`, and package root.
- docs and build output refresh.

This plan does not cover dotted runtime aliases such as `ACheckbox.Group`, separate `ARadioButton`, or Form validation integration.

## Task 1: Write Failing Group Tests

**Files:**
- Modify: `packages/components/src/checkbox/__tests__/checkbox.test.ts`
- Modify: `packages/components/src/radio/__tests__/radio.test.ts`

- [ ] **Step 1: Add CheckboxGroup tests**

Append these tests to `packages/components/src/checkbox/__tests__/checkbox.test.ts`:

```ts
import CheckboxGroup from '../checkbox-group.vue'

const checkboxOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true }
]

it('renders CheckboxGroup options and emits array updates', async () => {
  const wrapper = mount(CheckboxGroup, {
    props: {
      modelValue: ['apple'],
      options: checkboxOptions,
      name: 'fruit',
      direction: 'vertical'
    }
  })

  expect(wrapper.classes()).toContain('aheart-checkbox-group--vertical')
  expect(wrapper.findAll('input').map((input) => input.attributes('name'))).toEqual(['fruit', 'fruit', 'fruit'])
  expect(wrapper.findAll('input')[0].element.checked).toBe(true)
  expect(wrapper.findAll('input')[2].attributes()).toHaveProperty('disabled')

  await wrapper.findAll('input')[1].setValue(true)

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana']])
  expect(wrapper.emitted('change')?.[0]).toEqual([['apple', 'banana']])
})

it('CheckboxGroup inherits disabled from ConfigProvider', () => {
  const wrapper = mount(ConfigProvider, {
    props: { disabled: true },
    slots: {
      default: {
        render() {
          return h(CheckboxGroup, { options: checkboxOptions })
        }
      }
    }
  })

  expect(wrapper.findAll('input').every((input) => input.attributes('disabled') !== undefined)).toBe(true)
})
```

- [ ] **Step 2: Add RadioGroup tests**

Append these tests to `packages/components/src/radio/__tests__/radio.test.ts`:

```ts
import RadioGroup from '../radio-group.vue'

const radioOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true }
]

it('renders RadioGroup options and emits scalar updates', async () => {
  const wrapper = mount(RadioGroup, {
    props: {
      modelValue: 'apple',
      options: radioOptions,
      name: 'fruit',
      direction: 'vertical'
    }
  })

  expect(wrapper.classes()).toContain('aheart-radio-group--vertical')
  expect(wrapper.findAll('input').map((input) => input.attributes('name'))).toEqual(['fruit', 'fruit', 'fruit'])
  expect(wrapper.findAll('input')[0].element.checked).toBe(true)
  expect(wrapper.findAll('input')[2].attributes()).toHaveProperty('disabled')

  await wrapper.findAll('input')[1].setValue(true)

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
  expect(wrapper.emitted('change')?.[0]).toEqual(['banana'])
})

it('renders RadioGroup button options with size, block, and solid style', async () => {
  const wrapper = mount(RadioGroup, {
    props: {
      modelValue: 'apple',
      options: radioOptions,
      optionType: 'button',
      buttonStyle: 'solid',
      size: 'large',
      block: true
    }
  })

  expect(wrapper.classes()).toContain('aheart-radio-group--button')
  expect(wrapper.classes()).toContain('aheart-radio-group--block')
  expect(wrapper.classes()).toContain('aheart-radio-group--large')
  expect(wrapper.find('.aheart-radio-button').classes()).toContain('is-checked')

  await wrapper.findAll('input')[1].setValue(true)

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
})

it('RadioGroup inherits disabled from ConfigProvider', () => {
  const wrapper = mount(ConfigProvider, {
    props: { disabled: true },
    slots: {
      default: {
        render() {
          return h(RadioGroup, { options: radioOptions })
        }
      }
    }
  })

  expect(wrapper.findAll('input').every((input) => input.attributes('disabled') !== undefined)).toBe(true)
})
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- checkbox radio
```

Expected: FAIL because `checkbox-group.vue` and `radio-group.vue` do not exist yet.

## Task 2: Implement CheckboxGroup

**Files:**
- Modify: `packages/components/src/checkbox/types.ts`
- Modify: `packages/components/src/checkbox/checkbox.vue`
- Create: `packages/components/src/checkbox/checkbox-group.vue`
- Modify: `packages/components/src/checkbox/style.css`
- Modify: `packages/components/src/checkbox/index.ts`

- [ ] **Step 1: Extend Checkbox types**

Add:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export type CheckboxValue = string | number | boolean

export interface CheckboxOption {
  label: string
  value: CheckboxValue
  disabled?: boolean
}
```

Add `value` and `name` to `checkboxProps`, then add `checkboxGroupProps` and `checkboxGroupEmits`.

- [ ] **Step 2: Forward native value and name**

In `checkbox.vue`, bind `:value="value"` and `:name="name"` to the native checkbox input.

- [ ] **Step 3: Create `checkbox-group.vue`**

Render a group wrapper and one `ACheckbox` per option. Use `includes` for selection, append values when checked, remove values when unchecked, and emit both model update and change.

- [ ] **Step 4: Add CheckboxGroup styles**

Add `.aheart-checkbox-group`, `.aheart-checkbox-group--horizontal`, and `.aheart-checkbox-group--vertical` to `style.css`.

- [ ] **Step 5: Export and install CheckboxGroup**

Update `packages/components/src/checkbox/index.ts` to export `CheckboxGroup` as a named installable component.

## Task 3: Implement RadioGroup

**Files:**
- Modify: `packages/components/src/radio/types.ts`
- Modify: `packages/components/src/radio/radio.vue`
- Create: `packages/components/src/radio/radio-group.vue`
- Modify: `packages/components/src/radio/style.css`
- Modify: `packages/components/src/radio/index.ts`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Extend Radio types**

Add:

```ts
import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type RadioValue = string | number | boolean
export type RadioGroupDirection = 'horizontal' | 'vertical'
export type RadioOptionType = 'default' | 'button'
export type RadioButtonStyle = 'outline' | 'solid'

export interface RadioOption {
  label: string
  value: RadioValue
  disabled?: boolean
}
```

Add `value` to `radioProps`, then add `radioGroupProps` and `radioGroupEmits`.

- [ ] **Step 2: Forward native value**

In `radio.vue`, bind `:value="value"` to the native radio input.

- [ ] **Step 3: Create `radio-group.vue`**

Render regular `ARadio` controls for default mode and button labels for `optionType="button"`. Emit `update:modelValue` and `change` when a non-disabled option is selected.

- [ ] **Step 4: Add RadioGroup styles**

Add wrapper, vertical, button, solid, block, and size classes to `style.css`.

- [ ] **Step 5: Export and install RadioGroup**

Update `packages/components/src/radio/index.ts` and root `packages/components/src/index.ts` to include `RadioGroup` and `CheckboxGroup` in plugin installation and named exports.

## Task 4: Verify Source and Commit

- [ ] **Step 1: Run targeted tests and typecheck**

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- checkbox radio
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 2: Commit source**

```bash
git add packages/components/src/checkbox packages/components/src/radio packages/components/src/index.ts
git commit -m "feat: add selection group APIs"
```

## Task 5: Update Docs and Build Output

**Files:**
- Modify: `docs/components/checkbox.md`
- Modify: `docs/components/radio.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] **Step 1: Update docs**

Add CheckboxGroup and RadioGroup examples and API tables.

- [ ] **Step 2: Verify docs build**

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

- [ ] **Step 3: Commit docs**

```bash
git add docs/components/checkbox.md docs/components/radio.md
git commit -m "docs: document selection group APIs"
```

- [ ] **Step 4: Run full verification**

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
test -f packages/components/es/checkbox/checkbox-group.vue.d.ts && test -f packages/components/es/radio/radio-group.vue.d.ts && test -f packages/components/lib/checkbox/checkbox-group.vue.d.ts && test -f packages/components/lib/radio/radio-group.vue.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo selection-groups-build-ok
```

Expected: every command exits 0 and the final check prints `selection-groups-build-ok`.

- [ ] **Step 5: Commit generated output**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update selection group outputs"
```
