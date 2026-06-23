# Ant Style Drawer Semantic Functions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add function-valued `classNames` and `styles` support to Aheart Drawer semantic hooks.

**Architecture:** Broaden Drawer semantic hook types to match Modal, then add one generic resolver in `drawer.vue`. Existing template class and style call sites keep calling `semanticClass` and `semanticStyle`, so object-form behavior stays intact.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest with Vue Test Utils, Vite library build, VitePress docs.

---

## File Structure

- Modify `packages/components/src/drawer/types.ts`: add semantic info/config types and widen `classNames` / `styles` prop declarations.
- Modify `packages/components/src/drawer/drawer.vue`: add semantic config resolver and route `semanticClass` / `semanticStyle` through it.
- Modify `packages/components/src/drawer/__tests__/drawer.test.ts`: add function-valued semantic hook coverage.
- Modify `docs/components/drawer.md`: update API rows and add `DrawerSemanticInfo` reference.
- Regenerate Drawer outputs under `packages/components/es/drawer` and `packages/components/lib/drawer`.

### Task 1: Add Failing Semantic Function Test

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Add function semantic hook coverage**

Add after `applies root panel semantic classes styles and z-index`:

```ts
it('resolves semantic class and style functions with drawer props', () => {
  const wrapper = mountDrawer({
    props: {
      open: true,
      title: 'Function drawer',
      placement: 'left',
      classNames: ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
        root: props.placement === 'left' ? 'semantic-left-root' : 'semantic-other-root',
        body: props.open ? 'semantic-open-body' : 'semantic-closed-body'
      }),
      styles: ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
        root: props.placement === 'left' ? { color: 'rgb(9, 8, 7)' } : { color: 'rgb(1, 1, 1)' },
        body: props.open ? { padding: '32px' } : { padding: '4px' }
      })
    },
    slots: {
      default: 'Function styled body'
    }
  })

  expect(wrapper.find('.aheart-drawer').classes()).toContain('semantic-left-root')
  expect(wrapper.find('.aheart-drawer').attributes('style')).toContain('color: rgb(9, 8, 7)')
  expect(wrapper.find('.aheart-drawer__body').classes()).toContain('semantic-open-body')
  expect(wrapper.find('.aheart-drawer__body').attributes('style')).toContain('padding: 32px')
})
```

- [ ] **Step 2: Run Drawer tests to verify red**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: FAIL because `classNames` and `styles` functions are not yet accepted or resolved.

### Task 2: Implement Semantic Function Resolution

**Files:**
- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`

- [ ] **Step 1: Broaden Drawer semantic types**

In `packages/components/src/drawer/types.ts`, replace:

```ts
export type DrawerClassNames = Partial<Record<DrawerSemanticPart, string>>
export type DrawerStyles = Partial<Record<DrawerSemanticPart, CSSProperties>>
```

with:

```ts
export interface DrawerSemanticInfo {
  props: Readonly<Record<string, unknown>>
}

export type DrawerSemanticRecord<T> = Partial<Record<DrawerSemanticPart, T>>
export type DrawerSemanticConfig<T> = DrawerSemanticRecord<T> | ((info: DrawerSemanticInfo) => DrawerSemanticRecord<T>)
export type DrawerClassNames = DrawerSemanticConfig<string>
export type DrawerStyles = DrawerSemanticConfig<CSSProperties>
```

Change the prop declarations to:

```ts
classNames: [Object, Function] as PropType<DrawerClassNames>,
styles: [Object, Function] as PropType<DrawerStyles>,
```

- [ ] **Step 2: Add resolver import and helper**

In `packages/components/src/drawer/drawer.vue`, import `type DrawerSemanticConfig`.

Replace:

```ts
const semanticClass = (part: DrawerSemanticPart) => props.classNames?.[part]
const semanticStyle = (part: DrawerSemanticPart): CSSProperties | undefined => props.styles?.[part]
```

with:

```ts
const resolveSemanticConfig = <T,>(
  config: DrawerSemanticConfig<T> | undefined,
  part: DrawerSemanticPart
): T | undefined => {
  const resolved = typeof config === 'function' ? config({ props }) : config
  return resolved?.[part]
}

const semanticClass = (part: DrawerSemanticPart) => resolveSemanticConfig(props.classNames, part)
const semanticStyle = (part: DrawerSemanticPart): CSSProperties | undefined =>
  resolveSemanticConfig(props.styles, part)
```

- [ ] **Step 3: Run Drawer tests to verify green**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: all Drawer tests pass, including the new function semantic hook coverage.

### Task 3: Update Documentation

**Files:**
- Modify: `docs/components/drawer.md`

- [ ] **Step 1: Update API rows**

Replace the `classNames` and `styles` rows with:

```md
| classNames | 语义化结构类名，支持对象或函数 | `Partial<Record<DrawerSemanticPart, string>>` \| `(info: DrawerSemanticInfo) => Partial<Record<DrawerSemanticPart, string>>` | - |
| styles | 语义化结构样式，支持对象或函数 | `Partial<Record<DrawerSemanticPart, CSSProperties>>` \| `(info: DrawerSemanticInfo) => Partial<Record<DrawerSemanticPart, CSSProperties>>` | - |
```

- [ ] **Step 2: Add DrawerSemanticInfo section**

Add after `### DrawerSemanticPart`:

```md
### DrawerSemanticInfo

```ts
interface DrawerSemanticInfo {
  props: Readonly<Record<string, unknown>>
}
```
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

Expected: build completes and generated Drawer outputs include function-valued semantic hook types and runtime resolver.

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
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-semantic-functions-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-semantic-functions.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer
git diff --cached --check
git commit -m "feat: align drawer semantic functions"
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

- Spec coverage: the plan includes semantic types, runtime resolver, tests, docs, generated outputs, and merge workflow.
- Placeholder scan: no unfinished placeholders or vague implementation steps.
- Type consistency: `DrawerSemanticInfo`, `DrawerSemanticConfig`, `classNames`, and `styles` match between spec, plan, source, tests, and docs.
