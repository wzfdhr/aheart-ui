# Ant Style Spin Description Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `description` renderable content support to `ASpin` while preserving the existing `tip` API as a compatibility alias.

**Architecture:** Keep the current `ASpin` component structure and reuse its local `ARenderNode` helper for renderable content. Resolve description content through slot, `description`, then `tip`, and merge new `description` semantic hooks with legacy `tip` hooks on the same node.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `description` prop as `VNodeChild`
- `description` slot
- renderable `tip` fallback alias
- `SpinRenderable` public type
- `description` semantic class/style part
- legacy `tip` semantic hooks merged onto the same description node
- docs and generated package output refresh

This plan does not cover `Spin.setDefaultIndicator`, function-valued `classNames` / `styles`, or changing the public base DOM class from `aheart-spin__tip`.

## Files

- Modify: `packages/components/src/spin/types.ts`
- Modify: `packages/components/src/spin/spin.vue`
- Modify: `packages/components/src/spin/style.css`
- Modify: `packages/components/src/spin/index.ts`
- Modify: `packages/components/src/spin/__tests__/spin.test.ts`
- Modify: `docs/components/spin.md`
- Generated after build: `packages/components/es/spin/*`
- Generated after build: `packages/components/lib/spin/*`

## Task 1: Write Failing Spin Description Tests

- [ ] **Step 1: Add tests in `packages/components/src/spin/__tests__/spin.test.ts`**

Add these tests after the existing semantic classes/styles test:

```ts
it('renders vnode description and uses tip as fallback', () => {
  const descriptionWrapper = mount(Spin, {
    props: {
      description: h('span', { class: 'description-node' }, 'Syncing node'),
      tip: 'Legacy tip'
    }
  })

  expect(descriptionWrapper.find('.description-node').text()).toBe('Syncing node')
  expect(descriptionWrapper.text()).not.toContain('Legacy tip')

  const tipWrapper = mount(Spin, {
    props: {
      tip: h('span', { class: 'tip-node' }, 'Legacy node')
    }
  })

  expect(tipWrapper.find('.tip-node').text()).toBe('Legacy node')
})

it('lets description slot override description and tip props', () => {
  const wrapper = mount(Spin, {
    props: {
      description: h('span', { class: 'prop-description' }, 'Prop description'),
      tip: 'Legacy tip'
    },
    slots: {
      description: '<span class="slot-description">Slot description</span>'
    }
  })

  expect(wrapper.find('.slot-description').text()).toBe('Slot description')
  expect(wrapper.find('.prop-description').exists()).toBe(false)
  expect(wrapper.text()).not.toContain('Legacy tip')
})

it('applies description semantic hooks with legacy tip hooks', () => {
  const wrapper = mount(Spin, {
    props: {
      description: 'Styled',
      classNames: {
        description: 'semantic-description',
        tip: 'legacy-tip'
      },
      styles: {
        description: { color: 'rgb(7, 8, 9)' },
        tip: { fontWeight: '600' }
      }
    }
  })

  const description = wrapper.find('.aheart-spin__description')

  expect(description.exists()).toBe(true)
  expect(description.classes()).toEqual(
    expect.arrayContaining(['aheart-spin__tip', 'semantic-description', 'legacy-tip'])
  )
  expect(description.attributes('style')).toContain('color: rgb(7, 8, 9)')
  expect(description.attributes('style')).toContain('font-weight: 600')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- spin
```

Expected: the new tests fail because `description` is not a declared prop, renderable `tip` is not rendered through `ARenderNode`, the `description` slot is unused, and `.aheart-spin__description` is missing.

## Task 2: Implement Description Resolution

- [ ] **Step 1: Extend `packages/components/src/spin/types.ts`**

Define a renderable type, widen `tip`, add `description`, and include `description` in semantic parts.

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type SpinPercent = number | 'auto'
export type SpinRenderable = VNodeChild
export type SpinIndicator = VNodeChild | (() => VNodeChild)
export type SpinSemanticPart =
  | 'root'
  | 'section'
  | 'indicator'
  | 'dot'
  | 'description'
  | 'tip'
  | 'percent'
  | 'container'
export type SpinClassNames = Partial<Record<SpinSemanticPart, string>>
export type SpinStyles = Partial<Record<SpinSemanticPart, StyleValue>>

const renderableProp = [String, Number, Boolean, Object, Array, Function] as PropType<SpinRenderable>

export const spinProps = {
  spinning: { type: Boolean, default: true },
  size: { type: String as PropType<AheartSize>, default: 'middle' },
  description: renderableProp,
  tip: renderableProp,
  delay: Number,
  indicator: [String, Number, Object, Array, Function] as PropType<SpinIndicator>,
  percent: [Number, String] as PropType<SpinPercent>,
  fullscreen: Boolean,
  wrapperClassName: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: { type: Object as PropType<SpinClassNames>, default: () => ({}) },
  styles: { type: Object as PropType<SpinStyles>, default: () => ({}) }
} as const

export type SpinProps = ExtractPropTypes<typeof spinProps>
```

- [ ] **Step 2: Update `packages/components/src/spin/spin.vue`**

Add slot-aware description resolution and render it in both indicator branches.

```ts
const hasRenderable = (value: unknown) => value !== undefined && value !== null && value !== false && value !== ''
const hasDescriptionSlot = computed(() => Boolean(slots.description))
const descriptionNode = computed(() => props.description ?? props.tip)
const hasDescription = computed(() => hasDescriptionSlot.value || hasRenderable(descriptionNode.value))
const descriptionClass = computed(() => [props.classNames.description, props.classNames.tip])
const descriptionStyle = computed(() => [props.styles.description, props.styles.tip])
```

Replace both existing `tip` spans with:

```vue
<span
  v-if="hasDescription"
  class="aheart-spin__tip aheart-spin__description"
  :class="descriptionClass"
  :style="descriptionStyle"
>
  <slot name="description">
    <ARenderNode :node="descriptionNode" />
  </slot>
</span>
```

- [ ] **Step 3: Update `packages/components/src/spin/style.css`**

Keep the existing class and add the new semantic class to the same style rule.

```css
.aheart-spin__tip,
.aheart-spin__description {
  margin-top: 8px;
  color: var(--aheart-color-primary);
  font-size: 14px;
}
```

- [ ] **Step 4: Update `packages/components/src/spin/index.ts`**

Export the new public type alongside existing Spin types.

```ts
export { default as ASpin } from './spin.vue'
export { default } from './spin.vue'
export type {
  SpinClassNames,
  SpinIndicator,
  SpinPercent,
  SpinProps,
  SpinRenderable,
  SpinSemanticPart,
  SpinStyles
} from './types'
```

- [ ] **Step 5: Run targeted tests and component typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- spin
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: targeted Spin tests pass and component typecheck exits 0.

- [ ] **Step 6: Commit source and tests**

```bash
git add packages/components/src/spin/types.ts packages/components/src/spin/spin.vue packages/components/src/spin/style.css packages/components/src/spin/index.ts packages/components/src/spin/__tests__/spin.test.ts
git commit -m "feat: add spin description parity"
```

## Task 3: Update Spin Documentation

- [ ] **Step 1: Update `docs/components/spin.md`**

Prefer `description` in examples and keep `tip` as a compatibility alias. Add API rows:

```md
| description | 自定义描述内容 | `VNodeChild` | - |
| tip | 兼容旧版提示内容，低于 `description` 优先级 | `VNodeChild` | - |
```

Add the slot row:

```md
| description | 自定义描述内容，优先于 `description` / `tip` 属性 |
```

Add Semantic DOM rows:

```md
| description | 描述内容节点 |
| tip | 描述内容节点兼容别名 |
```

- [ ] **Step 2: Build package output before docs verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: package build exits 0 and generated `es` / `lib` output reflects Spin source changes.

- [ ] **Step 3: Run docs build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

- [ ] **Step 4: Commit docs**

```bash
git add docs/components/spin.md
git commit -m "docs: document spin description APIs"
```

## Task 4: Commit Generated Output and Full Verification

- [ ] **Step 1: Commit generated Spin output**

```bash
git add packages/components/es/spin packages/components/lib/spin
git commit -m "build: update spin description outputs"
```

- [ ] **Step 2: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
git diff --check
git status --short --branch
```

Expected: all commands exit 0 and the final status is clean on `codex/consolidated-ant-style-foundation`.

## Self-Review

- Spec coverage: each requirement in `docs/superpowers/specs/2026-06-22-ant-style-spin-description-design.md` maps to Task 1, Task 2, or Task 3.
- Placeholder scan: no `TBD`, unfinished `TODO`, or "similar to" placeholders remain.
- Type consistency: `SpinRenderable`, `description`, `tip`, `SpinSemanticPart`, `descriptionClass`, and `descriptionStyle` are named consistently across tests, source, docs, and generated output.
