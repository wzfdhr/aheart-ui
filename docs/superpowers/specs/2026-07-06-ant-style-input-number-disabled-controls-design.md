# Ant-style InputNumber Disabled Controls Design

## Context

Ant Design InputNumber derives its control visibility from `controls`, disabled
state, and read-only state. In the official implementation, controls are not
rendered when the component is disabled or read-only. Aheart InputNumber
currently keeps the controls visible and disables the buttons.

## Goal

Hide InputNumber step controls when the resolved disabled state is true or when
`readOnly` is true.

## Scope

- Keep controls hidden when `controls` is `false`.
- Hide controls when `disabled` is true, including disabled inherited from
  `AConfigProvider`.
- Hide controls when `readOnly` is true.
- Preserve step behavior when controls are visible.
- Preserve keyboard and wheel guard behavior for disabled/read-only states.

## Non-goals

- No change to the control icon API.
- No change to `mode`.
- No change to value parsing, clamping, formatter/parser, or emitted events.

## Verification

- Add focused tests for direct disabled, ConfigProvider disabled, and read-only
  controls visibility.
- Run focused InputNumber tests, component typecheck, full component tests,
  component build, docs build, and `git diff --check`.
