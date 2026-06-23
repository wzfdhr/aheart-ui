# Ant Style Modal Wrap Class Name Design

## Context

Ant Design Modal documents `wrapClassName` as the class name of the container for the modal dialog. Aheart Modal already supports semantic `classNames.wrap`, but it does not expose the Ant-compatible `wrapClassName` prop.

Official reference:

- https://ant.design/components/modal/

## Scope

This phase adds:

- `wrapClassName?: string` to `AModal`.
- Application of `wrapClassName` to the `.aheart-modal__wrap` element.
- Coexistence with `classNames.wrap`, so existing semantic styling remains unchanged.
- Tests, docs, and generated `es` / `lib` Modal outputs.

This phase does not add portal behavior, `getContainer`, focus management, motion hooks, or `modalRender`.

## Behavior

`wrapClassName` appends a user class to the wrap element around the dialog:

```html
<div class="aheart-modal__wrap custom-wrap semantic-wrap">...</div>
```

Class ordering follows the existing component convention:

1. built-in class
2. direct Ant-compatible prop class
3. semantic class hook

If `wrapClassName` is omitted, current rendering is unchanged. If both `wrapClassName` and `classNames.wrap` are supplied, both classes are present.

## Testing

Add Vitest coverage for:

- `wrapClassName` appearing on `.aheart-modal__wrap`.
- `wrapClassName` and `classNames.wrap` coexisting on the same element.

## Documentation

Update `docs/components/modal.md` to:

- Show `wrap-class-name` in the semantic styling example.
- Add `wrapClassName` to the Modal API table.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on one Modal styling prop only.
- Ambiguity check: target element, class coexistence, and ordering are explicit.
