# Ant Style InputNumber Change On Blur Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `changeOnBlur` commit timing to `AInputNumber`.

**Architecture:** Keep the existing InputNumber SFC and value parser path. Add a pending typed-input buffer used only when `changeOnBlur` is true, commit it on blur or Enter, and preserve immediate step behavior.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Failing Tests

**Files:**

- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`

- [x] Add a test named `defers typed changes until blur by default`.
- [x] Add a test named `emits typed changes immediately when changeOnBlur is false`.
- [x] Update existing immediate typed-input tests to pass `changeOnBlur: false` where they are not testing blur commit behavior.
- [x] Run focused InputNumber tests and confirm the new default blur test fails before implementation.

Command:

```bash
cd packages/components
../../node_modules/.bin/vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts
```

Expected RED result: the default blur test fails because typed input emits immediately.

## Task 2: Runtime and Types

**Files:**

- Modify: `packages/components/src/input-number/types.ts`
- Modify: `packages/components/src/input-number/input-number.vue`

- [x] Add `changeOnBlur` prop with default `true`.
- [x] Extract typed-input parsing to a reusable helper.
- [x] Add pending typed-input refs for raw text, parsed value, and validity.
- [x] In `handleInput`, defer valid candidates when `changeOnBlur` is true and emit immediately when false.
- [x] Commit pending input from `handleBlur` and Enter key.
- [x] Use a pending valid candidate as the step base before immediate step commits.
- [x] Run focused InputNumber tests and confirm green.

## Task 3: Docs and Generated Output

**Files:**

- Modify: `docs/components/input-number.md`
- Generated: `packages/components/es/input-number/**`
- Generated: `packages/components/lib/input-number/**`

- [x] Add a `changeOnBlur` example and API row.
- [x] Run package build to refresh generated InputNumber output.

## Task 4: Verification and GitHub Integration

- [x] Run focused InputNumber tests.
- [x] Run component typecheck.
- [x] Run all component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage only this phase's files.
- [ ] Commit with `feat: align input number change on blur`.
- [ ] Push `codex/consolidated-ant-style-foundation`.
- [ ] Fast-forward merge into `master`.
- [ ] Push `master`.
- [ ] Switch back to `codex/consolidated-ant-style-foundation`.
- [ ] Confirm the demo server still returns HTTP 200.

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: `changeOnBlur`, event payloads, and docs names match the design.
