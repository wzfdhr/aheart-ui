# Ant Style Dropdown Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Ant-style `Dropdown.Button` split-button compatibility component.

**Architecture:** Implement `dropdown-button.vue` as a composition wrapper around existing `AButton` and `ADropdown`. Keep menu, overlay, Teleport, hidden lifecycle, popup render aliases, and arrow behavior inside `ADropdown`; the new component only owns split-button structure, button props, and export wiring.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Dropdown Button Tests

**Files:**
- Modify: `packages/components/src/dropdown/__tests__/dropdown.test.ts`

- [x] Import `DropdownButton` from `../index`.
- [x] Assert `(Dropdown as any).Button` equals `DropdownButton`.
- [x] Add a test that mounts `DropdownButton` with `menu`, `trigger: ['click']`, and a default slot.
- [x] Assert the split root, main button, toggle button, and menu overlay render.
- [x] Assert clicking the main button emits `click`.
- [x] Assert clicking the toggle opens the dropdown and forwards overlay class/style props.
- [x] Add a loading/disabled test that proves the toggle does not open when disabled by `loading`.
- [x] Add a `buttonsRender` test that receives two nodes and can reverse them.
- [x] Run focused Dropdown tests and confirm they fail before implementation.

### Task 2: Dropdown Button Runtime And Types

**Files:**
- Modify: `packages/components/src/dropdown/types.ts`
- Create: `packages/components/src/dropdown/dropdown-button.vue`
- Modify: `packages/components/src/dropdown/style.css`

- [x] Add `DropdownButtonRender`, `DropdownButtonProps`, and emit validators.
- [x] Implement `dropdown-button.vue` with a root `.aheart-dropdown-button`.
- [x] Render the left `AButton` with slot content and primary button props.
- [x] Render the right `AButton` inside `ADropdown` and use `icon` or the default chevron.
- [x] Forward dropdown props to `ADropdown`.
- [x] Emit `click`, `openChange`, `update:open`, and `menuClick`.
- [x] Apply split-button CSS without changing standalone Dropdown styling.

### Task 3: Exports, Docs, And Generated Output

**Files:**
- Modify: `packages/components/src/dropdown/index.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `docs/components/dropdown.md`
- Modify generated outputs under `packages/components/es` and `packages/components/lib`

- [x] Attach `Dropdown.Button = DropdownButton`.
- [x] Export `DropdownButton` and `ADropdownButton` from the dropdown module.
- [x] Install and export `DropdownButton` from the package entry.
- [x] Document the split-button examples, API, and events.
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
