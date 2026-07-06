# Ant Style FormItem Hidden Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style FormItem `hidden` behavior while preserving validation registration.

**Architecture:** Extend FormItem props in `types.ts`, hide the root FormItem with `v-show` and a state class in `form-item.vue`, add a small CSS rule for the class, document the prop, and refresh generated package output.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Tests

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test that `hidden` renders `aheart-form-item--hidden` and inline `display: none`.
- [x] Add a test that a hidden named FormItem with required rules still emits `finishFailed`.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new tests fail because `hidden` is not implemented as a FormItem prop/state.

## Task 2: Implement FormItem Hidden

**Files:**
- Modify: `packages/components/src/form/types.ts`
- Modify: `packages/components/src/form/form-item.vue`
- Modify: `packages/components/src/form/style.css`

- [x] Add the `hidden` Boolean prop to FormItem props.
- [x] Add `v-show="!hidden"` to the FormItem root.
- [x] Add `aheart-form-item--hidden` to `formItemClass`.
- [x] Add a CSS rule for `.aheart-form-item--hidden`.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`
- Generated: `packages/components/es/style.css`
- Generated: `packages/components/lib/style.css`

- [x] Add hidden field docs and the FormItem API row.
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

- Spec coverage: both visual hiding and continued validation are covered.
- Placeholder scan: no TBD/TODO/fill-in placeholders remain.
- Type consistency: the public prop is consistently named `hidden`.
