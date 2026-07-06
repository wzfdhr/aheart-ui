# InputNumber Focused Class Design

## Goal

Expose a focused root state class on `AInputNumber`, aligning with rc InputNumber's root focused class behavior while following Aheart's local `is-*` state-class naming.

## Source Behavior

`@rc-component/input-number` includes a focused root class when the component is focused.

Source reference: `https://raw.githubusercontent.com/react-component/input-number/master/src/InputNumber.tsx`

## Current Gap

`AInputNumber` already tracks focus internally for wheel stepping, but the root element does not expose a focused state class. Consumers using semantic/root styling cannot target the focused state directly through classes.

## Design

- Reuse the existing `isFocused` ref that is set in `handleFocus` and cleared in `handleBlur`.
- Add `is-focused` to the root class object when `isFocused` is true.
- Keep the existing `:focus-within` CSS behavior unchanged.
- Do not change focus events, wheel behavior, value parsing, value formatting, or emitted events.

## Test Coverage

Add a focused InputNumber test that verifies:

- The root does not have `is-focused` initially.
- Triggering focus on the inner input adds `is-focused`.
- Triggering blur removes `is-focused`.

## Out of Scope

- Adding invalid or out-of-range state classes.
- Changing CSS focus styles.
- Changing semantic class names or style function APIs.
