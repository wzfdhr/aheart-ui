# Ant Style Breadcrumb Separator Path Design

## Context

The project is iteratively aligning Aheart UI components with the official Ant Design component APIs. The next Breadcrumb slice is based on the official Ant Design Breadcrumb documentation at `https://ant.design/components/breadcrumb/`.

Current `ABreadcrumb` already supports `items`, renderable `title`, renderable global `separator`, `itemRender`, `params`, per-item class/style/click handling, and semantic `classNames` / `styles`. The main remaining Ant-style gaps in this focused slice are:

- Ant's `ItemType` includes `SeparatorType` entries so separators can be configured independently in the `items` array.
- Ant's `path` behavior treats each route item's path as a segment that connects to previous route item paths. Current `ABreadcrumb` resolves each `path` in isolation.

## Recommended Approach

Extend the existing component in place and keep compatibility:

- Add `BreadcrumbSeparatorItem` with `type: 'separator'` and optional `separator`.
- Keep the existing route item shape as `BreadcrumbRouteItem`.
- Allow `BreadcrumbItem` to be either route or separator.
- Render separator items as their own list item using existing separator semantic hooks.
- Resolve route `path` values as cumulative path segments for generated hrefs and `itemRender` paths.

Alternatives considered:

- Add only a per-route `separator` field. This is easier but does not match Ant's documented `SeparatorType` shape.
- Replace the current `path` behavior with router-aware navigation. That would add an app/router dependency and is outside this component-library slice.

## Component Behavior

### Separator Items

- A separator item is `{ type: 'separator', separator?: VNodeChild, key?: string | number, className?: string, style?: StyleValue }`.
- Separator items render a list item with the separator content only.
- Separator items use `classNames.item`, `classNames.separator`, `styles.item`, and `styles.separator`.
- A separator item does not receive `aria-current`, does not render a link, and does not call `itemRender`.
- A route item immediately followed by a separator item does not render the global separator after itself. The explicit separator item supplies that separator.
- A route item followed by another route item still renders the global `separator` prop.

### Cumulative Path

- Route item `path` values are interpolated with `params` and normalized as path segments.
- For a route item with `path`, the generated href is `/${cumulativeSegments.join('/')}`.
- `href` remains an explicit escape hatch and still takes precedence over generated path hrefs.
- `itemRender` receives cumulative path segments for route items only; separator items do not add path segments.
- Current item behavior stays the same: the last route item is non-link and gets `aria-current="page"`.

## Documentation

Update `docs/components/breadcrumb.md` with:

- An example for independent separator items.
- An example showing connected relative `path` segments.
- Updated `BreadcrumbItem` docs covering `BreadcrumbRouteItem | BreadcrumbSeparatorItem`.

## Testing

Use TDD:

- Add failing tests for separator items replacing the automatic separator between adjacent route items.
- Add failing tests for cumulative path href generation and `itemRender` path arguments.
- Verify red before source implementation, then targeted green and package typecheck.

## Non-Goals

- Do not add dropdown menus to breadcrumb items in this slice.
- Do not add Vue Router integration.
- Do not remove the current global `separator` prop.
- Do not remove existing route item fields or itemRender arguments.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice is focused on `SeparatorType` and cumulative `path`.
- Compatibility check: existing linked items, disabled items, VNode titles, itemRender, and semantic hooks must continue to pass.
