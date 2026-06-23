# Ant Style Modal Closable Callbacks Design

## Context

Ant Design Modal currently allows object-form `closable` to include close callbacks through:

```ts
closable?: boolean | (Exclude<ClosableType, boolean> & { onClose?: () => void; afterClose?: () => void })
```

Aheart Modal already supports object-form `closable.closeIcon` and `closable.disabled`, but it does not call `closable.onClose` or `closable.afterClose`.

## Scope

This phase adds object-form `closable` callbacks to `AModal`.

In scope:

- Add `onClose?: () => void` and `afterClose?: () => void` to `ModalClosableConfig`.
- Invoke `closable.onClose` whenever an enabled close pathway closes the Modal.
- Invoke `closable.afterClose` at the same close completion point as the existing `afterClose` event.
- Keep existing `cancel`, `close`, `update:open`, and `afterClose` emits unchanged.
- Update Modal docs and generated package outputs.

Out of scope:

- Animation timing changes.
- Static Modal APIs.
- Portal `getContainer`.
- Additional ARIA fields from Ant's internal `useClosable` helper.

## Behavior

- Close button click calls `closable.onClose`, then emits the existing close/update events.
- Mask click, Escape, and Cancel button continue using the shared close path, so they also call `closable.onClose` when they actually close the Modal.
- Disabled close button does not call `closable.onClose` because it does not close the Modal.
- When `open` changes from true to false, the component emits `afterClose` and then calls `closable.afterClose`.

## Component Design

Keep callbacks in `modal.vue` to match existing close orchestration. Add a helper:

```ts
const notifyClosableClose = () => {
  closableConfig.value?.onClose?.()
}
```

Call it in the existing `close` helper before `emit('update:open', false)` and `emit('close')`. Call `closableConfig.value?.afterClose?.()` in the `!open` branch of the existing `open` watcher, immediately after the current `emit('afterClose')`.

## Tests

Add Modal tests for:

- `closable.onClose` firing through the shared close path for close button, mask, Cancel, and Escape.
- `closable.afterClose` firing when `open` changes from true to false.

Existing disabled close button tests continue to prove disabled close controls do not close the Modal.

## Documentation

Update the API table and add a `ModalClosableConfig` snippet documenting `closeIcon`, `disabled`, `onClose`, and `afterClose`.

## Self Review

- Placeholder scan: no placeholder markers or deferred behavior.
- Scope check: one object-form `closable` callback addition only.
- Ambiguity check: `onClose` is tied to actual close attempts and `afterClose` is tied to the current close completion event.
