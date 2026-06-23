# Ant Style Modal Render Wrapper Design

## Context

Ant Design Modal documents `modalRender` as a custom modal content render function. Aheart Modal currently renders the dialog section directly inside the wrapper and does not expose a prop for consumers to wrap or replace the dialog node.

Official reference:

- https://ant.design/components/modal/

## Scope

This phase adds:

- `modalRender?: (node: VNodeChild) => VNodeChild` to `AModal`.
- Rendering through `modalRender` around the current dialog section.
- Preservation of existing dialog content, footer actions, close controls, semantic classes, and events when the render function wraps the original node.
- Tests, docs, and generated `es` / `lib` Modal outputs.

This phase does not add portal behavior, `getContainer`, drag behavior, focus management, or built-in draggable examples.

## Behavior

`modalRender` receives the default dialog node. When omitted, rendering is unchanged.

When supplied, the function result is rendered inside `.aheart-modal__wrap`:

```ts
modalRender: (node) => h('div', { class: 'custom-shell' }, [node])
```

The original dialog node includes the same header, body, footer, classes, styles, ARIA role, and event handlers as before. If the function returns the original node inside a wrapper, the OK and Cancel buttons continue to emit their normal events.

## Testing

Add Vitest coverage for:

- `modalRender` wrapping the dialog node.
- Wrapped dialog interactions preserving OK, Cancel, close, and `update:open` events.

## Documentation

Update `docs/components/modal.md` to:

- Add a custom render example.
- Add `modalRender` to the Modal API table.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on one Modal render hook only.
- Ambiguity check: default behavior, wrapper behavior, and event preservation are explicit.
