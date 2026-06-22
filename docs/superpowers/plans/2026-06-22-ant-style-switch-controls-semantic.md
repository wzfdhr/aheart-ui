# Ant Style Switch Controls Semantic API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `ASwitch` closer to Ant Design Switch with controlled aliases, uncontrolled defaults, click/change event parity, semantic styling hooks, and richer content slots.

**Architecture:** Extend the existing single-file Switch component rather than introducing new helpers. Keep `modelValue` as the primary Vue API, layer Ant aliases through computed value resolution, and expose semantic hooks directly on the root, handle, and content elements.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `checked`, `value`, `defaultChecked`, and `defaultValue`.
- `update:checked`, `update:value`, existing `update:modelValue`, `change`, and new `click`.
- Event payloads that include `(checked, event)` for user interactions.
- `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- Semantic keys `root`, `content`, and `indicator`.
- `checkedChildren` / `unCheckedChildren` slots.
- Docs and generated `es` / `lib` outputs.

This plan does not cover imperative `focus()` / `blur()` methods or Form integration.

## Files

- Modify: `packages/components/src/switch/types.ts`
- Modify: `packages/components/src/switch/switch.vue`
- Modify: `packages/components/src/switch/style.css`
- Modify: `packages/components/src/switch/__tests__/switch.test.ts`
- Modify: `docs/components/switch.md`
- Generated after build: `packages/components/es/switch/*`
- Generated after build: `packages/components/lib/switch/*`
- Generated after build: `packages/components/es/style.css`
- Generated after build: `packages/components/lib/style.css`

## Task 1: Write Failing Switch Tests

- [ ] **Step 1: Add tests in `packages/components/src/switch/__tests__/switch.test.ts`**

Add tests that assert:

```ts
it('prefers checked and value aliases over modelValue', () => {
  const checkedWrapper = mount(Switch, {
    props: { modelValue: false, value: false, checked: true }
  })
  const valueWrapper = mount(Switch, {
    props: { modelValue: false, value: true }
  })

  expect(checkedWrapper.attributes('aria-checked')).toBe('true')
  expect(valueWrapper.attributes('aria-checked')).toBe('true')
})

it('emits Ant-style alias updates, change, and click payloads', async () => {
  const wrapper = mount(Switch, {
    props: { checked: false }
  })

  await wrapper.trigger('click')

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
  expect(wrapper.emitted('update:value')?.[0]).toEqual([true])
  expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
  expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(MouseEvent)
  expect(wrapper.emitted('click')?.[0]?.[0]).toBe(true)
  expect(wrapper.emitted('click')?.[0]?.[1]).toBeInstanceOf(MouseEvent)
})

it('supports uncontrolled defaultChecked and defaultValue', async () => {
  const checkedWrapper = mount(Switch, {
    props: { defaultChecked: true, checkedChildren: 'On', unCheckedChildren: 'Off' }
  })
  const valueWrapper = mount(Switch, {
    props: { defaultValue: true }
  })

  expect(checkedWrapper.attributes('aria-checked')).toBe('true')
  expect(checkedWrapper.text()).toContain('On')
  expect(valueWrapper.attributes('aria-checked')).toBe('true')

  await checkedWrapper.trigger('click')

  expect(checkedWrapper.attributes('aria-checked')).toBe('false')
  expect(checkedWrapper.text()).toContain('Off')
})

it('applies semantic classes and styles', () => {
  const wrapper = mount(Switch, {
    props: {
      checked: true,
      className: 'switch-class',
      rootClassName: 'switch-root',
      style: { marginTop: '4px' },
      classNames: {
        root: 'semantic-root',
        indicator: 'semantic-indicator',
        content: 'semantic-content'
      },
      styles: {
        root: { width: '70px' },
        indicator: { backgroundColor: 'red' },
        content: { color: 'yellow' }
      }
    }
  })

  expect(wrapper.classes()).toContain('switch-class')
  expect(wrapper.classes()).toContain('switch-root')
  expect(wrapper.classes()).toContain('semantic-root')
  expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  expect(wrapper.attributes('style')).toContain('width: 70px')
  expect(wrapper.find('.aheart-switch__handle').classes()).toContain('semantic-indicator')
  expect(wrapper.find('.aheart-switch__handle').attributes('style')).toContain('background-color: red')
  expect(wrapper.find('.aheart-switch__label').classes()).toContain('semantic-content')
  expect(wrapper.find('.aheart-switch__label').attributes('style')).toContain('color: yellow')
})

it('renders checked and unchecked content slots', async () => {
  const wrapper = mount(Switch, {
    props: { defaultChecked: true },
    slots: {
      checkedChildren: '<span class="checked-slot">Yes</span>',
      unCheckedChildren: '<span class="unchecked-slot">No</span>'
    }
  })

  expect(wrapper.find('.checked-slot').exists()).toBe(true)

  await wrapper.trigger('click')

  expect(wrapper.find('.unchecked-slot').exists()).toBe(true)
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- switch
```

Expected: the new tests fail because the Switch aliases, uncontrolled defaults, semantic hooks, and slots are not implemented.

## Task 2: Implement Switch API

- [ ] **Step 1: Extend `packages/components/src/switch/types.ts`**

Add:

```ts
import type { ExtractPropTypes, PropType, StyleValue } from 'vue'

export type SwitchSemanticPart = 'root' | 'content' | 'indicator'
export type SwitchClassNames = Partial<Record<SwitchSemanticPart, string>>
export type SwitchStyles = Partial<Record<SwitchSemanticPart, StyleValue>>
```

Add props:

```ts
checked: {
  type: Boolean,
  default: undefined
},
value: {
  type: Boolean,
  default: undefined
},
defaultChecked: Boolean,
defaultValue: Boolean,
className: String,
rootClassName: String,
style: [String, Object, Array] as PropType<StyleValue>,
classNames: Object as PropType<SwitchClassNames>,
styles: Object as PropType<SwitchStyles>
```

Update emits:

```ts
'update:checked': (checked: boolean) => typeof checked === 'boolean',
'update:value': (checked: boolean) => typeof checked === 'boolean',
change: (checked: boolean, event: MouseEvent) => typeof checked === 'boolean' && event instanceof MouseEvent,
click: (checked: boolean, event: MouseEvent) => typeof checked === 'boolean' && event instanceof MouseEvent
```

- [ ] **Step 2: Update `packages/components/src/switch/switch.vue`**

Use an internal ref initialized from `defaultChecked ?? defaultValue ?? false`, a `mergedChecked` computed that applies the precedence from the spec, and a `isControlled` computed.

Apply semantic classes/styles:

```ts
const rootStyle = computed(() => [props.style, props.styles?.root])
const indicatorClass = computed(() => ['aheart-switch__handle', props.classNames?.indicator])
const indicatorStyle = computed(() => props.styles?.indicator)
const contentClass = computed(() => ['aheart-switch__label', props.classNames?.content])
const contentStyle = computed(() => props.styles?.content)
```

Update the click handler to emit all update aliases, `change(nextChecked, event)`, and `click(nextChecked, event)`. Ignore disabled and loading clicks.

- [ ] **Step 3: Keep CSS compatible**

No selector rename is needed. Ensure existing `.aheart-switch__handle` and `.aheart-switch__label` styles still apply when classes are arrays.

- [ ] **Step 4: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- switch
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: both commands exit 0.

## Task 3: Update Docs

- [ ] **Step 1: Update `docs/components/switch.md`**

Document:

- aliases/default values
- checked/unchecked slots
- semantic class/style hooks
- new event signatures
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

Expected: command exits 0 and updates Switch generated files under `es` and `lib`.

- [ ] **Step 2: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: all commands exit 0.
