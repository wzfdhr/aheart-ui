# Ant Style Modal Semantic Aliases Design

## Context

Ant Design Modal documents semantic DOM hooks with names such as `root`, `mask`, `wrapper`, `container`, `header`, `body`, `footer`, and `close`. Aheart Modal already has semantic hooks, but its internal names use `wrap` for the outer scrolling wrapper and `dialog` for the rendered dialog panel.

The existing names are useful and should keep working, but adding Ant-style aliases reduces surprise for consumers porting semantic class and style configs from Ant-style code.

## Scope

This phase adds Ant-style semantic aliases to `AModal`.

In scope:

- Add `wrapper` and `container` to `ModalSemanticPart`.
- Apply `wrapper` classes and styles to the same DOM node as existing `wrap`.
- Apply `container` classes and styles to the same DOM node as existing `dialog`.
- Keep existing `wrap` and `dialog` semantic keys working.
- Update Modal docs and generated package outputs.

Out of scope:

- Renaming DOM classes.
- Removing `wrap` or `dialog`.
- Adding portal `getContainer`.
- Static Modal APIs.
- Changing semantic behavior for other components.

## Behavior

- `classNames.wrapper` and `styles.wrapper` apply to `.aheart-modal__wrap`.
- `classNames.container` and `styles.container` apply to `.aheart-modal__dialog`.
- If both old and new keys are supplied, both class names are applied and style objects are merged with the Ant-style alias last.
- Existing `classNames.wrap`, `styles.wrap`, `classNames.dialog`, and `styles.dialog` continue to behave as before.

## Component Design

Extend `modalSemanticParts` with `wrapper` and `container`.

Add small helpers in `modal.vue`:

```ts
const semanticClasses = (...parts: ModalSemanticPart[]) => parts.map((part) => semanticClass(part))
const semanticStyles = (...parts: ModalSemanticPart[]): CSSProperties | undefined =>
  parts.reduce<CSSProperties>((merged, part) => ({ ...merged, ...semanticStyle(part) }), {})
```

Use `semanticClasses('wrap', 'wrapper')` and `semanticStyles('wrap', 'wrapper')` for the wrapper node. Use `semanticClasses('dialog', 'container')` and `semanticStyles('dialog', 'container')` for the dialog node.

## Tests

Add Modal coverage for:

- `wrapper` class/style applying to `.aheart-modal__wrap`.
- `container` class/style applying to `.aheart-modal__dialog`.
- Existing `wrap` and `dialog` coverage remains unchanged through current tests.

## Documentation

Update the Modal semantic example and `ModalSemanticPart` section to list both compatibility names and Ant-style alias names.

## Self Review

- Placeholder scan: no placeholder markers or deferred behavior.
- Scope check: one semantic alias addition only.
- Ambiguity check: old names remain compatibility keys; new names are applied to the same nodes.
