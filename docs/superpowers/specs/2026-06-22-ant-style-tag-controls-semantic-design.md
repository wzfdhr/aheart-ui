# Ant Style Tag Controls Semantic API Design

## Context

`ATag` currently supports only color, `closable`, and a `close` event. Ant Design Tag 6 exposes a richer surface for clickable tags, variant control, close icon customization, semantic styling, checkable tags, and checkable tag groups.

Official reference:

- https://ant.design/components/tag/

## Scope

This slice adds:

- `ATag` `variant`, `bordered`, `disabled`, `href`, `target`, `rel`, `title`, `icon`, and `closeIcon`.
- `ATag` root hooks: `className`, `rootClassName`, and `style`.
- `ATag` semantic hooks: `classNames` and `styles`.
- `ATag` semantic parts: `root`, `icon`, `content`, and `close`.
- `ATag` custom close icon behavior where `closeIcon={false}` hides the close affordance.
- `ACheckableTag` as the Vue export for Ant's `Tag.CheckableTag`.
- `ATagGroup` as the Vue export for Ant's `Tag.CheckableTagGroup`.
- `ATagGroup` `value`, `modelValue`, `defaultValue`, `multiple`, primitive options, option metadata, and semantic hooks.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add React-style dotted runtime aliases (`Tag.CheckableTag`), drag sorting demos, or design token generation.

## Behavior

### Tag

`ATag` resolves its rendered root as:

1. `<a>` when `href` is present and the tag is not disabled.
2. `<span>` otherwise.

`variant` defaults to `filled`, matching Ant Design 6. `bordered=false` is retained as a compatibility alias and resolves to a borderless visual class unless an explicit `variant` is supplied.

`closeIcon=false` or `closeIcon=null` hides the close button. Otherwise, `closable` renders a close button using either the custom close icon, the `closeIcon` slot, or the default `×`.

Disabled tags do not navigate and do not emit `close`.

### CheckableTag

`ACheckableTag` is controlled by `checked`, mirroring Ant's controlled-only `Tag.CheckableTag`. User interaction emits:

- `update:checked(nextChecked)`
- `change(nextChecked, event)`

Disabled checkable tags do not emit.

### TagGroup

`ATagGroup` normalizes options as:

- `string` or `number`: `{ label: String(option), value: option }`
- object option: preserves `label`, `value`, `disabled`, `icon`, `className`, `style`, and `title`

The selected value resolves in this order:

1. `value`
2. `modelValue`
3. internal state initialized from `defaultValue`

For `multiple=true`, selected values are arrays. For single mode, clicking the current checked option clears selection to `null`, matching the official group value type of `string | number | Array<string | number> | null`.

On change, `ATagGroup` emits:

- `update:modelValue(nextValue)`
- `update:value(nextValue)`
- `change(nextValue)`

## Testing

Use Vitest and Vue Test Utils:

- Verify `ATag` variant, bordered compatibility, anchor rendering, disabled behavior, and semantic style hooks.
- Verify `ATag` icon and custom close icon behavior.
- Verify `ACheckableTag` controlled checked state, events, and disabled behavior.
- Verify `ATagGroup` single and multiple value handling, uncontrolled defaults, primitive options, option metadata, and semantic hooks.
- Run targeted Tag tests, package typecheck, package build, docs build, then full verification.

## Documentation

Update `docs/components/tag.md` with:

- Variant, link, custom close icon, checkable, group, and semantic styling examples.
- Expanded API tables for Tag, CheckableTag, TagGroup, events, slots, options, and Semantic DOM.
