# Ant-style InputNumber Input Event Design

## Context

Ant Design InputNumber inherits the rc-input-number `onInput` callback, which receives the raw input text as a string. Aheart InputNumber currently exposes `change`, `pressEnter`, and `step`, but it does not emit a component-level raw input event.

Recent native attribute forwarding lets `onInput` reach the inner input as a DOM event listener. For Ant-style compatibility, component `input` should instead represent the raw text callback while other undeclared native listeners continue to pass through.

## Goal

Emit raw input text from InputNumber whenever the user types, without changing value commit semantics.

## Scope

- Add an `input` emit with `(value: string) => void`.
- Emit the raw text on every input event, including invalid intermediate text.
- Preserve `changeOnBlur`: value `change` remains deferred until blur/Enter by default.
- Preserve immediate value commits when `changeOnBlur` is false.
- Update docs so `input` is documented as a component event rather than a native listener pass-through example.

## Non-goals

- No new prop.
- No change to parser, formatter, precision, min/max, or step behavior.
- No change to native listener forwarding except that `@input` is now the component event.

## Verification

- Add a focused test proving `input` emits raw text while `change` remains deferred.
- Run focused InputNumber tests, component typecheck, full component tests, component build, docs build, and `git diff --check`.
