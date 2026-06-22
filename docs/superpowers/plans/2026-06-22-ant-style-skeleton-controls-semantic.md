# Ant Style Skeleton Controls And Semantic API Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `ASkeleton` with Ant-style button/input/image/node placeholders and semantic styling hooks.

**Architecture:** Keep `ASkeleton` as one focused placeholder component. Add typed config objects and computed render state in `skeleton.vue`, then style all parts through local CSS and semantic `classNames` / `styles` maps.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Skeleton Tests

**Files:**
- Modify: `packages/components/src/skeleton/__tests__/skeleton.test.ts`

- [ ] Add tests for root `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- [ ] Add tests for `button`, `input`, `image`, and `node` placeholder rendering.
- [ ] Add tests for local `active` overrides when root `active=false`.
- [ ] Add a regression assertion that `loading=false` still renders slot content only.
- [ ] Run focused Skeleton tests and confirm RED.

## Task 2: Implement Skeleton Enhancements

**Files:**
- Modify: `packages/components/src/skeleton/types.ts`
- Modify: `packages/components/src/skeleton/skeleton.vue`
- Modify: `packages/components/src/skeleton/style.css`

- [ ] Add new Skeleton config types and props.
- [ ] Add render helpers for CSS values and active state.
- [ ] Render semantic hooks on root, avatar, content, title, paragraph, paragraph rows, button, input, image, and node.
- [ ] Add CSS for button/input/image/node placeholders and active animations.
- [ ] Run focused Skeleton tests and component typecheck.
- [ ] Commit source changes.

## Task 3: Document And Build

**Files:**
- Modify: `docs/components/skeleton.md`
- Modify generated package output under `packages/components/es`
- Modify generated package output under `packages/components/lib`

- [ ] Add docs examples for button/input/image/node and semantic styling.
- [ ] Update API tables for new props, config types, and Semantic DOM.
- [ ] Run docs build.
- [ ] Run package build and commit generated outputs.
- [ ] Run full final verification:
  - `pnpm dlx pnpm@9.15.4 typecheck`
  - `pnpm dlx pnpm@9.15.4 test`
  - `pnpm dlx pnpm@9.15.4 build`
  - `pnpm dlx pnpm@9.15.4 docs:build`
- [ ] Confirm the worktree is clean.
