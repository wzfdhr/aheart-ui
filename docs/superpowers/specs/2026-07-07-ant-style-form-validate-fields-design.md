# Ant-Style Form Validate Fields Design

## Goal

Expose an Ant-style field validation entrypoint on `AForm`: `validateFields(names?)`.

## Scope

- Add `validateFields(names?: string[])` to the `AForm` exposed instance methods.
- Keep string field names only, matching the current flat model and FormItem `name` support.
- Keep validation synchronous and return the existing result shape: `{ values, errorFields }`.
- Support validating all registered/rule-backed fields when `names` is omitted.
- Support validating only requested fields when `names` is provided.
- Preserve `validate()`, submit, scroll, value readers, error readers, and field registration behavior.

## Design

`AForm` already has a synchronous `validate()` helper that validates all fields and updates `fieldStates[name].errors`. This phase extracts the core logic into `validateFields(names?)`.

`validateFields()` validates the same field-name set as `validate()` currently uses. `validateFields(['password'])` validates only `password`, emits the per-field `validate` event only for that field, and leaves other field error state unchanged.

`validate()` remains as the existing public method and delegates to `validateFields()` with no arguments, preserving the current API while adding the Ant-style method name.

## Tests

- Add a focused Form test that mounts multiple invalid named fields.
- Assert `validateFields` is exposed.
- Assert `validateFields(['password'])` returns only the password error.
- Assert the per-field `validate` event is emitted only for `password`.
- Assert the unvalidated email field still has no stored errors.
- Assert `validateFields()` without names validates all fields.
- Verify the test fails before implementation because the method is not exposed.

## Docs

Update the Form exposes table with `validateFields`.
