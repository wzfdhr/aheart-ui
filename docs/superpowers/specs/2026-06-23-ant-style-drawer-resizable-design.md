# Ant Style Drawer Resizable Design

## Context

Aheart Drawer now covers Ant-style mount containers, renderable content, close controls, mask controls, focus behavior, semantic hooks, style aliases, destroy aliases, and nested push behavior. Ant Design Drawer 6.4.5 also documents resizable drawers through `resizable`, `maxSize`, `ResizableConfig`, the `dragger` semantic DOM part, and the `draggerSize` design token.

Reference: Ant Design Drawer documentation, `https://ant.design/components/drawer/`.

## Goal

Add practical `ADrawer` resize support that matches the Ant-style API shape while keeping the implementation local to Drawer.

## Behavior

- `resizable` accepts `boolean | DrawerResizableConfig` and defaults to disabled.
- `DrawerResizableConfig` supports `onResizeStart?: () => void`, `onResize?: (size: number) => void`, and `onResizeEnd?: () => void`.
- `maxSize?: number` caps the active width or height when resizing.
- A dragger handle renders only when `resizable` is `true` or an object.
- Dragging updates width for `left` and `right`, and height for `top` and `bottom`.
- Direction follows placement:
  - `right`: moving the handle left increases width.
  - `left`: moving the handle right increases width.
  - `bottom`: moving the handle up increases height.
  - `top`: moving the handle down increases height.
- Existing configured size, width, or height remains the initial size; numeric values and simple pixel strings are used as the starting size for dragging.
- Existing `push`, style aliases, semantic styles, Teleport, focus trap, close, mask, destroy, and lifecycle behavior remains unchanged.
- `classNames.dragger` and `styles.dragger` style the resize handle.

## Files

- `packages/components/src/drawer/types.ts`: add `dragger`, `DrawerResizableConfig`, `DrawerResizable`, `resizable`, and `maxSize`.
- `packages/components/src/drawer/drawer.vue`: render the dragger, track drag state, update panel size, clamp to `maxSize`, and call resize callbacks.
- `packages/components/src/drawer/style.css`: add placement-aware dragger styles.
- `packages/components/src/drawer/__tests__/drawer.test.ts`: add focused resize tests.
- `docs/components/drawer.md`: document the new API and type section.
- Generated component outputs under `packages/components/es/drawer` and `packages/components/lib/drawer` are refreshed by the component build.

## Testing

- Focused Drawer tests must prove dragger rendering, right-placement resizing, `maxSize` clamping, callback calls, bottom-placement height resizing, disabled dragger behavior, and semantic dragger styling.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice only adds Drawer resizable behavior.
- Consistency check: `DrawerResizableConfig`, `DrawerResizable`, `resizable`, `maxSize`, and `dragger` are named consistently across tests, source, docs, and generated output.
