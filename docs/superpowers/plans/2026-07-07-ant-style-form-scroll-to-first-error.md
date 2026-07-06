# Form Scroll To First Error Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `AForm` `scrollToFirstError` behavior for submit validation failures.

**Architecture:** Keep validation data flow unchanged. Add a form element ref and a small helper that finds the first failed field's mounted `[data-name]` element under the form root and calls `scrollIntoView`.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Test

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test proving failed submit with `scrollToFirstError` scrolls the first invalid FormItem.
- [x] Assert `finishFailed` payloads remain unchanged.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new test fails because `scrollIntoView` is not called.

## Task 2: Implement Form Scroll To First Error

**Files:**
- Modify: `packages/components/src/form/types.ts`
- Modify: `packages/components/src/form/form.vue`

- [x] Add `FormScrollToFirstError = boolean | ScrollIntoViewOptions`.
- [x] Add `scrollToFirstError` to `formProps`.
- [x] Add a root form ref.
- [x] Add a helper that finds the first matching descendant by `data-name` and calls `scrollIntoView`.
- [x] Call the helper after failed submit when `scrollToFirstError` is truthy.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [x] Add a `scroll-to-first-error` docs example and API row.
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

- Spec coverage: prop shape, failed-submit behavior, payload preservation, docs, and verification are covered.
- Placeholder scan: no TBD/TODO/fill-in placeholders remain.
- Type consistency: the public prop is consistently named `scrollToFirstError`.
