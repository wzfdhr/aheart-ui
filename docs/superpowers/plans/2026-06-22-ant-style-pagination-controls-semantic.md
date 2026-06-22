# Ant Style Pagination Controls And Semantic Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Pagination control configuration, item rendering, page-size and quick-jump behavior, and semantic class/style hooks.

**Architecture:** Keep the current `pagination.vue` native-button structure. Extend `types.ts`, compute compact page items, add native size and quick-jump controls, route all changes through normalized emit helpers, and attach semantic class/style hooks to the existing elements.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `align`
- `showLessItems`
- `showSizeChanger`
- `pageSizeOptions`
- `showQuickJumper`
- functional `showTotal`
- `itemRender`
- `showSizeChange`
- `className`
- `rootClassName`
- `style`
- `classNames`
- `styles`
- docs and generated package output refresh

This plan does not cover responsive mode, locale packages, custom dropdown popups, or clickable ellipsis jump controls.

## Task 1: Write Failing Pagination Tests

**Files:**

- Modify: `packages/components/src/pagination/__tests__/pagination.test.ts`

- [ ] Add a test that `showSizeChanger` renders native page-size options, emits `update:pageSize`, emits `showSizeChange`, and emits `change`.
- [ ] Add a test that `showQuickJumper` normalizes input on Enter and the Go button.
- [ ] Add a test that `align`, `showLessItems`, and functional `showTotal` render expected classes and text.
- [ ] Add a test that `itemRender` customizes previous, next, and page item labels.
- [ ] Add a test that `className`, `rootClassName`, `style`, `classNames`, and `styles` apply to root and semantic parts.
- [ ] Run focused Pagination tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- pagination
```

Expected: FAIL before implementation.

## Task 2: Implement Pagination Controls

**Files:**

- Modify: `packages/components/src/pagination/types.ts`
- Modify: `packages/components/src/pagination/pagination.vue`
- Modify: `packages/components/src/pagination/style.css`

- [ ] Extend Pagination types for align, page-size changer, quick jumper, item render, semantic hooks, root hooks, and `showSizeChange`.
- [ ] Compute visible page items with ellipsis markers and a narrower sibling count when `showLessItems` is true.
- [ ] Normalize current page and page size through helpers before emitting.
- [ ] Render page-size select when `showSizeChanger` is true.
- [ ] Render quick-jump number input and Go button when `showQuickJumper` is true.
- [ ] Render functional `showTotal(total, range)` when `showTotal` is a function.
- [ ] Apply `itemRender` to previous, next, and page labels.
- [ ] Apply root, total, prev, next, page, activePage, sizeChanger, and quickJumper class/style hooks.
- [ ] Run focused Pagination tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- pagination
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/pagination.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add an alignment example.
- [ ] Add a page-size changer example.
- [ ] Add a quick jumper example.
- [ ] Add a custom total and itemRender example.
- [ ] Add a semantic styling example.
- [ ] Update Pagination API rows for `align`, `showLessItems`, `showSizeChanger`, `pageSizeOptions`, `showQuickJumper`, `showTotal`, `itemRender`, `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- [ ] Update Pagination Events rows for `showSizeChange`.
- [ ] Run docs build.
- [ ] Run package build.
- [ ] Commit documentation separately from generated outputs where practical.

## Task 4: Final Verification

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
test -f packages/components/es/pagination/index.d.ts && test -f packages/components/lib/pagination/index.d.ts && grep -q "PaginationItemRender" packages/components/es/pagination/types.d.ts && grep -q "PaginationItemRender" packages/components/lib/pagination/types.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo pagination-controls-semantic-build-ok
git diff --quiet -- packages/components/es/style.css packages/components/lib/style.css && echo deterministic-style-output-clean
```

Expected: all commands exit 0, the final checks print `pagination-controls-semantic-build-ok` and `deterministic-style-output-clean`, and `git status --short` is clean after generated outputs are committed.

## Self-Review

- Spec coverage: every Pagination controls, page-size, quick-jump, item-render, and semantic hook requirement from the design has a task.
- Placeholder scan: no unfinished markers or postponed requirements.
- Type consistency: prop, event, and semantic part names match the design document.
