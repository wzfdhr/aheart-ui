# Ant Style Switch Native Element Design

## Goal

Expose `nativeElement` from `ASwitch` component refs so consumers can access the root button element in the same style as other ref-enabled components.

## Context

`ASwitch` already supports `autoFocus`, `focus()`, and `blur()` on the root button. `ACheckbox` and `AInputNumber` already expose `nativeElement` from their component refs. `ASwitch` should follow that convention because its root element is the interactive native button.

## Requirements

- `ASwitch` component refs expose:
  - `focus()`
  - `blur()`
  - `nativeElement`
- `nativeElement` returns the root `<button>` element.
- Existing checked state, event payloads, autofocus behavior, renderable content, slots, semantic classes, and styles stay unchanged.
- Component documentation lists `nativeElement` in the Methods section.
- Generated `es` and `lib` declaration output includes `nativeElement`.

## Architecture

Keep the existing `switchRef` as the single source of truth for the root button. Extend `defineExpose` to include `nativeElement: switchRef`. No new props, emits, wrappers, or runtime behavior branches are needed.

## Testing

Add a focused unit assertion to the existing ref-control test. The test mounts `ASwitch` into `document.body`, verifies `autoFocus`, calls exposed `blur()` and `focus()`, then verifies `nativeElement` is exactly the root mounted button.

## Documentation

Update `docs/components/switch.md` so the example ref type and Methods table include `nativeElement?: HTMLButtonElement`.

## Out of Scope

- Changing Switch DOM structure.
- Changing focus target away from the root button.
- Adding focus or blur events.
- Changing Radio or Checkbox APIs in this stage.

## Self Review

- Placeholder scan: no placeholders remain.
- Consistency check: `nativeElement` consistently refers to the root `<button>`.
- Scope check: this is one narrow component API addition.
- Ambiguity check: focus target and native element target are explicit.
