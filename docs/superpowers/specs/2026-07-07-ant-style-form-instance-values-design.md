# Ant-Style Form Instance Values Design

## Goal

Expose Ant-style Form instance value readers on `AForm`: `getFieldValue(name)` and `getFieldsValue(names?)`.

## Scope

- Add `getFieldValue(name: string)` to the `AForm` exposed instance methods.
- Add `getFieldsValue(names?: string[] | true)` to the `AForm` exposed instance methods.
- Keep string field names only, matching the current flat model and FormItem `name` support.
- Read from the current `model` prop; do not introduce an internal mutable form store.
- Preserve validation, submit, scroll, and field registration behavior.

## Design

`AForm` already owns a flat `model` prop and a helper that discovers field names from Form-level rules and mounted FormItems. This phase adds readonly instance methods over that state.

`getFieldValue(name)` returns `props.model[name]`.

`getFieldsValue()` returns values for registered or rule-backed fields, using the same field-name set as validation. `getFieldsValue(['email', 'password'])` returns only those named values. `getFieldsValue(true)` returns a shallow clone of the complete model, including values without a mounted FormItem.

This keeps the API useful for consumers while avoiding larger Ant Form store features that are outside the current architecture.

## Tests

- Add a focused Form test that mounts named FormItems with extra model data.
- Assert the exposed `getFieldValue` reads one field.
- Assert `getFieldsValue()` returns registered field values.
- Assert `getFieldsValue(names)` returns the requested subset.
- Assert `getFieldsValue(true)` returns the complete model.
- Verify the test fails before implementation because the methods are not exposed.

## Docs

Update the Form exposes table with `getFieldValue` and `getFieldsValue`.
