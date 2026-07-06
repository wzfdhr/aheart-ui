# Ant-style InputNumber Key Aliases Design

## Context

`@rc-component/input-number` handles keyboard stepping for both modern
`ArrowUp`/`ArrowDown` key values and legacy `Up`/`Down` key values. Aheart
InputNumber currently handles only `ArrowUp` and `ArrowDown`, so keyboard
events with the legacy key names do not step.

## Goal

Support `Up` and `Down` as aliases for keyboard stepping while preserving the
existing `ArrowUp` and `ArrowDown` behavior.

## Scope

- Treat `Up` exactly like `ArrowUp`.
- Treat `Down` exactly like `ArrowDown`.
- Preserve the `keyboard` prop suppression behavior.
- Preserve Shift 10x stepping and `step` event metadata.
- Document that keyboard stepping accepts both key name forms.

## Non-goals

- No change to Enter handling.
- No press-and-hold button repeat behavior.
- No change to wheel or control button stepping.
- No change to emitted event names or emitter labels.

## Verification

- Add a focused test proving `Up` and `Down` trigger keyboard stepping and emit
  `step` metadata with `emitter: 'keyboard'`.
- Run focused InputNumber tests, component typecheck, component build, full
  component tests, docs build, and `git diff --check`.
