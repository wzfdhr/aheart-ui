# Ant Style InputNumber Decimal Separator Design

## Context

Ant Design's InputNumber API includes `decimalSeparator` for customizing the visible decimal separator. Aheart InputNumber currently supports formatter/parser hooks, precision, controls, wheel stepping, variants, status, and semantic styling, but it does not expose a first-class decimal separator prop.

Reference: Ant Design InputNumber documentation, `https://ant.design/components/input-number/`.

## Goal

Add a focused `decimalSeparator` compatibility slice to `AInputNumber`.

## Behavior

- `decimalSeparator` is a string prop accepted by `AInputNumber`.
- When `formatter` is not provided, the displayed value replaces the default `.` decimal point with `decimalSeparator`.
- When `parser` is not provided, typed input replaces `decimalSeparator` with `.` before numeric parsing.
- Existing `formatter` and `parser` hooks keep precedence. If users provide either hook, that hook controls its side of formatting or parsing.
- If `decimalSeparator` is omitted or equals `.`, default behavior is unchanged.

## Non-Goals

- Do not implement `stringMode`.
- Do not change precision, min/max, keyboard, wheel, or step behavior.
- Do not add locale-aware grouping separators.
- Do not delay change emission to blur.

## Files

- `packages/components/src/input-number/types.ts`: add `decimalSeparator`.
- `packages/components/src/input-number/input-number.vue`: apply default display and parse separator conversion.
- `packages/components/src/input-number/__tests__/input-number.test.ts`: add red-green coverage.
- `docs/components/input-number.md`: document the prop and add a short example.
- Generated component outputs under `packages/components/es` and `packages/components/lib` are refreshed by the component build.

## Testing

- Focused InputNumber tests must first fail because comma decimal display/parse is not implemented.
- After implementation, focused InputNumber tests must pass.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to default decimal separator display and parsing.
- Consistency check: tests, docs, source, and generated output all use the same `decimalSeparator` behavior.
