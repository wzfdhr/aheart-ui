# Ant Style Popconfirm Semantic Functions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add function-form semantic `classNames` and `styles` hooks to Popconfirm.

**Architecture:** Keep Popconfirm's DOM, Teleport, triggers, buttons, events, and floating behavior unchanged. Add a small resolver in `popconfirm.vue` that normalizes object or function semantic maps, then reuse the resolved maps everywhere current object maps are read. The function receives the visible state and effective placement so adjusted floating placement is available to callers.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Popconfirm Semantic Function Test

**Files:**
- Modify: `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`

- [x] Add a test that passes function-form `classNames` and `styles` to `APopconfirm`.
- [x] Assert the function receives `{ open: true, placement: 'bottom' }` after top placement is overflow-adjusted.
- [x] Assert returned classes/styles apply to root, trigger, popup, container, arrow, message, icon, text, title, description, actions, cancel button, and OK button.
- [x] Run focused Popconfirm tests and confirm the new case fails before implementation.

### Task 2: Runtime And Types

**Files:**
- Modify: `packages/components/src/popconfirm/types.ts`
- Modify: `packages/components/src/popconfirm/popconfirm.vue`

- [x] Add `PopconfirmSemanticInfo`, `PopconfirmSemanticClassNames`, and `PopconfirmSemanticStyles` aliases.
- [x] Redefine `PopconfirmClassNames` and `PopconfirmStyles` to support object or function forms.
- [x] Add a `semanticInfo` computed with `open` and effective `placement`.
- [x] Add resolver computed values for object/function semantic maps.
- [x] Replace direct `props.classNames?.part` and `props.styles?.part` reads with resolved map reads.
- [x] Keep overlay alias ordering unchanged.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/popconfirm.md`
- Modify generated outputs under `packages/components/es/popconfirm` and `packages/components/lib/popconfirm`

- [x] Update Popconfirm API rows for `classNames` and `styles` to include function forms.
- [x] Document `PopconfirmSemanticInfo` with `open` and `placement`.
- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused Popconfirm tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
