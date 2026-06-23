# Ant Style Modal Semantic Aliases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `wrapper` and `container` semantic aliases to `AModal`.

**Architecture:** Keep the existing Modal DOM and compatibility semantic keys. Extend the semantic part union, then merge old/new semantic classes and styles at the existing wrapper and dialog call sites.

**Tech Stack:** Vue 3 SFC, TypeScript, Vue Test Utils, Vitest jsdom, Vite package build, VitePress docs build.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` to add `wrapper` and `container` semantic keys.
- Modify `packages/components/src/modal/modal.vue` to apply old and new semantic keys to the same nodes.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` to add red-green semantic alias coverage.
- Modify `docs/components/modal.md` to document the aliases.
- Run package build to regenerate `packages/components/es/modal/**` and `packages/components/lib/modal/**`.

### Task 1: Add Failing Semantic Alias Test

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Add alias coverage**

Add this test after `applies wrapClassName alongside semantic wrap class`:

```ts
it('supports Ant-style wrapper and container semantic aliases', () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      classNames: {
        wrapper: 'semantic-wrapper',
        container: 'semantic-container'
      },
      styles: {
        wrapper: { outline: '1px solid rgb(1, 2, 3)' },
        container: { maxWidth: '88vw' }
      }
    }
  })

  const wrap = wrapper.find('.aheart-modal__wrap')
  const dialog = wrapper.find('.aheart-modal__dialog')

  expect(wrap.classes()).toContain('semantic-wrapper')
  expect(wrap.attributes('style')).toContain('outline: 1px solid rgb(1, 2, 3)')
  expect(dialog.classes()).toContain('semantic-container')
  expect(dialog.attributes('style')).toContain('max-width: 88vw')
})
```

- [ ] **Step 2: Run Modal tests to verify red**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: the new alias test fails because `wrapper` and `container` are not yet applied.

### Task 2: Implement Semantic Alias Types and Runtime

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Extend semantic parts**

Change:

```ts
export const modalSemanticParts = ['root', 'mask', 'wrap', 'dialog', 'header', 'title', 'body', 'footer', 'close'] as const
```

to:

```ts
export const modalSemanticParts = [
  'root',
  'mask',
  'wrap',
  'wrapper',
  'dialog',
  'container',
  'header',
  'title',
  'body',
  'footer',
  'close'
] as const
```

- [ ] **Step 2: Add class/style merge helpers**

In `modal.vue`, add after `semanticStyle`:

```ts
const semanticClasses = (...parts: ModalSemanticPart[]) => parts.map((part) => semanticClass(part))
const semanticStyles = (...parts: ModalSemanticPart[]): CSSProperties | undefined => {
  const merged = parts.reduce<CSSProperties>((styles, part) => ({ ...styles, ...semanticStyle(part) }), {})

  return Object.keys(merged).length > 0 ? merged : undefined
}
```

- [ ] **Step 3: Apply aliases to wrapper and dialog**

Change:

```ts
const wrapClass = computed(() => ['aheart-modal__wrap', props.wrapClassName, semanticClass('wrap')])
```

to:

```ts
const wrapClass = computed(() => ['aheart-modal__wrap', props.wrapClassName, semanticClasses('wrap', 'wrapper')])
const wrapStyle = computed(() => semanticStyles('wrap', 'wrapper'))
```

Change the wrapper template style binding to:

```vue
<div :class="wrapClass" :style="wrapStyle">
```

Change `dialogClass` so it includes:

```ts
semanticClasses('dialog', 'container')
```

Change `dialogStyle` so it merges:

```ts
...semanticStyles('dialog', 'container'),
```

- [ ] **Step 4: Run Modal tests to verify green**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: Modal tests pass, including the semantic alias coverage.

### Task 3: Update Documentation

**Files:**
- Modify: `docs/components/modal.md`

- [ ] **Step 1: Update semantic demo**

Add `container` and `wrapper` to the existing semantic demo configuration:

```ts
const semanticClassNames = ({ props }: { props: { open?: boolean } }) => ({
  container: props.open ? 'docs-modal-dialog' : '',
  wrapper: 'docs-modal-wrap',
  body: 'docs-modal-body'
})
```

Update the rendered example to rely on the semantic `wrapper` class instead of `wrap-class-name`.

- [ ] **Step 2: Update ModalSemanticPart docs**

Use this line:

```md
`root`、`mask`、`wrap`、`wrapper`、`dialog`、`container`、`header`、`title`、`body`、`footer`、`close`
```

### Task 4: Build Generated Outputs and Verify

**Files:**
- Modify generated Modal outputs under `packages/components/es/modal/**`
- Modify generated Modal outputs under `packages/components/lib/modal/**`

- [ ] **Step 1: Run package build**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Modal outputs include semantic alias types and runtime class/style merging.

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

### Task 5: Stage and Commit

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
git add docs/superpowers/specs/2026-06-23-ant-style-modal-semantic-aliases-design.md docs/superpowers/plans/2026-06-23-ant-style-modal-semantic-aliases.md docs/components/modal.md packages/components/src/modal packages/components/es/modal packages/components/lib/modal
```

- [ ] **Step 3: Commit**

Run:

```bash
git diff --cached --check
git commit -m "feat: align modal semantic aliases"
```

Expected: commit succeeds with only the intended stage changes.

## Self Review

- Spec coverage: the plan includes semantic type aliases, runtime class/style application, tests, docs, generated outputs, full checks, and commit scope.
- Placeholder scan: no placeholder markers or vague deferred steps.
- Type consistency: `wrapper`, `container`, `wrap`, `dialog`, `ModalSemanticPart`, `classNames`, and `styles` names match across source, tests, docs, and generated outputs.
