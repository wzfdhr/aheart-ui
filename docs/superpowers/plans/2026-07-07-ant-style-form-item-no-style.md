# Ant Style FormItem No Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style FormItem `noStyle` behavior while preserving validation registration.

**Architecture:** Extend FormItem props in `types.ts`, branch the FormItem template so `noStyle` renders only the default slot, document the prop, and refresh generated package output.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Tests

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test that `noStyle` renders the default slot while omitting `.aheart-form-item`.
- [x] Add a test that a no-style named FormItem with required rules still emits `finishFailed`.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new tests fail because `noStyle` is not implemented as a FormItem prop/template branch.

## Task 2: Implement FormItem No Style

**Files:**
- Modify: `packages/components/src/form/types.ts`
- Modify: `packages/components/src/form/form-item.vue`

- [x] Add the `noStyle` Boolean prop to FormItem props.
- [x] Render only the default slot when `noStyle` is true.
- [x] Keep registration, validation, and unregistration logic unchanged.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [x] Add no-style field docs and the FormItem API row.
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

- Spec coverage: both structural no-style rendering and continued validation are covered.
- Placeholder scan: no TBD/TODO/fill-in placeholders remain.
- Type consistency: the public prop is consistently named `noStyle`.
