# Ant Style Tooltip Teleport Hover Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep hover-triggered Tooltip open when moving from trigger/root into the teleported popup.

**Architecture:** Mirror the Popover related-target handoff pattern. Tooltip keeps root, trigger, and popup refs; mouseleave closes only when the next pointer target is outside both root and popup.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Tooltip Hover Handoff Test

**Files:**
- Modify: `packages/components/src/tooltip/__tests__/tooltip.test.ts`

- [x] Add a real Teleport test that mounts Tooltip with `mouseEnterDelay: 0`, `mouseLeaveDelay: 0`, and `getPopupContainer`.
- [x] Trigger mouseenter on `.aheart-tooltip__trigger` and assert the teleported popup exists.
- [x] Trigger mouseleave from `.aheart-tooltip__trigger` with `relatedTarget` set to the teleported popup and assert the popup remains visible.
- [x] Dispatch mouseleave from the popup to `document.body` and assert the latest `openChange` event is `[false]`.
- [x] Run focused Tooltip tests and confirm they fail before implementation.

### Task 2: Tooltip Runtime Handoff

**Files:**
- Modify: `packages/components/src/tooltip/tooltip.vue`

- [x] Add `ref="rootRef"` to the root `.aheart-tooltip`.
- [x] Add `ref="popupRef"` to `.aheart-tooltip__popup`.
- [x] Add `rootRef` and `popupRef` reactive refs next to `triggerRef`.
- [x] Add `containsRelatedTarget(event, element)` helper.
- [x] Add `isHoveringTriggerOrPopup(event)` helper.
- [x] Change `handleMouseLeave` to receive `event: MouseEvent`.
- [x] Keep the existing delayed close path only when `!isHoveringTriggerOrPopup(event)`.

### Task 3: Generated Output

**Files:**
- Modify generated outputs under `packages/components/es/tooltip` and `packages/components/lib/tooltip`

- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused Tooltip tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
