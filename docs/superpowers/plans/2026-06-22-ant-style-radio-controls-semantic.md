# Ant Style Radio Controls Semantic API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `ARadio` and `ARadioGroup` closer to Ant Design Radio with controlled aliases, uncontrolled defaults, semantic style hooks, richer options, and updated documentation.

**Architecture:** Extend the existing Radio files in place. Standalone radio owns a small internal uncontrolled state, while RadioGroup normalizes options and owns grouped uncontrolled state only when neither `value` nor `modelValue` is supplied.

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

This plan does not cover dotted runtime aliases, child-radio composition inside groups, a separate `ARadioButton`, imperative focus/blur methods, or Form integration.

## Files

- Modify: `packages/components/src/radio/types.ts`
- Modify: `packages/components/src/radio/radio.vue`
- Modify: `packages/components/src/radio/radio-group.vue`
- Modify: `packages/components/src/radio/__tests__/radio.test.ts`
- Modify: `docs/components/radio.md`
- Generated after build: `packages/components/es/radio/*`
- Generated after build: `packages/components/lib/radio/*`

## Task 1: Write Failing Radio Tests

- [ ] **Step 1: Add tests in `packages/components/src/radio/__tests__/radio.test.ts`**

Add tests that assert:

```ts
it('prefers checked alias over modelValue and supports defaultChecked', () => {
  const checkedWrapper = mount(Radio, {
    props: { checked: true, modelValue: false, label: 'Alias' }
  })
  const defaultWrapper = mount(Radio, {
    props: { defaultChecked: true, label: 'Default' }
  })

  expect(checkedWrapper.find('input').element.checked).toBe(true)
  expect(defaultWrapper.find('input').element.checked).toBe(true)
})

it('emits checked alias update and change event payload', async () => {
  const wrapper = mount(Radio, {
    props: { checked: false }
  })

  await wrapper.find('input').setValue(true)

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
  expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
  expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(Event)
})

it('applies Radio semantic classes and styles', () => {
  const wrapper = mount(Radio, {
    props: {
      checked: true,
      label: 'Styled',
      className: 'radio-class',
      rootClassName: 'radio-root',
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

  expect(wrapper.classes()).toContain('radio-class')
  expect(wrapper.classes()).toContain('radio-root')
  expect(wrapper.classes()).toContain('semantic-root')
  expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  expect(wrapper.attributes('style')).toContain('color: red')
  expect(wrapper.find('.aheart-radio__inner').classes()).toContain('semantic-icon')
  expect(wrapper.find('.aheart-radio__inner').attributes('style')).toContain('border-color: blue')
  expect(wrapper.find('.aheart-radio__label').classes()).toContain('semantic-label')
  expect(wrapper.find('.aheart-radio__label').attributes('style')).toContain('font-weight: 600')
})

it('supports RadioGroup value alias and uncontrolled defaultValue', async () => {
  const valueWrapper = mount(RadioGroup, {
    props: {
      value: 'banana',
      modelValue: 'apple',
      options: radioOptions
    }
  })
  const defaultWrapper = mount(RadioGroup, {
    props: {
      defaultValue: 'apple',
      options: radioOptions
    }
  })

  expect(valueWrapper.findAll('input')[1].element.checked).toBe(true)
  expect(defaultWrapper.findAll('input')[0].element.checked).toBe(true)

  await defaultWrapper.findAll('input')[1].setValue(true)

  expect(defaultWrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
  expect(defaultWrapper.emitted('update:value')?.[0]).toEqual(['banana'])
  expect(defaultWrapper.emitted('change')?.[0]).toEqual(['banana'])
  expect(defaultWrapper.findAll('input')[1].element.checked).toBe(true)
})

it('normalizes primitive group options and applies option metadata', () => {
  const wrapper = mount(RadioGroup, {
    props: {
      defaultValue: 2,
      options: [
        'Plain',
        2,
        { label: 'Styled', value: 'styled', className: 'option-class', style: { color: 'green' }, title: 'Styled title' }
      ]
    }
  })

  const radios = wrapper.findAllComponents(Radio)

  expect(wrapper.text()).toContain('Plain')
  expect(wrapper.text()).toContain('2')
  expect(wrapper.findAll('input')[1].element.checked).toBe(true)
  expect(radios[2].classes()).toContain('option-class')
  expect(radios[2].attributes('style')).toContain('color: green')
  expect(radios[2].attributes('title')).toBe('Styled title')
})

it('applies button option metadata in RadioGroup button mode', () => {
  const wrapper = mount(RadioGroup, {
    props: {
      defaultValue: 'styled',
      optionType: 'button',
      options: [
        { label: 'Styled', value: 'styled', className: 'button-option', style: { color: 'green' }, title: 'Button title' }
      ]
    }
  })

  const option = wrapper.find('.aheart-radio-button')

  expect(option.classes()).toContain('button-option')
  expect(option.attributes('style')).toContain('color: green')
  expect(option.attributes('title')).toBe('Button title')
  expect(option.classes()).toContain('is-checked')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- radio
```

Expected: the new tests fail because aliases, uncontrolled defaults, semantic hooks, and richer options are not implemented.

## Task 2: Implement Radio APIs

- [ ] **Step 1: Extend `packages/components/src/radio/types.ts`**

Add `StyleValue` import and these types:

```ts
export type RadioSemanticPart = 'root' | 'icon' | 'label'
export type RadioClassNames = Partial<Record<RadioSemanticPart, string>>
export type RadioStyles = Partial<Record<RadioSemanticPart, StyleValue>>
export type RadioRawOption = string | number | RadioOption
```

Extend `RadioOption`:

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
classNames: Object as PropType<RadioClassNames>,
styles: Object as PropType<RadioStyles>
```

Change `modelValue` to `{ type: Boolean, default: undefined }`.

Add group props:

```ts
value: [String, Number, Boolean] as PropType<RadioValue>,
defaultValue: [String, Number, Boolean] as PropType<RadioValue>,
className: String,
rootClassName: String,
style: [String, Object, Array] as PropType<StyleValue>
```

Change group `options` to `RadioRawOption[]`, and add `update:value` to emits.

- [ ] **Step 2: Update `packages/components/src/radio/radio.vue`**

Use `internalChecked`, `isControlled`, and `mergedChecked` with precedence `checked ?? modelValue ?? internalChecked`.

Bind `title`, root style, semantic icon class/style, and semantic label class/style.

On change, update internal state only when uncontrolled, then emit `update:modelValue`, `update:checked`, and `change(true, event)`.

- [ ] **Step 3: Update `packages/components/src/radio/radio-group.vue`**

Normalize primitive options to `{ label: String(option), value: option }`. Use `mergedValue = props.value ?? props.modelValue ?? internalValue`. Pass option `className`, `style`, and `title` to `Radio` or button option labels. Emit `update:modelValue`, `update:value`, and `change`.

- [ ] **Step 4: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- radio
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: both commands exit 0.

## Task 3: Update Docs

- [ ] **Step 1: Update `docs/components/radio.md`**

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

Expected: command exits 0 and updates Radio generated files under `es` and `lib`.

- [ ] **Step 2: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: all commands exit 0 and `git status --short` has no unstaged drift after build outputs are committed.
