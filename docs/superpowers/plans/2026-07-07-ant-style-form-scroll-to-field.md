# Form Scroll To Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose `AForm.scrollToField(name, options?)`.

**Architecture:** Reuse the Form root ref and data-name lookup used by `scrollToFirstError`. Public `scrollToField` accepts a string field name and optional `ScrollIntoViewOptions`, then forwards to the target FormItem element's `scrollIntoView`.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Test

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test proving `wrapper.vm.scrollToField` is exposed.
- [x] Assert it scrolls the matching field and forwards `ScrollIntoViewOptions`.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new test fails because `scrollToField` did not forward options before implementation.

## Task 2: Implement Exposed Method

**Files:**
- Modify: `packages/components/src/form/form.vue`

- [x] Update `scrollToField` to accept optional `ScrollIntoViewOptions`.
- [x] Forward provided options to `scrollIntoView(options)`.
- [x] Make `scrollToFirstError` pass prop options into `scrollToField`.
- [x] Add `scrollToField` to `defineExpose`.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [x] Add `scrollToField` to the Form exposes table.
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

- Spec coverage: exposed method, options forwarding, docs, and verification are covered.
- Self-check: no unresolved draft markers remain.
- Type consistency: the exposed method is consistently named `scrollToField`.
