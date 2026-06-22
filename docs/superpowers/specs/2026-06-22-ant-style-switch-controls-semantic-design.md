# Ant Style Switch Controls Semantic API Design

## Context

`ASwitch` currently covers the basic `modelValue`, loading, size, disabled, and text-label behavior, but it is still thinner than Ant Design Switch. Ant exposes value aliases for Form ergonomics, uncontrolled initial state, click callbacks, and semantic `classNames` / `styles` hooks for `root`, `content`, and `indicator`.

Official reference:

- https://ant.design/components/switch/

## Scope

This slice adds:

- Controlled aliases: `checked` and `value`, with `modelValue` still supported as the Vue-first API.
- Uncontrolled initial values: `defaultChecked` and `defaultValue`.
- `click` event emitted with the next checked state and the original mouse event.
- `change` event emitted with the next checked state and the original mouse event.
- `update:checked`, `update:value`, and `update:modelValue` emissions on user toggles.
- `className`, `rootClassName`, `style`, `classNames`, and `styles` for semantic styling.
- Semantic parts: `root`, `content`, and `indicator`.
- Slot support for checked and unchecked content so consumers can pass icon-like or richer inline content.
- Tests, docs, and build outputs.

This slice does not add imperative `focus()` / `blur()` exposes, Form.Item valuePropName integration, async loading state management, or token-specific CSS variables. Those can be handled in later passes.

## Behavior

### Value Resolution

The checked state resolves in this order:

1. `checked`
2. `value`
3. `modelValue`
4. internal uncontrolled state initialized from `defaultChecked`, then `defaultValue`, then `false`

If any controlled prop is present, clicking does not mutate internal state. If no controlled prop is present, clicking updates the internal state before emitting events.

### Events

When the user clicks an enabled, non-loading switch:

- compute `nextChecked = !mergedChecked`
- update internal state only when uncontrolled
- emit `update:modelValue`, `update:checked`, and `update:value` with `nextChecked`
- emit `change(nextChecked, event)`
- emit `click(nextChecked, event)`

When disabled or loading, clicks are ignored and no events are emitted.

### Semantic DOM

- `root`: the button element with `role="switch"`
- `indicator`: the visual handle
- `content`: the checked or unchecked label/content area

`className`, `rootClassName`, and `classNames.root` all apply to the root button. `style` and `styles.root` merge on the root button.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before implementation.
- Verify controlled alias precedence and emissions.
- Verify uncontrolled `defaultChecked` / `defaultValue` behavior.
- Verify disabled/loading click suppression.
- Verify semantic classes and styles.
- Verify checked/unchecked content slots.
- Run targeted Switch tests, component typecheck, docs build, and package build.

## Documentation

Update `docs/components/switch.md`:

- Add examples for aliases/default values, slots, and semantic styles.
- Expand API table with new props.
- Expand events to include `click` and event payloads.
- Add slots and Semantic DOM sections.
