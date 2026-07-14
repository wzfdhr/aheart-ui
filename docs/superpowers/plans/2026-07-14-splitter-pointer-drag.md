# Splitter And Pointer Drag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans task-by-task. Each completed development task must receive a product-manager review before the next task starts.

**Goal:** Add a reusable pointer drag foundation with iframe protection, migrate Drawer resizing, and provide a production-ready Splitter with controlled panel sizing.

**Architecture:** A DOM-safe `usePointerDrag` composable owns global pointer listeners, rAF coalescing, cursor and selection restoration, and a temporary full-viewport drag shield. Splitter has a pure size solver for px, percentage, and auto inputs, while panel layout and ARIA behavior remain in Vue components. Drawer delegates only its existing resize gesture lifecycle to the shared driver.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, Playwright for the browser acceptance task.

## Constraints

- `Divider` remains visual only; all resize behavior belongs to new `Splitter` components.
- Number sizes are CSS pixels; percent sizes resolve against the live container; `auto` panels split remaining valid space equally.
- A drag only changes the adjacent panels. Min/max constraints stop at the nearest legal size.
- The driver must handle `pointerup`, `pointercancel`, window blur, component unmount, and iframe crossing without modifying iframe styles.
- Keyboard resize uses arrow keys at 10 px and Shift+arrow at 50 px, with separator ARIA values.
- Avoid date, drag-and-drop, and external i18n dependencies.

---

### Task 1: Shared pointer drag driver

**Files:**
- Create: `packages/components/src/utils/use-pointer-drag.ts`
- Test: `packages/components/src/utils/__tests__/use-pointer-drag.test.ts`

- [ ] Write failing tests for rAF-coalesced move callbacks, document cleanup on end/cancel/blur/unmount, and a single temporary drag shield with `pointer-events: all`.
- [ ] Implement `usePointerDrag(options)` with start, stop, `isDragging`, pointer capture where available, and SSR guards.
- [ ] Run the focused test file and component typecheck.
- [ ] Commit the driver and obtain a product-manager review.

### Task 2: Migrate Drawer resize behavior

**Files:**
- Modify: `packages/components/src/drawer/drawer.vue`
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] Write failing tests that start a Drawer resize and assert shield creation and cleanup on pointer cancel and component unmount.
- [ ] Replace manual document listeners with the shared driver while retaining existing size calculation and callback behavior.
- [ ] Run Drawer and pointer-driver tests, typecheck, then commit and obtain a product-manager review.

### Task 3: Splitter size solver and public types

**Files:**
- Create: `packages/components/src/splitter/solver.ts`
- Create: `packages/components/src/splitter/types.ts`
- Test: `packages/components/src/splitter/__tests__/solver.test.ts`

- [ ] Write failing pure-function tests for px/percent/auto resolution, min/max clamping, remaining-space redistribution, and adjacent-panel resizing.
- [ ] Implement `resolveSplitterSizes` and `resizeAdjacentPanels` without DOM dependencies.
- [ ] Run solver tests and typecheck, then commit and obtain a product-manager review.

### Task 4: Splitter and SplitterPanel components

**Files:**
- Create: `packages/components/src/splitter/splitter.vue`
- Create: `packages/components/src/splitter/splitter-panel.vue`
- Create: `packages/components/src/splitter/style.css`
- Create: `packages/components/src/splitter/index.ts`
- Create: `packages/components/src/splitter/__tests__/splitter.test.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `packages/components/vite.config.ts`

- [ ] Write failing component tests for horizontal and vertical layout, controlled/uncontrolled sizes, lazy resize, InputNumber-driven numeric changes, min/max, collapse, keyboard behavior, and ResizeObserver response.
- [ ] Implement panels, handles, ARIA, ResizeObserver, and shared pointer drag integration.
- [ ] Run focused tests and typecheck, then commit and obtain a product-manager review.

### Task 5: Documentation, browser acceptance, and release integration

**Files:**
- Create: `docs/components/splitter.md`
- Create: `docs/en/components/splitter.md`
- Modify: `docs/.vitepress/config.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Modify: `packages/components/es/**` and `packages/components/lib/**` through build

- [ ] Add Chinese and English API and controlled numeric-input examples.
- [ ] Add Playwright browser coverage for iframe-crossing drag, touch pointer drag, and desktop/mobile keyboard use.
- [ ] Run release gate, verify deterministic artifacts and docs routes, commit, then obtain a final product-manager review before merging.
