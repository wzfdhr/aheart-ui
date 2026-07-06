# Ant Style Popover Destroy Alias Design

## Context

Aheart Popover supports `destroyOnHidden` to remove the popup DOM after close. Ant Design's shared Tooltip/Common API lists the older deprecated `destroyTooltipOnHide` prop for Tooltip, Popover, and Popconfirm. Aheart Tooltip and Popconfirm already accept this compatibility alias; Aheart Popover does not.

Reference: Ant Design shared Tooltip/Common API source, `https://github.com/ant-design/ant-design/blob/master/components/tooltip/shared/sharedProps.en-US.md`.

## Goal

Allow `APopover` to accept `destroyTooltipOnHide` as a compatibility alias for `destroyOnHidden`.

## Behavior

- `destroyTooltipOnHide` is a boolean prop that defaults to `false`.
- When `destroyTooltipOnHide` is true, a hidden Popover popup is removed from the DOM, matching `destroyOnHidden`.
- When either `destroyOnHidden` or `destroyTooltipOnHide` is true, hidden popup DOM is destroyed.
- Default behavior still preserves the popup DOM after first render.
- Existing title/content rendering, triggers, hover timers, Teleport, `getPopupContainer`, placement adjustment, semantic hooks, arrow behavior, color, z-index, and `fresh` compatibility remain unchanged.

## Files

- `packages/components/src/popover/types.ts`: add the compatibility prop.
- `packages/components/src/popover/popover.vue`: compute the shared hidden destroy state from both props.
- `packages/components/src/popover/__tests__/popover.test.ts`: add red-green coverage for the alias.
- `docs/components/popover.md`: document the alias as deprecated compatibility behavior.
- Generated component outputs under `packages/components/es/popover` and `packages/components/lib/popover` are refreshed by the component build.

## Testing

- Focused Popover tests must first fail because `destroyTooltipOnHide` is not recognized and does not destroy the hidden popup.
- After implementation, focused tests must pass with:
  - default hidden preservation unchanged,
  - `destroyOnHidden` destruction unchanged,
  - `destroyTooltipOnHide` destruction matching `destroyOnHidden`,
  - the alias not leaking as a DOM attribute.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popover's deprecated hidden-destroy alias.
- Consistency check: tests, docs, runtime behavior, and generated output all use `destroyTooltipOnHide`.
