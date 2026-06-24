# Ant Style Dropdown Semantic Functions Design

## Context

Aheart Dropdown currently supports semantic `classNames` and `styles` maps for `root`, `trigger`, `popup`, `menu`, and `arrow`. Ant Design's current Dropdown API documents both `classNames` and `styles` as accepting either an object map or a function that receives component information and returns a map.

Reference: Ant Design Dropdown documentation, `https://ant.design/components/dropdown/`.

## Goal

Allow `ADropdown` and the inherited `ADropdownButton` dropdown props to accept function-form semantic hooks without changing the existing object-form behavior.

## Behavior

- `classNames` accepts either `Partial<Record<DropdownSemanticPart, string>>` or `(info: DropdownSemanticInfo) => Partial<Record<DropdownSemanticPart, string>>`.
- `styles` accepts either `Partial<Record<DropdownSemanticPart, StyleValue>>` or `(info: DropdownSemanticInfo) => Partial<Record<DropdownSemanticPart, StyleValue>>`.
- `DropdownSemanticInfo` includes a stable `open` boolean and `placement`.
- The resolved semantic maps apply to the same nodes as today:
  - `root`
  - `trigger`
  - `popup`
  - `menu`
  - `arrow`
- Existing object-form hooks, `overlayClassName`, `overlayStyle`, `Dropdown.Button`, menu click behavior, popup render aliases, Teleport, and hidden lifecycle remain unchanged.

## Files

- `packages/components/src/dropdown/types.ts`: split semantic map aliases and add function-form public types.
- `packages/components/src/dropdown/dropdown.vue`: resolve function-form semantic maps once and use the resolved maps for all semantic nodes.
- `packages/components/src/dropdown/__tests__/dropdown.test.ts`: add red-green coverage for function-form hooks and inherited DropdownButton behavior.
- `docs/components/dropdown.md`: document object-or-function forms and the `DropdownSemanticInfo` fields.
- Generated component outputs under `packages/components/es/dropdown`, `packages/components/lib/dropdown`, and shared style declarations are refreshed by the component build.

## Testing

- Focused Dropdown tests must first fail because function-form `classNames` and `styles` are not resolved.
- After implementation, focused tests must pass with:
  - function-form hooks receiving `open` and `placement`,
  - returned classes/styles applying to root, trigger, popup, menu, and arrow,
  - object-form hooks still covered by existing tests,
  - DropdownButton forwarding function-form hooks to its internal Dropdown.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Dropdown semantic hook function support.
- Consistency check: types, docs, tests, and generated output use `DropdownSemanticInfo` consistently.
