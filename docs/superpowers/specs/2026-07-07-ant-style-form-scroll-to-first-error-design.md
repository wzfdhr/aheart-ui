# Ant-Style Form Scroll To First Error Design

## Goal

Add Ant Design-compatible `Form.scrollToFirstError` support so a failed submit can scroll the first invalid `AFormItem` into view.

## Scope

- Add a `scrollToFirstError` prop to `AForm`.
- Support `true` and `ScrollIntoViewOptions` object values.
- On submit validation failure, scroll the first field in `errorFields` whose FormItem is mounted under the current form.
- Preserve current validation events, finishFailed payloads, hidden/no-style validation behavior, and synchronous validation.

## Design

`AForm` will keep a ref to its root `<form>` element. After `validate()` returns failed fields, `handleSubmit` will emit `finishFailed` and, when `scrollToFirstError` is truthy, locate the first matching descendant with `data-name` equal to the failed field name. The component already renders named FormItems with `data-name`, so this avoids adding IDs or changing field registration.

For `scrollToFirstError: true`, `scrollIntoView()` is called without options. For an object value, that object is passed to `scrollIntoView(options)`.

## Tests

- Add a submit test with two invalid fields and `scrollToFirstError`.
- Stub `HTMLElement.prototype.scrollIntoView`.
- Assert the first invalid FormItem is scrolled once and the existing `finishFailed` payload is preserved.
- Verify the test fails before implementation.

## Docs

Update Form docs with a `scroll-to-first-error` demo and Form API row.
