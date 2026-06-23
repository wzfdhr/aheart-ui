# Ant Style Modal Renderable Content Design

## Context

Ant Design Modal documents `title`, `okText`, and `cancelText` as `ReactNode`. It also documents `footer` as `ReactNode` or a render function, with `footer={null}` hiding the default footer.

Official reference:

- https://ant.design/components/modal/

Aheart Modal currently treats `title`, `okText`, and `cancelText` as strings, and `footer` as a boolean. Slots cover some customization, but prop-driven renderable content is still missing.

## Scope

This phase adds:

- `ModalRenderable = VNodeChild` for title and button labels.
- `title?: ModalRenderable`.
- `okText?: ModalRenderable` and `cancelText?: ModalRenderable`.
- `footer?: boolean | ModalRenderable | ModalFooterRender`.
- `footer={null}` and `footer={false}` hide the default footer when no `footer` slot is supplied.
- Footer render-function support that receives the default footer node and named OK/Cancel button nodes.
- Tests, docs, and generated `es` / `lib` outputs.

This phase does not add Modal static methods, `modalRender`, focus management, async close callbacks, or responsive breakpoint widths.

## Behavior

### Renderable Title And Labels

`title`, `okText`, and `cancelText` render through the existing Modal render-node helper. Strings keep working. VNodes and numeric `0` render as meaningful content. `false`, `null`, `undefined`, and empty string title values do not create a title area unless the `title` slot exists.

The `title` slot keeps priority over the `title` prop.

### Renderable Footer

Footer precedence:

1. `footer` slot when supplied.
2. `footer` render function when `footer` is a function.
3. Renderable `footer` prop when `footer` is not `true`, `false`, or `null`.
4. Default Cancel and OK buttons when `footer` is `true` or omitted.

When `footer` is `false` or `null`, the footer is hidden unless the `footer` slot exists.

The footer render function receives:

```ts
originNode: VNodeChild
extra: {
  okButton: VNodeChild
  cancelButton: VNodeChild
  OkBtn: () => VNodeChild
  CancelBtn: () => VNodeChild
}
```

The lower-case fields are convenient Vue values; the Ant-style `OkBtn` / `CancelBtn` factories are included for API familiarity.

## Testing

Add Vitest coverage for:

- VNode `title`, `okText`, and `cancelText` props.
- Numeric `0` title and button labels.
- `title` slot priority over `title` prop.
- Renderable `footer` prop replacing default buttons.
- Footer render function composing default buttons and preserving OK/Cancel events.
- `footer={null}` hiding the default footer.

## Documentation

Update `docs/components/modal.md` to:

- Add a renderable content example.
- Document `title`, `okText`, `cancelText`, and `footer` as renderable APIs.
- Document `ModalFooterRender`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Modal renderable content only.
- Ambiguity check: footer precedence and render-function arguments are explicit.
