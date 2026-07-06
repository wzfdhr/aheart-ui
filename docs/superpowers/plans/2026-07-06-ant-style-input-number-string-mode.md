# Ant Style InputNumber String Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style InputNumber `stringMode` so string values and high precision decimal steps can flow through the component.

**Architecture:** Keep the existing InputNumber component and extend its value type to `number | string`. Add small local decimal-string helpers for string-mode stepping and clamping, route typed input through string output when `stringMode` is true, and leave number-mode behavior unchanged.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Add Failing String Mode Tests

**Files:**

- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`

- [x] Add a test named `emits string values when stringMode is enabled`.
- [x] Mount `InputNumber` with `stringMode`, `modelValue="1.000000000000000001"`, and `step="0.000000000000000001"`.
- [x] Assert the input displays the full string.
- [x] Type `2.000000000000000001`.
- [x] Assert `update:modelValue` and `change` emit the exact string.
- [x] Click the increase control.
- [x] Assert `update:modelValue`, `change`, and `step` emit `"1.000000000000000002"` for the stepped value.
- [x] Add a test named `uses string defaultValue as uncontrolled initial value`.
- [x] Mount `InputNumber` with `stringMode`, `defaultValue="3.000000000000000001"`, and `step="0.000000000000000001"`.
- [x] Assert the input displays the full default string.
- [x] Click the increase control.
- [x] Assert the input displays `"3.000000000000000002"` and emits the string value.
- [x] Run focused InputNumber tests and confirm the new tests fail before implementation.

Command:

```bash
cd packages/components
../../node_modules/.bin/vitest run src/input-number/__tests__/input-number.test.ts --environment jsdom
```

Expected RED failure: Vue warns that string value props are invalid and the emitted payloads are numbers or missing.

## Task 2: Implement String Mode Types And Runtime

**Files:**

- Modify: `packages/components/src/input-number/types.ts`
- Modify: `packages/components/src/input-number/input-number.vue`

- [x] Add `InputNumberValue = number | string`.
- [x] Change `modelValue`, `value`, and `defaultValue` props to `[Number, String]`.
- [x] Add `stringMode: Boolean`.
- [x] Change formatter, parser, update, change, and step event types to use `InputNumberValue`.
- [x] Change uncontrolled value storage to `InputNumberValue | undefined`.
- [x] Add decimal string helpers for regular decimal strings: validation, negation, addition, and comparison.
- [x] Add `emitValue` support for string-mode conversion.
- [x] Add string-mode input parsing that emits parsed display strings.
- [x] Add string-mode step handling that emits exact decimal strings where possible.
- [x] Run focused InputNumber tests and confirm they pass.

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

- [x] Add a `stringMode` documentation example.
- [x] Update API rows for `modelValue`, `value`, `defaultValue`, `formatter`, `parser`, `stringMode`, and events.
- [x] Run package build to refresh generated InputNumber output.

Command:

```bash
cd packages/components
../../node_modules/.bin/vite build
```

Expected result: generated `es` and `lib` InputNumber files include string-mode value types and runtime.

## Task 4: Final Verification And GitHub Integration

- [x] Run component typecheck.
- [x] Run all component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage only this phase's files.
- [ ] Commit with `feat: align input number string mode`.
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

- Spec coverage: every `stringMode` behavior in the design has a task.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: `InputNumberValue`, `stringMode`, event payloads, and documentation names match the design.
