# Ant Style Modal Close Controls Design

## Context

Ant Design Modal documents `closable` as `boolean | ClosableType` and `closeIcon` as renderable close icon content. It also documents that `closeIcon` set to `null` or `false` hides the close button.

Official reference:

- https://ant.design/components/modal/

Aheart Modal currently supports only boolean `closable` and always renders `×` for the close button. This makes custom close icons and disabled close-button states impossible without replacing the header.

## Scope

This phase adds:

- `ModalClosableConfig` with `closeIcon?: VNodeChild` and `disabled?: boolean`.
- `ModalClosable = boolean | ModalClosableConfig`.
- A `closeIcon?: VNodeChild` prop.
- Renderable close icon support from either `closeIcon` or `closable.closeIcon`.
- Hidden close button behavior when the resolved close icon is `null` or `false`.
- Disabled close button behavior when `closable.disabled` is true.
- Tests, docs, and generated `es` / `lib` outputs.

This phase does not add Modal static methods, draggable/modalRender support, focus restoration, async close callbacks, or renderable title/footer props.

## Behavior

`closable: false` still hides the close button. When `closable` is an object, the close button remains visible unless the resolved icon is `null` or `false`.

Close icon precedence:

1. `closable.closeIcon` when `closable` is an object and the key is present.
2. `closeIcon` prop when provided.
3. Default `×`.

When the close button is disabled through `closable: { disabled: true }`, clicking that button does not emit `update:open` or `close`. Mask clicks, Escape, and footer cancel keep their existing behavior.

## API

```ts
export interface ModalClosableConfig {
  closeIcon?: VNodeChild
  disabled?: boolean
}

export type ModalClosable = boolean | ModalClosableConfig
```

`closeIcon` is a renderable prop. Passing `false` or `null` hides the close button.

## Testing

Add Vitest coverage for:

- `closeIcon` prop rendering custom close content.
- `closeIcon={false}` hiding the close button.
- Object-form `closable.closeIcon` rendering custom close content.
- Object-form `closable.disabled` preventing close-button close events.
- Existing `closable={false}` behavior staying intact.

## Documentation

Update `docs/components/modal.md` to show custom close controls and document `closable` object form plus `closeIcon`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Modal close controls only.
- Ambiguity check: icon precedence, hide behavior, and disabled button behavior are explicit.
