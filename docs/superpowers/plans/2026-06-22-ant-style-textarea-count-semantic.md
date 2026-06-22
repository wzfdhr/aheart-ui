# Ant Style Textarea Count And Semantic Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Textarea clear-icon customization, count formatting/configuration, and semantic class/style hooks.

**Architecture:** Keep the existing `textarea.vue` component. Extend `types.ts`, compute count display from `showCount`, `count`, `maxlength`, and the current value, and apply semantic class/style values to the existing wrapper, textarea control, clear button, and count elements. Preserve the existing CSS-variable implementation for `autoSize`.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Textarea.allowClear` object form
- `Textarea.clearIcon` slot
- `Textarea.showCount` object form
- `Textarea.count`
- `Textarea.className`
- `Textarea.rootClassName`
- `Textarea.style`
- `Textarea.classNames`
- `Textarea.styles`
- docs and generated package output refresh

This plan does not cover base Input, Search, Password, OTP, grouped addon behavior, runtime height measurement, truncation, or exceed formatting.

## Task 1: Write Failing Textarea Tests

**Files:**

- Modify: `packages/components/src/textarea/__tests__/textarea.test.ts`

- [ ] Add a test that `allowClear={{ clearIcon: 'clear' }}` renders the custom clear icon text.
- [ ] Add a test that the `clearIcon` slot overrides `allowClear.clearIcon`.
- [ ] Add a test that `showCount={{ formatter }}` renders custom count text.
- [ ] Add a test that `count.max`, `count.strategy`, and `count.show` render custom count text.
- [ ] Add a test that `count.show=false` hides the count even when `showCount` is true.
- [ ] Add a test that `className`, `rootClassName`, `style`, `classNames.root`, and `styles.root` apply to the Textarea wrapper while `autoSize` variables remain present.
- [ ] Add a test that semantic classes and styles apply to textarea, clear, and count parts.
- [ ] Run the focused Textarea tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- textarea
```

Expected: FAIL before implementation.

## Task 2: Implement Textarea Controls

**Files:**

- Modify: `packages/components/src/textarea/types.ts`
- Modify: `packages/components/src/textarea/textarea.vue`

- [ ] Extend Textarea types for `allowClear` object form, `showCount` object form, `count`, root hooks, and semantic hooks.
- [ ] Compute clear icon content from the `clearIcon` slot, `allowClear.clearIcon`, and the default clear glyph.
- [ ] Compute whether count should show from `showCount` and `count.show`.
- [ ] Compute count length from `count.strategy` or `modelValue.length`.
- [ ] Compute count text from `count.show`, `showCount.formatter`, `count.max`, `maxlength`, and count length.
- [ ] Merge root `style`, `styles.root`, and autoSize CSS variables on the wrapper.
- [ ] Apply root, textarea, clear, and count class/style hooks.
- [ ] Run focused Textarea tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- textarea
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/textarea.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add a custom clear icon example.
- [ ] Add a count formatter/config example.
- [ ] Add a semantic styling example.
- [ ] Update Textarea API and slots sections.
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

Expected: all pass, generated declaration files include the new Textarea count and semantic types, `docs/.vitepress/dist/superpowers` is not created, and aggregate `style.css` remains clean after build.

## Self-Review

- Spec coverage: every Textarea count and semantic hook requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: prop, slot, and semantic part names match the design document.
