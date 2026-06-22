# Ant Style Descriptions Semantic API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design style semantic class and style hooks to `ADescriptions`, plus missing item configuration such as `colon`, item styles, and `span="filled"`.

**Architecture:** Extend the existing Descriptions component in place. The current CSS-grid row packing remains the rendering model; new props are layered onto the root, structural wrappers, and each item without changing the public basics that already work.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `ADescriptions` `className`, `rootClassName`, and `style`.
- `ADescriptions` `classNames` and `styles`.
- Semantic keys `root`, `header`, `title`, `extra`, `table`, `row`, `item`, `label`, and `content`.
- `ADescriptions` `colon`, `labelStyle`, and `contentStyle`.
- `DescriptionItem` `key`, `children`, `className`, `style`, `labelStyle`, `contentStyle`, and `span="filled"`.
- Docs and generated `es` / `lib` outputs.

This plan does not implement responsive breakpoint `column` objects.

## Files

- Modify: `packages/components/src/descriptions/types.ts`
- Modify: `packages/components/src/descriptions/descriptions.vue`
- Modify: `packages/components/src/descriptions/style.css`
- Modify: `packages/components/src/descriptions/__tests__/descriptions.test.ts`
- Modify: `docs/components/descriptions.md`
- Generated after build: `packages/components/es/descriptions/*`
- Generated after build: `packages/components/lib/descriptions/*`
- Generated after build: `packages/components/es/style.css`
- Generated after build: `packages/components/lib/style.css`

## Task 1: Write Failing Descriptions Tests

- [ ] **Step 1: Add semantic API tests in `packages/components/src/descriptions/__tests__/descriptions.test.ts`**

Add tests that verify:

- Root `className`, `rootClassName`, `style`, `classNames.root`, `styles.root`, and the column CSS variable merge.
- `header`, `title`, `extra`, `table`, `row`, `item`, `label`, and `content` semantic classes and styles.
- Global `labelStyle` and `contentStyle` apply to all rendered items.

- [ ] **Step 2: Add item metadata and colon tests**

Add tests that verify:

- `span="filled"` fills the remaining columns in the current row.
- Item `key`, `children`, `className`, `style`, `labelStyle`, and `contentStyle` are supported.
- `colon={false}` removes the colon class from labels, while the default includes it.

- [ ] **Step 3: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- descriptions
```

Expected: the new tests fail because the semantic and item configuration props are not implemented.

## Task 2: Implement Descriptions Semantic APIs

- [ ] **Step 1: Extend `packages/components/src/descriptions/types.ts`**

Add `StyleValue` import and these types:

```ts
export type DescriptionItemSpan = number | 'filled'
export type DescriptionsSemanticPart =
  | 'root'
  | 'header'
  | 'title'
  | 'extra'
  | 'table'
  | 'row'
  | 'item'
  | 'label'
  | 'content'
export type DescriptionsClassNames = Partial<Record<DescriptionsSemanticPart, string>>
export type DescriptionsStyles = Partial<Record<DescriptionsSemanticPart, StyleValue>>
```

Add root props and extend `DescriptionItem` with item-level metadata and style hooks.

- [ ] **Step 2: Update `packages/components/src/descriptions/descriptions.vue`**

Apply root, structural, and item semantic classes and styles. Preserve size, layout, bordered, and column CSS behavior. Add helpers for item key, item content, item span packing, and merged label/content styles.

- [ ] **Step 3: Update `packages/components/src/descriptions/style.css`**

Add colon marker styling through `.aheart-descriptions__label.has-colon::after`. Keep bordered and vertical layouts visually stable.

- [ ] **Step 4: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- descriptions
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: targeted Descriptions tests and package typecheck pass.

## Task 3: Document And Build

- [ ] **Step 1: Update `docs/components/descriptions.md`**

Add semantic styling and `span="filled"` examples, API rows, item API rows, and a Semantic DOM table.

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

Expected: Descriptions `es` / `lib` outputs and aggregate CSS update.

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
