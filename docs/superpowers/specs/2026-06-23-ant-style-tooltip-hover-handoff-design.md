# Ant Style Tooltip Teleport Hover Handoff Design

## Context

Aheart Tooltip already supports renderable titles, hover timing, hidden lifecycle preservation, object arrow configuration, semantic class/style hooks, and popup mounting through `getPopupContainer`.

Tooltip now teleports its popup to `document.body` by default. With hover trigger and `mouseLeaveDelay: 0`, moving from the trigger/root into the teleported popup can close the tooltip before the popup receives mouseenter. Popover, Popconfirm, and Dropdown already guard this handoff by checking the mouse event `relatedTarget` against both the trigger/root area and the teleported popup.

Reference: Ant Design Tooltip documentation, `https://ant.design/components/tooltip/`.

## Goal

Keep hover-triggered `ATooltip` open when pointer movement goes from the trigger/root into its teleported popup, while preserving existing delayed close behavior when the pointer leaves both areas.

## Behavior

- The Tooltip root has a root ref.
- The teleported popup has a popup ref.
- `mouseleave` accepts the mouse event and checks whether `relatedTarget` is inside the root or the popup.
- When pointer movement stays within trigger/root/popup, Tooltip does not schedule a close.
- When pointer movement leaves both root and popup, Tooltip clears the current timers and schedules close with `mouseLeaveDelay`.
- `mouseLeaveDelay: 0` closes immediately only when the pointer leaves both root and popup.
- Existing hover delay, click, focus, context menu, popup preservation, `destroyOnHidden`, `getPopupContainer`, semantic hooks, arrow rendering, and renderable title behavior remain unchanged.

## Files

- `packages/components/src/tooltip/tooltip.vue`: add root and popup refs plus related-target hover handoff logic.
- `packages/components/src/tooltip/__tests__/tooltip.test.ts`: add real Teleport coverage for trigger-to-popup handoff with `mouseLeaveDelay: 0`.
- Generated component outputs under `packages/components/es/tooltip` and `packages/components/lib/tooltip` are refreshed by the component build.

## Testing

- Focused Tooltip tests must first fail because current Tooltip closes immediately when root mouseleave fires with a teleported popup as `relatedTarget`.
- After implementation, focused tests must pass with:
  - trigger-to-popup movement keeping Tooltip open,
  - popup-to-body movement closing Tooltip,
  - existing hover timing and Teleport tests preserved.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Tooltip hover continuity across Teleport.
- Consistency check: source refs, tests, generated output, and behavior names match the existing Popover/Popconfirm pattern.
