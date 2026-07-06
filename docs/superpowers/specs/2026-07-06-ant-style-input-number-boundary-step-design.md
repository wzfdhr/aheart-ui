# InputNumber Boundary Step Design

## Goal

Align `AInputNumber` min/max boundary step behavior with Ant-style `InputNumber`.

## Source Behavior

`rc-input-number` computes `upDisabled` when the current decimal value is greater than or equal to `max`, and `downDisabled` when it is less than or equal to `min`. `onInternalStep` returns early when the requested direction is disabled.

## Current Gap

`AInputNumber` clamps values to `min` and `max`, but the direction controls remain enabled and a step past a boundary can still emit `update:modelValue`, `change`, and `step` with the clamped boundary value.

## Design

- Add direction-specific boundary state:
  - increase disabled when `mergedValue >= max`
  - decrease disabled when `mergedValue <= min`
- Use decimal string comparison so numeric and `stringMode` values follow the same boundary checks.
- Keep the controls hidden when the whole component is disabled or read-only.
- Return early in shared `handleStep` when the requested direction is boundary-disabled.
- Do not change typed input clamping, formatter/parser behavior, or emitted payloads for valid steps.

## Test Coverage

Add a focused InputNumber test that verifies:

- at `max`, the increase button is disabled and ArrowUp emits no value or step event
- at `min`, the decrease button is disabled and ArrowDown emits no value or step event

## Out of Scope

- Styling disabled controls differently beyond the native disabled attribute.
- Changing min/max typed input behavior.
- Supporting non-finite min/max values.
