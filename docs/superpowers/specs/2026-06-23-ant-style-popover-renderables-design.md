# Ant Style Popover Renderables Design

## Context

`APopover` already supports title/content props and slots, hover/focus/click/context menu triggers, controlled and uncontrolled open state, placement, color, hover delays, `destroyOnHidden`, `fresh`, arrow configuration, z-index, legacy overlay class/style props, and semantic class/style hooks.

Ant Design Popover models `title` and `content` as `ReactNode | () => ReactNode`. The current Aheart implementation types and renders those props as plain strings, so Vue nodes, render functions, and numeric nodes are not rendered as DOM.

Official reference:

- https://ant.design/components/popover/

## Scope

This slice adds:

- `VNodeChild | () => VNodeChild` support for `title`.
- `VNodeChild | () => VNodeChild` support for `content`.
- Correct rendering of numeric nodes such as `0`.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not change trigger timing, controlled state, `destroyOnHidden`, `fresh`, portal/container behavior, placement alignment, arrow geometry, or semantic class/style contracts.

## Behavior

### Renderable Content

`title` and `content` accept:

```ts
export type PopoverRenderable = VNodeChild
export type PopoverRenderableFactory = () => VNodeChild
export type PopoverContent = PopoverRenderable | PopoverRenderableFactory
```

Render functions are called at render time. Slots still override prop fallbacks:

- `title` slot overrides `title`.
- `content` slot overrides `content`.

### Numeric Nodes

`0` is treated as renderable title/content rather than as an empty value.

### Empty Content

`undefined`, `null`, and `false` are treated as absent for prop-driven title/content. Slots still count as present.

### Existing Behavior

The slice preserves:

- Trigger handling and controlled/uncontrolled open behavior.
- `update:open` and `openChange` events.
- Placement, color, hover delays, `destroyOnHidden`, `fresh`, arrow configuration, z-index, overlay legacy props, and semantic hooks.

## Testing

Add Vitest coverage for:

- VNode and render-function `title` / `content` props.
- Numeric `0` title/content rendering.
- Slots continuing to override renderable prop fallbacks.

The RED tests should fail before implementation because current props reject object/function/number nodes and the template relies on string interpolation and truthiness.

## Documentation

Update `docs/components/popover.md` to:

- Add a renderable content demo.
- Document `title` and `content` as `VNodeChild | () => VNodeChild`.
- Mention title/content slots keep priority over prop fallbacks.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Popover content renderability only.
- Ambiguity check: explicit absent values are `undefined`, `null`, and `false`; numeric `0` renders.
