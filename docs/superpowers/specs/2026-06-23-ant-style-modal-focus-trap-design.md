# Ant Style Modal Focus Trap Design

## Context

Ant Design Modal documents `focusable` as the configuration object for Modal focus management, with `{ trap?: boolean, focusTriggerAfterClose?: boolean }`. The previous Aheart Modal phase added trigger focus restoration but intentionally left focus trapping out of scope. Aheart Modal currently lets keyboard focus leave the dialog when users press Tab past the last focusable element.

## Scope

This phase adds `focusable.trap` support to `AModal`.

In scope:

- Extend `ModalFocusableConfig` with `trap?: boolean`.
- Trap Tab navigation inside the rendered dialog when the trap is enabled.
- Resolve the default trap setting from the mask visibility, matching Ant's current Modal source behavior where Modal passes the merged mask state as the default trap value.
- Let `focusable.trap` override the mask-derived default.
- Keep existing focus restoration behavior unchanged.
- Update Modal docs and generated package outputs.

Out of scope:

- Static Modal APIs.
- Portal `getContainer`.
- Opening autofocus heuristics or `autoFocusButton`.
- Animation timing changes.
- Global focus sentinels outside the rendered Modal tree.

## Behavior

- When `open` is true and a visible mask is present, Tab and Shift+Tab cycle through focusable elements inside the dialog.
- When `mask` is false or `mask.enabled` is false, the trap is disabled by default.
- When `focusable.trap` is true, the trap is enabled even without a visible mask.
- When `focusable.trap` is false, Tab is not intercepted even with a visible mask.
- Disabled buttons, elements marked `hidden`, elements with `aria-hidden="true"`, and elements with `tabindex="-1"` are excluded from the focus cycle.
- If there are no focusable descendants, the dialog itself becomes the fallback focus target for Tab cycling.

## Component Design

`modal.vue` keeps focus trapping local to the component. A `dialogRef` points at the `role="dialog"` section. The existing root keydown handler continues to handle Escape and gains Tab handling. The new helper collects focusable descendants from the dialog, filters disabled and explicitly hidden entries, and cycles focus when the active element is before the first item, on the first item with Shift+Tab, or on the last item with Tab.

The trap only runs when `props.open` and `shouldTrapFocus` are true. `shouldTrapFocus` resolves as:

```ts
focusableConfig.value?.trap ?? isMaskVisible.value
```

This keeps object-form mask behavior consistent with the earlier mask phase.

## Tests

Add Modal tests for:

- Default masked modals cycling from the last focusable element to the first on Tab.
- Shift+Tab cycling from the first focusable element to the last.
- Disabled mask modals leaving focus unchanged by default.
- `focusable.trap: false` letting Tab leave focus unchanged from the component's point of view.
- `focusable.trap: true` enabling trapping when `mask` is false.

## Documentation

Update the Modal focus demo to mention both trigger restoration and focus trap. Update the API table and `ModalFocusableConfig` snippet to include `trap?: boolean`.

## Self Review

- Placeholder scan: no placeholder markers or deferred requirements.
- Scope check: one Modal focus-management API addition, no portal or static API work.
- Ambiguity check: the default trap behavior is explicitly tied to visible mask state and overridable through `focusable.trap`.
