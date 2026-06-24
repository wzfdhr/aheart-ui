# Ant Style Dropdown Auto Adjust Overflow Implementation Plan

**Goal:** Add `autoAdjustOverflow` support to Dropdown and inherited Dropdown.Button behavior.

**Architecture:** Keep Dropdown's existing CSS placement classes and add a small runtime resolver that selects an effective placement after the overlay is rendered. The resolver reads trigger and overlay bounding boxes, flips vertical direction when needed, adjusts horizontal alignment when the popup would overflow, and leaves the configured placement intact when adjustment is disabled.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Dropdown Overflow Adjustment Tests

**Files:**
- Modify: `packages/components/src/dropdown/__tests__/dropdown.test.ts`

- [x] Add DOMRect and viewport helpers for deterministic overflow tests.
- [x] Add a test proving `placement="bottomLeft"` flips to `topLeft` when the popup cannot fit below the trigger.
- [x] Add a test proving `autoAdjustOverflow={false}` keeps `bottomLeft` in the same geometry.
- [x] Add a Dropdown.Button test proving `autoAdjustOverflow` is forwarded to the internal Dropdown.
- [x] Run focused Dropdown tests and confirm the new adjustment case fails before implementation.

### Task 2: Runtime And Types

**Files:**
- Modify: `packages/components/src/dropdown/types.ts`
- Modify: `packages/components/src/dropdown/dropdown.vue`
- Modify: `packages/components/src/dropdown/dropdown-button.vue`

- [x] Add `autoAdjustOverflow` to `dropdownProps` with default `true`.
- [x] Expose `autoAdjustOverflow` through `dropdownButtonProps`.
- [x] Add `effectivePlacement` state initialized from `props.placement`.
- [x] Use `effectivePlacement` in overlay classes and `DropdownSemanticInfo`.
- [x] Add helpers for viewport size, placement vertical side, placement alignment, and placement reconstruction.
- [x] Add a resolver that flips top/bottom and adjusts Left/Right alignment from measured bounding boxes.
- [x] Schedule placement adjustment with `nextTick` after open state or relevant props change.
- [x] Forward `autoAdjustOverflow` from `dropdown-button.vue` to `ADropdown`.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/dropdown.md`
- Modify generated outputs under `packages/components/es/dropdown` and `packages/components/lib/dropdown`

- [x] Document `autoAdjustOverflow` in `ADropdown` API.
- [x] Document inherited `autoAdjustOverflow` in `ADropdownButton` API.
- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused Dropdown tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
