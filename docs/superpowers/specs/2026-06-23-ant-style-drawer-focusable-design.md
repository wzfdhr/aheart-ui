# Ant Style Drawer Focusable Design

## Context

Ant Design Drawer documents `focusable` as the focus management configuration for drawer dialogs, with `trap` and `focusTriggerAfterClose` options. Aheart Drawer already supports close controls, mask config, `getContainer`, and renderable header/footer content, but it does not yet restore focus to the opener or cycle Tab focus inside the drawer.

Official reference:

- https://ant.design/components/drawer/

## Scope

This phase adds:

- `focusable?: { trap?: boolean; focusTriggerAfterClose?: boolean }` to `ADrawer`.
- Default focus restoration to the element that was active when the drawer opened.
- `focusable.focusTriggerAfterClose: false` opt-out.
- Tab and Shift+Tab trapping inside the drawer panel when trapping is enabled.
- Mask-derived default trapping, with `focusable.trap` taking precedence.
- Tests, docs, and generated `es` / `lib` Drawer outputs.

This phase does not add animation timing, auto-focus on first open, nested drawer push behavior, or static Drawer methods.

## Behavior

When a drawer transitions from closed to open, it stores `document.activeElement` if it is an `HTMLElement`.

When that drawer later transitions from open to closed:

- If `focusable.focusTriggerAfterClose` is `false`, focus stays wherever the user or application moved it.
- If `focusable.focusTriggerAfterClose` is omitted or `true`, focus returns to the stored trigger element.
- Focus restoration only runs when the saved trigger is still connected to `document`.
- Restoration is queued with `nextTick` so the close state has been applied before focus moves.

Focus trapping behaves as follows:

- A visible mask enables trapping by default.
- `mask={false}` or `mask={{ enabled: false }}` disables default trapping.
- `focusable.trap: true` enables trapping even without a visible mask.
- `focusable.trap: false` disables trapping even with a visible mask.
- Tab from the last focusable item cycles to the first focusable item.
- Shift+Tab from the first focusable item cycles to the last focusable item.
- If focus is outside the drawer panel while trapping is enabled, Tab moves into the panel.
- If the panel has no focusable descendants, the panel itself is the fallback target.

## Architecture

The implementation stays local to `packages/components/src/drawer/drawer.vue`.

`types.ts` gains a `DrawerFocusableConfig` interface and a `focusable` prop. The Drawer panel receives a template ref and `tabindex="-1"` so it can be the fallback focus target. The existing root keydown handler gains Tab trap handling before its Escape branch. Trigger capture and focus restoration follow the Modal implementation pattern, but without the deprecated top-level `focusTriggerAfterClose` prop because Drawer only exposes the object-form API in this phase.

## Testing

Add Vitest coverage for:

- Default focus restoration after an open-to-close transition.
- Disabled `focusable.focusTriggerAfterClose` leaving focus in place.
- Default masked drawers cycling Tab from the last focusable element to the first.
- Shift+Tab cycling from the first focusable element to the last.
- `focusable.trap: false` disabling the default masked trap.
- `focusable.trap: true` enabling trapping when `mask` is false.

## Documentation

Update `docs/components/drawer.md` to:

- Add a focus management demo using `focusable`.
- Add `focusable` to the API table.
- Add a `DrawerFocusableConfig` reference section.
- Keep existing mask, closable, renderable, and semantic docs unchanged.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Drawer focus management only.
- Ambiguity check: restoration defaults, disabled behavior, trap defaults, and override precedence are explicit.
