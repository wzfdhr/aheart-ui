# Ant Style Message Closable Controls Design

## Context

Ant Design Message does not render a close button by default in its documented API. Aheart Message currently renders a close button for every notice, which makes its default visual output noisier than Ant.

## Scope

This phase aligns Message close controls:

- Hide the Message close button by default.
- Add `closable?: boolean` to notice and open config objects.
- Add `closeIcon?: VNodeChild` to notice and open config objects.
- Keep `close` events, semantic close classes/styles, and `handle.close()` behavior for explicitly closable notices.

This phase does not add motion, placement, Alert behavior, Notification APIs, or custom close timing.

## Design

`MessageNotice` and `MessageOpenConfig` gain two optional fields:

```ts
closable?: boolean
closeIcon?: MessageContentNode
```

The service copies those fields into the normalized notice. `AMessage` renders the close button only when `notice.closable` is true. Its content is `notice.closeIcon ?? '×'`, rendered through the existing `ARenderNode` helper.

Existing close behavior remains unchanged once the button exists:

- Clicking the button emits `close`.
- The service removes the notice through its existing `onClose` handler.
- Semantic classes and styles apply to the close button.

## Testing

Add focused tests:

- A plain notice does not render `.aheart-message-notice__close`.
- A closable notice renders the button, supports a VNode `closeIcon`, and still emits `close`.
- The global service can open a closable message and clicking it removes the notice.

The first test should fail before implementation because Message currently renders close buttons by default.

## Documentation

Update `docs/components/message.md` to:

- Add a manual close example with `closable` and `closeIcon`.
- Document `closable` and `closeIcon` in `MessageOpenConfig`.
- Note that the close semantic part is only present for closable notices.

## Acceptance Criteria

- Default Message notices do not show a close button.
- `closable: true` shows a close button.
- `closeIcon` can be a string, number, or VNode.
- Existing `message.destroy`, `MessageHandle.close`, timers, stack, hover pause, and semantic hooks keep working.
