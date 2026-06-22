# Ant Style Message Controls And Semantic API Design

Date: 2026-06-22

## Context

`message` already supports the first-pass Ant-style global feedback service: static type methods, keyed updates, `duration`, `top`, `maxCount`, and `destroy`. The next parity gap is Ant Message's richer per-notice customization, thenable close interface, semantic DOM styling, and global mount/config options.

Reference: Ant Design Message documentation, `https://ant.design/components/message/`.

## Goals

- Preserve current `message.open`, `message.success`, `message.info`, `message.warning`, `message.error`, `message.loading`, `message.destroy`, and `message.config` behavior.
- Add per-notice config options:
  - `className`
  - `style`
  - `icon`
  - `onClick`
  - `classNames`
  - `styles`
  - `pauseOnHover`
- Support `content` and `icon` as `VNodeChild` values, not only strings.
- Add thenable close behavior so `message.success(...).then(afterClose)` resolves after the notice closes.
- Add global config options:
  - `getContainer`
  - `prefixCls`
  - `rtl`
  - `pauseOnHover`
- Keep the global static service local and lightweight; do not introduce `message.useMessage` or an App provider in this slice.

## Non Goals

- `message.useMessage` hook/context API.
- App-level message provider integration.
- Stacked message collapse UI.
- Motion/transition orchestration.
- Placement variants beyond top-center.

## Public API

```ts
export type MessageKey = string | number
export type MessageContentNode = VNodeChild
export type MessageSemanticPart = 'root' | 'notice' | 'icon' | 'content' | 'close'
export type MessageClassNames = Partial<Record<MessageSemanticPart, string>>
export type MessageStyles = Partial<Record<MessageSemanticPart, StyleValue>>

export interface MessageNotice {
  key: MessageKey
  type: MessageType
  content: MessageContentNode
  duration?: number
  className?: string
  style?: StyleValue
  icon?: MessageContentNode
  onClick?: () => void
  onClose?: () => void
  pauseOnHover?: boolean
  classNames?: MessageClassNames
  styles?: MessageStyles
}

export interface MessageGlobalConfig {
  top?: number | string
  duration?: number
  maxCount?: number
  getContainer?: () => HTMLElement
  prefixCls?: string
  rtl?: boolean
  pauseOnHover?: boolean
}
```

`message.open` and all type helpers return `MessageHandle`, which includes:

```ts
export interface MessageHandle extends PromiseLike<void> {
  key: MessageKey
  close: () => void
}
```

## Behavior

- `content` can be text or renderable Vue children.
- `icon` replaces the default icon for that notice.
- `className` and `style` apply to the notice node.
- Semantic `classNames` and `styles` apply to:
  - `root`: message host root
  - `notice`: each notice
  - `icon`: icon node
  - `content`: content node
  - `close`: close button
- `onClick` runs when a notice is clicked, excluding the close button's own click action.
- `pauseOnHover=true` pauses the remaining auto-close time on pointer enter and resumes it on pointer leave.
- Existing `duration: 0` behavior remains persistent.
- `message[level](...).then(afterClose)` resolves after close, whether closed by timer, close button, handle, keyed destroy, or full destroy.
- `getContainer` controls the DOM container used by the global host. Reconfiguring with a different container remounts the host.
- `prefixCls` adds Ant-style custom class aliases while preserving the existing `aheart-message` classes for compatibility.
- `rtl=true` applies a deterministic RTL class to the host and notices.
- `message.destroy()` resets notices and global config to defaults.

## Verification

- Add RED tests for per-notice class/style/icon/onClick and VNode content.
- Add RED tests for semantic class/style hooks.
- Add RED tests for thenable close behavior.
- Add RED tests for `getContainer`, `prefixCls`, `rtl`, and `pauseOnHover`.
- Run focused Message tests for RED and GREEN.
- Run component typecheck.
- Update docs and generated `es` / `lib` outputs.
- Run full verification before closing the slice.
