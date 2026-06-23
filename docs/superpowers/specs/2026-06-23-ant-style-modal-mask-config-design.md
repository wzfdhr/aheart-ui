# Ant Style Modal Mask Config Design

## Context

Ant Design Modal documents `mask` as either a boolean or an object with `enabled`, `blur`, and `closable` controls. Aheart Modal currently accepts only a boolean `mask` and keeps click-to-close behavior on the legacy `maskClosable` prop.

Official reference:

- https://ant.design/components/modal/

## Scope

This phase adds:

- `ModalMaskConfig` with `enabled?: boolean`, `blur?: boolean`, and `closable?: boolean`.
- `mask: boolean | ModalMaskConfig` support on `AModal`.
- Object-form mask visibility through `mask.enabled`.
- Object-form mask blur styling through `mask.blur`.
- Object-form mask click behavior through `mask.closable`, with `maskClosable` kept as the fallback for existing consumers.
- Tests, docs, and generated `es` / `lib` Modal outputs.

This phase does not add portal behavior, animation timing changes, global Modal config, or static Modal methods.

## Behavior

`mask={false}` continues to hide the mask. `mask={true}` continues to show it and uses `maskClosable` to decide whether mask clicks close the modal.

When `mask` is an object, the fields are optional:

```ts
interface ModalMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}
```

`mask.enabled === false` hides the mask while leaving the dialog rendered. Any other object value keeps the mask visible.

`mask.blur === true` adds an `is-blur` state class to `.aheart-modal__mask`. The class applies a small `backdrop-filter` blur while preserving existing mask color and semantic class/style hooks.

`mask.closable` takes precedence over `maskClosable` when it is defined. If `mask.closable` is omitted, the legacy `maskClosable` prop remains the fallback.

## Testing

Add Vitest coverage for:

- Object-form `mask` rendering the mask, applying blur, and hiding only the mask when `enabled` is false.
- `mask.closable` overriding the legacy `maskClosable` prop in both locked and closable directions.
- Existing boolean `mask` and `maskClosable` behavior continuing to pass.

## Documentation

Update `docs/components/modal.md` to:

- Add a mask configuration demo.
- Document `mask` as `boolean | { enabled?: boolean; blur?: boolean; closable?: boolean }`.
- Clarify that `maskClosable` is legacy-compatible and `mask.closable` is preferred.
- Add a `ModalMaskConfig` reference section.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on one Modal mask API gap only.
- Ambiguity check: precedence, defaults, hidden-mask behavior, and blur styling are explicit.
