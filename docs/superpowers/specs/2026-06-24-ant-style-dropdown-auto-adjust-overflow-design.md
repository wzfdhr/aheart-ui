# Ant Style Dropdown Auto Adjust Overflow Design

## Context

Aheart Dropdown supports Ant-style placements and now has hover timing, popup containers, semantic hooks, and Dropdown.Button inheritance. Ant Design's current Dropdown API includes `autoAdjustOverflow` for automatic placement adjustment when the popup would overflow the viewport. Aheart Dropdown currently always renders the configured placement class.

Reference: Ant Design Dropdown documentation, `https://ant.design/components/dropdown/`.

## Goal

Add `autoAdjustOverflow` to `ADropdown` and inherited `ADropdownButton` behavior with a lightweight viewport-aware placement resolver that works with the current CSS placement model.

## Behavior

- `autoAdjustOverflow` is a boolean prop that defaults to `true`.
- When open and enabled, Dropdown measures the trigger and overlay after render.
- If a bottom placement has more room above than below and the overlay does not fit below, it flips to the corresponding top placement.
- If a top placement has more room below than above and the overlay does not fit above, it flips to the corresponding bottom placement.
- If a left-aligned placement would overflow the right edge and right alignment fits better, it switches to the corresponding `Right` placement.
- If a right-aligned placement would overflow the left edge and left alignment fits better, it switches to the corresponding `Left` placement.
- Center placements can adjust to `Left` or `Right` when the centered popup would overflow a horizontal edge.
- `autoAdjustOverflow={false}` preserves the configured `placement`.
- The effective placement drives the overlay placement class and `DropdownSemanticInfo.placement`.
- Existing open state, hover timers, menu close behavior, Teleport, `getPopupContainer`, semantic classes/styles, and Dropdown.Button split-button behavior remain unchanged.

## Files

- `packages/components/src/dropdown/types.ts`: add the public prop and inherited Dropdown.Button prop.
- `packages/components/src/dropdown/dropdown.vue`: add effective placement state, viewport measurement, placement adjustment, and open/prop watchers.
- `packages/components/src/dropdown/dropdown-button.vue`: forward `autoAdjustOverflow`.
- `packages/components/src/dropdown/__tests__/dropdown.test.ts`: add red-green coverage for vertical flip, disabled adjustment, and Dropdown.Button forwarding.
- `docs/components/dropdown.md`: document the prop on Dropdown and Dropdown.Button.
- Generated component outputs under `packages/components/es/dropdown` and `packages/components/lib/dropdown` are refreshed by the component build.

## Testing

- Focused Dropdown tests must first fail because the configured placement class never changes.
- After implementation, focused tests must pass with:
  - bottom-to-top vertical flip when the lower viewport space is insufficient,
  - `autoAdjustOverflow={false}` keeping the configured placement,
  - Dropdown.Button forwarding the prop to the internal Dropdown,
  - existing semantic function tests still receiving the effective placement for unchanged cases.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Dropdown viewport-aware placement adjustment.
- Consistency check: the public prop, docs, tests, runtime behavior, and generated output all use `autoAdjustOverflow`.
