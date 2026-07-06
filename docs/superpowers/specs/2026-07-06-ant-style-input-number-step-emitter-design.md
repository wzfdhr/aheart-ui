# InputNumber Step Emitter Design

## Goal

Align `AInputNumber` step event metadata with Ant Design by including the interaction source in the emitted step info.

## Source API

Ant Design documents the step callback info as containing:

- `offset`
- `type`
- `emitter`, one of `handler`, `keydown`, or `wheel`

## Current Gap

`AInputNumber` currently emits step info with only `offset` and `type`. Consumers cannot distinguish whether a value change came from the control buttons, keyboard arrows, or mouse wheel.

## Design

- Add `InputNumberStepEmitter = 'handler' | 'keydown' | 'wheel'`.
- Add `emitter` to `InputNumberStepInfo`.
- Pass the emitter explicitly from each interaction path:
  - control buttons use `handler`
  - arrow keys use `keydown`
  - mouse wheel uses `wheel`
- Keep `offset` as a number and `type` as `up | down`.
- Keep the event name `step` and existing value argument unchanged.

## Testing

Update focused InputNumber tests so the step event payload includes `emitter` for:

- control click
- keyboard arrow
- wheel step
- string `step` values

## Out of Scope

- Changing `update:modelValue` or `change` events
- Adding `changeOnBlur`
- Adding `stringMode`
- Implementing public focus/blur instance methods
