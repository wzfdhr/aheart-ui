# Ant-style InputNumber Wheel Threshold Design

## Context

`@rc-component/input-number` does not step on every wheel event. It converts
wheel delta into pixel distance, accumulates matching-direction deltas, resets
stale deltas after 200ms, and steps only when the accumulated distance reaches
100px. Aheart InputNumber currently steps on every non-zero wheel event.

## Goal

Align `changeOnWheel` stepping with rc's wheel delta threshold behavior.

## Scope

- Convert `deltaMode` line and page wheel events to pixel-equivalent deltas.
- Accumulate wheel deltas until the absolute distance reaches 100px.
- Reset accumulation when wheel direction changes.
- Reset stale accumulation after 200ms.
- Emit one wheel step when the threshold is crossed and preserve leftover delta.
- Preserve `changeOnWheel=false`, min/max, precision, stringMode, and existing
  `step` event metadata.
- Document that wheel stepping uses an accumulated threshold.

## Non-goals

- No change to keyboard stepping.
- No change to control button stepping.
- No focus-only wheel listener behavior in this phase.
- No multi-step loop for a single large wheel event.

## Verification

- Update focused wheel tests so small deltas do not step until the accumulated
  threshold is reached.
- Run focused InputNumber tests, component typecheck, component build, full
  component tests, docs build, and `git diff --check`.
