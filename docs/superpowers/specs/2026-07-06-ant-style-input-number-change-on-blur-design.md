# Ant Style InputNumber Change On Blur Design

## Context

Ant Design InputNumber documents `changeOnBlur` with a default value of `true`. Aheart InputNumber currently emits `update:modelValue` and `change` on every valid native input event, so typed input commits immediately.

Official reference:

- https://ant.design/components/input-number/

## Scope

This phase adds:

- `changeOnBlur?: boolean` with default `true`.
- Deferred typed-input commits until blur by default.
- Immediate typed-input commits when `changeOnBlur` is `false`.
- Enter-key commit for pending typed input before `pressEnter`.
- Existing step, keyboard arrow, wheel, min/max, precision, parser, decimal separator, and `stringMode` behavior preserved.
- Tests, docs, and generated `es` / `lib` InputNumber outputs.

This phase does not change empty input output from `undefined`, does not add focus/blur events, and does not change step event metadata.

## Behavior

When `changeOnBlur` is omitted or `true`, native typing stores the raw input text and parsed candidate value without emitting value events immediately. On blur, the latest valid candidate is emitted through `update:modelValue` and `change`. Pressing Enter also commits the pending candidate before emitting `pressEnter`.

When `changeOnBlur` is `false`, native typing follows the existing immediate behavior and emits each valid typed value on input.

Buttons, ArrowUp/ArrowDown, and wheel stepping continue to emit immediately. If a valid typed candidate is pending and the user steps before blur, the step uses that candidate as the base value.

## Testing

Add focused InputNumber tests for:

- Default deferred typed input until blur.
- Immediate typed input when `changeOnBlur` is false.
- Existing Enter parser behavior committing pending typed input.
- Existing stringMode immediate-input test explicitly using `changeOnBlur: false`.

## Documentation

Update `docs/components/input-number.md` with:

- A short `changeOnBlur` demo.
- API row for `changeOnBlur`.
- Intro text mentioning blur commit behavior.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on InputNumber typed-input commit timing only.
- Ambiguity check: blur, Enter, immediate opt-out, and step interaction are explicit.
