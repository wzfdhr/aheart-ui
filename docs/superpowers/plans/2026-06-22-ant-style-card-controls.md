# Ant Style Card Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Card variant, inner-card, actions prop, and semantic class/style hooks.

**Architecture:** Keep the existing `card.vue` component. Extend `types.ts`, compute border state from `variant` and legacy `bordered`, render action items from either slot or prop, and apply semantic class/style values to the existing Card DOM structure.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Card.variant`
- `Card.type`
- `Card.actions`
- `Card.className`
- `Card.rootClassName`
- `Card.style`
- `Card.classNames`
- `Card.styles`
- `Card.headStyle`
- `Card.bodyStyle`
- docs and generated package output refresh

This plan does not cover `Card.Meta`, `Card.Grid`, tabbed cards, or rich non-slot ReactNode-style props.

## Task 1: Write Failing Card Tests

**Files:**

- Modify: `packages/components/src/card/__tests__/card.test.ts`

- [ ] Add a test that `variant="borderless"` renders borderless and `variant="outlined"` overrides `bordered={false}`.
- [ ] Add a test that `type="inner"` adds the inner-card class.
- [ ] Add a test that `actions` prop renders simple action items.
- [ ] Add a test that the `actions` slot overrides the `actions` prop.
- [ ] Add a test that `className`, `rootClassName`, `style`, `classNames.root`, and `styles.root` apply to the root.
- [ ] Add a test that semantic classes and styles apply to header, title, extra, cover, body, and actions.
- [ ] Add a test that `headStyle` and `bodyStyle` apply to header and body.
- [ ] Run the focused Card tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
```

Expected: FAIL before implementation.

## Task 2: Implement Card Controls

**Files:**

- Modify: `packages/components/src/card/types.ts`
- Modify: `packages/components/src/card/card.vue`
- Modify: `packages/components/src/card/style.css`

- [ ] Extend Card types for variant, inner type, actions prop, root hooks, compatibility styles, and semantic hooks.
- [ ] Compute borderless state from `variant` first, falling back to `bordered`.
- [ ] Add an inner-card class when `type` is `inner`.
- [ ] Apply root, header, title, extra, cover, body, and actions class/style hooks.
- [ ] Render `actions` prop items when the `actions` slot is absent.
- [ ] Keep the `actions` slot as the richer override.
- [ ] Run focused Card tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/card.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add examples for variant and inner cards.
- [ ] Add an actions prop example.
- [ ] Add a semantic styling example.
- [ ] Update Card API and slots sections.
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

Expected: all pass, generated declaration files include the new Card control types, and `docs/.vitepress/dist/superpowers` is not created.

## Self-Review

- Spec coverage: every Card controls requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: prop, slot, and semantic part names match the design document.
