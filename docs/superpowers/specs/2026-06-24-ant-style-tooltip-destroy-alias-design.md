# Ant Style Tooltip Destroy Alias Design

## Context

Aheart Tooltip already supports `destroyOnHidden` to remove the popup DOM when the tooltip closes. Ant Design's shared Tooltip/Common API also lists the older deprecated `destroyTooltipOnHide` prop for Tooltip, Popover, and Popconfirm. Aheart Popconfirm already accepts this alias, but Aheart Tooltip currently ignores it.

Reference: Ant Design Tooltip documentation, `https://ant.design/components/tooltip/`, and the shared Tooltip/Common API source, `https://github.com/ant-design/ant-design/blob/master/components/tooltip/shared/sharedProps.en-US.md`.

## Goal

Allow `ATooltip` to accept `destroyTooltipOnHide` as a compatibility alias for `destroyOnHidden`.

## Behavior

- `destroyTooltipOnHide` is a boolean prop that defaults to `false`.
- When `destroyTooltipOnHide` is true, a hidden tooltip popup is removed from the DOM, matching `destroyOnHidden`.
- When either `destroyOnHidden` or `destroyTooltipOnHide` is true, hidden popup DOM is destroyed.
- Default behavior still preserves the popup DOM after first render.
- Existing title rendering, triggers, hover timers, Teleport, `getPopupContainer`, placement adjustment, semantic hooks, arrow behavior, color, z-index, and `fresh` compatibility remain unchanged.

## Files

- `packages/components/src/tooltip/types.ts`: add the compatibility prop.
- `packages/components/src/tooltip/tooltip.vue`: compute the shared hidden destroy state from both props.
- `packages/components/src/tooltip/__tests__/tooltip.test.ts`: add red-green coverage for the alias.
- `docs/components/tooltip.md`: document the alias as deprecated compatibility behavior.
- Generated component outputs under `packages/components/es/tooltip` and `packages/components/lib/tooltip` are refreshed by the component build.

## Testing

- Focused Tooltip tests must first fail because `destroyTooltipOnHide` is not recognized and does not destroy the hidden popup.
- After implementation, focused tests must pass with:
  - default hidden preservation unchanged,
  - `destroyOnHidden` destruction unchanged,
  - `destroyTooltipOnHide` destruction matching `destroyOnHidden`,
  - the alias not leaking as a DOM attribute.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Tooltip's deprecated hidden-destroy alias.
- Consistency check: tests, docs, runtime behavior, and generated output all use `destroyTooltipOnHide`.
