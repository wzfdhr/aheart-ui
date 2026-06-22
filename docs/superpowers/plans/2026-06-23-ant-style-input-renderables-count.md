# Ant Style Input Renderables Count Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style renderable adornments, disabled clear config, count clipping, and addon semantic hooks to `AInput`.

**Architecture:** Keep `AInput` as a single Vue component backed by `types.ts`. Add a tiny local render-node component for `VNodeChild` props, extend count formatting helpers, and preserve existing string and slot behavior.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `InputRenderable = VNodeChild`.
- Renderable `prefix`, `suffix`, `addonBefore`, and `addonAfter` props.
- `addonBefore` and `addonAfter` slots.
- Renderable `allowClear.clearIcon`.
- `allowClear.disabled`.
- Renderable `showCount.formatter` and `count.show`.
- `count.exceedFormatter`.
- `group`, `addonBefore`, and `addonAfter` semantic hooks.
- Docs and generated package output refresh.

This plan does not cover TextArea, Search, Password, OTP, or function-valued semantic maps.

## Files

- Modify: `packages/components/src/input/types.ts`
- Modify: `packages/components/src/input/input.vue`
- Modify: `packages/components/src/input/__tests__/input.test.ts`
- Modify: `docs/components/input.md`
- Generated after build: `packages/components/es/input/*`
- Generated after build: `packages/components/lib/input/*`

## Task 1: Write Failing Input Tests

- [ ] **Step 1: Add tests in `packages/components/src/input/__tests__/input.test.ts`**

Add focused tests for:

```ts
it('renders vnode adornments clear icon and count formatter', () => {
  const wrapper = mount(Input, {
    props: {
      modelValue: 'Aheart',
      prefix: h('span', { class: 'prefix-node' }, 'pre'),
      suffix: h('span', { class: 'suffix-node' }, 'suf'),
      addonBefore: h('span', { class: 'addon-before-node' }, 'before'),
      addonAfter: h('span', { class: 'addon-after-node' }, 'after'),
      allowClear: { clearIcon: h('span', { class: 'clear-node' }, 'clear') },
      showCount: {
        formatter: ({ count }) => h('span', { class: 'count-node' }, `${count} chars`)
      }
    }
  })

  expect(wrapper.find('.prefix-node').text()).toBe('pre')
  expect(wrapper.find('.suffix-node').text()).toBe('suf')
  expect(wrapper.find('.addon-before-node').text()).toBe('before')
  expect(wrapper.find('.addon-after-node').text()).toBe('after')
  expect(wrapper.find('.clear-node').text()).toBe('clear')
  expect(wrapper.find('.count-node').text()).toBe('6 chars')
})
```

```ts
it('lets addon slots override renderable addon props', () => {
  const wrapper = mount(Input, {
    props: {
      addonBefore: h('span', { class: 'prop-before' }, 'prop before'),
      addonAfter: h('span', { class: 'prop-after' }, 'prop after')
    },
    slots: {
      addonBefore: '<span class="slot-before">slot before</span>',
      addonAfter: '<span class="slot-after">slot after</span>'
    }
  })

  expect(wrapper.find('.slot-before').text()).toBe('slot before')
  expect(wrapper.find('.slot-after').text()).toBe('slot after')
  expect(wrapper.find('.prop-before').exists()).toBe(false)
  expect(wrapper.find('.prop-after').exists()).toBe(false)
})
```

```ts
it('supports disabled allowClear config', () => {
  const wrapper = mount(Input, {
    props: {
      modelValue: 'value',
      allowClear: {
        disabled: true,
        clearIcon: 'clear'
      }
    }
  })

  expect(wrapper.find('.aheart-input__clear').exists()).toBe(false)
})
```

```ts
it('uses count exceedFormatter for displayed and emitted values', async () => {
  const wrapper = mount(Input, {
    props: {
      modelValue: 'abcdef',
      count: {
        max: 3,
        exceedFormatter: (value, { max }) => value.slice(0, max)
      },
      showCount: true
    }
  })

  expect(wrapper.find('input').element.value).toBe('abc')
  expect(wrapper.find('.aheart-input__count').text()).toBe('3 / 3')

  await wrapper.find('input').setValue('12345')

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123'])
  expect(wrapper.emitted('input')?.[0]).toEqual(['123'])
})
```

```ts
it('applies group and addon semantic hooks', () => {
  const wrapper = mount(Input, {
    props: {
      addonBefore: 'before',
      addonAfter: 'after',
      classNames: {
        group: 'semantic-group',
        addonBefore: 'semantic-before',
        addonAfter: 'semantic-after'
      },
      styles: {
        group: { width: '360px' },
        addonBefore: { color: 'red' },
        addonAfter: { color: 'blue' }
      }
    }
  })

  expect(wrapper.classes()).toContain('semantic-group')
  expect(wrapper.attributes('style')).toContain('width: 360px')
  expect(wrapper.find('.aheart-input__addon--before').classes()).toContain('semantic-before')
  expect(wrapper.find('.aheart-input__addon--before').attributes('style')).toContain('color: red')
  expect(wrapper.find('.aheart-input__addon--after').classes()).toContain('semantic-after')
  expect(wrapper.find('.aheart-input__addon--after').attributes('style')).toContain('color: blue')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input
```

Expected: new tests fail because Input does not render VNode props, addon slots do not exist, `allowClear.disabled` is ignored, count clipping is absent, and addon semantic hooks are not typed/applied.

## Task 2: Extend Input Types

- [ ] **Step 1: Add renderable and count types**

In `packages/components/src/input/types.ts`:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type InputRenderable = VNodeChild

export interface InputCountExceedFormatterInfo {
  max: number
}
```

Update `InputAllowClearConfig`, `InputShowCountConfig`, and `InputCountConfig` to use `InputRenderable` and `exceedFormatter`.

- [ ] **Step 2: Widen renderable props and semantic parts**

Use a reusable renderable prop object for `prefix`, `suffix`, `addonBefore`, and `addonAfter`:

```ts
const renderableProp = {
  type: [String, Number, Boolean, Object, Array, Function] as PropType<InputRenderable>,
  default: undefined
}
```

Extend `InputSemanticPart` with `group`, `addonBefore`, and `addonAfter`.

## Task 3: Implement Renderable and Count Behavior

- [ ] **Step 1: Add local render-node component**

In `input.vue`, import `defineComponent` and render `VNodeChild` values through a tiny local component:

```ts
const AInputRenderNode = defineComponent({
  name: 'AInputRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})
```

- [ ] **Step 2: Render adornments and addon slots**

Use `hasRenderable` helpers for props and slots. Render prefix/suffix/clear/count through `AInputRenderNode`, and add `addonBefore` / `addonAfter` slots that fallback to renderable props.

- [ ] **Step 3: Apply clear disabled and semantic hooks**

Add:

```ts
const allowClearDisabled = computed(() => allowClearConfig.value?.disabled ?? false)
const showClear = computed(
  () => Boolean(props.allowClear) && !allowClearDisabled.value && !isDisabled.value && Boolean(currentValue.value)
)
```

Apply `classNames.group`, `styles.group`, `classNames.addonBefore`, `styles.addonBefore`, `classNames.addonAfter`, and `styles.addonAfter`.

- [ ] **Step 4: Clip exceeded count values**

Add helper functions:

```ts
const measureCount = (value: string) => props.count?.strategy?.(value) ?? value.length
const formatExceededValue = (value: string) => {
  const max = props.count?.max

  if (max === undefined || !props.count?.exceedFormatter || measureCount(value) <= max) {
    return value
  }

  return props.count.exceedFormatter(value, { max })
}
```

Use formatted values for displayed input value, count info, `input`, and `change` emissions.

- [ ] **Step 5: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input
```

Expected: all Input tests pass.

## Task 4: Update Docs and Generated Outputs

- [ ] **Step 1: Update `docs/components/input.md`**

Document:

- Renderable adornment props.
- `allowClear.disabled`.
- `showCount.formatter` / `count.show` renderable returns.
- `count.exceedFormatter`.
- `addonBefore` / `addonAfter` slots.
- `group`, `addonBefore`, and `addonAfter` semantic parts.

- [ ] **Step 2: Run package build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Commit the generated `packages/components/es/input/*` and `packages/components/lib/input/*` changes separately from source/docs when practical.

## Task 5: Full Verification

- [ ] Run typecheck:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
```

- [ ] Run all tests:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
```

- [ ] Run package build:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

- [ ] Run docs build:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

- [ ] Remove VitePress cache if generated.
- [ ] Run `git diff --check`.
- [ ] Confirm clean status and recent commits.
