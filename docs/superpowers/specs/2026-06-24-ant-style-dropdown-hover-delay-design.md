# Ant Style Dropdown Hover Delay Design

## Context

Aheart Tooltip, Popover, and Popconfirm already expose `mouseEnterDelay` and `mouseLeaveDelay` for hover-triggered floating content. Dropdown defaults to hover trigger too, but currently opens and closes immediately. This leaves Dropdown with a slightly different interaction contract from the rest of the floating family.

References:

- Ant Design Tooltip documentation, `https://ant.design/components/tooltip/`
- Ant Design Popover documentation, `https://ant.design/components/popover/`
- Ant Design Popconfirm documentation, `https://ant.design/components/popconfirm/`

## Goal

Add hover enter and leave delay props to `ADropdown`, and inherit them through `ADropdownButton`, while preserving existing click, context menu, disabled, Teleport, semantic hook, menu close, and hidden lifecycle behavior.

## Behavior

- `mouseEnterDelay` delays hover-triggered open by seconds.
- `mouseLeaveDelay` delays hover-triggered close by seconds.
- Both props default to `0.1`, matching Aheart Tooltip, Popover, and Popconfirm.
- A later opposite hover event cancels the pending timer before scheduling or applying the new state.
- A delay of `0` keeps immediate behavior for tests and users who opt out of delay.
- Hover handoff between trigger/root and overlay remains intact, including teleported overlays.
- Non-hover triggers continue to ignore the delay props.
- `ADropdownButton` forwards both delay props to its internal `ADropdown`.

## Files

- `packages/components/src/dropdown/types.ts`: add delay props to Dropdown and DropdownButton prop surfaces.
- `packages/components/src/dropdown/dropdown.vue`: add hover timer lifecycle and delay-aware open/close requests.
- `packages/components/src/dropdown/dropdown-button.vue`: forward delay props to the internal Dropdown.
- `packages/components/src/dropdown/__tests__/dropdown.test.ts`: add red-green coverage for delayed open, delayed close, cancellation, and DropdownButton forwarding.
- `docs/components/dropdown.md`: document the delay props on Dropdown and Dropdown.Button.
- Generated component outputs under `packages/components/es/dropdown`, `packages/components/lib/dropdown`, and shared style declarations are refreshed by the component build.

## Testing

- Focused Dropdown tests must first fail because `mouseEnterDelay` and `mouseLeaveDelay` are not recognized or respected.
- After implementation, focused tests must pass with:
  - delayed open before and after the configured enter timeout,
  - delayed close before and after the configured leave timeout,
  - timer cancellation when the pointer returns before the close timeout,
  - DropdownButton forwarding the delay props,
  - existing default hover tests adjusted to account for the family default delay.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Dropdown hover delay parity.
- Consistency check: default delay values, docs, tests, runtime props, and generated output match the existing floating-family pattern.
