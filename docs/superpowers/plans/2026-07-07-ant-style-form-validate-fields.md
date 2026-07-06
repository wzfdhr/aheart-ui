# Form Validate Fields Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose `AForm.validateFields(names?)`.

**Architecture:** Reuse the existing synchronous validation path. `validateFields(names?)` is the implementation method; existing `validate()` delegates to it for backward compatibility.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Test

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test proving `wrapper.vm.validateFields` is exposed.
- [x] Assert `validateFields(['password'])` validates only the password field.
- [x] Assert the per-field `validate` event is emitted only for the requested field.
- [x] Assert the unrequested email field error state remains empty.
- [x] Assert `validateFields()` validates all fields.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new test fails because `validateFields` is not exposed.

## Task 2: Implement Validate Fields

**Files:**
- Modify: `packages/components/src/form/form.vue`

- [x] Add a `validateFields(names?: string[])` helper.
- [x] Make `validateFields()` validate `getFieldNames()`.
- [x] Make `validateFields(names)` validate only the requested names.
- [x] Make existing `validate()` delegate to `validateFields()`.
- [x] Add `validateFields` to `defineExpose`.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [x] Add `validateFields` to the Form exposes table.
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

- Spec coverage: exposed method, subset validation, all-field validation, event behavior, docs, and verification are covered.
- Self-check: no unresolved draft markers remain.
- Type consistency: method names and signatures match the design.
