# Ant Style Modal Responsive Width Design

## Context

Ant Design Modal treats primitive `width` values as the dialog width and object-form `width` values as breakpoint widths. In the current Ant implementation, object widths are split from primitive widths, converted into per-breakpoint CSS variables, and merged into the Modal style.

Aheart Modal currently accepts only `number | string` for `width`. Passing an object is outside the public type and would not produce useful responsive widths.

## Scope

This phase adds object-form responsive widths to `AModal`.

In scope:

- Extend `Modal.width` to accept `Partial<Record<GridBreakpoint, number | string>>`.
- Normalize numeric breakpoint values to pixel strings.
- Emit CSS variables named `--aheart-modal-<breakpoint>-width` on the dialog for object widths.
- Add Modal CSS media rules that apply breakpoint widths using the same breakpoint names and thresholds as the local Grid implementation.
- Keep primitive `number | string` widths working as before.
- Update Modal docs and generated package outputs.

Out of scope:

- Portal `getContainer`.
- Static Modal APIs.
- Runtime viewport observers.
- Custom breakpoint token overrides.
- Resizing height or min/max width props beyond the existing `style` hook.

## Behavior

- `width={480}` still renders an inline `width: 480px` style on the dialog.
- `width="64vw"` still renders an inline `width: 64vw` style on the dialog.
- `width={{ xs: 320, md: '640px', xxl: '72vw' }}` renders `--aheart-modal-xs-width: 320px`, `--aheart-modal-md-width: 640px`, and `--aheart-modal-xxl-width: 72vw`.
- Missing breakpoint values fall back to the nearest smaller configured breakpoint and then to the default Modal width.
- The existing mobile fit rule remains, but it uses configured responsive variables when present so narrow screens can still respect an `xs` or `sm` value without exceeding the viewport.

## Component Design

Reuse the Grid breakpoint type so Modal and Grid agree on names:

```ts
import type { GridBreakpoint } from '../grid/types'

export type ModalResponsiveWidth = Partial<Record<GridBreakpoint, number | string>>
export type ModalWidth = number | string | ModalResponsiveWidth
```

In `modal.vue`, detect object-form width with a small type guard. Primitive width keeps the current inline `width` style. Object width skips the inline `width` property and contributes CSS variables instead.

CSS applies the variables through media queries. Each larger breakpoint falls back through smaller breakpoint variables, then to `--aheart-modal-width`, then to `520px`.

## Tests

Add Modal coverage for:

- Object-form `width` rendering per-breakpoint CSS variables.
- Numeric breakpoint widths becoming pixel strings.
- Primitive width still rendering the current inline dialog width.

The existing first Modal test already covers primitive numeric width, so the new test only needs to prove object width behavior.

## Documentation

Update the Modal API width row and add a `ModalResponsiveWidth` snippet. Add one short example showing `:width="{ xs: 320, md: 640, xl: '72vw' }"`.

## Self Review

- Placeholder scan: no placeholder markers or deferred behavior.
- Scope check: one width-shape addition only.
- Ambiguity check: breakpoint names and CSS thresholds follow the existing Grid implementation.
