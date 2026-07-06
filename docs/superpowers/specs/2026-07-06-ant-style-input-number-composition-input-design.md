# Ant-style InputNumber Composition Input Design

## Context

`@rc-component/input-number` keeps IME composition state and avoids parsing the
current text while composition is active. It collects the latest input value
again on composition end, which lets Chinese and other IME flows finish before
numeric parsing or value updates run.

## Goal

Align Aheart InputNumber typed-input parsing with rc behavior during IME
composition.

## Scope

- Keep emitting raw `input` text while composition is active.
- Do not emit `update:modelValue` or `change` from typed input while
  composition is active, even when `changeOnBlur` is `false`.
- Re-parse the current input value on `compositionend`.
- For `changeOnBlur=false`, commit the parsed value on `compositionend`.
- For default `changeOnBlur=true`, keep the parsed value pending until blur or
  Enter.
- Preserve keyboard composition guard, formatter/parser precedence, min/max,
  precision, decimal separator, stringMode, and step behavior.
- Document that IME composition is parsed after composition ends.

## Non-goals

- No new public event.
- No change to control button, keyboard, or wheel stepping.
- No change to `changeOnBlur` defaults.

## Verification

- Add a focused regression test that proves composing text emits raw `input`
  but no value events until `compositionend` when `changeOnBlur=false`.
- Run focused InputNumber tests, component typecheck, component build, full
  component tests, docs build, `git diff --check`, and demo HTTP check.
