# Ant Style Drawer Destroy Inactive Panel Design

## Context

Aheart Drawer already supports `destroyOnHidden`, `destroyOnClose`, and `forceRender`. Ant Design Drawer keeps `destroyOnHidden` as the current close-time destroy prop and also documents `destroyInactivePanel` as a deprecated compatibility alias.

Reference: Ant Design Drawer documentation, `https://ant.design/components/drawer/`.

## Goal

Add `destroyInactivePanel` to `ADrawer` as a backward-compatible alias for `destroyOnHidden`.

## Behavior

- `destroyInactivePanel` is a boolean prop.
- When `destroyInactivePanel` is true, closing the drawer removes the rendered drawer subtree, matching `destroyOnHidden`.
- `destroyOnHidden`, `destroyOnClose`, and `destroyInactivePanel` all feed the same internal destroy decision.
- `forceRender` continues to take priority and keeps the drawer subtree rendered while closed.
- Existing `afterOpenChange`, close button, mask click, Escape key, Teleport, semantic styling, and size behavior stay unchanged.

## Files

- `packages/components/src/drawer/types.ts`: add the boolean prop.
- `packages/components/src/drawer/drawer.vue`: include the alias in the `shouldDestroy` computed value.
- `packages/components/src/drawer/__tests__/drawer.test.ts`: add alias and force-render precedence tests.
- `docs/components/drawer.md`: document the deprecated alias.
- Generated component outputs under `packages/components/es/drawer` and `packages/components/lib/drawer` are refreshed by the component build.

## Testing

- Focused Drawer tests must prove the alias destroys hidden drawers and `forceRender` still prevents destruction.
- Component typecheck, full component tests, component build, documentation build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice only adds the deprecated Drawer destroy alias.
- Consistency check: the alias is named `destroyInactivePanel` in tests, props, docs, generated declarations, and generated runtime output.
