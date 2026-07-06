# Form Value Setters Design

Expose Ant-style Form instance value setters on `AForm`: `setFieldValue(name, value)` and `setFieldsValue(values)`.

## Scope

- Add `setFieldValue(name: string, value: unknown)` to the `AForm` exposed instance methods.
- Add `setFieldsValue(values: FormModel)` to the `AForm` exposed instance methods.
- Keep the API synchronous, matching the rest of the current Form instance surface.
- Mutate the supplied `model` object in place, because the current Form implementation already treats `model` as the source of truth.
- Clear validation errors for fields changed through either setter.
- Do not emit validation or submit events from setters.

## Design

`setFieldValue(name, value)` writes `value` into `props.model[name]` and clears the current validation errors for `name`.

`setFieldsValue(values)` iterates over the keys in `values`, writes each value into `props.model`, and clears validation errors for those keys. Unknown keys are allowed and become part of the model, so `getFieldsValue(true)` can read them back.

Existing readers keep their current behavior. `getFieldValue(name)` reflects values written by the setters, and `getFieldsValue(true)` returns a shallow clone of the updated model.

## Tests

- Assert both methods are exposed on `wrapper.vm`.
- Start from an invalid form and validate it to populate field errors.
- Assert `setFieldValue('email', value)` updates `model.email` and clears only the email error.
- Assert `setFieldsValue({ password, admin })` updates multiple keys, allows unknown keys, and clears password errors.
- Assert setters do not emit `validate` events beyond the explicit validation call used to seed errors.

## Docs

Update the Form exposes table with `setFieldValue` and `setFieldsValue`.
