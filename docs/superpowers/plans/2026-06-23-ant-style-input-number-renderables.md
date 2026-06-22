# Ant Style InputNumber Renderables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style renderable prefix, suffix, and control icon content to `AInputNumber`.

**Architecture:** Keep `AInputNumber` as a single Vue component backed by `types.ts`. Add a small local render-node helper and slot fallbacks, mirroring the Input/Textarea renderable pattern while preserving numeric value behavior.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `InputNumberRenderable = VNodeChild`.
- Renderable `prefix` and `suffix`.
- Renderable `controls.upIcon` and `controls.downIcon`.
- `prefix`, `suffix`, `increaseIcon`, and `decreaseIcon` slots.
- Docs and generated package output refresh.

This plan does not cover `stringMode`, `decimalSeparator`, `changeOnBlur`, uncontrolled `defaultValue`, focus methods, addon wrappers, or new semantic parts.

## Files

- Modify: `packages/components/src/input-number/types.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `docs/components/input-number.md`
- Generated after build: `packages/components/es/input-number/*`
- Generated after build: `packages/components/lib/input-number/*`

## Task 1: Write Failing InputNumber Renderable Tests

- [ ] **Step 1: Add tests in `packages/components/src/input-number/__tests__/input-number.test.ts`**

Add these tests after the existing custom controls test:

```ts
it('renders vnode prefix suffix and controls icon content', () => {
  const wrapper = mount(InputNumber, {
    props: {
      modelValue: 8,
      prefix: h('span', { class: 'prefix-node' }, '$'),
      suffix: h('span', { class: 'suffix-node' }, 'USD'),
      controls: {
        upIcon: h('span', { class: 'up-node' }, 'plus'),
        downIcon: h('span', { class: 'down-node' }, 'minus')
      }
    }
  })

  expect(wrapper.find('.prefix-node').text()).toBe('$')
  expect(wrapper.find('.suffix-node').text()).toBe('USD')
  expect(wrapper.find('.up-node').text()).toBe('plus')
  expect(wrapper.find('.down-node').text()).toBe('minus')
})
```

```ts
it('lets slots override renderable prefix suffix and controls icons', () => {
  const wrapper = mount(InputNumber, {
    props: {
      modelValue: 8,
      prefix: h('span', { class: 'prop-prefix' }, 'prop prefix'),
      suffix: h('span', { class: 'prop-suffix' }, 'prop suffix'),
      controls: {
        upIcon: h('span', { class: 'prop-up' }, 'prop up'),
        downIcon: h('span', { class: 'prop-down' }, 'prop down')
      }
    },
    slots: {
      prefix: '<span class="slot-prefix">slot prefix</span>',
      suffix: '<span class="slot-suffix">slot suffix</span>',
      increaseIcon: '<span class="slot-up">slot up</span>',
      decreaseIcon: '<span class="slot-down">slot down</span>'
    }
  })

  expect(wrapper.find('.slot-prefix').text()).toBe('slot prefix')
  expect(wrapper.find('.slot-suffix').text()).toBe('slot suffix')
  expect(wrapper.find('.slot-up').text()).toBe('slot up')
  expect(wrapper.find('.slot-down').text()).toBe('slot down')
  expect(wrapper.find('.prop-prefix').exists()).toBe(false)
  expect(wrapper.find('.prop-suffix').exists()).toBe(false)
  expect(wrapper.find('.prop-up').exists()).toBe(false)
  expect(wrapper.find('.prop-down').exists()).toBe(false)
})
```

```ts
it('renders numeric zero prefix and suffix as renderable content', () => {
  const wrapper = mount(InputNumber, {
    props: {
      modelValue: 8,
      prefix: 0,
      suffix: 0
    }
  })

  expect(wrapper.find('.aheart-input-number__prefix').text()).toBe('0')
  expect(wrapper.find('.aheart-input-number__suffix').text()).toBe('0')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input-number
```

Expected: new tests fail because InputNumber interpolates VNode props as strings, lacks slot overrides, and treats numeric `0` prefix/suffix as absent.

## Task 2: Extend InputNumber Types

- [ ] **Step 1: Add renderable type and renderable prop helper**

In `packages/components/src/input-number/types.ts`:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type InputNumberRenderable = VNodeChild

const renderableProp = {
  type: null as unknown as PropType<InputNumberRenderable>,
  default: undefined
}
```

- [ ] **Step 2: Update prop and control icon types**

Use:

```ts
export interface InputNumberControlsConfig {
  upIcon?: InputNumberRenderable
  downIcon?: InputNumberRenderable
}
```

and set:

```ts
prefix: renderableProp,
suffix: renderableProp,
```

## Task 3: Implement Renderable Rendering

- [ ] **Step 1: Add local render-node component**

In `packages/components/src/input-number/input-number.vue`, import `defineComponent`, `useSlots`, and Vue types:

```ts
import { computed, defineComponent, useSlots } from 'vue'
import type { PropType, VNodeChild } from 'vue'
```

Add:

```ts
const AInputNumberRenderNode = defineComponent({
  name: 'AInputNumberRenderNode',
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

- [ ] **Step 2: Add renderable presence helper**

Add:

```ts
const hasRenderable = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  return value !== undefined && value !== null && value !== false && value !== true && value !== ''
}
```

Then compute:

```ts
const slots = useSlots()
const hasPrefix = computed(() => Boolean(slots.prefix) || hasRenderable(props.prefix))
const hasSuffix = computed(() => Boolean(slots.suffix) || hasRenderable(props.suffix))
```

- [ ] **Step 3: Update template render paths**

Use:

```vue
<span v-if="hasPrefix" :class="prefixClass" :style="prefixStyle">
  <slot name="prefix">
    <AInputNumberRenderNode :node="prefix" />
  </slot>
</span>
```

and:

```vue
<span v-if="hasSuffix" :class="suffixClass" :style="suffixStyle">
  <slot name="suffix">
    <AInputNumberRenderNode :node="suffix" />
  </slot>
</span>
```

For controls:

```vue
<slot name="increaseIcon">
  <AInputNumberRenderNode :node="increaseIcon" />
</slot>
```

and:

```vue
<slot name="decreaseIcon">
  <AInputNumberRenderNode :node="decreaseIcon" />
</slot>
```

- [ ] **Step 4: Run targeted test and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input-number
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
```

Expected: focused InputNumber tests and component typecheck pass.

## Task 4: Update Docs and Generated Outputs

- [ ] **Step 1: Update `docs/components/input-number.md`**

Document:

- Renderable `prefix` and `suffix`.
- Renderable `controls.upIcon` and `controls.downIcon`.
- `prefix`, `suffix`, `increaseIcon`, and `decreaseIcon` slots.
- Existing Semantic DOM parts.

- [ ] **Step 2: Run package build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Commit generated `packages/components/es/input-number/*` and `packages/components/lib/input-number/*` changes separately from source/docs when practical.

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

- [ ] Clean known generated d.ts ordering drift if build creates only those unrelated changes.

- [ ] Run docs build:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

- [ ] Remove VitePress cache if generated.
- [ ] Run `git diff --check`.
- [ ] Confirm clean status and recent commits.
