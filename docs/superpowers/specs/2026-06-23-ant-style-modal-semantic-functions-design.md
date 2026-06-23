# Ant Style Modal Semantic Functions Design

## Context

Ant Design Modal documents `classNames` and `styles` as semantic DOM customization hooks that accept either an object or a function. Aheart Modal currently accepts only object records, so consumers cannot derive semantic classes or styles from current Modal props.

Official reference:

- https://ant.design/components/modal/

## Scope

This phase adds:

- Function-form `classNames` support for `AModal`.
- Function-form `styles` support for `AModal`.
- A small semantic resolver that passes the current props object to each function.
- Tests, docs, and generated `es` / `lib` Modal outputs.

This phase does not add new semantic parts, portal behavior, global config, or static Modal methods.

## Behavior

`classNames` and `styles` continue to accept partial records keyed by `ModalSemanticPart`.

They also accept functions:

```ts
classNames: ({ props }) => ({
  root: props.open ? 'modal-open-root' : 'modal-closed-root',
  body: 'modal-body'
})

styles: ({ props }) => ({
  body: {
    padding: props.open ? '24px' : '16px'
  }
})
```

The function receives:

```ts
interface ModalSemanticInfo {
  props: Readonly<Record<string, unknown>>
}
```

The function return value is treated like the existing object form. Each semantic part still resolves independently through the existing `semanticClass(part)` and `semanticStyle(part)` helpers.

## Testing

Add Vitest coverage for:

- Function-form `classNames` adding classes based on current props.
- Function-form `styles` adding inline styles based on current props.
- Existing object-form semantic classes and styles continuing to pass.

## Documentation

Update `docs/components/modal.md` to:

- Demonstrate function-form semantic hooks in the existing semantic styling demo.
- Document `classNames` and `styles` as object or function forms.
- Add a `ModalSemanticInfo` reference section.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on one Modal semantic customization API gap only.
- Ambiguity check: input shape, return shape, and object-form compatibility are explicit.
