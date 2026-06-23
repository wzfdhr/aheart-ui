# Ant Style Popconfirm Renderables Design

## Context

`APopconfirm` already supports click/hover/focus/context menu triggers, controlled and uncontrolled open state, disabled state, placement, color, arrow, z-index, action button props, `showCancel`, popup click events, and semantic class/style hooks.

Ant Design Popconfirm models `title` and `description` as `ReactNode | () => ReactNode`, and `icon` as `ReactNode`. The current Aheart implementation types and renders those props as plain strings, so Vue nodes, render functions, numeric nodes, and explicit false/null icon values are not handled correctly.

Official reference:

- https://ant.design/components/popconfirm/

## Scope

This slice adds:

- `VNodeChild | () => VNodeChild` support for `title`.
- `VNodeChild | () => VNodeChild` support for `description`.
- `VNodeChild` support for `icon`.
- Correct rendering of numeric nodes such as `0`.
- Explicit `false` / `null` icon values hiding the icon while preserving the default icon when `icon` is omitted.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add async close loading behavior, `destroyOnHidden`, `fresh`, portal container selection, placement auto-adjustment, or align configuration.

## Behavior

### Renderable Text Content

`title` and `description` accept:

```ts
export type PopconfirmRenderable = VNodeChild
export type PopconfirmRenderableFactory = () => VNodeChild
export type PopconfirmContent = PopconfirmRenderable | PopconfirmRenderableFactory
```

Render functions are called at render time. Slots still override prop fallbacks:

- `title` slot overrides `title`.
- `description` slot overrides `description`.
- `icon` slot overrides `icon`.

### Renderable Icon

`icon` accepts `VNodeChild`.

When `icon` is omitted, Popconfirm continues to render the default `!` icon. When `icon` is `false` or `null`, the icon region is not rendered.

### Numeric Nodes

`0` is treated as renderable content for title, description, and icon rather than as an empty value.

### Existing Behavior

The slice preserves:

- Trigger handling and controlled/uncontrolled open behavior.
- `confirm`, `cancel`, `update:open`, `openChange`, and `popupClick` events.
- `okText`, `cancelText`, `okType`, button prop bags, `showCancel`, color, arrow, z-index, and semantic hooks.

## Testing

Add Vitest coverage for:

- VNode and render-function title/description/icon props.
- Numeric `0` title/description/icon rendering.
- `icon: false` hiding the icon while title content still renders.
- Slots continuing to override renderable prop fallbacks.

The RED tests should fail before implementation because current props reject object/function/number nodes and the template relies on string interpolation and truthiness.

## Documentation

Update `docs/components/popconfirm.md` to:

- Add a renderable content demo.
- Document `title` and `description` as `VNodeChild | () => VNodeChild`.
- Document `icon` as `VNodeChild` with slot priority and default/hide behavior.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Popconfirm content renderability only.
- Ambiguity check: omitted icon keeps the default icon; explicit `false` or `null` hides it.
