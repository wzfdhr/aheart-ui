# Ant Style Modal Loading Footer Design

## Context

Ant Design Modal renders a content skeleton for `loading` and suppresses the footer while that loading state is active. Its current Modal source computes `dialogFooter = footer !== null && !loading ? (...) : null`. Aheart Modal already renders an `ASkeleton` in the body when `loading` is true, but it still renders default or custom footer actions.

## Scope

This phase aligns `AModal` loading behavior with Ant's Modal footer suppression.

In scope:

- Hide the Modal footer while `loading` is true.
- Keep the existing body skeleton behavior unchanged.
- Restore the footer automatically when `loading` becomes false.
- Apply the same rule to default footer buttons and slot/custom footer content.
- Update Modal docs and generated package outputs.

Out of scope:

- Changing `confirmLoading` semantics.
- Async close coordination.
- Static Modal APIs.
- Loading animations or Skeleton layout changes.

## Behavior

- `loading: true` renders the body Skeleton and no `.aheart-modal__footer`.
- `loading: false` preserves the existing default footer behavior.
- A footer slot or custom `footer` prop is also hidden while `loading` is true, matching Ant's single footer suppression rule.
- `footer: false` and `footer: null` continue to hide the footer regardless of loading state.

## Component Design

The existing `hasFooter` computed value is the only runtime behavior that needs to change. It should return false when `props.loading` is true before checking slots or `props.footer`.

The body already uses:

```vue
<ASkeleton v-if="loading" active :paragraph="{ rows: 3 }" />
```

That behavior remains unchanged.

## Tests

Add Modal tests for:

- `loading` hides the default footer buttons while the Skeleton is visible.
- `loading` hides a footer slot while the Skeleton is visible.

Existing tests continue to cover normal default footer rendering, custom footer rendering, and `footer: null`.

## Documentation

Update the loading section to state that `loading` shows the Skeleton and suppresses footer actions until content is ready. Keep the API table row for `loading` concise.

## Self Review

- Placeholder scan: no placeholder markers or deferred decisions.
- Scope check: one Modal loading behavior alignment only.
- Ambiguity check: the rule applies to all footer sources while `loading` is true.
