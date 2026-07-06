# Form Instance Values Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose `AForm.getFieldValue(name)` and `AForm.getFieldsValue(names?)`.

**Architecture:** Reuse the existing Form `model` prop and registered field-name discovery. These methods are readonly helpers; they do not mutate values or introduce an internal form store.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Test

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test proving `wrapper.vm.getFieldValue` and `wrapper.vm.getFieldsValue` are exposed.
- [x] Assert `getFieldValue('email')` returns the current model field value.
- [x] Assert `getFieldsValue()` returns registered FormItem values.
- [x] Assert `getFieldsValue(['password', 'missing'])` returns the requested subset, including `missing: undefined`.
- [x] Assert `getFieldsValue(true)` returns a shallow clone of the complete model.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new test fails because the methods are not exposed.

## Task 2: Implement Value Readers

**Files:**
- Modify: `packages/components/src/form/form.vue`

- [x] Add a `getFieldValue(name: string)` helper that returns `props.model[name]`.
- [x] Add a `getFieldsValue(names?: string[] | true)` helper.
- [x] Make the no-argument form return values for `getFieldNames()`.
- [x] Make the array form return values for the requested names.
- [x] Make the `true` form return `cloneValues()`.
- [x] Add both helpers to `defineExpose`.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [x] Add `getFieldValue` and `getFieldsValue` to the Form exposes table.
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

- Spec coverage: exposed value readers, field subset behavior, full-model behavior, docs, and verification are covered.
- Self-check: no unresolved draft markers remain.
- Type consistency: method names and signatures match the design.
