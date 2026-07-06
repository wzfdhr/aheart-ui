# Ant-style InputNumber Control Hold Design

## Context

`@rc-component/input-number` repeats control-button stepping when a user holds a
step handler. It steps once on mouse down, waits 600ms, then repeats every 200ms
until the press stops. Aheart InputNumber currently steps only once from button
clicks.

## Goal

Support press-and-hold stepping for InputNumber increase and decrease controls.

## Scope

- Step once immediately on control `mousedown`.
- Start repeated handler stepping after a 600ms hold delay.
- Continue repeated stepping every 200ms while held.
- Stop repeating on `mouseup` or `mouseleave`.
- Keep existing click fallback behavior for tests and non-mouse activation.
- Preserve disabled/readOnly, `controls=false`, stringMode, min/max, precision,
  and existing `step` event metadata.
- Document long-press control stepping.

## Non-goals

- No touch-specific repeat handling.
- No change to keyboard or wheel stepping.
- No change to root mouse event forwarding.
- No change to emitted event names or emitter labels.

## Verification

- Add a focused fake-timer test proving a held increase control steps
  immediately, repeats after 600ms, repeats every 200ms, and stops after
  `mouseup`.
- Run focused InputNumber tests, component typecheck, component build, full
  component tests, docs build, and `git diff --check`.
