# Ant-style InputNumber Composition Guard Design

## Context

`@rc-component/input-number` tracks IME composition state and skips keyboard
stepping while composition is active. This prevents arrow keys used by input
methods from changing the numeric value before composition has ended.

## Goal

Align Aheart InputNumber keyboard stepping with rc behavior during composition
input.

## Scope

- Track composition start and end on the native input.
- Keep `pressEnter` behavior intact.
- Skip `ArrowUp`/`ArrowDown` and legacy `Up`/`Down` keyboard stepping while
  composition is active.
- Resume normal keyboard stepping after composition ends.
- Preserve `keyboard=false`, shift-step, min/max, precision, stringMode, and
  existing `step` event metadata.
- Document the IME guard in the InputNumber demo docs.

## Non-goals

- No parser, formatter, or onInput timing changes in this phase.
- No root-level composition listener refactor.
- No change to control button or wheel stepping.

## Verification

- Add a focused regression test that proves ArrowUp does not emit while
  composition is active and resumes after composition ends.
- Run focused InputNumber tests, component typecheck, component build, full
  component tests, docs build, `git diff --check`, and demo HTTP check.
