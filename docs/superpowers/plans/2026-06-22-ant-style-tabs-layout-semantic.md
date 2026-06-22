# Ant Style Tabs Layout And Semantic Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Tabs placement, extra tab-bar content, gutter, indicator, animation, tab-click, item icon, and semantic class/style hooks.

**Architecture:** Keep the existing item-driven `tabs.vue` component. Extend `types.ts`, compute placement and extra-content state, add nav wrappers for left/right extra content, attach semantic class/style hooks, and route tab clicks through the existing active-key change path.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `tabPlacement`
- `tabPosition`
- `tabBarExtraContent`
- `tabBarGutter`
- `tabBarStyle`
- `indicator`
- `animated`
- `tabClick`
- `TabItem.icon`
- `className`
- `rootClassName`
- `style`
- `classNames`
- `styles`
- docs and generated package output refresh

This plan does not cover editable-card add/remove behavior, overflow dropdowns, or full panel lifecycle caching.

## Task 1: Write Failing Tabs Tests

**Files:**

- Modify: `packages/components/src/tabs/__tests__/tabs.test.ts`

- [ ] Add a test that `tabPlacement`, `tabPosition`, `tabBarGutter`, `tabBarExtraContent`, and `TabItem.icon` render expected classes, styles, and content.
- [ ] Add a test that `animated` and `indicator` add expected classes and CSS variables.
- [ ] Add a test that `tabClick` emits for enabled tabs, including the active tab, and does not emit for disabled tabs.
- [ ] Add a test that root and semantic class/style hooks apply to root, nav, navList, tab, activeTab, tabIcon, tabLabel, panel, extra, extraLeft, and extraRight parts.
- [ ] Run focused Tabs tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tabs
```

Expected: FAIL before implementation.

## Task 2: Implement Tabs Layout Controls

**Files:**

- Modify: `packages/components/src/tabs/types.ts`
- Modify: `packages/components/src/tabs/tabs.vue`
- Modify: `packages/components/src/tabs/style.css`

- [ ] Extend Tabs types for placement, position alias, extra content, gutter, nav style, indicator, animated, tabClick, icons, root hooks, and semantic hooks.
- [ ] Compute resolved placement, mapping `tabPosition="left"` to `start` and `tabPosition="right"` to `end`.
- [ ] Render extra-left and extra-right content around the tab list.
- [ ] Render tab icons before labels.
- [ ] Apply gutter and indicator values through CSS variables.
- [ ] Add animated classes from boolean and object forms.
- [ ] Emit `tabClick(key, event)` for enabled tab clicks before active-key updates.
- [ ] Apply semantic class/style hooks to root, nav, navList, tab, activeTab, tabIcon, tabLabel, panel, extra, extraLeft, and extraRight.
- [ ] Run focused Tabs tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tabs
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/tabs.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add placement and tab-position examples.
- [ ] Add tab-bar extra content and gutter examples.
- [ ] Add indicator and animated examples.
- [ ] Add item icon and tab-click examples.
- [ ] Add semantic styling example.
- [ ] Update Tabs API rows for `tabPlacement`, `tabPosition`, `tabBarExtraContent`, `tabBarGutter`, `tabBarStyle`, `indicator`, `animated`, `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- [ ] Update TabItem rows for `icon`.
- [ ] Update Events rows for `tabClick`.
- [ ] Run docs build.
- [ ] Run package build.
- [ ] Commit documentation separately from generated outputs where practical.

## Task 4: Final Verification

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
test -f packages/components/es/tabs/index.d.ts && test -f packages/components/lib/tabs/index.d.ts && grep -q "TabsIndicatorConfig" packages/components/es/tabs/types.d.ts && grep -q "TabsIndicatorConfig" packages/components/lib/tabs/types.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo tabs-layout-semantic-build-ok
git diff --quiet -- packages/components/es/style.css packages/components/lib/style.css && echo deterministic-style-output-clean
```

Expected: all commands exit 0, final checks print `tabs-layout-semantic-build-ok` and `deterministic-style-output-clean`, and `git status --short` is clean after generated outputs are committed.

## Self-Review

- Spec coverage: every Tabs placement, extra-content, gutter, indicator, animated, tab-click, icon, and semantic hook requirement from the design has a task.
- Placeholder scan: no unfinished markers or postponed requirements.
- Type consistency: prop, event, and semantic part names match the design document.
