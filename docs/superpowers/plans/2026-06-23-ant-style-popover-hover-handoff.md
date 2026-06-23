# Ant Style Popover Teleport Hover Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep hover-triggered Popover open when moving from trigger/root into the teleported popup.

**Architecture:** Mirror the already-proven Dropdown and Popconfirm related-target handoff pattern. Popover keeps root, trigger, and popup refs; mouseleave closes only when the next pointer target is outside both root and popup.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Popover Hover Handoff Test

**Files:**
- Modify: `packages/components/src/popover/__tests__/popover.test.ts`

- [x] Add a real Teleport test that mounts Popover with `trigger: 'hover'`, `mouseEnterDelay: 0`, `mouseLeaveDelay: 0`, and `getPopupContainer`.
- [x] Trigger mouseenter on `.aheart-popover__trigger` and assert the teleported popup exists.
- [x] Trigger mouseleave from `.aheart-popover__trigger` with `relatedTarget` set to the teleported popup and assert the popup remains visible.
- [x] Dispatch mouseleave from the popup to `document.body` and assert the latest `openChange` event is `[false]`.
- [x] Run focused Popover tests and confirm they fail before implementation.

### Task 2: Popover Runtime Handoff

**Files:**
- Modify: `packages/components/src/popover/popover.vue`

- [x] Add `ref="rootRef"` to the root `.aheart-popover`.
- [x] Add `ref="popupRef"` to `.aheart-popover__popup`.
- [x] Add `rootRef` and `popupRef` reactive refs next to `triggerRef`.
- [x] Add `containsRelatedTarget(event, element)` helper.
- [x] Add `isHoveringTriggerOrPopup(event)` helper.
- [x] Change `handleMouseLeave` to receive `event: MouseEvent`.
- [x] Keep the existing timer clearing and delayed close path only when `!isHoveringTriggerOrPopup(event)`.

### Task 3: Generated Output

**Files:**
- Modify generated outputs under `packages/components/es/popover` and `packages/components/lib/popover`

- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused Popover tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
