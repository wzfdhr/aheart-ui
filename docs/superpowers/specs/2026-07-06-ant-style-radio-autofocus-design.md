# Radio AutoFocus Design

## Goal

Add Ant-style `autoFocus` support to `ARadio` so a radio can focus its native input when mounted.

## Source Behavior

Ant Design Radio documents `autoFocus` as a boolean prop that focuses the radio on mount. Aheart already exposes `focus()` and `blur()` instance methods for `ARadio`, so `autoFocus` should reuse the same native input focus target.

Official reference: `https://4x.ant.design/components/radio/`

## Current Gap

`ARadio` exposes imperative focus controls, but it does not declare an `autoFocus` prop and does not focus the native `<input type="radio">` during mount.

## Design

- Add an `autoFocus` boolean prop to `radioProps`.
- On mount, if `autoFocus` is true, focus the native input with the existing `focus()` helper.
- Use `nextTick(focus)` to match the local Switch implementation and avoid focusing before the element is mounted.
- Preserve current controlled/uncontrolled checked priority, group behavior, disabled fallback, semantic hooks, and focus/blur instance methods.

## Test Coverage

Add a focused Radio test that mounts into `document.body`, passes `autoFocus`, awaits Vue's mount tick, and verifies `document.activeElement` is the native radio input.

## Out of Scope

- Adding focus or blur emitted events.
- Adding `autoFocus` to Checkbox in this phase.
- Changing RadioGroup focus management.
- Changing `nativeElement` exposure.
