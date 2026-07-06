# Ant Style InputNumber Semantic Functions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber semantic `classNames` and `styles` with Ant Design's object-or-function API shape.

**Architecture:** Reuse the existing InputNumber semantic parts and the established local semantic function pattern from Tooltip/Popover/Popconfirm. Add types for semantic info/config, resolve `classNames` and `styles` into computed records, and keep every existing part binding reading a per-part value.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Add Failing Semantic Function Test

**Files:**

- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`

- [x] Add a test named `supports semantic classNames and styles functions`.
- [x] Mount `InputNumber` with `status="warning"`, `readOnly`, `prefix`, `suffix`, function-form `classNames`, and function-form `styles`.
- [x] Assert that returned root/input/prefix/suffix/actions/action classes render.
- [x] Assert that returned inline styles render.
- [x] Run focused InputNumber tests and confirm this new test fails before implementation.

Command:

```bash
cd packages/components
../../node_modules/.bin/vitest run src/input-number/__tests__/input-number.test.ts --environment jsdom
```

Expected RED failure: function-form semantic hooks are ignored because the component currently reads `props.classNames?.root` and `props.styles?.root` as object records.

## Task 2: Implement Semantic Function Resolution

**Files:**

- Modify: `packages/components/src/input-number/types.ts`
- Modify: `packages/components/src/input-number/input-number.vue`

- [x] Add `InputNumberSemanticInfo`.
- [x] Add `InputNumberSemanticRecord<T>`.
- [x] Add `InputNumberSemanticConfig<T>`.
- [x] Change `InputNumberClassNames` to `InputNumberSemanticConfig<string>`.
- [x] Change `InputNumberStyles` to `InputNumberSemanticConfig<StyleValue>`.
- [x] Change the prop runtime declarations to accept `[Object, Function]`.
- [x] Add computed `semanticInfo`, `resolvedClassNames`, and `resolvedStyles`.
- [x] Replace all direct `props.classNames?.part` and `props.styles?.part` reads with resolved records.
- [x] Run the focused InputNumber tests and confirm they pass.

Command:

```bash
cd packages/components
../../node_modules/.bin/vitest run src/input-number/__tests__/input-number.test.ts --environment jsdom
```

Expected GREEN result: all InputNumber tests pass.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/input-number.md`
- Generated: `packages/components/es/input-number/**`
- Generated: `packages/components/lib/input-number/**`

- [x] Update the semantic demo to use function-form `classNames` and `styles`.
- [x] Update API rows for `classNames` and `styles`.
- [x] Add an `InputNumberSemanticInfo` reference section.
- [x] Run package build to refresh generated InputNumber output.

Command:

```bash
cd packages/components
../../node_modules/.bin/vite build
```

Expected result: generated `es` and `lib` InputNumber files include the function-capable semantic types.

## Task 4: Final Verification And GitHub Integration

- [x] Run component typecheck.
- [x] Run all component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage only this phase's files.
- [ ] Commit with `feat: align input number semantic functions`.
- [ ] Push `codex/consolidated-ant-style-foundation`.
- [ ] Fast-forward merge into `master`.
- [ ] Push `master`.
- [ ] Switch back to `codex/consolidated-ant-style-foundation`.
- [ ] Confirm the demo server still returns HTTP 200.

Commands:

```bash
cd packages/components
../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
../../node_modules/.bin/vitest run --environment jsdom
../../node_modules/.bin/vite build
cd ../..
npm run docs:build
git diff --check
```

Expected result: all verification commands exit 0 and both remote branches point at the new commit.

## Self-Review

- Spec coverage: every requirement in the design has a task.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: `InputNumberSemanticInfo`, `InputNumberSemanticRecord<T>`, `InputNumberSemanticConfig<T>`, `InputNumberClassNames`, and `InputNumberStyles` names match the design.
