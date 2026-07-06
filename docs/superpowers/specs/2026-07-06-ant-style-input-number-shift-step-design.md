# Ant-style InputNumber Shift Step Design

## Context

`@rc-component/input-number` treats Shift + keyboard stepping as a decuple
step: it uses `getDecupleSteps(step)` for both the value update and
`onStep.info.offset`. Aheart InputNumber currently ignores `event.shiftKey`, so
Shift + ArrowUp/ArrowDown uses the normal step.

## Goal

Support 10x keyboard stepping when Shift is held.

## Scope

- Apply 10x step only to keyboard ArrowUp and ArrowDown interactions.
- Emit the 10x signed offset in the `step` event.
- Preserve existing button, wheel, keyboard suppression, min/max, precision, and
  stringMode behavior.
- Document Shift keyboard stepping.

## Non-goals

- No press-and-hold button repeat behavior.
- No change to default step, controls rendering, or wheel stepping.
- No change to event names or emitter labels.

## Verification

- Add a focused test proving Shift + ArrowUp uses 10x step and emits the 10x
  offset.
- Run focused InputNumber tests, component typecheck, full component tests,
  component build, docs build, and `git diff --check`.
