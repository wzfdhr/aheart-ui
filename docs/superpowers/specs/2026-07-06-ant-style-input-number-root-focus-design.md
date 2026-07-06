# InputNumber Root Focus Design

## Goal

Align `AInputNumber` root mouse-down focus behavior with rc InputNumber.

## Source Behavior

`@rc-component/input-number` handles root `onMouseDown` by focusing the inner input when the mouse-down target is not the input itself. This keeps prefix, suffix, wrapper, and control interactions anchored to the editable input.

Source reference: `https://raw.githubusercontent.com/react-component/input-number/master/src/InputNumber.tsx`

## Current Gap

`AInputNumber` routes Ant-compatible mouse listeners to the root wrapper, but a mouse-down on the root wrapper does not focus the inner input unless the browser target is already the input or a control step later calls focus.

## Design

- Add an internal root `mousedown` handler on the outer wrapper.
- If `inputRef` exists and `event.target !== inputRef.value`, focus the inner input.
- Keep existing user mouse listener routing on the root wrapper.
- Do not change value, step, parser, formatter, wheel, keyboard, or control repeat behavior.

## Test Coverage

Add a focused InputNumber test that mounts the component in `document.body`, triggers `mousedown` on the root wrapper, and verifies:

- the inner input becomes `document.activeElement`
- a user-provided root `onMousedown` listener still runs once

## Out of Scope

- Changing emitted events.
- Changing native attribute forwarding.
- Changing root mouse event routing beyond this internal focus behavior.
