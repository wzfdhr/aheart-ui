# Ant Style Steps Controls And Semantic Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Steps type variants, orientation alias, title placement, initial numbering, percent progress, item icon/subtitle/content support, and semantic class/style hooks.

**Architecture:** Keep the existing item-driven `steps.vue` list and button structure. Extend `types.ts`, render connector elements instead of pseudo-only connectors, compute resolved orientation and status values, and route all clicks through the existing `change` path.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `type`
- `orientation`
- `titlePlacement`
- `initial`
- `percent`
- `StepItem.icon`
- `StepItem.subTitle`
- `StepItem.content`
- `className`
- `rootClassName`
- `style`
- `classNames`
- `styles`
- docs and generated package output refresh

This plan does not cover responsive direction switching, render-function `progressDot`, render-function `iconRender`, or routed workflow integration.

## Task 1: Write Failing Steps Tests

**Files:**

- Modify: `packages/components/src/steps/__tests__/steps.test.ts`

- [ ] Add a test that `type`, `orientation`, `titlePlacement`, `initial`, and `percent` render expected classes, indicator text, and progress style.
- [ ] Add a test that `StepItem.icon`, `StepItem.subTitle`, and `StepItem.content` render expected text.
- [ ] Add a test that root and semantic class/style hooks apply to root, item, activeItem, button, indicator, icon, content, title, subTitle, description, and connector parts.
- [ ] Confirm disabled and non-current click behavior still works.
- [ ] Run focused Steps tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- steps
```

Expected: FAIL before implementation.

## Task 2: Implement Steps Controls

**Files:**

- Modify: `packages/components/src/steps/types.ts`
- Modify: `packages/components/src/steps/steps.vue`
- Modify: `packages/components/src/steps/style.css`

- [ ] Extend Steps types for type variants, orientation alias, title placement, initial numbering, percent progress, item icon/subtitle/content, root hooks, and semantic hooks.
- [ ] Compute resolved orientation from `orientation ?? direction`.
- [ ] Add root classes for type, orientation, title placement, and size.
- [ ] Render a real connector element for every non-last item.
- [ ] Render item icon override before derived finish/error/number indicator text.
- [ ] Render subtitle and content text.
- [ ] Clamp percent to `0..100` and apply a CSS variable to the current process icon.
- [ ] Apply semantic class/style hooks to root, item, activeItem, button, indicator, icon, content, title, subTitle, description, and connector.
- [ ] Run focused Steps tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- steps
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/steps.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add type variant examples.
- [ ] Add orientation and title placement examples.
- [ ] Add percent progress example.
- [ ] Add icon, subtitle, and content example.
- [ ] Add semantic styling example.
- [ ] Update Steps API rows for `type`, `orientation`, `titlePlacement`, `initial`, `percent`, `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- [ ] Update StepItem rows for `icon`, `subTitle`, and `content`.
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
test -f packages/components/es/steps/index.d.ts && test -f packages/components/lib/steps/index.d.ts && grep -q "StepsSemanticPart" packages/components/es/steps/types.d.ts && grep -q "StepsSemanticPart" packages/components/lib/steps/types.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo steps-controls-semantic-build-ok
git diff --quiet -- packages/components/es/style.css packages/components/lib/style.css && echo deterministic-style-output-clean
```

Expected: all commands exit 0, final checks print `steps-controls-semantic-build-ok` and `deterministic-style-output-clean`, and `git status --short` is clean after generated outputs are committed.

## Self-Review

- Spec coverage: every Steps type, orientation, title-placement, initial, percent, item-content, and semantic hook requirement from the design has a task.
- Placeholder scan: no unfinished markers or postponed requirements.
- Type consistency: prop, event, and semantic part names match the design document.
