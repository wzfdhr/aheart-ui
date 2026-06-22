# Ant Style Badge Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Badge configuration for zero display, small size, offsets, custom colors, indicator title, semantic styling hooks, and custom count content.

**Architecture:** Keep the existing `badge.vue` component and extend its props/types. Compute indicator visibility and style in the component, use CSS modifiers for standalone and size variants, and keep status/count/dot rendering paths simple.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Badge.showZero`
- `Badge.size`
- `Badge.offset`
- `Badge.color`
- `Badge.title`
- `Badge.classNames`
- `Badge.styles`
- `Badge` `count` slot
- standalone count/dot layout
- docs and generated package output refresh

This plan does not cover `Badge.Ribbon`, animated count transitions, or preset color token expansion.

## Task 1: Write Failing Badge Tests

**Files:**

- Modify: `packages/components/src/badge/__tests__/badge.test.ts`

- [ ] Add a test that `count={0}` hides the count by default and `showZero` renders `0`.
- [ ] Add a test that `size="small"` adds the small modifier and `offset={[8, -4]}` writes the translated indicator transform.
- [ ] Add a test that `dot`, `color`, and `title` apply to the dot indicator.
- [ ] Add a test that `classNames.root`, `styles.root`, `classNames.indicator`, and `styles.indicator` apply to the rendered elements.
- [ ] Add a test that the `count` slot overrides overflow-formatted text.
- [ ] Add a test that status badges use custom indicator class/style.
- [ ] Run the focused Badge tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- badge
```

Expected: FAIL before implementation.

## Task 2: Implement Badge Controls

**Files:**

- Modify: `packages/components/src/badge/types.ts`
- Modify: `packages/components/src/badge/badge.vue`
- Modify: `packages/components/src/badge/style.css`

- [ ] Extend Badge types for `showZero`, `size`, `offset`, `color`, `title`, `classNames`, and `styles`.
- [ ] Compute `hasDefaultSlot`, indicator visibility, count text, and normalized size.
- [ ] Render count, dot, and status indicators with semantic class/style hooks.
- [ ] Apply `color`, `offset`, `title`, and standalone classes to the right indicator.
- [ ] Render the `count` slot when provided.
- [ ] Run focused Badge tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- badge
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/badge.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add examples for zero display, small size, offset, custom color, semantic styling, and custom count content.
- [ ] Update Badge API and slots sections.
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
```

Expected: all pass, generated declaration files include the new Badge control types, and `docs/.vitepress/dist/superpowers` is not created.

## Self-Review

- Spec coverage: every Badge controls requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: prop and semantic part names match the design document.
