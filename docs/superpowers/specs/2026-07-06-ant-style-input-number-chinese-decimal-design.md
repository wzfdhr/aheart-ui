# Ant-style InputNumber Chinese Decimal Design

## Context

`@rc-component/input-number` includes an input normalization step for Chinese
input method flows: when no custom `parser` is provided, it converts `。` to
`.` and then recollects the input. This prevents values such as `1。5` from
being treated as `15` by the legacy default parser cleanup.

## Goal

Align Aheart InputNumber's default parser with the rc Chinese decimal point
normalization behavior.

## Scope

- When `parser` is not provided, treat `。` as `.` before default parser cleanup.
- Preserve the existing `decimalSeparator` conversion and formatted-character
  removal behavior.
- Preserve custom `parser` precedence; custom parsers continue to receive the
  original raw input string.
- Preserve `changeOnBlur`, composition input handling, stringMode, precision,
  min/max, formatter, step, keyboard, and wheel behavior.
- Document the default parser normalization.

## Non-goals

- No asynchronous recollection queue is introduced.
- No locale-wide punctuation parser is added.
- No change to custom parser signatures.

## Verification

- Add a focused regression test that `1。5` emits `1.5` with the default parser.
- Run focused InputNumber tests, component typecheck, component build, full
  component tests, docs build, `git diff --check`, and demo HTTP check.
