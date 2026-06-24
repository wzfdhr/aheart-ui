# Ant Style Tooltip Destroy Alias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the deprecated `destroyTooltipOnHide` compatibility alias to Tooltip.

**Architecture:** Keep Tooltip's DOM ownership and hidden lifecycle unchanged. Add the alias prop in `types.ts`, derive a shared `shouldDestroyOnHidden` computed in `tooltip.vue`, and route the existing popup render condition through that computed value.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Tooltip Destroy Alias Test

**Files:**
- Modify: `packages/components/src/tooltip/__tests__/tooltip.test.ts`

- [x] Add a test that opens and closes a tooltip with `destroyTooltipOnHide`.
- [x] Assert the popup is removed after close.
- [x] Assert the alias is not forwarded as a DOM attribute.
- [x] Run focused Tooltip tests and confirm the new case fails before implementation.

### Task 2: Runtime And Types

**Files:**
- Modify: `packages/components/src/tooltip/types.ts`
- Modify: `packages/components/src/tooltip/tooltip.vue`

- [x] Add `destroyTooltipOnHide` to `tooltipProps`.
- [x] Add `shouldDestroyOnHidden` computed as `props.destroyOnHidden || props.destroyTooltipOnHide`.
- [x] Replace the direct `props.destroyOnHidden` read in `shouldRenderPopup` with `shouldDestroyOnHidden`.
- [x] Keep default hidden preservation and `destroyOnHidden` behavior unchanged.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/tooltip.md`
- Modify generated outputs under `packages/components/es/tooltip` and `packages/components/lib/tooltip`

- [x] Add a Tooltip API row for `destroyTooltipOnHide`.
- [x] Describe it as a compatibility alias for `destroyOnHidden`.
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
