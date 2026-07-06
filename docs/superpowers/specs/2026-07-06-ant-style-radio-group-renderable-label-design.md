# RadioGroup Renderable Option Label Design

## Goal

Align `ARadioGroup` object option labels with the Ant-style option model by allowing `label` values to be Vue renderable nodes, not only strings.

## Current Behavior

`RadioOption.label` is typed as `string`. Default group options pass that value to the child Radio `label` prop, and button-style options render it through text interpolation. A VNode label is therefore treated as a plain object instead of rendering as DOM.

## Design

`RadioOption.label` will use Vue's `VNodeChild` type. `ARadioGroup` will render option labels through a small local render-node helper in both default and `optionType="button"` modes. Primitive options continue normalizing to `String(option)`, preserving current text labels, values, selection behavior, disabled handling, and option metadata.

The standalone `ARadio` `label` prop remains string-based; custom content is already available through its default slot. This stage only changes labels supplied via `ARadioGroup.options`.

## Verification

Add component tests for renderable labels in default and button group modes. Run focused Radio tests, full component tests, typecheck, component build, docs build, `git diff --check`, and a demo HTTP check.
