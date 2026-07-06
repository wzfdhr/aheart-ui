# Ant-style InputNumber Default Parser Design

## Context

`@rc-component/input-number` has a legacy default parser that removes display
formatting characters after applying `decimalSeparator`. This lets inputs such
as `$ 1,234.50` parse as `1234.50` when no custom parser is provided. Aheart
InputNumber currently passes the raw text to `Number(...)`, so formatted numeric
text does not commit.

## Goal

Support Ant/rc-compatible default parsing for formatted numeric input text.

## Scope

- When `parser` is not provided, normalize `decimalSeparator` and remove
  non-word, non-dot, and non-minus characters before numeric validation.
- Preserve custom `parser` behavior unchanged.
- Preserve empty input, `stringMode`, min/max, precision, `changeOnBlur`, and
  current event semantics.
- Document default parser behavior.

## Non-goals

- No change to formatter output.
- No locale-aware thousands parsing beyond rc's default cleanup rule.
- No change to custom parser signatures.

## Verification

- Add a focused test proving `$ 1,234.50` commits as `1234.5` with the default
  parser.
- Run focused InputNumber tests, component typecheck, component build, full
  component tests, docs build, and `git diff --check`.
