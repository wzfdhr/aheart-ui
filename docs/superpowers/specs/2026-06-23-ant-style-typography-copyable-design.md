# Ant Style Typography Copyable Design

## Context

`ATypography`, `ATitle`, `AText`, `AParagraph`, and `ALink` already provide the foundation for Ant-style typography: heading levels, text variants, mark/strong/italic/code/keyboard/delete/underline, disabled states, paragraph ellipsis classes, root semantic hooks, and docs.

Ant Design Typography exposes `copyable` on text-like typography components and `actions` placement for the operation bar. The current Aheart implementation does not render a copy operation, cannot call clipboard APIs, and has no way to place typography actions before the content.

Official reference:

- https://ant.design/components/typography/

## Scope

This slice adds:

- `copyable` support for `ATitle`, `AText`, and `AParagraph`.
- Boolean copyable mode that copies rendered text content.
- Object copyable mode with custom `text`, `icon`, `tooltips`, `format`, `tabIndex`, and `onCopy`.
- Copied state for icon and tooltip switching.
- `actions.placement` support for start/end operation placement.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add editable typography, expandable ellipsis, tooltip components around the copy button, or copyable support for `ALink`.

## Behavior

### Copyable

`copyable` accepts `true` or a configuration object:

```ts
export interface TypographyCopyableConfig {
  text?: string | (() => string | Promise<string>)
  icon?: VNodeChild | [VNodeChild, VNodeChild]
  tooltips?: false | [VNodeChild, VNodeChild]
  format?: 'text/plain' | 'text/html'
  tabIndex?: number
  onCopy?: (event: MouseEvent) => void
}
```

When `copyable` is true, the component copies the rendered slot text from an internal content wrapper. When `copyable.text` is a string or function, that value has priority over rendered slot text.

### Copied State

After a successful copy, the action enters copied state. If `copyable.icon` is an array, index 0 renders before copy and index 1 renders after copy. If `copyable.tooltips` is an array, index 0 is used before copy and index 1 after copy. The default labels are `Copy` and `Copied`.

### Action Placement

`actions.placement` controls whether the copy action renders before or after content:

```ts
export interface TypographyActionsConfig {
  placement?: 'start' | 'end'
}
```

The default placement is `end`.

### Existing Behavior

The slice preserves:

- Existing root tags for Title/Text/Paragraph.
- Text modifier classes and root semantic hooks.
- Paragraph ellipsis behavior.
- Disabled style classes; disabled text does not execute copy.

## Testing

Add Vitest coverage for:

- `AText copyable` copying rendered text through `navigator.clipboard.writeText`.
- `AParagraph copyable` using custom async copy text, custom copied icon, callback, and start placement.
- `ATitle copyable` rendering a copy action while preserving heading level.
- Disabled copyable text not calling the clipboard.

The RED tests should fail before implementation because current typography components do not render copy buttons or call clipboard APIs.

## Documentation

Update `docs/components/typography.md` to:

- Add copyable examples for Text, Paragraph, and Title.
- Document `copyable`, `actions`, `TypographyCopyableConfig`, and `TypographyActionsConfig`.
- Note that `copyable.text` overrides rendered slot text and `actions.placement` controls action position.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on copyable typography actions only.
- Ambiguity check: disabled text does not copy; Link is out of scope.
