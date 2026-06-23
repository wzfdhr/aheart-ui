# Ant Style Popconfirm Hover Delay And Arrow Design

## Context

Aheart Tooltip and Popover already support the Ant-style floating controls for hover timing and object arrow configuration:

- `mouseEnterDelay`
- `mouseLeaveDelay`
- `arrow: boolean | { pointAtCenter?: boolean }`

Popconfirm now supports renderable content, semantic class/style hooks, popup container mounting, hidden lifecycle controls, and teleported hover handoff, but its hover trigger still opens and closes immediately and its `arrow` prop only accepts a boolean.

Reference: Ant Design Popconfirm documentation, `https://ant.design/components/popconfirm/`.

## Goal

Align `APopconfirm` with the shared Ant-style hover timing and arrow configuration used by Tooltip and Popover.

## Behavior

- `mouseEnterDelay?: number` delays hover-triggered opening, in seconds, with default `0.1`.
- `mouseLeaveDelay?: number` delays hover-triggered closing, in seconds, with default `0.1`.
- Negative delay values are clamped to immediate timing.
- Hover timers are cleared before scheduling a replacement timer and on component unmount.
- Moving from the trigger/root into a teleported popup still keeps the popup open instead of scheduling a close.
- `arrow` accepts either `boolean` or `{ pointAtCenter?: boolean }`.
- `arrow={false}` keeps hiding the arrow.
- `arrow={{ pointAtCenter: true }}` applies the Popconfirm point-at-center arrow class.
- Existing click, focus, context menu, confirm, cancel, hidden lifecycle, semantic styling, and popup container behavior remain unchanged.

## Files

- `packages/components/src/popconfirm/types.ts`: add hover delay props and object arrow types.
- `packages/components/src/popconfirm/popconfirm.vue`: add delayed hover scheduling, timer cleanup, and object arrow class handling.
- `packages/components/src/popconfirm/style.css`: add the point-at-center arrow modifier.
- `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`: add delay and object arrow coverage and keep existing hover handoff deterministic.
- `docs/components/popconfirm.md`: document the new props and object arrow syntax.
- Generated component outputs under `packages/components/es/popconfirm` and `packages/components/lib/popconfirm` are refreshed by the component build.

## Testing

- Focused Popconfirm tests must first fail because current Popconfirm opens on hover immediately and does not apply an object-arrow modifier class.
- After implementation, focused tests must pass with:
  - delayed hover opening,
  - delayed hover closing,
  - teleported popup hover handoff preserved,
  - hidden popup preservation still working after delayed close,
  - boolean and object arrow behavior preserved.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popconfirm hover timing and arrow object configuration.
- Consistency check: source props, docs rows, tests, and generated output use the same public names.
