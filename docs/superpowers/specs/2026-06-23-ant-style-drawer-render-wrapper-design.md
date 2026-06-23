# Ant Style Drawer Render Wrapper Design

## Context

Ant Design Drawer exposes `drawerRender` for consumers who need to wrap or customize the rendered drawer node. Aheart Drawer currently renders the drawer panel section directly and does not provide a prop-level hook for wrapping that node.

Official reference:

- https://ant.design/components/drawer/

## Scope

This phase adds:

- `drawerRender?: (node: VNodeChild) => VNodeChild` to `ADrawer`.
- Rendering the existing drawer panel through `drawerRender`.
- Preservation of existing close button, mask, Escape, focusable, footer, semantic style, and slot behavior inside the custom render shell.
- Tests, docs, and generated `es` / `lib` Drawer outputs.

This phase does not add nested drawer `push`, motion lifecycle changes, draggable behavior, or static Drawer methods.

## Behavior

When `drawerRender` is omitted, Drawer renders exactly as it does today.

When `drawerRender` is provided:

- Drawer passes the default panel VNode to the function.
- The returned VNode is rendered in the same root Drawer container after the mask.
- The default panel retains `role="dialog"`, placement classes, semantic hooks, width/height styles, and focus management.
- Interactions inside the returned shell still bubble to the root keydown handler and component event handlers.

Example:

```ts
const drawerRender = (node: VNodeChild) => h('div', { class: 'custom-drawer-shell' }, [node])
```

## Architecture

`packages/components/src/drawer/types.ts` gains `DrawerRender` and a `drawerRender` prop.

`packages/components/src/drawer/drawer.vue` adds a local `ADrawerRenderWrapper` component mirroring the Modal implementation. The current panel section becomes the wrapper's default slot. The wrapper calls `drawerRender` when provided and otherwise returns the default slot node unchanged.

No CSS changes are required because the default `.aheart-drawer__panel` remains the styled element. Consumers style their wrapper through classes returned by `drawerRender`.

## Testing

Add Vitest coverage for:

- `drawerRender` wrapping the panel node and preserving default content.
- Close-button behavior still emitting `update:open(false)` and `close` when the panel is wrapped.
- Mask and root structure remain outside the `drawerRender` shell.

## Documentation

Update `docs/components/drawer.md` to:

- Add a `drawerRender` demo.
- Add `drawerRender` to the API table.
- Keep existing renderable, close, mask, focus, and semantic docs unchanged.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Drawer render wrapping only.
- Ambiguity check: wrapper target, omitted behavior, and interaction preservation are explicit.
