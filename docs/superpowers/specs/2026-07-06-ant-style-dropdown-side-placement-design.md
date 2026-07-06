# Ant Style Dropdown Side Placement Design

## Context

Ant Design's current Dropdown API supports twelve popup placements: `top`, `topLeft`, `topRight`, `bottom`, `bottomLeft`, `bottomRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, and `rightBottom`. Aheart Dropdown currently supports the six top/bottom placements only, while Tooltip, Popover, and Popconfirm already support the full floating placement set.

Reference: Ant Design Dropdown documentation, `https://ant.design/components/dropdown/`.

## Goal

Add the six side placements to `ADropdown` and inherited `ADropdownButton` behavior while preserving the existing top/bottom behavior.

## Behavior

- `DropdownPlacement` includes `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, and `rightBottom`.
- `ADropdown` renders side placement classes without rewriting them to top/bottom during the post-render placement update.
- `autoAdjustOverflow` flips `left` to `right` when the popup would overflow left and there is more room on the right.
- `autoAdjustOverflow` flips `right` to `left` when the popup would overflow right and there is more room on the left.
- Side placements can adjust their vertical alignment:
  - `leftTop`/`rightTop` can become `leftBottom`/`rightBottom` when the top-aligned popup overflows the bottom edge and bottom alignment fits.
  - `leftBottom`/`rightBottom` can become `leftTop`/`rightTop` when the bottom-aligned popup overflows the top edge and top alignment fits.
  - centered side placements can adjust to `Top` or `Bottom` when centered alignment overflows a vertical edge.
- Existing top/bottom vertical flipping and horizontal alignment adjustment remain unchanged.
- Dropdown.Button inherits the expanded placement type and runtime behavior through its internal `ADropdown`.

## Non-Goals

- Do not add `align.offset` to Dropdown in this stage.
- Do not change menu selection or menu click behavior.
- Do not replace Dropdown's local CSS placement model with the shared floating utility CSS.
- Do not change the default placement.

## Files

- `packages/components/src/dropdown/types.ts`: expand `DropdownPlacement`.
- `packages/components/src/dropdown/dropdown.vue`: expand placement side/alignment helpers and overflow resolver.
- `packages/components/src/dropdown/style.css`: add side placement and side arrow rules.
- `packages/components/src/dropdown/__tests__/dropdown.test.ts`: add red-green coverage for side placement preservation and side overflow flipping.
- `docs/components/dropdown.md`: document side placement support.
- Generated component outputs under `packages/components/es` and `packages/components/lib` are refreshed by the component build.

## Testing

- Focused Dropdown tests must first fail because side placements are rewritten by the current resolver.
- After implementation, focused Dropdown tests must pass.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Dropdown side placements.
- Consistency check: source, tests, docs, and generated output all use the same twelve placement values.
