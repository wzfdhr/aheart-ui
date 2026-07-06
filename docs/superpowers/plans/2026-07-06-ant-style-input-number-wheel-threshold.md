# Ant-style InputNumber Wheel Threshold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber mouse wheel stepping threshold with Ant/rc InputNumber.

**Architecture:** Keep `handleWheel` as the single wheel entry point. Add small wheel delta helpers and refs for accumulated delta and timestamp so wheel events reuse the existing `handleStep` path only after crossing the rc-compatible threshold.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vite package build.

---

### Task 1: Wheel Delta Threshold

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Update the wheel tests so `deltaY: -99` does not emit, a following `deltaY: -1` emits an up wheel step, and `deltaY: 100` emits a down wheel step.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current code steps on the first non-zero wheel delta.

- [x] **Step 3: Implement minimal source change**

Add rc-compatible constants, `deltaMode` conversion, accumulated wheel delta refs, direction reset, stale reset, threshold check, and leftover delta preservation.

- [x] **Step 4: Update docs**

Document that wheel stepping uses accumulated wheel distance.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number wheel threshold`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
