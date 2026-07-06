# Ant Style InputNumber Semantic Functions Design

## Context

Ant Design documents `classNames` and `styles` semantic DOM hooks as accepting either an object or a function. Aheart InputNumber currently accepts object records only, while Tooltip, Popover, Popconfirm, Modal, and Drawer already support the function form.

Official reference:

- https://ant.design/components/input-number/

## Scope

This phase adds:

- Function-form `classNames` support for `AInputNumber`.
- Function-form `styles` support for `AInputNumber`.
- `InputNumberSemanticInfo`, `InputNumberSemanticRecord<T>`, and `InputNumberSemanticConfig<T>` exported types.
- Tests, docs, and generated `es` / `lib` InputNumber outputs.

This phase does not add new semantic parts, change numeric input behavior, or alter existing object-form semantic hooks.

## Behavior

`classNames` and `styles` continue to accept partial records keyed by `InputNumberSemanticPart`.

They also accept functions:

```ts
classNames: ({ props }) => ({
  root: props.status === 'warning' ? 'amount-warning' : 'amount-root',
  input: 'amount-input'
})

styles: ({ props }) => ({
  action: {
    color: props.readOnly ? 'gray' : 'green'
  }
})
```

The function receives:

```ts
interface InputNumberSemanticInfo {
  props: Readonly<Record<string, unknown>>
}
```

The function return value is treated like the current object form. The component resolves the semantic config once into computed records and all existing part bindings read from those records.

## Testing

Add Vitest coverage for:

- Function-form `classNames` applying classes based on current props.
- Function-form `styles` applying inline styles based on current props.
- Object-form semantic hooks continuing to work through the same rendered parts.

## Documentation

Update `docs/components/input-number.md` to:

- Demonstrate function-form semantic hooks in the semantic styling example.
- Document `classNames` and `styles` as object or function forms.
- Add an `InputNumberSemanticInfo` reference section.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on one InputNumber semantic customization API gap only.
- Ambiguity check: function input shape, return shape, and object-form compatibility are explicit.
