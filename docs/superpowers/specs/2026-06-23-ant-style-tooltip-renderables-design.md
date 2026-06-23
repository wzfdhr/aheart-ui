# Ant Style Tooltip Renderables Design

## Context

`ATooltip` already supports hover/focus/click/context menu triggers, controlled and uncontrolled open state, placement, color, arrow configuration, z-index, hover delays, `destroyOnHidden`, `fresh`, legacy overlay class/style props, and semantic class/style hooks.

Ant Design Tooltip models `title` as `ReactNode | () => ReactNode`, and treats empty title values as no tooltip. The current Aheart implementation types and renders `title` as a plain string, so Vue nodes, render functions, and numeric nodes are not rendered as DOM.

Official reference:

- https://ant.design/components/tooltip/

## Scope

This slice adds:

- `VNodeChild | () => VNodeChild` support for `title`.
- Correct rendering of numeric nodes such as `0`.
- Slot override priority for the `title` slot.
- Preservation of the existing empty-title behavior: `undefined`, `null`, `false`, and `''` do not render a popup unless the `title` slot is present.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not change trigger timing, controlled state, `destroyOnHidden`, `fresh`, portal/container behavior, placement alignment, arrow geometry, or semantic class/style contracts.

## Behavior

### Renderable Title

`title` accepts:

```ts
export type TooltipRenderable = VNodeChild
export type TooltipRenderableFactory = () => VNodeChild
export type TooltipTitle = TooltipRenderable | TooltipRenderableFactory
```

Render functions are called at render time. The `title` slot still overrides the `title` prop fallback.

### Numeric Nodes

`0` is treated as renderable tooltip content rather than as an empty value.

### Empty Title

`undefined`, `null`, `false`, and `''` are treated as absent for prop-driven title content. A `title` slot still counts as present.

### Existing Behavior

The slice preserves:

- Trigger handling and controlled/uncontrolled open behavior.
- `update:open` and `openChange` events.
- Placement, color, hover delays, `destroyOnHidden`, `fresh`, arrow configuration, z-index, overlay legacy props, and semantic hooks.

## Testing

Add Vitest coverage for:

- VNode and render-function `title` props.
- Numeric `0` title rendering.
- `title` slot continuing to override renderable prop fallback.
- Empty string title not rendering a popup.

The RED tests should fail before implementation because current props reject object/function/number title values and the template relies on string interpolation and truthiness.

## Documentation

Update `docs/components/tooltip.md` to:

- Add a renderable title demo.
- Document `title` as `VNodeChild | () => VNodeChild`.
- Mention `title` slot priority and empty-title behavior.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Tooltip title renderability only.
- Ambiguity check: empty string remains absent; numeric `0` renders.
