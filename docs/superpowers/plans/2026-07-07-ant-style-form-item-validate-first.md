# Ant Style FormItem Validate First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style FormItem `validateFirst` behavior for the existing synchronous rule engine.

**Architecture:** Extend FormItem props and Form field state so registration includes each item's `validateFirst` setting. Form validation keeps the existing all-errors path by default and applies first-error reduction only for fields registered with `validateFirst`.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Tests

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test proving a normal field reports multiple synchronous rule errors.
- [x] Add a test proving `validateFirst` reports only the first synchronous rule error.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new `validateFirst` test fails because Form currently reports every failing rule.

## Task 2: Implement FormItem Validate First

**Files:**
- Modify: `packages/components/src/form/types.ts`
- Modify: `packages/components/src/form/form-item.vue`
- Modify: `packages/components/src/form/form.vue`

- [x] Add `FormValidateFirst = boolean | 'parallel'`.
- [x] Add `validateFirst` to FormItem props.
- [x] Store `validateFirst` in `FormFieldState`.
- [x] Pass `validateFirst` through `registerField`.
- [x] In `validateField`, stop collecting errors after the first failure when the field state has `validateFirst`.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [x] Add validate-first docs and the FormItem API row.
- [x] Run package build and docs build.
- [x] Remove unrelated generated declaration ordering drift if present.

## Task 4: Verify and Publish Phase

- [x] Run full component tests.
- [x] Run package typecheck.
- [x] Run package build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Commit the phase.
- [ ] Push the feature branch.
- [ ] Fast-forward merge into `master`, push `master`, and switch back.

## Self-Review

- Spec coverage: default all-error behavior and `validateFirst` first-error behavior are both covered.
- Placeholder scan: no TBD/TODO/fill-in placeholders remain.
- Type consistency: the public prop is consistently named `validateFirst`.
