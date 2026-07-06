# Ant Style Radio Group Orientation Design

## Goal

Add Ant-style direction aliases to `ARadioGroup`: `orientation` and `vertical`.

## Context

`ARadioGroup` currently uses `direction="horizontal" | "vertical"` for layout. Current Ant Design Radio Group documents `orientation="horizontal" | "vertical"` and a `vertical` boolean shortcut. Aheart should keep the existing `direction` API while adding those compatibility aliases.

## Requirements

- Add `orientation?: 'horizontal' | 'vertical'` to `ARadioGroup`.
- Add `vertical?: boolean` to `ARadioGroup`.
- Resolve direction in this order:
  1. `orientation`
  2. `vertical=true` resolves to `vertical`
  3. `direction`
- Preserve the existing default horizontal layout.
- Preserve existing `direction` behavior for current consumers.
- Preserve option rendering, button mode, solid style, block layout, size, disabled inheritance, value aliases, and events.
- Update Radio documentation to list `orientation` and `vertical`.
- Refresh generated `es` and `lib` package output.

## Architecture

Keep `direction` in the prop surface as the legacy local API. Add a computed `resolvedDirection` in `radio-group.vue`, and use it only for the layout class. No DOM structure or event flow changes are needed.

## Testing

Add a focused RadioGroup unit test that verifies:

- `orientation="vertical"` wins over `direction="horizontal"`.
- `vertical` resolves to vertical when `orientation` is absent.
- `orientation="horizontal"` wins over `vertical`.

The test should fail before implementation because `orientation` and `vertical` are not declared props and the group still reads `props.direction` directly.

## Documentation

Update `docs/components/radio.md` API table so consumers see `orientation`, `vertical`, and the existing `direction` compatibility prop together.

## Out of Scope

- Changing CheckboxGroup direction aliases.
- Changing RadioGroup DOM structure.
- Changing button option styling.
- Changing existing `direction` default or removing `direction`.

## Self Review

- Placeholder scan: no placeholders remain.
- Consistency check: precedence is stated once and reused by implementation and tests.
- Scope check: this is a single RadioGroup API compatibility slice.
- Ambiguity check: `orientation` and `vertical` priority are explicit.
