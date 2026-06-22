# Ant Style Empty Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Empty configuration for image URLs, hidden image/description states, image styling, root styling, description slot content, and semantic styling hooks.

**Architecture:** Keep the existing `empty.vue` component. Extend `types.ts`, compute image/description visibility from props and slots, apply root and semantic classes/styles with computed values, and preserve ConfigProvider locale fallback.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Empty.image`
- `Empty.imageStyle`
- `Empty.description={false}`
- `Empty.className`
- `Empty.rootClassName`
- `Empty.style`
- `Empty.classNames`
- `Empty.styles`
- `description` slot
- docs and generated package output refresh

This plan does not cover static Empty image constants, cross-component empty-state integration, or rich non-slot description nodes.

## Task 1: Write Failing Empty Tests

**Files:**

- Modify: `packages/components/src/empty/__tests__/empty.test.ts`

- [ ] Add a test that `image` string renders an image element with the provided source.
- [ ] Add a test that `image={false}` hides the image area.
- [ ] Add a test that `description={false}` hides the description area.
- [ ] Add a test that the `description` slot overrides locale fallback.
- [ ] Add a test that `className`, `rootClassName`, `style`, `classNames.root`, and `styles.root` apply to the root.
- [ ] Add a test that `classNames.image`, `styles.image`, `imageStyle`, `classNames.description`, `styles.description`, `classNames.footer`, and `styles.footer` apply to semantic parts.
- [ ] Run the focused Empty tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- empty
```

Expected: FAIL before implementation.

## Task 2: Implement Empty Controls

**Files:**

- Modify: `packages/components/src/empty/types.ts`
- Modify: `packages/components/src/empty/empty.vue`
- Modify: `packages/components/src/empty/style.css`

- [ ] Extend Empty types for image, imageStyle, root hooks, semantic hooks, and boolean description hiding.
- [ ] Compute image visibility, description visibility, resolved description, and semantic class/style values.
- [ ] Render string `image` as an `<img>` and hide the image area when `image` is false and no image slot exists.
- [ ] Render the `description` slot and hide description when `description` is false and no slot exists.
- [ ] Apply image, description, footer, and root hooks.
- [ ] Run focused Empty tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- empty
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/empty.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add examples for image URL, hidden image/description, description slot, and semantic styling.
- [ ] Update Empty API and slots sections.
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

Expected: all pass, generated declaration files include the new Empty control types, and `docs/.vitepress/dist/superpowers` is not created.

## Self-Review

- Spec coverage: every Empty controls requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: prop, slot, and semantic part names match the design document.
