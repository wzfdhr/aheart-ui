# Ant Style Drawer Style Aliases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style deprecated Drawer style alias props and map them to existing Aheart Drawer elements.

**Architecture:** Keep Drawer DOM unchanged. Add six `CSSProperties` props in `types.ts`, merge them into existing style computed values in `drawer.vue`, and preserve current semantic `styles` precedence by applying aliases before `styles.*`.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest with Vue Test Utils, Vite library build, VitePress docs.

---

## File Structure

- Modify `packages/components/src/drawer/types.ts`: add `bodyStyle`, `headerStyle`, `footerStyle`, `maskStyle`, `drawerStyle`, and `contentWrapperStyle`.
- Modify `packages/components/src/drawer/drawer.vue`: merge aliases into existing element style bindings.
- Modify `packages/components/src/drawer/__tests__/drawer.test.ts`: add style alias compatibility coverage.
- Modify `docs/components/drawer.md`: add alias API rows.
- Regenerate Drawer outputs under `packages/components/es/drawer` and `packages/components/lib/drawer`.

### Task 1: Add Failing Style Alias Tests

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Add alias style coverage**

Add after `resolves semantic class and style functions with drawer props`:

```ts
it('applies deprecated Ant style aliases to drawer elements', () => {
  const wrapper = mountDrawer({
    props: {
      open: true,
      title: 'Alias styled drawer',
      footer: true,
      width: 320,
      maskStyle: { opacity: '0.3' },
      headerStyle: { padding: '12px' },
      bodyStyle: { backgroundColor: 'rgb(10, 11, 12)' },
      footerStyle: { justifyContent: 'flex-start' },
      drawerStyle: { borderInlineStart: '2px solid rgb(1, 2, 3)' },
      contentWrapperStyle: { maxWidth: '80vw' }
    },
    slots: {
      default: 'Alias body',
      footer: 'Alias footer'
    }
  })

  expect(wrapper.find('.aheart-drawer__mask').attributes('style')).toContain('opacity: 0.3')
  expect(wrapper.find('.aheart-drawer__header').attributes('style')).toContain('padding: 12px')
  expect(wrapper.find('.aheart-drawer__body').attributes('style')).toContain('background-color: rgb(10, 11, 12)')
  expect(wrapper.find('.aheart-drawer__footer').attributes('style')).toContain('justify-content: flex-start')
  expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('border-inline-start: 2px solid rgb(1, 2, 3)')
  expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('max-width: 80vw')
  expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('width: 320px')
})
```

- [ ] **Step 2: Add semantic override coverage**

Add after the alias style test:

```ts
it('lets semantic styles override deprecated style aliases', () => {
  const wrapper = mountDrawer({
    props: {
      open: true,
      title: 'Override styled drawer',
      footer: true,
      maskStyle: { opacity: '0.2' },
      headerStyle: { padding: '4px' },
      bodyStyle: { padding: '4px' },
      footerStyle: { justifyContent: 'flex-start' },
      drawerStyle: { maxWidth: '70vw' },
      styles: {
        mask: { opacity: '0.8' },
        header: { padding: '16px' },
        body: { padding: '28px' },
        footer: { justifyContent: 'flex-end' },
        section: { maxWidth: '90vw' }
      }
    },
    slots: {
      default: 'Override body',
      footer: 'Override footer'
    }
  })

  expect(wrapper.find('.aheart-drawer__mask').attributes('style')).toContain('opacity: 0.8')
  expect(wrapper.find('.aheart-drawer__header').attributes('style')).toContain('padding: 16px')
  expect(wrapper.find('.aheart-drawer__body').attributes('style')).toContain('padding: 28px')
  expect(wrapper.find('.aheart-drawer__footer').attributes('style')).toContain('justify-content: flex-end')
  expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('max-width: 90vw')
})
```

- [ ] **Step 3: Run Drawer tests to verify red**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: FAIL because the alias props are not yet declared or merged into styles.

### Task 2: Implement Style Alias Mapping

**Files:**
- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`

- [ ] **Step 1: Add alias props**

In `packages/components/src/drawer/types.ts`, add after `rootStyle`:

```ts
bodyStyle: Object as PropType<CSSProperties>,
headerStyle: Object as PropType<CSSProperties>,
footerStyle: Object as PropType<CSSProperties>,
maskStyle: Object as PropType<CSSProperties>,
drawerStyle: Object as PropType<CSSProperties>,
contentWrapperStyle: Object as PropType<CSSProperties>,
```

- [ ] **Step 2: Merge panel aliases**

In `packages/components/src/drawer/drawer.vue`, update both branches of `panelStyle` to include:

```ts
...props.drawerStyle,
...props.contentWrapperStyle,
...semanticStyle('section'),
```

Keep width or height as the final property.

- [ ] **Step 3: Add merged style helpers**

Replace:

```ts
const maskStyle = computed(() => semanticStyle('mask'))
```

with:

```ts
const mergedMaskStyle = computed(() => ({
  ...props.maskStyle,
  ...semanticStyle('mask')
}))
const mergedHeaderStyle = computed(() => ({
  ...props.headerStyle,
  ...semanticStyle('header')
}))
const mergedBodyStyle = computed(() => ({
  ...props.bodyStyle,
  ...semanticStyle('body')
}))
const mergedFooterStyle = computed(() => ({
  ...props.footerStyle,
  ...semanticStyle('footer')
}))
```

Update template bindings:

```vue
<div v-if="showMask" :class="maskClass" :style="mergedMaskStyle" @click="handleMaskClick" />
<header v-if="hasHeader" :class="headerClass" :style="mergedHeaderStyle">
<div :class="bodyClass" :style="mergedBodyStyle">
<footer v-if="hasFooter" :class="footerClass" :style="mergedFooterStyle">
```

- [ ] **Step 4: Run Drawer tests to verify green**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: all Drawer tests pass, including style alias coverage.

### Task 3: Update Documentation

**Files:**
- Modify: `docs/components/drawer.md`

- [ ] **Step 1: Add API rows**

Add after `rootStyle`:

```md
| bodyStyle | 内容区样式别名；新代码优先使用 `styles.body` | `CSSProperties` | - |
| headerStyle | 头部样式别名；新代码优先使用 `styles.header` | `CSSProperties` | - |
| footerStyle | 页脚样式别名；新代码优先使用 `styles.footer` | `CSSProperties` | - |
| maskStyle | 遮罩样式别名；新代码优先使用 `styles.mask` | `CSSProperties` | - |
| drawerStyle | 面板样式别名；新代码优先使用 `styles.section` | `CSSProperties` | - |
| contentWrapperStyle | 面板外层样式兼容别名；当前映射到 `styles.section` | `CSSProperties` | - |
```

### Task 4: Build and Commit

**Files:**
- Generated: `packages/components/es/drawer/**`
- Generated: `packages/components/lib/drawer/**`

- [ ] **Step 1: Run typecheck**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
```

Expected: exit 0.

- [ ] **Step 2: Run full component tests**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
```

Expected: exit 0 with all component tests passing.

- [ ] **Step 3: Run component build**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build completes and generated Drawer outputs include alias props and merged style behavior.

- [ ] **Step 4: Remove known unrelated generated noise**

Run from the repository root:

```bash
git diff -- packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal | git apply -R
```

Expected: only Drawer-related generated files remain changed.

- [ ] **Step 5: Run docs build**

Run from `docs`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node_modules/.bin/vitepress build .
```

Expected: VitePress build completes.

- [ ] **Step 6: Run final diff checks**

Run from the repository root:

```bash
git status -sb
git diff --check
git diff --name-only
git diff --stat
```

Expected: no whitespace errors; changed files are limited to Drawer source/tests/docs, this phase's spec/plan, and generated Drawer outputs.

- [ ] **Step 7: Stage and commit**

Run from the repository root:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-style-aliases-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-style-aliases.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer
git diff --cached --check
git commit -m "feat: align drawer style aliases"
```

Expected: commit succeeds with only intended files.

- [ ] **Step 8: Push and fast-forward master**

Run from the repository root:

```bash
git push origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: both the work branch and `master` point at the new commit locally and on origin.

## Self-Review

- Spec coverage: the plan includes alias props, style mapping, precedence, tests, docs, generated outputs, and merge workflow.
- Placeholder scan: no unfinished placeholders or vague implementation steps.
- Type consistency: alias prop names and mapped semantic part names match between spec, plan, source, tests, and docs.
