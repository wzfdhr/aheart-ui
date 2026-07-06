# Ant-Style Form Instance Errors Design

## Goal

Expose Ant-style Form instance error readers on `AForm`: `getFieldError(name)` and `getFieldsError(names?)`.

## Scope

- Add `getFieldError(name: string)` to the `AForm` exposed instance methods.
- Add `getFieldsError(names?: string[])` to the `AForm` exposed instance methods.
- Keep string field names only, matching the current flat model and FormItem `name` support.
- Read currently stored validation errors; do not trigger validation from these methods.
- Preserve validation, submit, scroll, value readers, and field registration behavior.

## Design

`AForm` already stores per-field errors in `fieldStates[name].errors` after validation and exposes the same data to `AFormItem` through context. This phase turns that state into public readonly instance methods.

`getFieldError(name)` returns a shallow copy of the current error array for that field. Unknown or clean fields return `[]`.

`getFieldsError()` returns `{ name, errors }` objects for registered or rule-backed field names, using the same field-name set as validation. `getFieldsError(['email', 'password'])` returns results for the requested names, including empty errors for unknown or clean fields.

The methods only inspect current state. Consumers can call `validate()` or submit the form first when they need fresh validation results.

## Tests

- Add a focused Form test that mounts multiple named fields.
- Assert the exposed methods exist.
- Assert errors are empty before validation.
- Submit the form to populate validation state.
- Assert `getFieldError(name)` returns the current field errors.
- Assert `getFieldsError()` returns current errors for registered fields.
- Assert `getFieldsError(names)` includes requested clean or unknown fields with empty errors.
- Verify the test fails before implementation because the methods are not exposed.

## Docs

Update the Form exposes table with `getFieldError` and `getFieldsError`.
