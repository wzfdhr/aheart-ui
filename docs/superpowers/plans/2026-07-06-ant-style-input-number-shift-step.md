# Ant-style InputNumber Shift Step Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber Shift + keyboard stepping with Ant/rc InputNumber.

**Architecture:** Keep the existing `handleKeydown` and `handleStep` flow. Compute a keyboard step multiplier from `event.shiftKey`, pass the multiplied offset into `handleStep`, and use a multiplied string step for `stringMode` so high-precision string stepping remains decimal-safe.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vite package build.

---

### Task 1: Shift Keyboard Step

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Add a focused test that mounts `InputNumber` with `modelValue: 2` and `step: 2`, triggers `keydown` with `{ key: 'ArrowUp', shiftKey: true }`, then expects `update:modelValue` to emit `22` and `step` to emit `{ offset: 20, type: 'up', emitter: 'keyboard' }`.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current code emits normal step `4` and offset `2`.

- [x] **Step 3: Implement minimal source change**

Add decimal-safe 10x step calculation and pass the 10x offset from Shift + ArrowUp/ArrowDown.

- [x] **Step 4: Update docs**

Document that holding Shift while using keyboard arrows applies a 10x step.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number shift step`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
