# Ant Style Textarea Renderable Count Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style renderable clear/count configuration and count clipping to `ATextarea`.

**Architecture:** Keep the current single `textarea.vue` component and `types.ts` API file. Mirror the proven Input render-node/count helper pattern in Textarea, while leaving autoSize and semantic structure unchanged.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `TextareaRenderable = VNodeChild`.
- Renderable `allowClear.clearIcon`.
- `allowClear.disabled`.
- Renderable `showCount.formatter`.
- Renderable `count.show`.
- `count.exceedFormatter`.
- Docs and generated package output refresh.

This plan does not cover Input.Search, Input.Password, Input.OTP, resize measurement, or new Textarea semantic parts.

## Files

- Modify: `packages/components/src/textarea/types.ts`
- Modify: `packages/components/src/textarea/textarea.vue`
- Modify: `packages/components/src/textarea/__tests__/textarea.test.ts`
- Modify: `docs/components/textarea.md`
- Generated after build: `packages/components/es/textarea/*`
- Generated after build: `packages/components/lib/textarea/*`

## Task 1: Write Failing Textarea Tests

- [ ] **Step 1: Add tests in `packages/components/src/textarea/__tests__/textarea.test.ts`**

Add these tests after the existing count visibility test:

```ts
it('renders vnode clear icon and showCount formatter', () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: 'Aheart',
      allowClear: {
        clearIcon: h('span', { class: 'clear-node' }, 'clear')
      },
      showCount: {
        formatter: ({ count }) => h('span', { class: 'count-node' }, `${count} chars`)
      }
    }
  })

  expect(wrapper.find('.clear-node').text()).toBe('clear')
  expect(wrapper.find('.count-node').text()).toBe('6 chars')
})
```

```ts
it('renders vnode count show output', () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: 'hello',
      count: {
        max: 10,
        show: ({ count, maxLength }) => h('strong', { class: 'count-show-node' }, `${count}/${maxLength}`)
      }
    }
  })

  expect(wrapper.find('.count-show-node').text()).toBe('5/10')
})
```

```ts
it('supports disabled allowClear config', () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: 'value',
      allowClear: {
        disabled: true,
        clearIcon: 'clear'
      }
    }
  })

  expect(wrapper.find('.aheart-textarea__clear').exists()).toBe(false)
})
```

```ts
it('uses count exceedFormatter for displayed and emitted values', async () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: 'abcdef',
      count: {
        max: 3,
        exceedFormatter: (value, { max }) => value.slice(0, max)
      },
      showCount: true
    }
  })

  expect(wrapper.find('textarea').element.value).toBe('abc')
  expect(wrapper.find('.aheart-textarea__count').text()).toBe('3 / 3')

  await wrapper.find('textarea').setValue('12345')
  await wrapper.find('textarea').trigger('change')

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123'])
  expect(wrapper.emitted('input')?.[0]).toEqual(['123'])
  expect(wrapper.emitted('change')?.[0]).toEqual(['123'])
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- textarea
```

Expected: new tests fail because Textarea does not render VNode clear/count values, ignores `allowClear.disabled`, and does not clip exceeded count values.

## Task 2: Extend Textarea Types

- [ ] **Step 1: Add renderable and count types**

In `packages/components/src/textarea/types.ts`:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type TextareaRenderable = VNodeChild

export interface TextareaCountExceedFormatterInfo {
  max: number
}
```

Update:

```ts
export interface TextareaAllowClearConfig {
  clearIcon?: TextareaRenderable
  disabled?: boolean
}

export interface TextareaShowCountConfig {
  formatter?: (info: TextareaCountFormatterInfo) => TextareaRenderable
}

export interface TextareaCountConfig {
  max?: number
  strategy?: (value: string) => number
  show?: boolean | ((info: TextareaCountFormatterInfo) => TextareaRenderable)
  exceedFormatter?: (value: string, config: TextareaCountExceedFormatterInfo) => string
}
```

## Task 3: Implement Renderable and Count Behavior

- [ ] **Step 1: Add local render-node component**

In `packages/components/src/textarea/textarea.vue`, import `defineComponent` and render `VNodeChild` values through:

```ts
const ATextareaRenderNode = defineComponent({
  name: 'ATextareaRenderNode',
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

- [ ] **Step 2: Render clear/count nodes**

Replace interpolation:

```vue
<slot name="clearIcon">
  <ATextareaRenderNode :node="clearIconContent" />
</slot>
```

and:

```vue
<span v-if="showCountDisplay" :class="countClass" :style="countStyle">
  <ATextareaRenderNode :node="countText" />
</span>
```

- [ ] **Step 3: Add disabled clear and clipping helpers**

Add:

```ts
const measureCount = (value: string) => props.count?.strategy?.(value) ?? value.length
const formatExceededValue = (value: string) => {
  const max = props.count?.max

  if (max === undefined || !props.count?.exceedFormatter || measureCount(value) <= max) {
    return value
  }

  return props.count.exceedFormatter(value, { max })
}

const currentValue = computed(() => formatExceededValue(props.modelValue ?? ''))
const allowClearDisabled = computed(() => allowClearConfig.value?.disabled ?? false)
```

Use `currentValue` for the textarea `:value`, count info, clear visibility, and event formatting.

- [ ] **Step 4: Format input and change event values**

Update `getEventValue`:

```ts
const getEventValue = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const value = formatExceededValue(target.value)

  if (target.value !== value) {
    target.value = value
  }

  return value
}
```

- [ ] **Step 5: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- textarea
```

Expected: all Textarea tests pass.

## Task 4: Update Docs and Generated Outputs

- [ ] **Step 1: Update `docs/components/textarea.md`**

Document:

- Renderable `allowClear.clearIcon`.
- `allowClear.disabled`.
- Renderable `showCount.formatter` and `count.show`.
- `count.exceedFormatter`.
- Existing Semantic DOM parts: `root`, `textarea`, `clear`, `count`.

- [ ] **Step 2: Run package build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Commit generated `packages/components/es/textarea/*` and `packages/components/lib/textarea/*` changes separately from source/docs when practical.

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
