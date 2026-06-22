# Ant Style Select Controls And Semantic API Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `ASelect` with Ant-style semantic styling hooks, option field remapping, search sorting/filter-field controls, default value support, loading affordances, and configurable clear icons.

**Architecture:** Keep the native select foundation. Normalize raw options through `fieldNames`, derive a merged controlled/uncontrolled value, render semantic hooks on each stable DOM part, and keep loading/clear adornments local to the existing wrapper.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Select Tests

**Files:**
- Modify: `packages/components/src/select/__tests__/select.test.ts`

- [ ] Add tests for root and semantic `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- [ ] Add tests for `fieldNames`, `optionFilterProp`, and `filterSort`.
- [ ] Add tests for uncontrolled `defaultValue` and subsequent emitted updates.
- [ ] Add tests for `loading`, `loadingIcon`, and `loadingIcon` slot.
- [ ] Add tests for `allowClear={{ clearIcon }}` and `clearIcon` slot override.
- [ ] Run focused Select tests and confirm RED.

## Task 2: Implement Select Enhancements

**Files:**
- Modify: `packages/components/src/select/types.ts`
- Modify: `packages/components/src/select/select.vue`
- Modify: `packages/components/src/select/style.css`

- [ ] Add semantic map, field name, filter sort, and allow-clear config types.
- [ ] Normalize raw options through `fieldNames` while preserving string/number value mapping.
- [ ] Add merged controlled/uncontrolled value handling with `defaultValue`.
- [ ] Use `optionFilterProp` and `filterSort` in the search pipeline.
- [ ] Render semantic classes/styles on root, prefix, search, selector, option, not-found option, clear, suffix, and loading.
- [ ] Render loading and configurable clear icons through a local render component.
- [ ] Add CSS for loading state and semantic affordances.
- [ ] Run focused Select tests and component typecheck.
- [ ] Commit source changes.

## Task 3: Document And Build

**Files:**
- Modify: `docs/components/select.md`
- Modify generated package output under `packages/components/es`
- Modify generated package output under `packages/components/lib`

- [ ] Add docs examples for field names/filter sort, default value, loading icon, clear icon, and semantic styling.
- [ ] Update API, type, slot, event, and Semantic DOM tables.
- [ ] Run docs build.
- [ ] Run package build and commit generated outputs.
- [ ] Run full final verification:
  - `pnpm dlx pnpm@9.15.4 typecheck`
  - `pnpm dlx pnpm@9.15.4 test`
  - `pnpm dlx pnpm@9.15.4 build`
  - `pnpm dlx pnpm@9.15.4 docs:build`
- [ ] Confirm the worktree is clean.
