# Ant Style Message Controls And Semantic API Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `message` and `AMessage` with Ant-style per-notice customization, semantic styling hooks, thenable close behavior, and global mount/config controls.

**Architecture:** Keep `AMessage` as the presentational host and `service.ts` as the reactive global service. Add typed renderable notice data in `types.ts`, use a small local render component in `message.vue`, and keep timer/promise/container management inside the service.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Message Tests

**Files:**
- Modify: `packages/components/src/message/__tests__/message.test.ts`

- [ ] Add tests for VNode content, custom `icon`, notice `className`, notice `style`, and `onClick`.
- [ ] Add tests for root/notice/icon/content/close semantic `classNames` and `styles`.
- [ ] Add tests for `message.success(...).then(afterClose)` resolving after the notice closes.
- [ ] Add tests for `message.config({ getContainer, prefixCls, rtl })`.
- [ ] Add tests for `pauseOnHover` preserving the notice while hovered and closing after hover leaves.
- [ ] Run focused Message tests and confirm RED.

## Task 2: Implement Message Enhancements

**Files:**
- Modify: `packages/components/src/message/types.ts`
- Modify: `packages/components/src/message/message.vue`
- Modify: `packages/components/src/message/service.ts`
- Modify: `packages/components/src/message/style.css`

- [ ] Add `MessageKey`, renderable content/icon types, semantic map types, and new config fields.
- [ ] Render Vue children for content and icon through a local render component.
- [ ] Apply per-notice `className`, `style`, `onClick`, `classNames`, and `styles`.
- [ ] Add thenable handle support that resolves once per notice close path.
- [ ] Add `getContainer`, `prefixCls`, `rtl`, and `pauseOnHover` global config handling.
- [ ] Add pause/resume timer bookkeeping for hover pause.
- [ ] Add CSS for RTL state and custom prefix class compatibility.
- [ ] Run focused Message tests and component typecheck.
- [ ] Commit source changes.

## Task 3: Document And Build

**Files:**
- Modify: `docs/components/message.md`
- Modify generated package output under `packages/components/es`
- Modify generated package output under `packages/components/lib`

- [ ] Add docs examples for custom style/icon, promise interface, custom container, and semantic styling.
- [ ] Update Service API, `MessageOpenConfig`, `MessageGlobalConfig`, `AMessage API`, and Semantic DOM tables.
- [ ] Run docs build.
- [ ] Run package build and commit generated outputs.
- [ ] Run full final verification:
  - `pnpm dlx pnpm@9.15.4 typecheck`
  - `pnpm dlx pnpm@9.15.4 test`
  - `pnpm dlx pnpm@9.15.4 build`
  - `pnpm dlx pnpm@9.15.4 docs:build`
- [ ] Confirm the worktree is clean.
