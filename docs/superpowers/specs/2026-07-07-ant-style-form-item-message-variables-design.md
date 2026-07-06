# Ant-Style FormItem Message Variables Design

## Goal

Add Ant Design-compatible `FormItem` message variable interpolation so rule messages can use placeholders such as `${label}`, `${name}`, `${min}`, and custom values from `messageVariables`.

## Scope

- Add a `messageVariables` prop to `AFormItem`.
- Register each named field with its rules, `validateFirst`, and resolved message variables.
- Interpolate `${key}` placeholders when a rule fails.
- Include default variables from the field name, primitive label, and numeric rule constraints.
- Keep validation synchronous and preserve the existing `validateFirst`, hidden, no-style, help, extra, and event behavior.

## Design

`AFormItem` computes an effective variable map from the field name, primitive label text, and user-supplied `messageVariables`. The field registration passes that map into `AForm`.

`AForm` stores the variables in `FormFieldState`. When validation finds a failing rule, it builds a per-rule variable map and replaces `${...}` tokens in the selected message string. Unknown variables resolve to an empty string, matching the current small validation engine's pragmatic behavior.

Rule-specific values such as `type`, `len`, `min`, and `max` are available to messages. Custom `messageVariables` remain explicit field configuration and are refreshed when props change.

## Tests

- Add a Form submission test showing label, custom, field name, and rule constraint interpolation in emitted `finishFailed` and `validate` payloads.
- Run the focused Form test first to verify the new test fails with literal placeholders before implementation.
- Re-run focused tests, full component tests, typecheck, component build, docs build, and `git diff --check` before committing.

## Docs

Update `docs/components/form.md` with a message variables demo and API row for `messageVariables`.
