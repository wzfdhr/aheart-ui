# Ant Style Popover Auto Adjust Overflow Design

## Context

Aheart Popover already supports Ant-style placements, triggers, hover delays, controlled state, popup containers, renderable title/content, semantic hooks, arrows, and hidden lifecycle behavior. Ant Design's Popover documentation reuses the floating Common API, and that Common API includes `autoAdjustOverflow` with a default enabled value. Aheart Popover currently always renders the configured placement class.

Reference: Ant Design Popover documentation, `https://ant.design/components/popover/`, and its shared floating Common API.

## Goal

Add `autoAdjustOverflow` to `APopover` with the same lightweight viewport-aware placement resolver used by Tooltip.

## Behavior

- `autoAdjustOverflow` is a boolean prop that defaults to `true`.
- When the popover is visible and adjustment is enabled, Popover measures the trigger and popup after render.
- If a top placement has more room below than above and the popup does not fit above, it flips to the corresponding bottom placement.
- If a bottom placement has more room above than below and the popup does not fit below, it flips to the corresponding top placement.
- If a left placement has more room right than left and the popup does not fit left, it flips to the corresponding right placement.
- If a right placement has more room left than right and the popup does not fit right, it flips to the corresponding left placement.
- For top/bottom placements, horizontal alignment can adjust between center, Left, and Right when the centered or aligned popup would overflow the viewport edge.
- For left/right placements, vertical alignment can adjust between center, Top, and Bottom when the centered or aligned popup would overflow the viewport edge.
- `autoAdjustOverflow={false}` preserves the configured placement.
- Existing title/content rendering, open state, triggers, hover timers, Teleport, `getPopupContainer`, semantic hooks, arrow visibility, color, z-index, and hidden lifecycle behavior remain unchanged.

## Files

- `packages/components/src/popover/types.ts`: add the public prop.
- `packages/components/src/popover/popover.vue`: add effective placement state, viewport measurement, placement adjustment, and visibility/prop watchers.
- `packages/components/src/popover/__tests__/popover.test.ts`: add red-green coverage for vertical flip, disabled adjustment, and horizontal flip.
- `docs/components/popover.md`: document the prop.
- Generated component outputs under `packages/components/es/popover` and `packages/components/lib/popover` are refreshed by the component build.

## Testing

- Focused Popover tests must first fail because the configured placement class never changes.
- After implementation, focused tests must pass with:
  - top-to-bottom vertical flip when upper viewport space is insufficient,
  - `autoAdjustOverflow={false}` keeping configured placement,
  - left-to-right horizontal flip when left viewport space is insufficient,
  - existing renderable content, Teleport, hover timing, semantic hook, arrow, and lifecycle tests unchanged.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popover viewport-aware placement adjustment.
- Consistency check: the public prop, docs, tests, runtime behavior, and generated output all use `autoAdjustOverflow`.
