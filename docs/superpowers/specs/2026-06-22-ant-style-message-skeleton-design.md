# Ant Style Message Skeleton Design

## Goal

Add first-pass Message and Skeleton components to move the Feedback roadmap forward.

Message follows Ant Design's global lightweight feedback model with static methods and keyed updates. Skeleton follows Ant Design's loading placeholder model with active animation, avatar/title/paragraph controls, and loading-state slot fallback.

## References

- Ant Design Message: https://ant.design/components/message/
- Ant Design Skeleton: https://ant.design/components/skeleton/

The references guide API names and documentation structure. Aheart UI keeps an independent Vue implementation and a smaller first-pass feature set.

## Scope

Implement:

- Message
- Message service methods: `open`, `success`, `info`, `warning`, `error`, `loading`, `destroy`, and `config`
- Keyed message updates
- Duration control, including persistent `duration: 0`
- Max count and top offset config
- Skeleton
- Skeleton active animation
- Skeleton avatar/title/paragraph controls
- Skeleton round mode
- Skeleton loading false passthrough slot

Out of scope:

- Message hook/context API
- Promise-based message chaining
- App-level message provider context
- Message placement variants other than top center
- Skeleton input/button/image node variants

## Architecture

### Message

Directory:

- `packages/components/src/message/message.vue`
- `packages/components/src/message/service.ts`
- `packages/components/src/message/types.ts`
- `packages/components/src/message/style.css`
- `packages/components/src/message/index.ts`
- `packages/components/src/message/__tests__/message.test.ts`

`AMessage` is a presentational message host. The `message` service owns a small reactive notice store, lazily mounts the host into `document.body`, and exposes Ant-style static methods.

Props:

- `notices?: MessageNotice[]`
- `top?: number | string`

Events:

- `close`

Service API:

- `message.open(configOrContent, duration?, onClose?)`
- `message.success(configOrContent, duration?, onClose?)`
- `message.info(configOrContent, duration?, onClose?)`
- `message.warning(configOrContent, duration?, onClose?)`
- `message.error(configOrContent, duration?, onClose?)`
- `message.loading(configOrContent, duration?, onClose?)`
- `message.destroy(key?)`
- `message.config(options)`

### Skeleton

Directory:

- `packages/components/src/skeleton/skeleton.vue`
- `packages/components/src/skeleton/types.ts`
- `packages/components/src/skeleton/style.css`
- `packages/components/src/skeleton/index.ts`
- `packages/components/src/skeleton/__tests__/skeleton.test.ts`

`ASkeleton` renders placeholder layout when `loading` is true and renders its default slot when `loading` is false.

Props:

- `loading?: boolean`
- `active?: boolean`
- `avatar?: boolean | SkeletonAvatarConfig`
- `title?: boolean | SkeletonTitleConfig`
- `paragraph?: boolean | SkeletonParagraphConfig`
- `round?: boolean`

## Behavior

- Message methods create notices with type icons and close buttons.
- Message `duration: 0` keeps a notice until destroyed or manually closed.
- Message calls with the same `key` update the existing notice instead of adding a duplicate.
- Message `maxCount` keeps only the newest notices.
- Message `top` config controls host top offset.
- Skeleton renders avatar/title/paragraph placeholders according to prop configs.
- Skeleton paragraph rows default to three.
- Skeleton `loading=false` renders default slot content instead of placeholders.

## Documentation

Update Feedback status:

- Message -> Ready
- Skeleton -> Ready

Add VitePress pages:

- `docs/components/message.md`
- `docs/components/skeleton.md`

The pages include static method demos, persistent/keyed message examples, Skeleton loading/active/avatar/paragraph examples, API tables, events, service tables, and theme token notes.

## Testing

Tests are written before implementation:

- `AMessage` renders notices, icons, and close events.
- `message.success` mounts a global notice.
- `message.open` updates notices by key.
- `message.config` applies top and maxCount.
- `message.destroy` removes notices.
- `ASkeleton` renders default placeholders.
- `ASkeleton` renders active/avatar/title/paragraph/round variants.
- `ASkeleton` renders slot content when loading is false.

Full verification:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Use the bundled pnpm command in this environment.

## Self-Review

- Placeholder scan: no unresolved placeholders remain.
- Scope check: this slice covers Message and Skeleton only, not the larger overlay Feedback set.
- Ambiguity check: message service is a client-side DOM service in this pass.
