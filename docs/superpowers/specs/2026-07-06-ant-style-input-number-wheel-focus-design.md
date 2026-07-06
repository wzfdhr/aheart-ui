# Ant-style InputNumber Wheel Focus Design

## Context

`@rc-component/input-number` only handles `changeOnWheel` while the input is
focused. It binds the wheel listener when `changeOnWheel && focus`, removes it
on blur, and resets accumulated wheel delta when the listener is removed. Aheart
InputNumber currently handles wheel events whenever `changeOnWheel` is true,
even if the input has not been focused.

## Goal

Align Aheart InputNumber wheel stepping with rc focus-gated behavior.

## Scope

- Track focus state on the native input.
- Ignore wheel events when `changeOnWheel` is true but the input is not focused.
- Allow wheel stepping after focus using the existing accumulated threshold.
- Reset accumulated wheel delta on blur and stop wheel stepping after blur.
- Preserve `changeOnWheel=false`, min/max, precision, stringMode, disabled,
  readOnly, and existing `step` event metadata.
- Document that wheel stepping is active only while the input is focused.

## Non-goals

- No custom non-passive DOM listener in this phase.
- No change to wheel distance threshold, direction reset, or stale reset.
- No change to keyboard or control button stepping.

## Verification

- Add focused regression coverage proving wheel input is ignored before focus,
  works after focus, and is ignored again after blur.
- Run focused InputNumber tests, component typecheck, component build, full
  component tests, docs build, `git diff --check`, and demo HTTP check.
