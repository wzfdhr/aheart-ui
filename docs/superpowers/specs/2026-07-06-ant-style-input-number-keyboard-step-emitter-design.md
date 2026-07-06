# Ant-style InputNumber Keyboard Step Emitter Design

## Context

`@rc-component/input-number` emits `onStep` with `info.emitter` values of
`handler`, `keyboard`, or `wheel`. Aheart InputNumber currently emits `keydown`
for keyboard arrow stepping, which does not match the Ant-compatible rc event
contract.

## Goal

Change InputNumber keyboard step events to report `emitter: 'keyboard'`.

## Scope

- Update `InputNumberStepEmitter` from `keydown` to `keyboard`.
- Emit `keyboard` when ArrowUp or ArrowDown changes the value.
- Keep button steps as `handler` and wheel steps as `wheel`.
- Update tests, docs, and build outputs.

## Non-goals

- No change to keyboard enable/disable behavior.
- No change to step offsets, value clamping, precision, or stringMode behavior.
- No change to event names.

## Verification

- Add/update focused InputNumber tests to expect `keyboard` for arrow-key steps.
- Run focused InputNumber tests, component typecheck, full component tests,
  component build, docs build, and `git diff --check`.
