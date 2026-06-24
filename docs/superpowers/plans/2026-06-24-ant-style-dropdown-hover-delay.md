# Ant Style Dropdown Hover Delay Implementation Plan

**Goal:** Add `mouseEnterDelay` and `mouseLeaveDelay` support to Dropdown and inherited Dropdown.Button behavior.

**Architecture:** Reuse the timer-driven hover model already used by the floating family. Keep `setOpen` as the single state/emission path, and wrap it with delay-aware hover request helpers that clear pending timers on opposite movement and component teardown.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Dropdown Hover Delay Tests

**Files:**
- Modify: `packages/components/src/dropdown/__tests__/dropdown.test.ts`

- [x] Import `vi` for fake timers.
- [x] Add a test for delayed hover open and close on `ADropdown`.
- [x] Add a test proving a pending close is cancelled when the pointer returns before `mouseLeaveDelay`.
- [x] Add a `Dropdown.Button` test proving delay props are forwarded to the internal Dropdown.
- [x] Update existing immediate hover expectations to opt into `mouseEnterDelay: 0` where they intentionally assert immediate behavior.
- [x] Run focused Dropdown tests and confirm the new cases fail before implementation.

### Task 2: Runtime And Types

**Files:**
- Modify: `packages/components/src/dropdown/types.ts`
- Modify: `packages/components/src/dropdown/dropdown.vue`
- Modify: `packages/components/src/dropdown/dropdown-button.vue`

- [x] Add `mouseEnterDelay` and `mouseLeaveDelay` props with `0.1` defaults.
- [x] Expose both props through `dropdownButtonProps`.
- [x] Add hover timer refs and clear helpers in `dropdown.vue`.
- [x] Add a delay-to-ms helper that clamps negative values to immediate behavior.
- [x] Use delay-aware hover requests for hover enter and leave.
- [x] Clear pending hover timers on unmount.
- [x] Forward both props from `dropdown-button.vue` to `ADropdown`.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/dropdown.md`
- Modify generated outputs under `packages/components/es/dropdown` and `packages/components/lib/dropdown`

- [x] Document both delay props in `ADropdown` API.
- [x] Document both inherited delay props in `ADropdownButton` API.
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
