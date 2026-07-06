# FormItem Help Extra Renderables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render `AFormItem` `help` and `extra` props as Vue renderable nodes while preserving slot priority and validation fallback behavior.

**Architecture:** Reuse Form's existing `FormRenderable` type and local render-node helper. Broaden the two prop types, replace text interpolation with helper rendering, and use explicit renderable-presence checks.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Add Failing FormItem Tests

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] **Step 1: Write failing tests**

Add tests that mount `FormItem` with VNode `help` and `extra`, numeric `0` help and extra, and a parent Form validation fallback.

- [x] **Step 2: Run focused Form tests**

Run: `CI=true corepack pnpm --filter ./packages/components test -- form`

Expected before implementation: the VNode or numeric help/extra cases fail because current props and visibility checks are string-only/truthy.

### Task 2: Render Help And Extra Nodes

**Files:**
- Modify: `packages/components/src/form/types.ts`
- Modify: `packages/components/src/form/form-item.vue`

- [x] **Step 1: Update prop typing**

Change `help` and `extra` from `String` to `PropType<FormRenderable>` using the same accepted runtime prop constructors as `label`.

- [x] **Step 2: Update visibility and rendering**

Render help and extra fallbacks with `AFormItemRenderNode`. Add a `hasRenderableContent` helper that treats `0` as renderable and hides `undefined`, `null`, `false`, and empty strings. Keep validation error fallback when explicit `help` is absent.

- [x] **Step 3: Run focused Form tests**

Run: `CI=true corepack pnpm --filter ./packages/components test -- form`

Expected after implementation: all Form tests pass.

### Task 3: Update Docs And Generated Output

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/*`
- Generated: `packages/components/lib/form/*`

- [x] **Step 1: Update docs**

Show renderable `help` and `extra` in the basic Form demo. Change FormItem API rows for `help` and `extra` to `VNodeChild`.

- [x] **Step 2: Refresh generated output**

Run the component build and keep only Form-related generated output.

### Task 4: Verify And Integrate

- [x] **Step 1: Run verification**

Run focused Form tests, full component tests, component typecheck, component build, docs build, `git diff --check`, and an HTTP check for the Form docs page.

- [ ] **Step 2: Commit and integrate**

Stage only this phase's files, commit with `feat: render form item help extra`, push `codex/consolidated-ant-style-foundation`, fast-forward merge into `master`, push `master`, then switch back to the feature branch.
