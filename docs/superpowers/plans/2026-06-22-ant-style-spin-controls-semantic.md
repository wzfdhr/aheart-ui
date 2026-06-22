# Ant Style Spin Controls And Semantic API Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `ASpin` with Ant-style delay, indicator, fullscreen, percent, wrapper class, and semantic styling hooks.

**Architecture:** Keep `ASpin` as one focused feedback component. Add typed config props in `types.ts`, visible-state and render helpers in `spin.vue`, and style the standalone, nested, and fullscreen states through local CSS.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Spin Tests

**Files:**
- Modify: `packages/components/src/spin/__tests__/spin.test.ts`

- [ ] Add tests for root `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- [ ] Add tests for `wrapperClassName`, nested section hooks, and content container hooks.
- [ ] Add tests for `indicator`, `percent`, and `fullscreen`.
- [ ] Add tests for `delay` using fake timers.
- [ ] Add a regression assertion that `spinning=false` hides the indicator and leaves content unblurred.
- [ ] Run focused Spin tests and confirm RED.

## Task 2: Implement Spin Enhancements

**Files:**
- Modify: `packages/components/src/spin/types.ts`
- Modify: `packages/components/src/spin/spin.vue`
- Modify: `packages/components/src/spin/style.css`

- [ ] Add `SpinPercent`, `SpinIndicator`, semantic map types, and new props.
- [ ] Add local render support for VNode or function-based `indicator`.
- [ ] Add delayed visible state with timer cleanup when `spinning` or `delay` changes.
- [ ] Render standalone, nested, and fullscreen classes while preserving existing class names.
- [ ] Apply semantic class/style hooks to root, section, indicator, dot, tip, percent, and container.
- [ ] Add CSS for fullscreen overlay, percent text, custom indicator alignment, and delayed hidden state.
- [ ] Run focused Spin tests and component typecheck.
- [ ] Commit source changes.

## Task 3: Document And Build

**Files:**
- Modify: `docs/components/spin.md`
- Modify generated package output under `packages/components/es`
- Modify generated package output under `packages/components/lib`

- [ ] Add docs examples for delayed loading, custom indicator, fullscreen, percent, and semantic styling.
- [ ] Update API tables for new props and Semantic DOM.
- [ ] Run docs build.
- [ ] Run package build and commit generated outputs.
- [ ] Run full final verification:
  - `pnpm dlx pnpm@9.15.4 typecheck`
  - `pnpm dlx pnpm@9.15.4 test`
  - `pnpm dlx pnpm@9.15.4 build`
  - `pnpm dlx pnpm@9.15.4 docs:build`
- [ ] Confirm the worktree is clean.
