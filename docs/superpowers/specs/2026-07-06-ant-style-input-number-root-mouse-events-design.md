# Ant-style InputNumber Root Mouse Events Design

## Context

`@rc-component/input-number` models mouse handlers such as click, mousedown,
mouseup, mouseenter, mousemove, mouseleave, and mouseout as outer wrapper
events. Aheart InputNumber currently forwards undeclared listeners to the inner
`<input>`, so wrapper-level mouse events do not fire when the component root
itself is triggered.

## Goal

Route InputNumber mouse listeners that Ant treats as wrapper events to the
outer root element while preserving native input attributes and non-mouse
listeners on the inner input.

## Scope

- Route `click`, `mousedown`, `mouseup`, `mouseenter`, `mousemove`,
  `mouseleave`, and `mouseout` listeners to the root element.
- Preserve `class` and `style` on the root element.
- Preserve input-specific attributes and listeners such as `name`,
  `autocomplete`, `pattern`, `aria-*`, `blur`, and `focus` on the inner input.
- Update docs to describe the split between root mouse listeners and inner input
  attributes.

## Non-goals

- No new emitted events.
- No change to value, parser, formatter, step, keyboard, or wheel behavior.
- No change to addon, prefix, suffix, or controls rendering.

## Verification

- Add a focused test proving root mouse listeners fire on the outer element.
- Keep the existing focused test proving native input attributes/listeners stay
  on the inner input.
- Run focused InputNumber tests, component typecheck, full component tests,
  component build, docs build, and `git diff --check`.
