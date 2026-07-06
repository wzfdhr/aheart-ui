# FormItem Help Extra Renderables Design

## Goal

Align `AFormItem` help and extra content with Ant-style Form.Item APIs by allowing the `help` and `extra` props to accept Vue renderable nodes, not only strings.

## Current Behavior

`formItemProps.help` and `formItemProps.extra` are typed as `String`. `form-item.vue` renders them through text interpolation and truthy checks. Vue nodes are stringified or warned about by prop validation, and numeric renderables such as `0` are dropped by the visibility checks.

## Design

Reuse the existing `FormRenderable` type backed by Vue `VNodeChild`. Type `help` and `extra` as renderable props. Render their prop fallbacks through the local `AFormItemRenderNode` helper that already handles renderable labels.

`help` keeps the current priority order:

1. `help` slot
2. Explicit `help` prop
3. First validation error from the parent form

`extra` keeps the current slot-over-prop priority. Visibility checks use explicit renderable presence rules so `0` renders while `undefined`, `null`, `false`, and empty string stay hidden.

## Non-Goals

- Do not change validation behavior.
- Do not change `help` slot or `extra` slot names.
- Do not add a new message aggregation model.
- Do not change Form layout, required marks, feedback icons, or field registration.

## Verification

Add FormItem tests for VNode `help` and `extra`, numeric `0` help and extra, and validation-error fallback when no explicit help prop is provided. Run the focused Form test before implementation to verify the new cases fail, then run focused Form tests, full component tests, typecheck, component build, docs build, `git diff --check`, and a demo HTTP check before commit.
