# Ant Style FormItem Hidden Design

## Context

FormItem already supports validation, renderable label/help/extra content,
label controls, and tooltip. Ant Design also exposes a `hidden` prop on
Form.Item: the item is not visually displayed, but it still participates in
form collection and validation. Aheart's Form model is consumer-owned, so this
slice focuses on hidden rendering while preserving existing registration and
validation behavior.

Official reference:

- https://ant.design/components/form/

## Scope

This slice adds:

- `hidden?: boolean` on FormItem.
- Hidden items render with a deterministic hidden class and are visually hidden.
- Hidden items remain mounted, keep registering field rules, and continue to
  participate in Form validation.
- Documentation and generated package output for the new prop.

This slice intentionally does not implement Form value collection, `preserve`,
`noStyle`, dependency tracking, or conditional unmounting.

## Behavior

- `hidden=false` or omitted preserves current FormItem rendering.
- `hidden=true` keeps the FormItem component mounted but hides the root element
  through `v-show` and an item state class.
- A hidden named item with rules still registers with Form and can produce
  `finishFailed` errors on submit.
- Hidden FormItem keeps its slots mounted, so consumer-controlled field values
  and rule registration remain stable.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before source changes.
- Verify `hidden` adds the hidden class and inline `display: none` style.
- Verify hidden FormItems still validate and emit `finishFailed`.
- Run focused Form tests, then full package verification.

## Documentation

Update `docs/components/form.md` with:

- A hidden field example.
- A FormItem API row for `hidden`.
