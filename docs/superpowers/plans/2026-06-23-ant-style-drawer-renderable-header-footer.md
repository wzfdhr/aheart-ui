# Ant Style Drawer Renderable Header Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Vue renderable support for Drawer `title`, `extra`, and `footer` props.

**Architecture:** Keep Drawer rendering inside `drawer.vue`. Reuse the local `ADrawerRenderNode` helper added for close icons, widen Drawer prop types in `types.ts`, and use computed visibility helpers so slots continue to override prop fallbacks without duplicating header/footer markup.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vue Test Utils, Vite, VitePress.

---

## File Structure

- Modify `packages/components/src/drawer/types.ts`: add renderable aliases and widen `title`, `extra`, and `footer`.
- Modify `packages/components/src/drawer/drawer.vue`: render prop fallbacks through `ADrawerRenderNode` and update visibility checks.
- Modify `packages/components/src/drawer/__tests__/drawer.test.ts`: add failing renderable header/footer tests.
- Modify `docs/components/drawer.md`: add docs example and API/type updates.
- Update generated Drawer outputs under `packages/components/es/drawer` and `packages/components/lib/drawer` with `vite build`.

## Task 1: Add Failing Renderable Tests

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Add VNode prop rendering coverage**

Insert after `renders extra prop when no extra slot is provided`:

```ts
  it('renders VNode title extra and footer props', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: h('span', { class: 'render-title' }, 'Render title'),
        extra: h('button', { class: 'render-extra' }, 'Render extra'),
        footer: h('div', { class: 'render-footer' }, 'Render footer')
      }
    })

    expect(wrapper.find('.render-title').text()).toBe('Render title')
    expect(wrapper.find('.render-extra').text()).toBe('Render extra')
    expect(wrapper.find('.render-footer').text()).toBe('Render footer')
  })
```

- [ ] **Step 2: Add slot override coverage**

```ts
  it('lets title extra and footer slots override renderable props', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: h('span', { class: 'prop-title' }, 'Prop title'),
        extra: h('span', { class: 'prop-extra' }, 'Prop extra'),
        footer: h('span', { class: 'prop-footer' }, 'Prop footer')
      },
      slots: {
        title: '<span class="slot-title">Slot title</span>',
        extra: '<span class="slot-extra">Slot extra</span>',
        footer: '<span class="slot-footer">Slot footer</span>'
      }
    })

    expect(wrapper.find('.slot-title').text()).toBe('Slot title')
    expect(wrapper.find('.slot-extra').text()).toBe('Slot extra')
    expect(wrapper.find('.slot-footer').text()).toBe('Slot footer')
    expect(wrapper.find('.prop-title').exists()).toBe(false)
    expect(wrapper.find('.prop-extra').exists()).toBe(false)
    expect(wrapper.find('.prop-footer').exists()).toBe(false)
  })
```

- [ ] **Step 3: Add numeric and null footer coverage**

```ts
  it('renders numeric zero title extra and footer props', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 0,
        extra: 0,
        footer: 0
      }
    })

    expect(wrapper.find('.aheart-drawer__title').text()).toBe('0')
    expect(wrapper.find('.aheart-drawer__extra').text()).toBe('0')
    expect(wrapper.find('.aheart-drawer__footer').text()).toBe('0')
  })

  it('hides footer slot when footer is null', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        footer: null
      },
      slots: {
        footer: '<span class="hidden-footer">Hidden footer</span>'
      }
    })

    expect(wrapper.find('.aheart-drawer__footer').exists()).toBe(false)
    expect(wrapper.find('.hidden-footer').exists()).toBe(false)
  })
```

- [ ] **Step 4: Run focused tests and verify RED**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: new tests fail because `title` rejects VNodes/numbers, `extra` rejects VNodes, `footer` rejects renderable/null values, and the template interpolates prop fallbacks.

## Task 2: Implement Renderable Header and Footer Props

**Files:**
- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`

- [ ] **Step 1: Add renderable aliases and widen props**

In `packages/components/src/drawer/types.ts`, add:

```ts
export type DrawerRenderable = VNodeChild
export type DrawerTitle = DrawerRenderable
export type DrawerExtra = DrawerRenderable
export type DrawerFooter = boolean | DrawerRenderable
```

Replace the current `title`, `extra`, and `footer` props with:

```ts
  title: {
    type: [String, Number, Boolean, Object, Array, Function] as PropType<DrawerTitle>,
    default: undefined
  },
  extra: {
    type: [String, Number, Boolean, Object, Array, Function] as PropType<DrawerExtra>,
    default: undefined
  },
```

```ts
  footer: {
    type: [Boolean, String, Number, Object, Array, Function] as PropType<DrawerFooter>,
    default: undefined
  },
```

- [ ] **Step 2: Add renderable visibility helpers**

In `packages/components/src/drawer/drawer.vue`, add after `shouldRender`:

```ts
const isRenderableNode = (value: VNodeChild) =>
  value !== undefined && value !== null && value !== false && value !== true && value !== ''
```

Replace `hasExtra`, `hasHeader`, and `hasFooter` with:

```ts
const hasTitle = computed(() => Boolean(slots.title) || isRenderableNode(props.title))
const hasExtra = computed(() => Boolean(slots.extra) || isRenderableNode(props.extra))
const hasHeader = computed(() => hasTitle.value || hasExtra.value || showCloseButton.value)
```

```ts
const shouldHideFooter = computed(() => props.footer === false || props.footer === null)
const shouldRenderFooterProp = computed(() => isRenderableNode(props.footer))
const hasFooter = computed(
  () => !shouldHideFooter.value && (Boolean(slots.footer) || props.footer === true || shouldRenderFooterProp.value)
)
```

- [ ] **Step 3: Render prop fallbacks through `ADrawerRenderNode`**

Replace title, extra, and footer template blocks with:

```vue
          <div v-if="hasTitle" :class="titleClass" :style="semanticStyle('title')">
            <slot name="title">
              <ADrawerRenderNode :node="title" />
            </slot>
          </div>
          <div v-if="hasExtra" :class="extraClass" :style="semanticStyle('extra')">
            <slot name="extra">
              <ADrawerRenderNode :node="extra" />
            </slot>
          </div>
```

```vue
        <footer v-if="hasFooter" :class="footerClass" :style="semanticStyle('footer')">
          <slot name="footer">
            <ADrawerRenderNode v-if="shouldRenderFooterProp" :node="footer" />
          </slot>
        </footer>
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: all Drawer tests pass.

## Task 3: Update Docs and Generated Output

**Files:**
- Modify: `docs/components/drawer.md`
- Modify: `packages/components/es/drawer/*`
- Modify: `packages/components/lib/drawer/*`

- [ ] **Step 1: Add renderable docs state**

Change the docs import and add renderable constants:

```ts
import { h, ref } from 'vue'
```

```ts
const renderableOpen = ref(false)
const renderableTitle = h('span', { class: 'docs-drawer-renderable-title' }, 'Review profile')
const renderableExtra = h('span', { class: 'docs-drawer-renderable-extra' }, 'Synced')
const renderableFooter = h('div', { class: 'docs-drawer-renderable-footer' }, 'Footer content can come from props.')
```

- [ ] **Step 2: Add renderable docs section**

Insert before `## 关闭按钮`:

````md
## 可渲染内容

<div class="aheart-demo-panel">
  <AButton @click="renderableOpen = true">Renderable drawer</AButton>
  <ADrawer
    v-model:open="renderableOpen"
    :title="renderableTitle"
    :extra="renderableExtra"
    :footer="renderableFooter"
  >
    Title, extra, and footer can come from renderable props or slots.
  </ADrawer>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'

const open = ref(false)
const title = h('span', { class: 'workspace-title' }, 'Review profile')
const extra = h('span', { class: 'workspace-extra' }, 'Synced')
const footer = h('div', { class: 'workspace-footer' }, 'Footer content can come from props.')
</script>

<template>
  <ADrawer v-model:open="open" :title="title" :extra="extra" :footer="footer">
    Title, extra, and footer can come from renderable props or slots.
  </ADrawer>
</template>
```
````

- [ ] **Step 3: Update API rows and type section**

Set API rows to:

```md
| title | 标题内容 | `DrawerRenderable` | - |
| extra | 标题栏右侧额外内容；复杂内容也可使用 `extra` slot | `DrawerRenderable` | - |
| footer | 页脚内容；`true` 可只显示 footer slot，`false` 或 `null` 隐藏页脚 | `boolean` \| `DrawerRenderable` | - |
```

Add after `### DrawerGetContainer`:

````md
### DrawerRenderable

```ts
type DrawerRenderable = VNodeChild
```
````

- [ ] **Step 4: Generate Drawer package output**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build completes and generated Drawer files include the widened props.

## Task 4: Verify, Commit, Push, and Merge

**Files:**
- Stage only Drawer source/tests, Drawer docs, this stage's spec/plan, and generated Drawer package outputs.

- [ ] **Step 1: Run verification**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
```

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src
```

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Run from `docs`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node_modules/.bin/vitepress build .
```

Run from repo root:

```bash
git diff --check
```

- [ ] **Step 2: Stage intended files**

Run from repo root:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-renderable-header-footer-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-renderable-header-footer.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer
```

- [ ] **Step 3: Commit this phase**

Run:

```bash
git commit -m "feat: align drawer renderable header footer"
```

- [ ] **Step 4: Push and fast-forward merge to master**

Run:

```bash
git push origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: `master`, `origin/master`, `codex/consolidated-ant-style-foundation`, and `origin/codex/consolidated-ant-style-foundation` point to the new commit.

## Self-Review

- Spec coverage: tests cover VNode props, slot priority, numeric zero, and null footer suppression.
- Type consistency: `DrawerRenderable`, `DrawerTitle`, `DrawerExtra`, and `DrawerFooter` names match the spec and snippets.
- Verification scope: focused tests, type check, full tests, component build, docs build, and diff whitespace checks are included before commit.
