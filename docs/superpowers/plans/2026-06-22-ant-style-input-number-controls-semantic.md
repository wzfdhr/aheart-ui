# Ant Style InputNumber Controls And Semantic Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style InputNumber custom controls, mouse-wheel stepping, formatter info compatibility, and semantic class/style hooks.

**Architecture:** Keep the existing `input-number.vue` component. Extend `types.ts`, compute controls from boolean or object props, route wheel events through the existing step path, pass formatter info to existing formatters, and apply semantic class/style values to the existing root, prefix, input, suffix, actions, and action elements.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `InputNumber.controls` object form
- `InputNumber.changeOnWheel`
- `InputNumber.formatter(value, info)` compatibility
- `InputNumber.className`
- `InputNumber.rootClassName`
- `InputNumber.style`
- `InputNumber.classNames`
- `InputNumber.styles`
- docs and generated package output refresh

This plan does not cover `stringMode`, arbitrary-precision string values, `changeOnBlur`, locale-specific `decimalSeparator`, or rich Vue slots for prefix/suffix/control icons.

## Task 1: Write Failing InputNumber Tests

**Files:**

- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`

- [ ] Add a test that `controls={{ upIcon: 'up', downIcon: 'down' }}` renders custom control text.
- [ ] Add a test that `controls=false` hides the controls.
- [ ] Add a test that `changeOnWheel` steps up for negative wheel delta and down for positive wheel delta.
- [ ] Add a test that wheel events do not step when `changeOnWheel` is false.
- [ ] Add a test that `formatter` receives an info object containing `userTyping` and `input`.
- [ ] Add a test that `className`, `rootClassName`, `style`, `classNames.root`, and `styles.root` apply to the InputNumber root.
- [ ] Add a test that semantic classes and styles apply to input, prefix, suffix, actions, and action parts.
- [ ] Run the focused InputNumber tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input-number
```

Expected: FAIL before implementation.

## Task 2: Implement InputNumber Controls

**Files:**

- Modify: `packages/components/src/input-number/types.ts`
- Modify: `packages/components/src/input-number/input-number.vue`

- [ ] Extend InputNumber types for controls object form, formatter info, `changeOnWheel`, root hooks, and semantic hooks.
- [ ] Compute `showControls` from boolean or object `controls`.
- [ ] Compute custom increase/decrease icon text from `controls.upIcon` and `controls.downIcon`.
- [ ] Pass `{ userTyping: false, input }` as the second formatter argument.
- [ ] Add a `wheel` handler on the input that steps only when `changeOnWheel` is true.
- [ ] Keep wheel stepping disabled when the component is disabled or read-only.
- [ ] Apply root, input, prefix, suffix, actions, and action class/style hooks.
- [ ] Run focused InputNumber tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input-number
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/input-number.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add a custom controls example.
- [ ] Add a wheel stepping example.
- [ ] Add a semantic styling example.
- [ ] Update InputNumber API rows for `controls`, `changeOnWheel`, `formatter`, `className`, `rootClassName`, `style`, `classNames`, and `styles`.
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

Expected: all pass, generated declaration files include the new InputNumber controls and semantic types, `docs/.vitepress/dist/superpowers` is not created, and aggregate `style.css` remains clean after build.

## Self-Review

- Spec coverage: every InputNumber controls, wheel, formatter info, and semantic hook requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: prop, formatter info, and semantic part names match the design document.
