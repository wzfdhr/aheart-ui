# FormItem Renderable Label Design

## Goal

Align `AFormItem` label content with Ant-style form item APIs by allowing the `label` prop to accept Vue renderable nodes, not only strings.

## Current Behavior

`formItemProps.label` is typed as `String`. `form-item.vue` renders the prop through text interpolation inside the label slot fallback. A VNode label is therefore stringified instead of rendered, while the named `label` slot already supports custom content.

## Design

Add a `FormRenderable` type backed by Vue `VNodeChild` and type the `label` prop as a renderable prop. `AFormItem` will keep named `label` slot priority, but its prop fallback will render through a local render-node helper. Required and optional marks remain outside the fallback content so their behavior does not change.

This stage is limited to `AFormItem.label`. `help` and `extra` remain string props because they already have dedicated slots for custom content and are not part of this slice.

## Verification

Add component tests that supply `label` as `h('span', ...)`, verify the nested label element renders, verify the required mark remains visible, and confirm `0` remains a visible label value. Run focused Form tests, full component tests, typecheck, component build, docs build, `git diff --check`, and a demo HTTP check.
