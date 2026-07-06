# FormItem Message Variable Escape Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style escaped message variable syntax for FormItem validation messages.

**Architecture:** Keep FormItem registration unchanged. Change only the Form validation interpolation helper so escaped `\\${key}` placeholders are emitted as literal `${key}` while unescaped placeholders continue to interpolate from field and rule variables.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Test

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] Add a test proving `${label}` interpolates and `\\${label}` remains literal in the same failed rule message.
- [x] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [x] Confirm the new test fails because the escaped placeholder is currently converted.

## Task 2: Implement Escape Handling

**Files:**
- Modify: `packages/components/src/form/form.vue`

- [x] Update `interpolateMessage` to match an optional leading backslash before `${key}`.
- [x] Return `${key}` unchanged, without the escape backslash, when the token was escaped.
- [x] Keep unknown unescaped variables resolving to an empty string.
- [x] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [x] Add escape syntax to the message variables demo and prose note.
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

- Spec coverage: escaped placeholder behavior is covered by a failing test, implementation task, and docs task.
- Placeholder scan: no TBD/TODO/fill-in placeholders remain.
- Type consistency: no public type names change in this slice.
