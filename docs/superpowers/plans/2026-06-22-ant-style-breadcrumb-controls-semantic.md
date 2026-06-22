# Ant Style Breadcrumb Controls And Semantic API Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `ABreadcrumb` with Ant-style render customization, path params, item callbacks, VNode content, and semantic styling hooks.

**Reference:** Ant Design Breadcrumb documentation, `https://ant.design/components/breadcrumb/`.

## Task 1: Write Failing Breadcrumb Tests

- [ ] Add tests for root/list/item/link/text/separator semantic class/style hooks.
- [ ] Add tests for VNode `title` and `separator` rendering.
- [ ] Add tests for `itemRender` arguments and output.
- [ ] Add tests for `path` + `params`, per-item class/style, and `onClick`.
- [ ] Run focused Breadcrumb tests and confirm RED.

## Task 2: Implement Breadcrumb API Enhancements

- [ ] Update `packages/components/src/breadcrumb/types.ts` with new types, props, and item fields.
- [ ] Update `packages/components/src/breadcrumb/breadcrumb.vue` with VNode rendering, semantic hooks, `itemRender`, path resolution, and click handling.
- [ ] Update `packages/components/src/breadcrumb/style.css` for custom rendered nodes and stable separator/link layout.
- [ ] Run focused Breadcrumb tests and component typecheck.
- [ ] Commit source changes.

## Task 3: Document And Build

- [ ] Update `docs/components/breadcrumb.md` with examples and API rows for the new props and item fields.
- [ ] Run docs build.
- [ ] Run package build and commit generated outputs.
- [ ] Run final verification:
  - `pnpm dlx pnpm@9.15.4 typecheck`
  - `pnpm dlx pnpm@9.15.4 test`
  - `pnpm dlx pnpm@9.15.4 build`
  - `pnpm dlx pnpm@9.15.4 docs:build`
- [ ] Confirm the worktree is clean.
