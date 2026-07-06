# InputNumber Step Focus Design

## Goal

Align `AInputNumber` step interactions with Ant-style focus behavior by focusing the inner input after a valid step.

## Source Behavior

`rc-input-number` calls `inputRef.current?.focus()` at the end of `onInternalStep` after a valid handler, keyboard, or wheel step.

## Current Gap

`AInputNumber` emits the stepped value and `step` event, but it does not explicitly return focus to the input. Clicking a control can leave focus outside the text input, which diverges from Ant-style interaction behavior.

## Design

- Focus the inner input after `handleStep` completes a valid step.
- Keep disabled and read-only steps as no-ops, including no focus change.
- Reuse the existing `inputRef`.
- Do not change emitted values, `step` event payloads, hold-repeat behavior, keyboard behavior, or wheel thresholds.

## Test Coverage

Add a focused DOM-attached test that clicks the increase control and verifies `document.activeElement` is the inner input after the step.

## Out of Scope

- Changing focus cursor placement.
- Changing disabled control rendering.
- Changing control repeat timing.
