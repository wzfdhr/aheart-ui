# Ant-style InputNumber Control Hold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber control-button press-and-hold stepping with Ant/rc InputNumber.

**Architecture:** Keep the existing `handleStep` path as the single source for value updates and `step` metadata. Add small control-step timer helpers around the increase/decrease controls so `mousedown` performs the immediate step, delayed repeat uses the same handler emitter, and `mouseup`/`mouseleave` clears pending timers.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest fake timers, Vite package build.

---

### Task 1: Control Press-and-Hold Repeat

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [ ] **Step 1: Write the failing test**

Add a focused fake-timer test that mounts `InputNumber` with `defaultValue: 2` and `step: 2`, triggers `mousedown` on the increase control, verifies one immediate step, advances 599ms with no extra step, advances 1ms for the first repeat, advances 200ms for the next repeat, then triggers `mouseup` and verifies no further repeats.

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current controls only step on click and do not respond to held `mousedown`.

- [x] **Step 3: Implement minimal source change**

Add control-step timer helpers, wire increase/decrease controls to `mousedown`, `mouseup`, `mouseleave`, and preserve the click fallback without double stepping after a mouse press.

- [x] **Step 4: Update docs**

Document that holding the control buttons repeats stepping after the hold delay.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number control hold`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
