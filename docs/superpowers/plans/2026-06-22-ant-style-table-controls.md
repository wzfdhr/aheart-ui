# Ant Style Table Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for the source change and superpowers:verification-before-completion before reporting completion. Keep commits split by plan, source, docs, and generated build output.

**Goal:** Add Table default/controlled sorting, filters, richer change payloads, and pagination-state polish.

**Architecture:** Reuse the existing `table.vue` and `types.ts`. Introduce a small internal filter/sort state layer, derive controlled state from column config, filter before sorting, paginate after sorting, and emit Ant-like change metadata through Vue's `change` event.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `TableColumn.defaultSortOrder`
- `TableColumn.filters`
- `TableColumn.filteredValue`
- `TableColumn.defaultFilteredValue`
- `TableColumn.filterMultiple`
- `TableChangeExtra`
- Header filter controls
- richer `change` event payloads
- docs and generated package output refresh

This plan does not cover custom filter dropdown renderers, remote data adapters, row selection customization, fixed columns, virtual scrolling, or multi-sort priority.

## Task 1: Write Failing Tests

**Files:**

- Modify: `packages/components/src/table/__tests__/table.test.ts`

- [ ] Add tests for `defaultSortOrder`, controlled `sortOrder`, filter controls, single-select filters, and richer pagination `change` payloads.
- [ ] Run the focused Table tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- table
```

Expected: FAIL before implementation.

## Task 2: Implement Table Controls

**Files:**

- Modify: `packages/components/src/table/types.ts`
- Modify: `packages/components/src/table/table.vue`
- Modify: `packages/components/src/table/style.css`

- [ ] Extend table types for filter values, filter options, and `TableChangeExtra`.
- [ ] Initialize uncontrolled sort and filter state from default column config.
- [ ] Resolve controlled sort and filter state from column config on each render.
- [ ] Filter data before sorting.
- [ ] Support `sorter: true` with basic value comparison.
- [ ] Render compact header filter buttons and respect `filterMultiple: false`.
- [ ] Emit `change(pagination, filters, sorter, extra)` for sorting, filtering, and pagination.
- [ ] Reset internal pagination to page 1 when sorting or filtering changes.
- [ ] Run focused Table tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- table
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/table.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add filtering and richer control API documentation.
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
```

Expected: all pass, generated declaration files include the new Table control types, and `docs/.vitepress/dist/superpowers` is not created.
