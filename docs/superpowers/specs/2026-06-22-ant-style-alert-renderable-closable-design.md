# Ant Style Alert Renderable Closable Design

## Context

The project is iteratively aligning Aheart UI components with the official Ant Design component APIs. The next Alert slice is based on the official Ant Design Alert documentation at `https://ant.design/components/alert/`.

Current `AAlert` already supports type, message/title, description, showIcon, banner, closable, close events, action and icon slots, close icon slot, root hooks, and semantic `classNames` / `styles`. The main gaps are:

- Several content props are string-only while Ant treats them as renderable nodes.
- `closable` is boolean-only while Ant supports `boolean | ClosableType`.
- Semantic DOM names use local `content` and `action`; Ant's current table uses `section` and `actions`.

## Recommended Approach

Extend the existing component in place and keep compatibility:

- Widen content props to `VNodeChild` and render them through a local render-node helper.
- Support `closable` as `boolean | AlertClosableConfig` while preserving the existing `closeIcon` prop and `closeIcon` slot.
- Add Ant semantic aliases `section` and `actions` while keeping existing `content` and `action`.

Alternatives considered:

- Replace local semantic names with Ant names. This would be a breaking change for users already using `content` and `action`.
- Add only renderable props and postpone closable config. This would leave a documented Ant API gap in a small, testable area.

## Component Behavior

### Renderable Content

- `title`, `message`, `description`, `action`, `icon`, and `closeIcon` accept `VNodeChild`.
- `title` continues to take precedence over `message`.
- Default slot continues to override `description`.
- `action`, `icon`, and `closeIcon` slots continue to override matching props.

### Closable Config

- `closable` may be:
  - `false` or omitted: no close button.
  - `true`: render the close button.
  - object: render the close button and apply config.
- Closable object fields:
  - `closeIcon?: VNodeChild`
  - `ariaLabel?: string`
  - `ariaLabelledby?: string`
  - `ariaDescribedby?: string`
  - `onClose?: (event: MouseEvent) => void`
  - `afterClose?: () => void`
- Click handling order: emit `close`, call closable `onClose`, hide the Alert, emit `afterClose`, call closable `afterClose`.

### Semantic DOM

- `classNames.section` and `styles.section` apply to the content wrapper.
- `classNames.actions` and `styles.actions` apply to the action wrapper.
- Existing `content` and `action` keys remain supported. When both are present, Ant-style aliases are appended after local aliases so they can override via CSS order.

## Documentation

Update `docs/components/alert.md` with:

- An example for renderable prop content and object `closable`.
- Updated API types.
- Updated semantic DOM table documenting both current Ant aliases and local compatibility aliases.

## Testing

Use TDD:

- Add failing tests for VNode prop rendering across title/message/description/action/icon/closeIcon.
- Add failing tests for closable object callbacks and ARIA attributes.
- Add failing tests for `section` and `actions` semantic aliases.
- Verify red before source implementation, then targeted green and package typecheck.

## Non-Goals

- Do not add close animations.
- Do not replace the current local `title` alias with only Ant's `message`.
- Do not remove existing `content` / `action` semantic keys.
