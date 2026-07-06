# Form Value Setters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose `AForm.setFieldValue(name, value)` and `AForm.setFieldsValue(values)`.

**Architecture:** Reuse the current Form model-as-source-of-truth design. The setters mutate `props.model` in place and clear validation state for the written fields without emitting validation or submit events.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Test

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test proving `wrapper.vm.setFieldValue` and `wrapper.vm.setFieldsValue` are exposed.
- [x] Seed validation errors with `validateFields()`.
- [x] Assert `setFieldValue('email', 'ada@example.com')` mutates the model and clears only the email error.
- [x] Assert `setFieldsValue({ password: 'secret', admin: true })` mutates multiple keys and allows unknown model keys.
- [x] Assert setter calls do not emit new `validate` events.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new test fails because setters are not exposed.

## Task 2: Implement Value Setters

**Files:**
- Modify: `packages/components/src/form/form.vue`

- [x] Add `setFieldValue(name: string, value: unknown)`.
- [x] Make `setFieldValue` write to `props.model[name]`.
- [x] Make `setFieldValue` clear validation for that field.
- [x] Add `setFieldsValue(values: FormModel)`.
- [x] Make `setFieldsValue` write every supplied key to `props.model`.
- [x] Make `setFieldsValue` clear validation for changed keys.
- [x] Expose both methods with `defineExpose`.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [x] Add both setters to the Form exposes table.
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

- Spec coverage: exposed methods, model mutation, validation clearing, unknown keys, docs, and verification are covered.
- Self-check: no unresolved draft markers remain.
- Type consistency: setter method names and signatures match the design.
