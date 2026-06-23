# Ant Style Drawer Get Container Design

## Context

Ant Design Drawer exposes `getContainer` so consumers can choose where the drawer overlay is mounted. Aheart Drawer currently renders inline where `ADrawer` appears in the Vue tree. That is useful for simple cases, but it does not match Ant-style overlay behavior where drawers normally mount at `document.body` and can be redirected to a custom container.

Reference:

- https://ant.design/components/drawer/

## Scope

This phase adds `getContainer` support to `ADrawer`.

Included:

- Add a `getContainer` prop that accepts an `HTMLElement`, selector string, function returning an `HTMLElement`, or `false`.
- Mount Drawer content through Vue `Teleport`.
- Default to `document.body` when a browser `document` exists.
- Preserve inline rendering when `getContainer` is `false`.
- Keep existing Drawer structure, classes, placement sizing, close behavior, lifecycle events, and semantic hooks unchanged after relocation.
- Update Drawer tests, docs, and generated `es` / `lib` package outputs.

Out of scope:

- Drawer renderable title, extra, close icon, or footer prop expansions.
- Modal changes.
- Push nested drawer behavior.
- Server-side rendering changes beyond avoiding `document` access when it is unavailable.

## API

```ts
export type DrawerGetContainer = HTMLElement | string | (() => HTMLElement) | false
```

`getContainer` behavior:

- `undefined`: teleport to `document.body` when `document` exists.
- `false`: render inline at the component location.
- `HTMLElement`: teleport to that element.
- `string`: pass the selector to Vue Teleport.
- `() => HTMLElement`: call the function and teleport to the returned element.

## Architecture

`drawer.vue` wraps the current root DOM with `<Teleport>`. A small computed resolver normalizes `getContainer` into a Teleport target and disabled flag. The existing `.aheart-drawer` root remains the same element and owns the same keydown, mask, and close handlers.

Existing behavior tests continue to use a local mount helper with Teleport stubbed, so they keep asserting Drawer internals through `wrapper.find`. New tests use real Teleport behavior for mount-location coverage.

## Tests

Add tests for:

- Default mounting to `document.body`.
- `getContainer={false}` rendering inline.
- Function containers rendering into a custom DOM node.
- Selector containers rendering into a selected DOM node.

## Documentation

Update `docs/components/drawer.md` API docs with `getContainer`, accepted types, and the default `document.body`. Mention that `false` keeps the Drawer inline.

## Review Notes

- Scope check: one Drawer mount-location API only.
- Compatibility check: existing inline behavior remains available with `getContainer={false}`.
- Ambiguity check: browser default is `document.body`; non-browser environments disable teleporting until a DOM target exists.
