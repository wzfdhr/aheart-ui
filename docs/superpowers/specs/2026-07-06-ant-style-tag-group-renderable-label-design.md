# TagGroup Renderable Option Label Design

## Goal

Allow `ATagGroup` object option labels to accept Vue renderable nodes instead of only strings.

## Current Behavior

`TagOption.label` is typed as `string`. `tag-group.vue` renders each option label with text interpolation inside `ACheckableTag`, so a VNode label is stringified instead of rendered as DOM. `TagOption.icon` already supports `VNodeChild`, which makes label behavior inconsistent with the rest of the option content API.

## Design

`TagOption.label` will use a renderable alias backed by Vue `VNodeChild`. `ATagGroup` will render the label through a small local render-node helper inside the existing `ACheckableTag` slot. Primitive options continue normalizing to `String(option)`, preserving current text labels, selected values, single/multiple behavior, disabled handling, icon rendering, class/style/title metadata, and semantic styling.

This stage is limited to `ATagGroup.options[].label`; standalone `ATag` and `ACheckableTag` slot behavior does not change.

## Verification

Add a component test that supplies an option label created with `h('span', ...)`, verifies the nested element renders, and verifies the selected option state. Run focused Tag tests, full component tests, typecheck, component build, docs build, `git diff --check`, and a demo HTTP check.
