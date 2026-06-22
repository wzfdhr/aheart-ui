# Ant Style Input Count And Semantic Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Input clear-icon customization, count formatting/configuration, and semantic class/style hooks.

**Architecture:** Keep the existing `input.vue` component. Extend `types.ts`, compute count display from `showCount`, `count`, `maxlength`, and the current value, and apply semantic class/style values to the existing wrapper, input, prefix, suffix, clear, and count elements.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Input.allowClear` object form
- `Input.clearIcon` slot
- `Input.showCount` object form
- `Input.count`
- `Input.className`
- `Input.rootClassName`
- `Input.style`
- `Input.classNames`
- `Input.styles`
- docs and generated package output refresh

This plan does not cover `Input.TextArea`, `Input.Search`, `Input.Password`, OTP, rich addon slots, truncation, or exceed formatting.

## Task 1: Write Failing Input Tests

**Files:**

- Modify: `packages/components/src/input/__tests__/input.test.ts`

- [ ] Add a test that `allowClear={{ clearIcon: 'clear' }}` renders the custom clear icon text.
- [ ] Add a test that the `clearIcon` slot overrides `allowClear.clearIcon`.
- [ ] Add a test that `showCount={{ formatter }}` renders custom count text.
- [ ] Add a test that `count.max`, `count.strategy`, and `count.show` render custom count text.
- [ ] Add a test that `count.show=false` hides the count even when `showCount` is true.
- [ ] Add a test that `className`, `rootClassName`, `style`, `classNames.root`, and `styles.root` apply to the Input wrapper.
- [ ] Add a test that semantic classes and styles apply to input, prefix, suffix, clear, and count parts.
- [ ] Run the focused Input tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input
```

Expected: FAIL before implementation.

## Task 2: Implement Input Controls

**Files:**

- Modify: `packages/components/src/input/types.ts`
- Modify: `packages/components/src/input/input.vue`

- [ ] Extend Input types for `allowClear` object form, `showCount` object form, `count`, root hooks, and semantic hooks.
- [ ] Compute clear icon content from the `clearIcon` slot, `allowClear.clearIcon`, and the default clear glyph.
- [ ] Compute whether count should show from `showCount` and `count.show`.
- [ ] Compute count length from `count.strategy` or `modelValue.length`.
- [ ] Compute count text from `count.show`, `showCount.formatter`, `count.max`, `maxlength`, and count length.
- [ ] Apply root, input, prefix, suffix, clear, and count class/style hooks.
- [ ] Run focused Input tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/input.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add a custom clear icon example.
- [ ] Add a count formatter/config example.
- [ ] Add a semantic styling example.
- [ ] Update Input API and slots sections.
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

Expected: all pass, generated declaration files include the new Input count and semantic types, and `docs/.vitepress/dist/superpowers` is not created.

## Self-Review

- Spec coverage: every Input count and semantic hook requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: prop, slot, and semantic part names match the design document.
