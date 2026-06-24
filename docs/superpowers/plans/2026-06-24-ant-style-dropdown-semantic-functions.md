# Ant Style Dropdown Semantic Functions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add function-form semantic `classNames` and `styles` hooks to Dropdown.

**Architecture:** Keep Dropdown's DOM and overlay behavior unchanged. Add a small resolver in `dropdown.vue` that normalizes object or function semantic maps, then reuse the resolved maps everywhere current object maps are read.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Dropdown Semantic Function Tests

**Files:**
- Modify: `packages/components/src/dropdown/__tests__/dropdown.test.ts`

- [x] Add a test that passes function-form `classNames` and `styles` to `ADropdown`.
- [x] Assert the function receives `{ open: true, placement: 'topRight' }`.
- [x] Assert returned classes/styles apply to root, trigger, popup, menu, and arrow.
- [x] Add a `DropdownButton` assertion proving function-form popup hooks are forwarded to the internal Dropdown.
- [x] Run focused Dropdown tests and confirm the new cases fail before implementation.

### Task 2: Runtime And Types

**Files:**
- Modify: `packages/components/src/dropdown/types.ts`
- Modify: `packages/components/src/dropdown/dropdown.vue`

- [x] Add `DropdownSemanticInfo`, `DropdownSemanticClassNames`, and `DropdownSemanticStyles` aliases.
- [x] Redefine `DropdownClassNames` and `DropdownStyles` to support object or function forms.
- [x] Add a `semanticInfo` computed with `open` and `placement`.
- [x] Add a resolver helper for object/function semantic maps.
- [x] Replace direct `props.classNames?.part` and `props.styles?.part` reads with resolved map reads.
- [x] Keep `overlayClassName` and `overlayStyle` ordering unchanged.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/dropdown.md`
- Modify generated outputs under `packages/components/es/dropdown` and `packages/components/lib/dropdown`

- [x] Update Dropdown API rows for `classNames` and `styles` to include function forms.
- [x] Document `DropdownSemanticInfo` with `open` and `placement`.
- [x] Note that `ADropdownButton` inherits the same semantic hook forms.
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
