# Ant Style Drawer Renderable Header Footer Design

## Goal

Align Drawer header and footer content props with Ant Design's renderable content model by allowing `title`, `extra`, and `footer` to accept Vue renderable nodes while preserving the existing slots and boolean footer behavior.

## References

- Ant Design Drawer: https://ant.design/components/drawer/

Ant Design documents `title`, `extra`, and `footer` as renderable node content. Aheart UI maps that shape to Vue `VNodeChild`, with slots keeping priority over prop fallbacks.

## Scope

Implement:

- `title` as `VNodeChild`.
- `extra` as `VNodeChild`.
- `footer` as `boolean | VNodeChild`.
- A shared `DrawerRenderable` exported type.
- Prop fallback rendering through the existing Drawer render-node helper.
- Slot override priority for `title`, `extra`, and `footer`.
- Numeric `0` rendering for `title`, `extra`, and `footer`.
- Docs and generated declaration/runtime output.

Keep:

- Existing string `title` behavior.
- Existing string/number `extra` behavior.
- Existing `footer: true` behavior for showing a footer region with slot content.
- Existing `footer` slot behavior when no `footer` prop is provided.
- Existing `title`, `extra`, and `footer` slots.

Out of scope:

- `drawerRender`.
- Nested drawer `push` behavior.
- `autoFocus`.
- Renderable body content props; default slot remains the Drawer body API.
- Footer action button presets.

## Behavior

- `title`, `extra`, and `footer` render strings, numbers, arrays, and Vue VNodes.
- `0` is meaningful content and renders as text.
- `undefined`, `null`, `false`, `true`, and empty string are absent for `title` and `extra`.
- `footer: true` renders the footer container and relies on the `footer` slot for content, matching existing boolean behavior.
- `footer: false` or `footer: null` hides the footer container.
- A `footer` slot renders when the footer prop is not `false` or `null`.
- `title`, `extra`, and `footer` slots override matching prop content.
- Header rendering still depends on visible title, visible extra, or a visible close button.

## Type Design

```ts
export type DrawerRenderable = VNodeChild
export type DrawerTitle = DrawerRenderable
export type DrawerExtra = DrawerRenderable
export type DrawerFooter = boolean | DrawerRenderable
```

`drawerProps.title`, `drawerProps.extra`, and `drawerProps.footer` use these aliases.

## Testing

Add tests before implementation for:

- VNode `title`, `extra`, and `footer` props.
- Slot priority over renderable prop fallbacks.
- Numeric `0` rendering for all three surfaces.
- `footer: null` hiding a provided footer slot.

Existing Drawer tests must continue to pass.

## Documentation

Update `docs/components/drawer.md` with:

- A renderable header/footer example.
- API rows for renderable `title`, `extra`, and `footer`.
- A `DrawerRenderable` type section.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice is limited to Drawer header and footer renderable content props.
- Compatibility check: existing string props, footer boolean, and slots remain supported.
