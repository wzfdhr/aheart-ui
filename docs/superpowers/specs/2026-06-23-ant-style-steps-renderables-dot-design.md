# Ant Style Steps Renderables and Dot Design

## Context

`ASteps` already supports item arrays, current/status derivation, disabled steps, vertical direction, ConfigProvider size fallback, type variants, `titlePlacement`, `initial`, percent rendering, item subtitles/content, and semantic class/style hooks.

Ant Design Steps documents `items` fields such as `title`, `subTitle`, `description`, and `icon` as renderable nodes rather than plain strings. It also treats dot-style steps as dot indicators instead of numeric indicators.

Official reference:

- https://ant.design/components/steps/

## Scope

This slice adds:

- `VNodeChild` support for `StepItem.title`.
- `VNodeChild` support for `StepItem.description`.
- `VNodeChild` support for `StepItem.icon`.
- `VNodeChild` support for `StepItem.subTitle`.
- `VNodeChild` support for `StepItem.content`.
- Dot type rendering without generated numeric/status text when no explicit icon is provided.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add responsive layout, label placement auto-switching, custom progress dot render callbacks, item-level `percent`, or new status values.

## Behavior

### Renderable Items

`StepItem` content fields accept `VNodeChild` values:

```ts
export type StepRenderable = VNodeChild

export interface StepItem {
  title: StepRenderable
  description?: StepRenderable
  status?: StepStatus
  disabled?: boolean
  icon?: StepRenderable
  subTitle?: StepRenderable
  content?: StepRenderable
}
```

The component renders these fields through a small local render-node helper, matching existing component patterns in Alert, Empty, Input, and other renderable slices.

### Dot Type

For `type="dot"`, generated numeric/status indicator text is not rendered. The circular `.aheart-steps__icon` itself is the dot marker.

Explicit `item.icon` still renders in dot type so callers who intentionally provide a custom icon keep control.

Percent rendering remains limited to the current `process` item when `percent` is a number.

### Existing Behavior

The slice preserves:

- `current`, `status`, `disabled`, and `change` behavior.
- `direction` / `orientation` behavior.
- `titlePlacement`, `initial`, and percent clamping.
- Type classes for `default`, `dot`, `navigation`, `panel`, and `inline`.
- ConfigProvider size fallback.
- Semantic hooks for root, item, activeItem, button, indicator, icon, content, title, subTitle, description, and connector.

## Testing

Add Vitest coverage for:

- VNode item fields rendering for title, description, icon, subTitle, and content.
- `type="dot"` suppressing generated number text for items without explicit icons.
- `type="dot"` still rendering explicit item icons.

The RED tests should fail before implementation because current StepItem fields are string-only in the template and dot type still renders generated numeric text.

## Documentation

Update `docs/components/steps.md` to:

- Mention renderable item fields in the progress/content demo.
- Update API tables from `string` to `VNodeChild` for the renderable fields.
- Clarify that `type="dot"` renders dot markers and `initial` only affects generated numeric indicators in non-dot modes.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Steps item renderables and dot indicator parity only.
- Ambiguity check: explicit icons in dot mode remain supported; generated numeric/status text is suppressed.
