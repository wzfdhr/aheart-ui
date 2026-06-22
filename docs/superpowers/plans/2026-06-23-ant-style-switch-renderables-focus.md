# Ant Style Switch Renderables and Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style renderable checked/unchecked content and focus controls to `ASwitch`.

**Architecture:** Keep `ASwitch` as a single Vue SFC backed by `types.ts`. Add a small local render-node helper, a root button ref, lifecycle autofocus, and `defineExpose` methods without changing existing state priority or semantic hooks.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `SwitchRenderable = VNodeChild`.
- Renderable `checkedChildren` and `unCheckedChildren`.
- Existing checked/unchecked slots overriding matching renderable props.
- Numeric `0` checked/unchecked content.
- `autoFocus` prop.
- Exposed `focus()` and `blur()` methods.
- Docs and generated package output refresh.

This plan does not change loading visuals, switch dimensions, controlled/uncontrolled priority, or semantic part names.

## Files

- Modify: `packages/components/src/switch/types.ts`
- Modify: `packages/components/src/switch/switch.vue`
- Modify: `packages/components/src/switch/__tests__/switch.test.ts`
- Modify: `docs/components/switch.md`
- Generated after build: `packages/components/es/switch/*`
- Generated after build: `packages/components/lib/switch/*`

## Task 1: Write Failing Switch Tests

- [ ] **Step 1: Add renderable and focus tests**

In `packages/components/src/switch/__tests__/switch.test.ts`, add `nextTick` to the Vue import:

```ts
import { h, nextTick } from 'vue'
```

Add these tests after the existing checked/unchecked slots test:

```ts
it('renders vnode checked and unchecked children props', async () => {
  const wrapper = mount(Switch, {
    props: {
      defaultChecked: true,
      checkedChildren: h('span', { class: 'checked-node' }, 'yes'),
      unCheckedChildren: h('span', { class: 'unchecked-node' }, 'no')
    }
  })

  expect(wrapper.find('.checked-node').text()).toBe('yes')

  await wrapper.trigger('click')

  expect(wrapper.find('.unchecked-node').text()).toBe('no')
})
```

```ts
it('lets slots override renderable checked and unchecked props', async () => {
  const wrapper = mount(Switch, {
    props: {
      defaultChecked: true,
      checkedChildren: h('span', { class: 'prop-checked' }, 'prop yes'),
      unCheckedChildren: h('span', { class: 'prop-unchecked' }, 'prop no')
    },
    slots: {
      checkedChildren: '<span class="slot-checked">slot yes</span>',
      unCheckedChildren: '<span class="slot-unchecked">slot no</span>'
    }
  })

  expect(wrapper.find('.slot-checked').text()).toBe('slot yes')
  expect(wrapper.find('.prop-checked').exists()).toBe(false)

  await wrapper.trigger('click')

  expect(wrapper.find('.slot-unchecked').text()).toBe('slot no')
  expect(wrapper.find('.prop-unchecked').exists()).toBe(false)
})
```

```ts
it('renders numeric zero checked and unchecked children', async () => {
  const wrapper = mount(Switch, {
    props: {
      defaultChecked: true,
      checkedChildren: 0,
      unCheckedChildren: 0
    }
  })

  expect(wrapper.find('.aheart-switch__label').text()).toBe('0')

  await wrapper.trigger('click')

  expect(wrapper.find('.aheart-switch__label').text()).toBe('0')
})
```

```ts
it('focuses root button with autoFocus and exposes focus controls', async () => {
  const host = document.createElement('div')
  document.body.appendChild(host)

  const wrapper = mount(Switch, {
    attachTo: host,
    props: { autoFocus: true }
  })

  await nextTick()

  expect(document.activeElement).toBe(wrapper.element)

  document.body.focus()
  ;(wrapper.vm as unknown as { focus: () => void }).focus()
  expect(document.activeElement).toBe(wrapper.element)

  ;(wrapper.vm as unknown as { blur: () => void }).blur()
  expect(document.activeElement).not.toBe(wrapper.element)

  wrapper.unmount()
  host.remove()
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- switch
```

Expected: new tests fail because Switch stringifies VNode props, rejects numeric renderable props, and lacks `autoFocus`, `focus()`, and `blur()`.

## Task 2: Extend Switch Types

- [ ] **Step 1: Import `VNodeChild` and add renderable type**

In `packages/components/src/switch/types.ts`, change the import and add a renderable alias:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type SwitchRenderable = VNodeChild
```

- [ ] **Step 2: Add renderable prop helper and prop types**

Add:

```ts
const renderableProp = {
  type: null as unknown as PropType<SwitchRenderable>,
  default: undefined
}
```

Update props:

```ts
autoFocus: Boolean,
checkedChildren: renderableProp,
unCheckedChildren: renderableProp,
```

## Task 3: Implement Renderable Rendering and Focus Controls

- [ ] **Step 1: Add render-node helper and root ref**

In `packages/components/src/switch/switch.vue`, update imports:

```ts
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import type { PropType, VNodeChild } from 'vue'
```

Add after config setup:

```ts
const switchRef = ref<HTMLButtonElement>()

const ASwitchRenderNode = defineComponent({
  name: 'ASwitchRenderNode',
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

- [ ] **Step 2: Bind root ref and render props through helper**

Add `ref="switchRef"` to the root button.

Update the content template to:

```vue
<span :class="contentClass" :style="contentStyle">
  <slot v-if="mergedChecked" name="checkedChildren">
    <ASwitchRenderNode :node="checkedChildren" />
  </slot>
  <slot v-else name="unCheckedChildren">
    <ASwitchRenderNode :node="unCheckedChildren" />
  </slot>
</span>
```

- [ ] **Step 3: Add focus methods and autofocus lifecycle**

Add:

```ts
const focus = () => {
  switchRef.value?.focus()
}

const blur = () => {
  switchRef.value?.blur()
}

onMounted(() => {
  if (props.autoFocus) {
    nextTick(focus)
  }
})

defineExpose({
  focus,
  blur
})
```

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- switch
```

Expected: all Switch tests pass.

- [ ] **Step 5: Run targeted typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: typecheck exits 0.

- [ ] **Step 6: Commit implementation**

Run:

```bash
git add packages/components/src/switch/types.ts packages/components/src/switch/switch.vue packages/components/src/switch/__tests__/switch.test.ts
git commit -m "feat: add switch renderable focus parity"
```

## Task 4: Update Switch Documentation

- [ ] **Step 1: Update docs demos and API tables**

In `docs/components/switch.md`:

- Add `<script setup lang="ts"> import { h, ref } from 'vue'; const switchRef = ref<{ focus: () => void; blur: () => void }>(); const checkedNode = h('span', { class: 'demo-switch-node' }, '1'); const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0') </script>`.
- Add a renderable checked/unchecked demo using `:checked-children="checkedNode"` and `:un-checked-children="uncheckedNode"`.
- Add a focus controls demo with a ref and two buttons calling `focus()` and `blur()`.
- Change `checkedChildren` and `unCheckedChildren` API types to `VNodeChild`.
- Add `autoFocus | 是否自动获取焦点 | boolean | false`.
- Add a Methods section listing `focus()` and `blur()`.

- [ ] **Step 2: Build docs once**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

- [ ] **Step 3: Commit docs**

Run:

```bash
git add docs/components/switch.md
git commit -m "docs: document switch renderable focus APIs"
```

## Task 5: Refresh Generated Outputs and Verify

- [ ] **Step 1: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: package build exits 0 and updates `packages/components/es/switch/*` and `packages/components/lib/switch/*`.

- [ ] **Step 2: Commit generated outputs**

Run:

```bash
git add packages/components/es/switch packages/components/lib/switch
git commit -m "build: update switch renderable focus outputs"
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

- Spec coverage: each scope item maps to tests, implementation, docs, generated outputs, and final verification.
- Placeholder scan: no unfinished placeholders.
- Type consistency: `SwitchRenderable`, `checkedChildren`, `unCheckedChildren`, `autoFocus`, `focus`, and `blur` names are consistent across tasks.
