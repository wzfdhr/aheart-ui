# Ant-style InputNumber Precision Display Design

## Context

`@rc-component/input-number` applies default formatter precision when the user
is not actively typing. With `precision={2}`, `12.5` displays as `12.50`; with
`decimalSeparator=","`, the same value displays as `12,50`. Aheart InputNumber
currently applies precision to emitted numeric values, but the default display
path uses `String(value)` and does not pad trailing decimal zeros.

## Goal

Align Aheart InputNumber's default non-typing display formatting with rc
precision behavior.

## Scope

- When no custom `formatter` is provided and the input is not in pending user
  typing state, display valid values with the configured `precision`.
- Preserve `decimalSeparator` display output after precision formatting.
- Preserve custom `formatter` precedence.
- Preserve pending input text while `changeOnBlur` is active, so typing such as
  `1.` is not reformatted prematurely.
- Preserve parser, min/max, stringMode, composition, step, keyboard, and wheel
  behavior.
- Document that precision also formats the displayed value.

## Non-goals

- No change to custom formatter behavior.
- No new locale grouping or thousands formatting.
- No new precision prop type.

## Verification

- Add a focused regression test for `precision=2` display and
  `precision=2 + decimalSeparator=","` display.
- Run focused InputNumber tests, component typecheck, component build, full
  component tests, docs build, `git diff --check`, and demo HTTP check.
