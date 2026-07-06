# Form Instance Errors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose `AForm.getFieldError(name)` and `AForm.getFieldsError(names?)`.

**Architecture:** Reuse the existing Form `fieldStates` error storage populated by validation. These methods are readonly helpers and do not trigger validation.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Test

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test proving `wrapper.vm.getFieldError` and `wrapper.vm.getFieldsError` are exposed.
- [x] Assert both methods return empty errors before validation.
- [x] Submit the form to populate validation state.
- [x] Assert `getFieldError('email')` returns the current field errors.
- [x] Assert `getFieldsError()` returns registered field errors.
- [x] Assert `getFieldsError(['password', 'missing'])` includes `missing` with empty errors.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new test fails because the methods are not exposed.

## Task 2: Implement Error Readers

**Files:**
- Modify: `packages/components/src/form/form.vue`

- [x] Add a `getFieldError(name: string)` helper that returns a copy of `fieldStates[name]?.errors ?? []`.
- [x] Add a `getFieldsError(names?: string[])` helper.
- [x] Make the no-argument form return errors for `getFieldNames()`.
- [x] Make the array form return errors for the requested names.
- [x] Add both helpers to `defineExpose`.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [x] Add `getFieldError` and `getFieldsError` to the Form exposes table.
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

- Spec coverage: exposed error readers, empty state, validated state, requested subset behavior, docs, and verification are covered.
- Self-check: no unresolved draft markers remain.
- Type consistency: method names and signatures match the design.
