# Ant Style Checkbox Controls Semantic API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `ACheckbox` and `ACheckboxGroup` closer to Ant Design Checkbox with controlled aliases, uncontrolled defaults, semantic style hooks, richer options, and updated documentation.

**Architecture:** Extend the existing Checkbox files in place. Standalone checkbox owns a small internal uncontrolled state, while CheckboxGroup normalizes options and owns grouped uncontrolled state only when neither `value` nor `modelValue` is supplied.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Standalone `checked`, `defaultChecked`, `update:checked`, and `change(checked, event)`.
- Standalone `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- Standalone semantic keys `root`, `icon`, and `label`.
- Group `value`, `defaultValue`, `update:value`, string/number options, option `className`, `style`, and `title`.
- Group root `className`, `rootClassName`, and `style`.
- Docs and generated `es` / `lib` outputs.

This plan does not cover dotted runtime aliases, child-checkbox composition inside groups, imperative focus/blur methods, or Form integration.

## Files

- Modify: `packages/components/src/checkbox/types.ts`
- Modify: `packages/components/src/checkbox/checkbox.vue`
- Modify: `packages/components/src/checkbox/checkbox-group.vue`
- Modify: `packages/components/src/checkbox/__tests__/checkbox.test.ts`
- Modify: `docs/components/checkbox.md`
- Generated after build: `packages/components/es/checkbox/*`
- Generated after build: `packages/components/lib/checkbox/*`

## Task 1: Write Failing Checkbox Tests

- [ ] **Step 1: Add tests in `packages/components/src/checkbox/__tests__/checkbox.test.ts`**

Add tests that assert:

```ts
it('prefers checked alias over modelValue and supports defaultChecked', async () => {
  const checkedWrapper = mount(Checkbox, {
    props: { checked: true, modelValue: false, label: 'Alias' }
  })
  const defaultWrapper = mount(Checkbox, {
    props: { defaultChecked: true, label: 'Default' }
  })

  expect(checkedWrapper.find('input').element.checked).toBe(true)
  expect(defaultWrapper.find('input').element.checked).toBe(true)

  await defaultWrapper.find('input').setValue(false)

  expect(defaultWrapper.find('input').element.checked).toBe(false)
})

it('emits checked alias update and change event payload', async () => {
  const wrapper = mount(Checkbox, {
    props: { checked: false }
  })

  await wrapper.find('input').setValue(true)

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
  expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
  expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(Event)
})

it('applies Checkbox semantic classes and styles', () => {
  const wrapper = mount(Checkbox, {
    props: {
      checked: true,
      label: 'Styled',
      className: 'checkbox-class',
      rootClassName: 'checkbox-root',
      style: { marginTop: '4px' },
      classNames: {
        root: 'semantic-root',
        icon: 'semantic-icon',
        label: 'semantic-label'
      },
      styles: {
        root: { color: 'red' },
        icon: { borderColor: 'blue' },
        label: { fontWeight: 600 }
      }
    }
  })

  expect(wrapper.classes()).toContain('checkbox-class')
  expect(wrapper.classes()).toContain('checkbox-root')
  expect(wrapper.classes()).toContain('semantic-root')
  expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  expect(wrapper.attributes('style')).toContain('color: red')
  expect(wrapper.find('.aheart-checkbox__inner').classes()).toContain('semantic-icon')
  expect(wrapper.find('.aheart-checkbox__inner').attributes('style')).toContain('border-color: blue')
  expect(wrapper.find('.aheart-checkbox__label').classes()).toContain('semantic-label')
  expect(wrapper.find('.aheart-checkbox__label').attributes('style')).toContain('font-weight: 600')
})

it('supports CheckboxGroup value alias and uncontrolled defaultValue', async () => {
  const valueWrapper = mount(CheckboxGroup, {
    props: {
      value: ['banana'],
      modelValue: ['apple'],
      options: checkboxOptions
    }
  })
  const defaultWrapper = mount(CheckboxGroup, {
    props: {
      defaultValue: ['apple'],
      options: checkboxOptions
    }
  })

  expect(valueWrapper.findAll('input')[1].element.checked).toBe(true)
  expect(defaultWrapper.findAll('input')[0].element.checked).toBe(true)

  await defaultWrapper.findAll('input')[1].setValue(true)

  expect(defaultWrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana']])
  expect(defaultWrapper.emitted('update:value')?.[0]).toEqual([['apple', 'banana']])
  expect(defaultWrapper.emitted('change')?.[0]).toEqual([['apple', 'banana']])
  expect(defaultWrapper.findAll('input')[1].element.checked).toBe(true)
})

it('normalizes primitive group options and applies option metadata', () => {
  const wrapper = mount(CheckboxGroup, {
    props: {
      defaultValue: ['Plain', 2],
      options: [
        'Plain',
        2,
        { label: 'Styled', value: 'styled', className: 'option-class', style: { color: 'green' }, title: 'Styled title' }
      ]
    }
  })

  const checkboxes = wrapper.findAllComponents(Checkbox)

  expect(wrapper.text()).toContain('Plain')
  expect(wrapper.text()).toContain('2')
  expect(wrapper.findAll('input')[0].element.checked).toBe(true)
  expect(wrapper.findAll('input')[1].element.checked).toBe(true)
  expect(checkboxes[2].classes()).toContain('option-class')
  expect(checkboxes[2].attributes('style')).toContain('color: green')
  expect(checkboxes[2].attributes('title')).toBe('Styled title')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- checkbox
```

Expected: the new tests fail because the aliases, uncontrolled defaults, semantic hooks, and richer options are not implemented.

## Task 2: Implement Checkbox APIs

- [ ] **Step 1: Extend `packages/components/src/checkbox/types.ts`**

Add `StyleValue` import and these types:

```ts
export type CheckboxSemanticPart = 'root' | 'icon' | 'label'
export type CheckboxClassNames = Partial<Record<CheckboxSemanticPart, string>>
export type CheckboxStyles = Partial<Record<CheckboxSemanticPart, StyleValue>>
export type CheckboxRawOption = CheckboxValue | CheckboxOption
```

Extend `CheckboxOption`:

```ts
className?: string
style?: StyleValue
title?: string
```

Add standalone props:

```ts
checked: { type: Boolean, default: undefined },
defaultChecked: { type: Boolean, default: undefined },
title: String,
className: String,
rootClassName: String,
style: [String, Object, Array] as PropType<StyleValue>,
classNames: Object as PropType<CheckboxClassNames>,
styles: Object as PropType<CheckboxStyles>
```

Change `modelValue` to `{ type: Boolean, default: undefined }`.

Add group props:

```ts
value: Array as PropType<CheckboxValue[]>,
defaultValue: {
  type: Array as PropType<CheckboxValue[]>,
  default: undefined
},
className: String,
rootClassName: String,
style: [String, Object, Array] as PropType<StyleValue>
```

Change group `modelValue` to default `undefined`, and group `options` to `CheckboxRawOption[]`.

Update emits:

```ts
'update:checked': (checked: boolean) => typeof checked === 'boolean',
change: (checked: boolean, event: Event) => typeof checked === 'boolean' && event instanceof Event,
'update:value': (value: CheckboxValue[]) => Array.isArray(value)
```

- [ ] **Step 2: Update `packages/components/src/checkbox/checkbox.vue`**

Use `internalChecked`, `isControlled`, and `mergedChecked` with precedence `checked ?? modelValue ?? internalChecked`.

Bind `title`, root style, semantic icon class/style, and semantic label class/style.

On change, update internal state only when uncontrolled, then emit `update:modelValue`, `update:checked`, and `change(checked, event)`.

- [ ] **Step 3: Update `packages/components/src/checkbox/checkbox-group.vue`**

Normalize options with:

```ts
const normalizedOptions = computed(() =>
  props.options.map((option) =>
    typeof option === 'object' && option !== null
      ? option
      : { label: String(option), value: option }
  )
)
```

Use `mergedValue = props.value ?? props.modelValue ?? internalValue`. Pass option `className`, `style`, and `title` to `Checkbox`. Emit `update:modelValue`, `update:value`, and `change`.

- [ ] **Step 4: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- checkbox
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: both commands exit 0.

## Task 3: Update Docs

- [ ] **Step 1: Update `docs/components/checkbox.md`**

Document:

- standalone `checked`, `defaultChecked`, and semantic hooks
- group `value`, `defaultValue`, and primitive options
- option `className`, `style`, and `title`
- updated event signatures
- Semantic DOM keys

- [ ] **Step 2: Run docs build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: command exits 0.

## Task 4: Build Outputs and Final Verification

- [ ] **Step 1: Run package build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: command exits 0 and updates Checkbox generated files under `es` and `lib`.

- [ ] **Step 2: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: all commands exit 0 and `git status --short` has no unstaged drift after build outputs are committed.
