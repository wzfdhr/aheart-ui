# Ant Style Message Pause On Hover Default Design

## Context

Ant Design Message exposes `pauseOnHover` in the global `message.config` API and documents the default as enabled. Aheart Message already implements hover pause/resume plumbing, but its global default is currently disabled.

## Scope

This phase aligns the default behavior:

- Global Message notices should pause auto-close while hovered unless a notice explicitly sets `pauseOnHover: false`.
- `message.destroy()` should reset the global default back to enabled.
- Existing explicit `pauseOnHover` overrides should keep working.

This phase does not add stacked message behavior, animation changes, close-button changes, notification APIs, or new placement options.

## Design

Change the Message service state default from `pauseOnHover: false` to `pauseOnHover: true`. When creating a notice, keep the existing resolution logic:

```ts
pauseOnHover: config.pauseOnHover ?? state.pauseOnHover
```

That preserves per-notice overrides while letting the default match Ant. Update `destroy()` to reset `state.pauseOnHover` to `true`.

## Testing

Add a focused service test that opens an auto-closing message without calling `message.config`, hovers the notice past its duration, and verifies it remains visible until mouse leave. This test should fail before the service default changes and pass after.

## Documentation

Update `docs/components/message.md` so the `MessageGlobalConfig.pauseOnHover` default is `true`.

## Acceptance Criteria

- A normal `message.info('...', duration)` pauses while hovered by default.
- A notice with `pauseOnHover: false` can still auto-close while hovered.
- `message.destroy()` resets the default to enabled.
- Message docs show `pauseOnHover` default as `true`.
