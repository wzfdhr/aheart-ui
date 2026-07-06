# Ant-style InputNumber Composition Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber keyboard stepping with Ant/rc InputNumber during IME composition.

**Architecture:** Keep native keyboard handling in `input-number.vue`. Add a small composition state ref that is toggled by native composition events and consulted before keyboard step handling.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vite package build.

---

### Task 1: Composition Keyboard Guard

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Add a test that triggers `compositionstart`, presses `ArrowUp`, verifies there is no value or step emission, then triggers `compositionend` and verifies normal `ArrowUp` stepping resumes.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current code does not track composition state and steps on `ArrowUp` during composition.

- [x] **Step 3: Implement minimal source change**

Add `isComposing`, bind `compositionstart` and `compositionend` on the native input, and return before keyboard step handling when composition is active.

- [x] **Step 4: Update docs**

Document that keyboard stepping is ignored during IME composition.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number composition guard`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
