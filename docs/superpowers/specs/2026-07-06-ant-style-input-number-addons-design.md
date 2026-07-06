# Ant-style InputNumber Addons Design

## Context

Ant Design InputNumber still exposes the deprecated `addonBefore` and `addonAfter`
props for compatibility. They render adjacent content before and after the input
control. Aheart InputNumber currently supports `prefix` and `suffix`, but those
are inline adornments inside the input body and do not cover the Ant-compatible
addon API.

## Goal

Add `addonBefore` and `addonAfter` renderable props to InputNumber so users can
pass strings, numbers, or VNodes as adjacent label content.

## Scope

- Add `addonBefore` and `addonAfter` props with the same renderable value shape
  as `prefix` and `suffix`.
- Render `addonBefore` before the input's inline prefix/control/suffix/actions.
- Render `addonAfter` after the input's inline prefix/control/suffix/actions.
- Preserve existing `prefix`, `suffix`, controls, input value, focus, and
  native input forwarding behavior.
- Document the props as Ant-compatible deprecated addon APIs.

## Non-goals

- No new slots for addons in this phase.
- No semantic DOM keys for addons in this phase.
- No change to value parsing, formatting, stepping, or validation behavior.

## Verification

- Add a focused test proving VNode/string addon content renders around the input.
- Add a focused test expectation that numeric zero addon content is renderable.
- Run focused InputNumber tests, component typecheck, full component tests,
  component build, docs build, and `git diff --check`.
