# Ant Style Modal Get Container Design

## Context

Ant Design Modal exposes `getContainer` so consumers can choose where the modal is mounted. Aheart Modal currently renders inline where `AModal` appears in the Vue tree. That works for simple pages, but it does not match Ant-style overlay behavior where dialogs normally mount at `document.body` and can be redirected to a custom overlay root.

Reference:

- https://ant.design/components/modal/

## Scope

This phase adds `getContainer` support to `AModal`.

Included:

- Add a `getContainer` prop that accepts an `HTMLElement`, a selector string, a function returning an `HTMLElement`, or `false`.
- Mount Modal content through Vue `Teleport`.
- Default to `document.body` in browser environments.
- Disable teleporting when `getContainer` is `false`, preserving inline rendering for embedded or test-only use cases.
- Keep all existing Modal behavior, classes, focus management, close events, and semantic hooks unchanged after relocation.
- Update Modal tests, docs, and generated `es` / `lib` package outputs.

Out of scope:

- Static Modal APIs such as `Modal.confirm`.
- Drawer portal support.
- Popup placement libraries or motion timing.
- Server-side rendering changes beyond safely avoiding `document` when it is unavailable.

## API

```ts
export type ModalGetContainer = HTMLElement | string | (() => HTMLElement) | false
```

`getContainer` behavior:

- `undefined`: teleport to `document.body` when `document` exists.
- `false`: render inline at the component location.
- `HTMLElement`: teleport to that element.
- `string`: pass the selector to Vue Teleport.
- `() => HTMLElement`: call the function and teleport to the returned element.

## Architecture

`modal.vue` wraps the current root DOM with `<Teleport>`. A small computed resolver normalizes `getContainer` into a Teleport target and a disabled flag.

The existing Modal root remains the same `.aheart-modal` element. Only its DOM location changes. Event handlers stay on the root, `dialogRef` still points to the dialog section, and focus restoration/trapping continues to work because those helpers query actual DOM nodes after teleporting.

## Tests

Add tests for:

- Default mounting to `document.body`.
- `getContainer={false}` rendering inline.
- Function containers rendering into a custom DOM node.
- Selector containers rendering into a selected DOM node.

Existing behavior tests continue to focus on Modal behavior rather than Teleport internals. They use a local mount helper with Teleport stubbed so current assertions still read cleanly from `wrapper.find`.

## Documentation

Update `docs/components/modal.md` API docs with `getContainer`, its accepted types, and the default `document.body`. Mention that `false` keeps Modal inline.

## Review Notes

- Scope check: one Modal mount-location API only.
- Compatibility check: existing inline behavior remains available through `getContainer={false}`.
- Ambiguity check: default browser behavior is explicitly `document.body`; non-browser environments disable teleporting until a DOM target exists.
