# Ant-Style FormItem Message Variable Escape Design

## Goal

Support Ant Design's escaped message variable syntax in `AFormItem` rule messages so `\\${label}` renders as literal `${label}` while normal `${label}` placeholders still interpolate.

## Scope

- Update Form validation message interpolation only.
- Preserve existing `messageVariables`, rule variable, `validateFirst`, hidden, no-style, help, extra, and event behavior.
- Do not add async validation or broader field value collection.

## Design

`AForm` currently interpolates every `${key}` token. The interpolation helper will recognize an optional leading backslash. If a token is escaped, it returns the placeholder without the escape backslash and without variable lookup. If a token is not escaped, it keeps the existing lookup behavior.

This mirrors the official Ant Design Form example where `${label}` is converted and `\\${label}` is not converted.

## Tests

- Add a Form submission test with one message containing both `${label}` and `\\${label}`.
- Verify the test fails before implementation because the escaped placeholder is converted.
- Run focused Form tests, full component tests, typecheck, component build, docs build, and `git diff --check` before commit.

## Docs

Update the Form message variables example to show the escape syntax and add a short note under the demo.
