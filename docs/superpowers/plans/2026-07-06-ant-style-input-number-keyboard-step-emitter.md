# Ant-style InputNumber Keyboard Step Emitter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber keyboard step `emitter` metadata with Ant/rc InputNumber.

**Architecture:** Keep the existing `step` event shape and step flow. Only rename the keyboard-origin emitter value from `keydown` to `keyboard` in source types, runtime emit calls, docs, tests, and generated package outputs.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript prop/emit validators, Vitest, Vite package build.

---

### Task 1: Keyboard Step Emitter

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/types.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Change the focused keyboard/wheel step test to expect `{ emitter: 'keyboard' }` for ArrowUp.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current code emits `keydown`.

- [x] **Step 3: Implement minimal source change**

Update `InputNumberStepEmitter`, the step emit validator, and ArrowUp/ArrowDown calls to use `keyboard`.

- [x] **Step 4: Update docs**

Update the `step` event API row so `info.emitter` documents `handler | keyboard | wheel`.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number keyboard step emitter`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
