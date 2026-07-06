# InputNumber Ref Methods Design

## Goal

Align `AInputNumber` with the Ant Design InputNumber Ref API by exposing imperative focus, blur, and native element access.

## Source API

Ant Design documents the InputNumber Ref API with:

- `focus(option?: { preventScroll?: boolean; cursor?: 'start' | 'end' | 'all' })`
- `blur()`
- `nativeElement`

## Current Gap

`AInputNumber` currently renders a native input but does not expose component instance methods. Consumers cannot programmatically focus or blur the input through a component ref.

## Design

- Add a root element ref and an input element ref.
- Expose:
  - `focus(options?)`
  - `blur()`
  - `nativeElement`
- `focus()` targets the inner input control.
- `focus({ cursor })` updates input selection after focusing:
  - `start`: collapsed selection at the start
  - `end`: collapsed selection at the end
  - `all`: selects the entire displayed value
- `nativeElement` follows existing aheart component convention and returns the root component element.

## Testing

Add a focused test that mounts the component into `document.body`, calls exposed methods, verifies focus state, cursor selection, blur state, and `nativeElement`.

## Out of Scope

- Changing value parsing behavior
- Adding uncontrolled value support
- Adding stringMode precision behavior
- Changing the component root DOM structure beyond adding refs
