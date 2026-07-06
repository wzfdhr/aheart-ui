# InputNumber Root Mouse-Down Default Design

## Goal

Align `AInputNumber` root mouse-down default prevention with rc InputNumber.

## Source Behavior

`@rc-component/input-number` handles root `onMouseDown` internally. When the mouse-down target is not the inner input, it focuses the input, prevents the default mouse-down behavior, then calls the user-provided `onMouseDown`.

Source reference: `https://raw.githubusercontent.com/react-component/input-number/master/src/InputNumber.tsx`

## Current Gap

`AInputNumber` currently focuses the inner input on root `mousedown`, but the user-provided root mouse-down listener is still routed through generic root attrs. That means the user listener runs before the internal handler and does not observe `event.defaultPrevented`; the internal handler also does not currently call `preventDefault`.

## Design

- Keep root mouse listener routing for click, mouseup, mouseenter, mousemove, mouseleave, and mouseout.
- Handle `onMousedown`/`onMouseDown` through the internal root mouse-down handler instead of generic `rootAttrs`.
- When the target is not the inner input, focus the input and call `event.preventDefault()`.
- Call any user-provided root mouse-down listener after the internal focus/default-prevention logic.
- Do not change value, parsing, formatting, keyboard, wheel, step, or control repeat behavior.

## Test Coverage

Add a focused InputNumber test that mounts the component with a root `onMousedown` listener, triggers root `mousedown`, and verifies the listener receives an event with `defaultPrevented === true`.

## Out of Scope

- Changing other root mouse event ordering.
- Preventing default when the original mouse-down target is already the inner input.
- Changing emitted component events.
