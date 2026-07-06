# Ant-style InputNumber Native Attributes Design

## Context

Ant Design documents `InputNumber` as accepting native `<input>` attributes and forwarding them to the underlying input element. The current Vue wrapper owns a root `<span>` and manually renders the inner `<input>`, so undeclared attributes such as `name`, `autocomplete`, `pattern`, `aria-label`, `onInput`, and `onBlur` currently land on the root wrapper instead of the actual input.

## Goal

Forward non-structural native input attributes and listeners to the internal `<input>` while preserving the existing root styling contract.

## Scope

- Forward undeclared attributes and listeners to the internal input.
- Keep `class` and `style` on the component root for backwards compatibility.
- Continue to control core numeric behavior internally: `value`, `disabled`, `readonly`, `min`, `max`, and `step` remain owned by component props.
- Allow native `type` and `inputmode` to override the defaults, matching Ant's documented native input attribute support.

## Non-goals

- No new public value event is introduced in this phase.
- No change to `changeOnBlur`, parsing, precision, step, or string mode semantics.
- No migration of `classNames.input` or `styles.input`; those remain the semantic customization API for the inner input.

## Verification

- Add focused tests showing native attributes and listeners are applied to the inner input.
- Add a guard that component `class` remains on the root.
- Run the InputNumber suite, full component tests, typecheck, component build, docs build, and `git diff --check`.
