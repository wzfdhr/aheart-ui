# Ant Style Button Icon and Auto Space Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style renderable button icons and `autoInsertSpace` behavior to `AButton`.

**Architecture:** Keep `AButton` as one Vue SFC backed by `types.ts`. Add a renderable icon branch for non-string icon props, preserve string icon-name behavior through `AIcon`, and transform only simple two-Chinese-character default text through a local render helper.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `ButtonIcon = VNodeChild`.
- Renderable `icon` prop support.
- String `icon` values continuing to render through `AIcon`.
- Numeric `0` `icon` prop support.
- Existing `icon` slot priority.
- `autoInsertSpace` defaulting to `true`.
- Two-Chinese-character auto-spacing for simple default text content.
- Docs and generated package output refresh.

This plan does not change color tokens, size names, loading delay behavior, anchor disabled behavior, or semantic part names.

## Files

- Modify: `packages/components/src/button/types.ts`
- Modify: `packages/components/src/button/button.vue`
- Modify: `packages/components/src/button/__tests__/button.test.ts`
- Modify: `docs/components/button.md`
- Generated after build: `packages/components/es/button/*`
- Generated after build: `packages/components/lib/button/*`

## Task 1: Write Failing Button Tests

- [ ] **Step 1: Add icon renderable and auto-space tests**

In `packages/components/src/button/__tests__/button.test.ts`, add these tests after the existing `renders icon prop before content by default` test:

```ts
it('renders vnode icon prop content', () => {
  const wrapper = mount(Button, {
    props: {
      icon: h('span', { class: 'icon-node' }, 'node')
    },
    slots: {
      default: 'Create'
    }
  })

  expect(wrapper.find('.icon-node').text()).toBe('node')
  expect(wrapper.find('.aheart-icon').exists()).toBe(false)
})
```

```ts
it('renders numeric zero icon prop content', () => {
  const wrapper = mount(Button, {
    props: {
      icon: 0
    },
    slots: {
      default: 'Count'
    }
  })

  expect(wrapper.find('.aheart-button__icon').text()).toBe('0')
})
```

Add this assertion to the existing `uses the icon slot before the icon prop` test:

```ts
expect(wrapper.find('.prop-icon-node').exists()).toBe(false)
```

and change that test's `icon` prop to:

```ts
icon: h('span', { class: 'prop-icon-node' }, 'prop')
```

Add these tests before the semantic hooks test:

```ts
it('auto inserts a space between exactly two Chinese characters by default', () => {
  const wrapper = mount(Button, {
    slots: {
      default: '保存'
    }
  })

  expect(wrapper.find('.aheart-button__content').text()).toBe('保 存')
})
```

```ts
it('can disable Chinese character auto spacing', () => {
  const wrapper = mount(Button, {
    props: {
      autoInsertSpace: false
    },
    slots: {
      default: '保存'
    }
  })

  expect(wrapper.find('.aheart-button__content').text()).toBe('保存')
})
```

```ts
it('does not auto space non-Chinese or longer text content', () => {
  const english = mount(Button, {
    slots: {
      default: 'OK'
    }
  })
  const longerChinese = mount(Button, {
    slots: {
      default: '默认按钮'
    }
  })

  expect(english.find('.aheart-button__content').text()).toBe('OK')
  expect(longerChinese.find('.aheart-button__content').text()).toBe('默认按钮')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- button
```

Expected: new tests fail because Button only accepts string icons and does not auto-space two Chinese characters.

## Task 2: Extend Button Types

- [ ] **Step 1: Add icon type**

In `packages/components/src/button/types.ts`, add:

```ts
export type ButtonIcon = VNodeChild
```

- [ ] **Step 2: Update icon and auto-space props**

Change:

```ts
icon: String,
```

to:

```ts
autoInsertSpace: {
  type: Boolean,
  default: true
},
icon: {
  type: null as unknown as PropType<ButtonIcon>,
  default: undefined
},
```

## Task 3: Implement Renderable Icons and Auto Spacing

- [ ] **Step 1: Import Vue text helpers**

In `packages/components/src/button/button.vue`, update the import:

```ts
import { Comment, Text, computed, defineComponent, onBeforeUnmount, ref, useSlots, watch, type PropType, type VNode, type VNodeChild } from 'vue'
```

- [ ] **Step 2: Add icon branch helpers**

Add:

```ts
const isStringIcon = computed(() => typeof props.icon === 'string')
const hasRenderableIcon = computed(() => props.icon !== undefined && props.icon !== null && props.icon !== false && props.icon !== true)
```

Change:

```ts
const hasIcon = computed(() => Boolean(slots.icon) || Boolean(props.icon))
```

to:

```ts
const hasIcon = computed(() => Boolean(slots.icon) || hasRenderableIcon.value)
```

- [ ] **Step 3: Render string icons through `AIcon` and non-string icons through `ARenderNode`**

Update both icon slots in the template to:

```vue
<slot name="icon">
  <AIcon v-if="isStringIcon" :name="icon as string" />
  <ARenderNode v-else :node="icon" />
</slot>
```

- [ ] **Step 4: Add content render helper**

Add after `ARenderNode`:

```ts
const isTwoChineseCharacters = (value: string) => /^[\u4e00-\u9fa5]{2}$/.test(value)

const getAutoSpacedText = (value: string) => {
  if (!props.autoInsertSpace || !isTwoChineseCharacters(value)) {
    return value
  }

  return `${value[0]} ${value[1]}`
}

const getContentNode = () => {
  const nodes = slots.default?.()

  if (!nodes) {
    return getAutoSpacedText('按钮')
  }

  const meaningfulNodes = nodes.filter((node) => node.type !== Comment)

  if (meaningfulNodes.length !== 1) {
    return nodes
  }

  const [node] = meaningfulNodes

  if (typeof node.children !== 'string') {
    return nodes
  }

  if (node.type === Text) {
    return getAutoSpacedText(node.children)
  }

  return nodes
}
```

- [ ] **Step 5: Render content through `ARenderNode`**

Change:

```vue
<span :class="contentClass" :style="contentStyle">
  <slot>按钮</slot>
</span>
```

to:

```vue
<span :class="contentClass" :style="contentStyle">
  <ARenderNode :node="contentNode" />
</span>
```

Add:

```ts
const contentNode = computed(() => getContentNode())
```

- [ ] **Step 6: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- button
```

Expected: all Button tests pass.

- [ ] **Step 7: Run targeted typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: typecheck exits 0.

- [ ] **Step 8: Commit implementation**

Run:

```bash
git add packages/components/src/button/types.ts packages/components/src/button/button.vue packages/components/src/button/__tests__/button.test.ts
git commit -m "feat: add button renderable icon autospace"
```

## Task 4: Update Button Documentation

- [ ] **Step 1: Update docs demos and API tables**

In `docs/components/button.md`:

- Add `<script setup lang="ts"> import { h } from 'vue'; const nodeIcon = h('span', { class: 'demo-button-node-icon' }, '★') </script>`.
- Add a renderable icon demo using `:icon="nodeIcon"`.
- Add an auto-space demo showing default `保存` and `:auto-insert-space="false"`.
- Change the `icon` API type to `VNodeChild` and note that string values render through `AIcon`.
- Add `autoInsertSpace | 自动在两个中文字符之间插入空格 | boolean | true`.

- [ ] **Step 2: Build docs once**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0. If it prints stale package VNode warnings before generated outputs are refreshed, continue to Task 5 and rerun docs after package build.

- [ ] **Step 3: Commit docs**

Run:

```bash
git add docs/components/button.md
git commit -m "docs: document button icon autospace APIs"
```

## Task 5: Refresh Generated Outputs and Verify

- [ ] **Step 1: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: package build exits 0 and updates `packages/components/es/button/*` and `packages/components/lib/button/*`.

- [ ] **Step 2: Commit generated outputs**

Run:

```bash
git add packages/components/es/button packages/components/lib/button
git commit -m "build: update button icon autospace outputs"
```

- [ ] **Step 3: Run final verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git diff --check
git status --short --branch
```

Expected: all commands exit 0 and final status is clean.

## Plan Self-Review

- Spec coverage: each scoped requirement maps to tests, implementation, docs, generated output, and final verification.
- Placeholder scan: no unfinished placeholders.
- Type consistency: `ButtonIcon`, `icon`, `autoInsertSpace`, `ARenderNode`, `getContentNode`, and `contentNode` names are consistent across tasks.
