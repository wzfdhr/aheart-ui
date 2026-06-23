# Ant Style Dropdown Popup Container Design

## Context

Aheart Dropdown already supports hover/click/context menu triggers, controlled and uncontrolled open state, disabled fallback from ConfigProvider, hidden overlay preservation, arrow configuration, overlay compatibility hooks, semantic class/style hooks, menu click handling, custom popup slots, and `popupRender` / `dropdownRender`.

Ant Design Dropdown 6.4.5 exposes `getPopupContainer(triggerNode)` as part of its popup API and defaults popup mounting to `document.body`. Tooltip, Popover, and Popconfirm now expose the same Aheart API, so Dropdown should complete the shared floating-container alignment.

Reference: Ant Design Dropdown documentation, `https://ant.design/components/dropdown/`.

## Goal

Align `ADropdown` popup mounting with the Ant-style container API while preserving current trigger, menu, custom popup, semantic styling, destroy, and menu-click behavior.

## Behavior

- `getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement` is accepted on `ADropdown`.
- When omitted, the dropdown overlay teleports to `document.body`.
- When provided, the callback receives the trigger wrapper element and the overlay teleports into the returned container.
- Existing structure tests use a Teleport stub so they can keep asserting local overlay DOM.
- Real Teleport tests prove default body mounting and callback-based custom container mounting.
- Hover-triggered Dropdown remains open when pointer movement goes from trigger/root to the teleported overlay, and closes when the pointer leaves both areas.
- Menu clicks, `closeOnClick`, `destroyOnHidden`, semantic class/style hooks, arrow rendering, and popup render customization remain unchanged.

## Files

- `packages/components/src/dropdown/types.ts`: add `DropdownGetPopupContainer` and `getPopupContainer`.
- `packages/components/src/dropdown/dropdown.vue`: wrap the overlay in Teleport, add root/trigger/overlay refs, resolve the target container, and keep hover behavior stable across the teleported overlay.
- `packages/components/src/dropdown/__tests__/dropdown.test.ts`: add a Teleport-stubbed helper for local tests and real Teleport coverage for default, custom, and hover handoff behavior.
- `docs/components/dropdown.md`: document the new API.
- Generated component outputs under `packages/components/es/dropdown` and `packages/components/lib/dropdown` are refreshed by the component build.

## Testing

- Focused Dropdown tests must first fail because the overlay renders inline, `getPopupContainer` is not a prop, and hover leave does not account for a teleported overlay target.
- After implementation, the Dropdown suite must pass with:
  - default overlay mounting under `document.body`,
  - custom overlay mounting through `getPopupContainer`,
  - hover transfer between trigger and teleported overlay preserved,
  - all existing trigger, menu click, semantic, destroy, and custom popup behavior preserved.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Dropdown popup mounting and hover continuity needed by that mounting change.
- Consistency check: `DropdownGetPopupContainer`, `getPopupContainer`, Teleport behavior, docs, tests, and generated output use the same API names.
