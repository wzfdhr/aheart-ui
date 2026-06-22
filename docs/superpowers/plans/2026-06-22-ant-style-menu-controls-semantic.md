# Ant Style Menu Controls And Semantic API Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `AMenu` with Ant-style control props, semantic styling hooks, and richer item display fields.

**Reference:** Ant Design Menu documentation, `https://ant.design/components/menu/`.

## Task 1: Write Failing Menu Tests

- [ ] Add tests for `inlineIndent`, `className`, `style`, `classNames`, and `styles`.
- [ ] Add tests for item `icon`, `extra`, `title`, and dashed divider rendering.
- [ ] Add tests for `forceSubMenuRender`.
- [ ] Add tests for `triggerSubMenuAction="hover"`.
- [ ] Add tests for custom `expandIcon`.
- [ ] Run focused Menu tests and confirm RED.

## Task 2: Implement Menu API Enhancements

- [ ] Update `packages/components/src/menu/types.ts` with new types, item fields, and props.
- [ ] Update `packages/components/src/menu/menu.vue` to apply root semantic hooks, CSS variables, and node props.
- [ ] Update `packages/components/src/menu/menu-node.vue` to render VNode child fields, semantic hooks, hover submenu action, forced submenu DOM, custom expand icon, title, and dashed dividers.
- [ ] Update `packages/components/src/menu/style.css` for semantic parts, inline indentation, hidden submenu lists, icons, extra content, and custom expand icon layout.
- [ ] Run focused Menu tests and component typecheck.
- [ ] Commit source changes.

## Task 3: Document And Build

- [ ] Update `docs/components/menu.md` with examples and API rows for the new props and item fields.
- [ ] Run docs build.
- [ ] Run package build and commit generated outputs.
- [ ] Run full final verification:
  - `pnpm dlx pnpm@9.15.4 typecheck`
  - `pnpm dlx pnpm@9.15.4 test`
  - `pnpm dlx pnpm@9.15.4 build`
  - `pnpm dlx pnpm@9.15.4 docs:build`
- [ ] Confirm the worktree is clean.
