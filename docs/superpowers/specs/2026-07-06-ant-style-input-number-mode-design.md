# Ant-style InputNumber Mode Design

## Context

Ant Design InputNumber exposes `mode` with `input` and `spinner` options. The official implementation passes the mode to its underlying input-number component, adds mode-specific classes, and changes default handler icons: input mode uses up/down icons, spinner mode uses plus/minus icons.

Aheart InputNumber already renders controls and supports custom `controls.upIcon` / `controls.downIcon`, but it does not declare `mode` or expose mode classes.

## Goal

Add InputNumber `mode` compatibility while preserving existing numeric behavior.

## Scope

- Add `mode?: 'input' | 'spinner'` with default `input`.
- Add a root mode class for styling and semantic inspection.
- Use `+` and `-` as default controls in `spinner` mode.
- Keep custom `controls.upIcon` and `controls.downIcon` overriding mode defaults.
- Apply lightweight spinner-mode styling: horizontal controls and centered input.
- Document the prop in the InputNumber API table.

## Non-goals

- No new value parsing, step, or keyboard behavior.
- No DOM reordering beyond CSS layout.
- No new slots or events.

## Verification

- Add focused tests for spinner mode class, default icons, and custom icon override.
- Run focused InputNumber tests, component typecheck, full component tests, component build, docs build, and `git diff --check`.
