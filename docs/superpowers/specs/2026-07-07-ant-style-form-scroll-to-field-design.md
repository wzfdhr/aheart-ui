# Ant-Style Form Scroll To Field Design

## Goal

Expose an Ant Design-compatible `scrollToField(name, options?)` method on `AForm`.

## Scope

- Add `scrollToField` to the `AForm` exposed instance methods.
- Accept the existing string field names and optional `ScrollIntoViewOptions`.
- Reuse the current Form root `[data-name]` lookup.
- Preserve `scrollToFirstError`, validation, submit events, and field registration behavior.

## Design

`AForm` already has a private `scrollToField` helper for `scrollToFirstError`. This slice turns that helper into the public exposed method and changes `scrollToFirstError` to pass options into it. The method finds the first mounted descendant FormItem with a matching `data-name` and calls `scrollIntoView()`.

If options are omitted, it calls `scrollIntoView()` without arguments. If options are provided, it forwards them to `scrollIntoView(options)`.

## Tests

- Add a test that mounts a Form with named fields.
- Stub `HTMLElement.prototype.scrollIntoView`.
- Assert `wrapper.vm.scrollToField('password', options)` is exposed and scrolls the matching FormItem with the same options object.
- Verify the test fails before implementation because the method is not exposed.

## Docs

Update the Form exposes table with `scrollToField`.
