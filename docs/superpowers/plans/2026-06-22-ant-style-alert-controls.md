# Ant Style Alert Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Alert configuration for banner defaults, variants, custom actions, custom icons, close lifecycle, root styling, and semantic styling hooks.

**Architecture:** Keep the existing `alert.vue` component. Extend `types.ts`, compute effective type/title/icon visibility from props, track a local closed state for closable alerts, and apply class/style hooks through semantic computed values.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Alert.title`
- `Alert.banner`
- `Alert.variant`
- `Alert.action`
- `Alert.icon`
- `Alert.closeIcon`
- `Alert.role`
- `Alert.className`
- `Alert.rootClassName`
- `Alert.style`
- `Alert.classNames`
- `Alert.styles`
- `afterClose`
- `action`, `icon`, and `closeIcon` slots
- docs and generated package output refresh

This plan does not cover `Alert.ErrorBoundary`, close animations, or React-specific `closable` object behavior.

## Task 1: Write Failing Alert Tests

**Files:**

- Modify: `packages/components/src/alert/__tests__/alert.test.ts`

- [ ] Add a test that `title` takes priority over `message`.
- [ ] Add a test that `banner` defaults to warning type and shows an icon.
- [ ] Add a test that `variant`, `role`, `className`, `rootClassName`, `style`, `classNames.root`, and `styles.root` apply.
- [ ] Add a test that `action` prop and `action` slot render in the action area.
- [ ] Add a test that custom `icon` and `closeIcon` render.
- [ ] Add a test that clicking close hides the Alert and emits both `close` and `afterClose`.
- [ ] Add a test that semantic `classNames` and `styles` apply to icon, title, description, action, and close parts.
- [ ] Run the focused Alert tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- alert
```

Expected: FAIL before implementation.

## Task 2: Implement Alert Controls

**Files:**

- Modify: `packages/components/src/alert/types.ts`
- Modify: `packages/components/src/alert/alert.vue`
- Modify: `packages/components/src/alert/style.css`

- [ ] Extend Alert types for `title`, `banner`, `variant`, `action`, `icon`, `closeIcon`, `role`, root hooks, semantic hooks, and `afterClose`.
- [ ] Compute effective title, type, icon visibility, icon text, and semantic class/style values.
- [ ] Render action prop/slot and custom icon/close icon prop/slots.
- [ ] Hide the Alert after close and emit `afterClose`.
- [ ] Add variant, banner, action, and close-layout styles.
- [ ] Run focused Alert tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- alert
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/alert.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add examples for banner mode, variants, custom action, custom icon/close icon, and semantic styling.
- [ ] Update Alert API, events, and slots sections.
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

Expected: all pass, generated declaration files include the new Alert control types, and `docs/.vitepress/dist/superpowers` is not created.

## Self-Review

- Spec coverage: every Alert controls requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: prop, event, slot, and semantic part names match the design document.
