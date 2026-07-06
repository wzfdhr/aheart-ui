# Ant-style InputNumber AutoFocus Design

## Context

Ant-style InputNumber supports an `autoFocus` option for focusing the input when it is mounted. Aheart InputNumber already exposes imperative `focus` and `blur` methods, but it does not declare an `autoFocus` prop or actively focus the inner input on mount.

## Goal

Add `autoFocus` support to InputNumber so consumers can request initial focus declaratively.

## Scope

- Add an `autoFocus` boolean prop to `InputNumber`.
- On mount, focus the internal input when `autoFocus` is true.
- Preserve existing `focus`, `blur`, native attribute pass-through, and value-change behavior.
- Document the prop in the InputNumber API table.

## Non-goals

- No change to cursor-position options for the imperative `focus` method.
- No new event is introduced.
- No focus management for later prop changes; this phase only covers initial mount behavior.

## Verification

- Add a focused test that mounts InputNumber into `document.body` and verifies `document.activeElement` is the inner input when `autoFocus` is true.
- Run focused InputNumber tests, component typecheck, full component tests, component build, docs build, and `git diff --check`.
