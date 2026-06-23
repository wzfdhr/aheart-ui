# Ant Style Modal Responsive Width Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style breakpoint object widths to `AModal`.

**Architecture:** Extend Modal width types to include a breakpoint record, keep primitive widths on the existing inline `width` style, map object widths to CSS variables, and let Modal CSS media queries choose the active breakpoint width.

**Tech Stack:** Vue 3 SFC, TypeScript, Vue Test Utils, Vitest jsdom, Vite package build, VitePress docs build.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` to add `ModalResponsiveWidth` and `ModalWidth`.
- Modify `packages/components/src/modal/modal.vue` to detect object-form width and render CSS variables.
- Modify `packages/components/src/modal/style.css` to apply responsive width variables at Grid breakpoints.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` to add red-green width coverage.
- Modify `docs/components/modal.md` to document responsive width.
- Run package build to regenerate `packages/components/es/modal/**` and `packages/components/lib/modal/**`.

### Task 1: Add Failing Responsive Width Test

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Add object width coverage**

Add this test after `renders title content footer centered state and width when open`:

```ts
it('maps responsive width object to breakpoint CSS variables', () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      width: {
        xs: 320,
        md: '640px',
        xxl: '72vw'
      }
    }
  })

  const style = wrapper.find('.aheart-modal__dialog').attributes('style') ?? ''

  expect(style).toContain('--aheart-modal-xs-width: 320px')
  expect(style).toContain('--aheart-modal-md-width: 640px')
  expect(style).toContain('--aheart-modal-xxl-width: 72vw')
  expect(style).not.toContain('width: [object Object]')
})
```

- [ ] **Step 2: Run Modal tests to verify red**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: the new responsive width test fails because object-form width does not yet create breakpoint CSS variables.

### Task 2: Implement Responsive Width Types and Runtime

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Extend width types**

In `packages/components/src/modal/types.ts`, add the Grid breakpoint import:

```ts
import type { GridBreakpoint } from '../grid/types'
```

Add:

```ts
export type ModalResponsiveWidth = Partial<Record<GridBreakpoint, number | string>>
export type ModalWidth = number | string | ModalResponsiveWidth
```

Change the `width` prop to:

```ts
width: {
  type: [Number, String, Object] as PropType<ModalWidth>,
  default: 520
},
```

- [ ] **Step 2: Add width helpers in `modal.vue`**

Import the new types:

```ts
type ModalResponsiveWidth,
type ModalWidth,
```

Add after `FOCUSABLE_SELECTOR`:

```ts
const modalWidthBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
```

Change `normalizeSize` to:

```ts
const normalizeSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)
```

Add:

```ts
const isResponsiveWidth = (value: ModalWidth): value is ModalResponsiveWidth =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const fixedDialogWidth = computed(() => (isResponsiveWidth(props.width) ? undefined : normalizeSize(props.width)))

const responsiveWidthVars = computed(() => {
  if (!isResponsiveWidth(props.width)) {
    return {}
  }

  const style: Record<string, string> = {}

  modalWidthBreakpoints.forEach((breakpoint) => {
    const breakpointWidth = props.width[breakpoint]

    if (breakpointWidth !== undefined && breakpointWidth !== null) {
      style[`--aheart-modal-${breakpoint}-width`] = normalizeSize(breakpointWidth)
    }
  })

  return style
})
```

- [ ] **Step 3: Use fixed width and responsive variables in dialog style**

Change `dialogStyle` to:

```ts
const dialogStyle = computed(() => ({
  ...props.style,
  ...responsiveWidthVars.value,
  ...semanticStyle('dialog'),
  width: fixedDialogWidth.value
}))
```

- [ ] **Step 4: Run Modal tests to verify green**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: Modal tests pass, including the responsive width test.

### Task 3: Add Responsive Width CSS

**Files:**
- Modify: `packages/components/src/modal/style.css`

- [ ] **Step 1: Add width fallback to the dialog rule**

Change `.aheart-modal__dialog` to include:

```css
width: var(--aheart-modal-width, 520px);
```

- [ ] **Step 2: Add breakpoint media queries**

Add these rules before the existing mobile max-width rule:

```css
@media (min-width: 480px) {
  .aheart-modal__dialog {
    width: var(--aheart-modal-xs-width, var(--aheart-modal-width, 520px));
  }
}

@media (min-width: 576px) {
  .aheart-modal__dialog {
    width: var(--aheart-modal-sm-width, var(--aheart-modal-xs-width, var(--aheart-modal-width, 520px)));
  }
}

@media (min-width: 768px) {
  .aheart-modal__dialog {
    width: var(--aheart-modal-md-width, var(--aheart-modal-sm-width, var(--aheart-modal-xs-width, var(--aheart-modal-width, 520px))));
  }
}

@media (min-width: 992px) {
  .aheart-modal__dialog {
    width: var(--aheart-modal-lg-width, var(--aheart-modal-md-width, var(--aheart-modal-sm-width, var(--aheart-modal-xs-width, var(--aheart-modal-width, 520px)))));
  }
}

@media (min-width: 1200px) {
  .aheart-modal__dialog {
    width: var(--aheart-modal-xl-width, var(--aheart-modal-lg-width, var(--aheart-modal-md-width, var(--aheart-modal-sm-width, var(--aheart-modal-xs-width, var(--aheart-modal-width, 520px))))));
  }
}

@media (min-width: 1600px) {
  .aheart-modal__dialog {
    width: var(--aheart-modal-xxl-width, var(--aheart-modal-xl-width, var(--aheart-modal-lg-width, var(--aheart-modal-md-width, var(--aheart-modal-sm-width, var(--aheart-modal-xs-width, var(--aheart-modal-width, 520px)))))));
  }
}
```

- [ ] **Step 3: Update mobile fit width**

Change the mobile width rule to:

```css
width: min(
  var(
    --aheart-modal-sm-width,
    var(--aheart-modal-xs-width, var(--aheart-modal-width, calc(100vw - 32px)))
  ),
  calc(100vw - 32px)
) !important;
```

- [ ] **Step 4: Run Modal tests again**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: Modal tests still pass.

### Task 4: Update Documentation

**Files:**
- Modify: `docs/components/modal.md`

- [ ] **Step 1: Add a responsive width example**

Add a compact example before the API section:

````md
### 响应式宽度

`width` 支持按断点配置，断点名称与栅格系统一致。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AButton type="primary" @click="open = true">Responsive width</AButton>
  <AModal v-model:open="open" title="Responsive modal" :width="{ xs: 320, md: 640, xl: '72vw' }">
    The dialog width follows configured breakpoints.
  </AModal>
</template>
```
````

- [ ] **Step 2: Update API and type docs**

Change the `width` API row to:

```md
| width | 对话框宽度，支持断点对象 | `number` \| `string` \| `ModalResponsiveWidth` | `520` |
```

Add:

````md
### ModalResponsiveWidth

```ts
type ModalResponsiveWidth = Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number | string>>
```
````

### Task 5: Build Generated Outputs and Verify

**Files:**
- Modify generated Modal outputs under `packages/components/es/modal/**`
- Modify generated Modal outputs under `packages/components/lib/modal/**`

- [ ] **Step 1: Run package build**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Modal outputs include responsive width types, CSS variables, and media rules.

- [ ] **Step 2: Remove known unrelated generated declaration noise if present**

Run:

```bash
cd /Users/start/Desktop/aheart-ui
git diff -- packages/components/es/drawer packages/components/lib/drawer packages/components/es/form packages/components/lib/form | git apply -R
```

Expected: only Modal-related generated files remain changed.

- [ ] **Step 3: Run full checks**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
```

Expected: all component tests and type checks pass.

- [ ] **Step 4: Run docs build and whitespace check**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/docs
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
cd /Users/start/Desktop/aheart-ui
git diff --check
```

Expected: docs build succeeds and diff check reports no whitespace errors.

### Task 6: Stage and Commit

**Files:**
- Stage the new spec and plan.
- Stage `docs/components/modal.md`.
- Stage `packages/components/src/modal/**`.
- Stage `packages/components/es/modal/**`.
- Stage `packages/components/lib/modal/**`.

- [ ] **Step 1: Inspect final diff**

Run:

```bash
cd /Users/start/Desktop/aheart-ui
git status --short
git diff --stat
```

Expected: changes are limited to Modal source, Modal docs, Modal generated outputs, and this phase's spec/plan files.

- [ ] **Step 2: Stage explicit paths**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-modal-responsive-width-design.md docs/superpowers/plans/2026-06-23-ant-style-modal-responsive-width.md docs/components/modal.md packages/components/src/modal packages/components/es/modal packages/components/lib/modal
```

- [ ] **Step 3: Commit**

Run:

```bash
git diff --cached --check
git commit -m "feat: align modal responsive width"
```

Expected: commit succeeds with only the intended stage changes.

## Self Review

- Spec coverage: the plan includes responsive width types, runtime CSS variables, CSS media queries, tests, docs, generated outputs, full checks, and commit scope.
- Placeholder scan: no placeholder markers or vague deferred steps.
- Type consistency: `ModalResponsiveWidth`, `ModalWidth`, breakpoint names, and CSS variable names match across source, tests, docs, and generated outputs.
