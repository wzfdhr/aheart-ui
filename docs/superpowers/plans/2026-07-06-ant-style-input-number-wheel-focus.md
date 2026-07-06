# Ant-style InputNumber Wheel Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber `changeOnWheel` stepping with Ant/rc focus-gated wheel behavior.

**Architecture:** Keep `handleWheel` as the single wheel event path. Add a focus-state ref that is toggled by native focus/blur handlers and checked before wheel delta accumulation.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vite package build.

---

### Task 1: Focus-gated Wheel Stepping

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Update wheel tests so an unfocused wheel event does not emit, focus enables wheel stepping, and blur disables wheel stepping again.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current code steps on wheel events regardless of focus state.

- [x] **Step 3: Implement minimal source change**

Add `isFocused`, bind native `focus`, set it false in blur, and return early from `handleWheel` when the input is not focused.

- [x] **Step 4: Update docs**

Document that wheel stepping is active only while the input is focused.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number wheel focus`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
