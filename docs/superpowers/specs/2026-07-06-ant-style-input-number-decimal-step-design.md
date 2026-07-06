# InputNumber Decimal Step Design

## Goal

Align `AInputNumber` numeric stepping with Ant Design's decimal-safe behavior so decimal steps do not emit JavaScript floating point artifacts.

## Source Behavior

`rc-input-number` builds step targets with decimal helpers in `onInternalStep`, including decuple steps for Shift-key stepping, then passes the decimal value through the shared value update path.

## Current Gap

`AInputNumber` already uses decimal string helpers for `stringMode`, but numeric mode still computes stepped values with `Number(baseValue ?? 0) + offset`. This can emit values such as `0.30000000000000004` for `modelValue: 0.2` and `step: 0.1`.

## Design

- Reuse the existing decimal string addition helpers for all step target calculation.
- Convert the decimal-safe result back to `number` when `stringMode` is disabled.
- Keep `step` event `offset` as the existing numeric offset for compatibility.
- Use the decuple decimal string step for Shift-key stepping in both numeric and string modes.
- Preserve min, max, precision, parser, formatter, wheel, and hold-step behavior.

## Test Coverage

Add a focused InputNumber test for `modelValue: 0.2` and `step: 0.1` that clicks the increase control and expects emitted value `0.3`, not a floating point artifact.

## Out of Scope

- Auto-inferring display precision from `step`.
- Changing numeric mode emitted values to strings.
- Reworking the decimal helper implementation.
