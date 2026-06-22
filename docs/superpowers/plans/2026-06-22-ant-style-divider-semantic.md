# Ant Style Divider Semantic API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design 6 style semantic class and style hooks to `ADivider` while preserving existing divider behavior.

**Architecture:** Extend the existing Divider component in place. The root remains the separator element, a dedicated line element carries line-level semantic styles, and the existing text wrapper receives text-level semantic styles only when rendered.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `ADivider` `className`, `rootClassName`, and `style`.
- `ADivider` `classNames` and `styles`.
- Semantic keys `root`, `line`, and `text`.
- Docs and generated `es` / `lib` outputs.

This plan does not change `vertical`, `type`, `orientation`, `titlePlacement`, `orientationMargin`, `variant`, `size`, `dashed`, or `plain` behavior.

## Files

- Modify: `packages/components/src/divider/types.ts`
- Modify: `packages/components/src/divider/divider.vue`
- Modify: `packages/components/src/divider/style.css`
- Modify: `packages/components/src/divider/__tests__/divider.test.ts`
- Modify: `docs/components/divider.md`
- Generated after build: `packages/components/es/divider/*`
- Generated after build: `packages/components/lib/divider/*`
- Generated after build: `packages/components/es/style.css`
- Generated after build: `packages/components/lib/style.css`

## Task 1: Write Failing Divider Tests

- [ ] **Step 1: Add tests in `packages/components/src/divider/__tests__/divider.test.ts`**

Add this test:

```ts
it('applies root line and text semantic classes and styles', () => {
  const wrapper = mount(Divider, {
    props: {
      titlePlacement: 'start',
      orientationMargin: 16,
      className: 'divider-class',
      rootClassName: 'divider-root',
      style: { marginTop: '4px' },
      classNames: {
        root: 'semantic-root',
        line: 'semantic-line',
        text: 'semantic-text'
      },
      styles: {
        root: { color: 'red' },
        line: { borderColor: 'blue' },
        text: { fontWeight: 600 }
      }
    },
    slots: { default: 'Section' }
  })

  expect(wrapper.classes()).toContain('divider-class')
  expect(wrapper.classes()).toContain('divider-root')
  expect(wrapper.classes()).toContain('semantic-root')
  expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  expect(wrapper.attributes('style')).toContain('color: red')
  expect(wrapper.attributes('style')).toContain('--aheart-divider-orientation-margin: 16px')
  expect(wrapper.find('.aheart-divider__line').classes()).toContain('semantic-line')
  expect(wrapper.find('.aheart-divider__line').attributes('style')).toContain('border-color: blue')
  expect(wrapper.find('.aheart-divider__text').classes()).toContain('semantic-text')
  expect(wrapper.find('.aheart-divider__text').attributes('style')).toContain('font-weight: 600')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- divider
```

Expected: the new test fails because semantic props and the line element are not implemented.

## Task 2: Implement Divider Semantic APIs

- [ ] **Step 1: Extend `packages/components/src/divider/types.ts`**

Add `StyleValue` import and these types:

```ts
export type DividerSemanticPart = 'root' | 'line' | 'text'
export type DividerClassNames = Partial<Record<DividerSemanticPart, string>>
export type DividerStyles = Partial<Record<DividerSemanticPart, StyleValue>>
```

Add props:

```ts
className: String,
rootClassName: String,
style: [String, Object, Array] as PropType<StyleValue>,
classNames: {
  type: Object as PropType<DividerClassNames>,
  default: () => ({})
},
styles: {
  type: Object as PropType<DividerStyles>,
  default: () => ({})
}
```

- [ ] **Step 2: Update `packages/components/src/divider/divider.vue`**

Render a line element inside the root:

```vue
<span class="aheart-divider__line" :class="classNames.line" :style="styles.line" aria-hidden="true" />
```

Apply root and text semantic classes/styles, preserving the existing orientation margin variable:

```ts
const dividerClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames.root,
  ...
])

const dividerStyle = computed(() => [
  props.orientationMargin
    ? { '--aheart-divider-orientation-margin': normalizeSize(props.orientationMargin) }
    : undefined,
  props.style,
  props.styles.root
])
```

- [ ] **Step 3: Update `packages/components/src/divider/style.css`**

Move the line drawing behavior to `.aheart-divider__line` without changing existing visuals. Keep text layout working for titled horizontal dividers.

- [ ] **Step 4: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- divider
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: targeted Divider tests and package typecheck pass.

## Task 3: Document And Build

- [ ] **Step 1: Update `docs/components/divider.md`**

Add semantic styling example, API rows, and Semantic DOM section.

- [ ] **Step 2: Build docs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build passes.

- [ ] **Step 3: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: Divider `es` / `lib` outputs and aggregate CSS update.

- [ ] **Step 4: Final verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git status --short --branch
```

Expected: all commands pass and the worktree is clean after committing.
