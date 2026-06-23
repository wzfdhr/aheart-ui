# Ant Style Message Stack Config Design

## Context

Ant Design Message supports a `stack` global configuration that collapses messages when the amount is over a threshold. Aheart Message already supports global configuration for top offset, duration, max count, custom container, RTL, and hover pause, but it does not expose stack behavior.

## Scope

This phase adds stack behavior to Message:

- `message.config({ stack: true })` enables stacking with the default threshold.
- `message.config({ stack: { threshold: 2 } })` enables stacking with an explicit threshold.
- `message.config({ stack: false })` disables stacking.
- `AMessage` accepts the same `stack` prop so the service and host component share one rendering path.

This phase does not change motion, placement, notification APIs, or the existing `maxCount` behavior.

## Design

Add a `MessageStackConfig` type:

```ts
export type MessageStackConfig = boolean | { threshold: number }
```

The service state stores `stack?: MessageStackConfig` and passes it to `MessageHost`. The host computes:

- `stackThreshold`: `3` for `true`, the configured threshold for an object, or disabled for `false`/`undefined`.
- `isStacked`: enabled when `notices.length > stackThreshold`.
- `visibleNotices`: all notices normally, or only the latest notice when stacked.
- `stackedCount`: hidden notice count, displayed as a compact `+N` indicator.

Timers and close behavior remain attached to the full notice list. Stack only changes rendering, so old notices can still expire normally and the latest notice can still be closed.

## Testing

Add a focused service test:

- Configure `stack: { threshold: 2 }`.
- Open three persistent notices.
- Assert only the latest notice is rendered.
- Assert older notice text is hidden.
- Assert the stack count indicator shows `+2`.

The test should fail before implementation because all notices render.

## Documentation

Update `docs/components/message.md` to document:

- A stack usage section.
- `message.config` includes `stack`.
- `MessageGlobalConfig.stack`.
- `AMessage.stack`.

## Acceptance Criteria

- Stack is disabled by default.
- `stack: true` stacks after more than three notices.
- `stack: { threshold: n }` stacks after more than `n` notices.
- `stack: false` disables stack behavior.
- Existing `maxCount`, close, hover pause, semantic classes, and custom container behavior keep working.
