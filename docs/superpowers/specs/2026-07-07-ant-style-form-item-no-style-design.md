# Ant Style FormItem No Style Design

## Context

FormItem now supports labels, help, extra, tooltip, hidden rendering, and submit-time validation. Ant Design also exposes `noStyle` on Form.Item for pure field controls: the item does not render form item layout chrome, but it still participates in form binding and validation.

Official reference:

- https://ant.design/components/form/

## Scope

This slice adds:

- `noStyle?: boolean` on FormItem.
- No-style items render only their default slot content.
- No-style named items remain mounted, keep field rule registration, and continue to participate in Form validation.
- Documentation and generated package output for the new prop.

This slice intentionally does not implement Form value collection, `valuePropName`, `trigger`, `dependencies`, inherited parent validation status, or nested name paths.

## Behavior

- `noStyle=false` or omitted preserves current styled FormItem rendering.
- `noStyle=true` suppresses the `.aheart-form-item` root, label, help, extra, tooltip, feedback, hidden class, and layout classes.
- A no-style named item with rules still registers with Form and can produce `finishFailed` errors on submit.
- The default slot stays mounted so consumer-owned controls continue rendering normally.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before source changes.
- Verify `noStyle` renders default slot content without a `.aheart-form-item` root.
- Verify no-style FormItems still validate and emit `finishFailed`.
- Run focused Form tests, then full package verification.

## Documentation

Update `docs/components/form.md` with:

- A no-style field example.
- A FormItem API row for `noStyle`.
