# Message <span class="aheart-status aheart-status--ready">Ready</span>

Message displays global lightweight feedback through a static service or the `AMessage` host component.

<script setup lang="ts">
import { message } from 'aheart-ui'
const notices = [
  { key: 'saved', type: 'success', content: 'Saved', icon: '✓' },
  { key: 'warning', type: 'warning', content: 'Check settings', className: 'demo-warning' }
]
const removeNotice = () => undefined
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ASpace>
    <AButton @click="message.success('Saved')">Success</AButton>
    <AButton @click="message.error('Failed')">Error</AButton>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { message } from 'aheart-ui'
</script>

<template>
<ASpace>
    <AButton @click="message.success('Saved')">Success</AButton>
    <AButton @click="message.error('Failed')">Error</AButton>
  </ASpace>
</template>
```

## Persistent Message

<div class="aheart-demo-panel">
  <AButton @click="message.loading({ key: 'sync', content: 'Syncing', duration: 0 })">
    Persistent loading
  </AButton>
</div>

```ts
message.loading({ key: 'sync', content: 'Syncing', duration: 0 })
```

## Update the Same Message

<div class="aheart-demo-panel">
  <ASpace>
    <AButton @click="message.loading({ key: 'upload', content: 'Uploading', duration: 0 })">
      Start
    </AButton>
    <AButton type="primary" @click="message.success({ key: 'upload', content: 'Uploaded', duration: 2 })">
      Finish
    </AButton>
  </ASpace>
</div>

```ts
message.loading({ key: 'upload', content: 'Uploading', duration: 0 })
message.success({ key: 'upload', content: 'Uploaded', duration: 2 })
```

## Custom Style and Icon

<div class="aheart-demo-panel">
  <AButton
    @click="
      message.info({
        content: 'Styled message',
        icon: '★',
        className: 'demo-message',
        style: { minWidth: '220px' },
        duration: 2
      })
    "
  >
    Custom message
  </AButton>
</div>

```ts
message.info({
  content: 'Styled message',
  icon: '★',
  className: 'demo-message',
  style: { minWidth: '220px' },
  duration: 2
})
```

## Manual Close

<div class="aheart-demo-panel">
  <AButton
    @click="
      message.info({
        content: 'Manual close',
        duration: 0,
        closable: true,
        closeIcon: 'dismiss'
      })
    "
  >
    Closable message
  </AButton>
</div>

```ts
message.info({
  content: 'Manual close',
  duration: 0,
  closable: true,
  closeIcon: 'dismiss'
})
```

Messages hide the close button by default to keep Ant Message feedback lightweight. Set `closable: true` when a manual close control is needed, or call `close()` on the returned handle.

## Promise API

```ts
message
  .loading('Saving', 1)
  .then(() => {
    message.success('Saved')
  })
```

## Global Configuration

<div class="aheart-demo-panel">
  <AButton
    @click="
      () => {
        message.config({ top: 32, maxCount: 1 })
        message.info('Only one message')
      }
    "
  >
    Configured message
  </AButton>
</div>

```ts
message.config({ top: 32, maxCount: 1 })
message.info('Only one message')
```

## Stacked Messages

<div class="aheart-demo-panel">
  <AButton
    @click="
      () => {
        message.config({ stack: { threshold: 2 } })
        message.info('First stacked', 0)
        message.info('Second stacked', 0)
        message.info('Third stacked', 0)
      }
    "
  >
    Stacked message
  </AButton>
</div>

```ts
message.config({ stack: { threshold: 2 } })
message.info('First stacked', 0)
message.info('Second stacked', 0)
message.info('Third stacked', 0)
```

With `stack` enabled, messages beyond the threshold collapse older notices and show the latest notice with the hidden count.

## Custom Container

```ts
message.config({
  getContainer: () => document.querySelector('#message-root') as HTMLElement,
  prefixCls: 'custom-message',
  rtl: true,
  pauseOnHover: true
})
```

## AMessage

<div class="aheart-demo-panel" style="position: relative; min-height: 96px;">
  <AMessage
    style="position: absolute;"
    prefix-cls="demo-message-host"
    :class-names="{ notice: 'demo-message-notice' }"
    :styles="{ root: { top: '12px' } }"
    :notices="[
      { key: 'saved', type: 'success', content: 'Saved', icon: '✓' },
      { key: 'warning', type: 'warning', content: 'Check settings', className: 'demo-warning' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { message } from 'aheart-ui'
</script>

<template>
<AButton @click="message.loading({ key: 'sync', content: 'Syncing', duration: 0 })">
    Persistent loading
  </AButton>
</template>
```

## API

## Service API

| Method | Description |
| --- | --- |
| message.open | Opens a default informational message. |
| message.success | Opens a success message. |
| message.info | Opens an informational message. |
| message.warning | Opens a warning message. |
| message.error | Opens an error message. |
| message.loading | Opens a loading message. |
| message.destroy | Closes one message or all messages. |
| message.config | Sets global `top`, `duration`, `maxCount`, `stack`, `getContainer`, `prefixCls`, `rtl`, and `pauseOnHover` options. |

Every message-opening method returns a `MessageHandle`. Call `close()` to dismiss it manually, or use `.then()` to continue after it closes.

### MessageHandle

| Field | Description | Type |
| --- | --- | --- |
| key | Unique message identifier. | `string \|number` |
| close | Closes this message manually. | `() => void` |
| then | Thenable interface that runs after the message closes. | `Promise<void>['then']` |

### MessageOpenConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique identifier. Opening with the same key updates the existing message. | `string \|number` | auto-generated |
| type | Message type. | `success` \|`info` \|`warning` \|`error` \|`loading` | `info` |
| content | Message content. | `VNodeChild` | - |
| duration | Time before automatic close, in seconds. `0` disables automatic closing. | `number` | `3` |
| className | Class name for the message node. | `string` | - |
| style | Styles for the message node. | `StyleValue` | - |
| icon | Custom icon. | `VNodeChild` | - |
| closable | Whether to show a close button. | `boolean` | `false` |
| closeIcon | Custom close-button content. | `VNodeChild` | `×` |
| onClick | Callback when the message is clicked. | `() => void` | - |
| onClose | Callback after the message closes. | `() => void` | - |
| pauseOnHover | Whether hovering pauses the close timer. | `boolean` | global configuration |
| classNames | Semantic DOM class names. | `MessageClassNames` | - |
| styles | Semantic DOM styles. | `MessageStyles` | - |

### MessageGlobalConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| top | Top offset. | `number \|string` | `8` |
| duration | Duration before automatic close, in seconds. | `number` | `3` |
| maxCount | Maximum visible count. | `number` | - |
| stack | Whether to stack messages beyond a threshold. | `boolean \|{ threshold: number }` | `false` |
| getContainer | Mount container; pass `false` to render inline. | `() => HTMLElement` | `document.body` |
| prefixCls | Custom class-name prefix. | `string` | - |
| rtl | Whether to enable the RTL class state. | `boolean` | `false` |
| pauseOnHover | Whether hovering pauses the close timer. | `boolean` | `true` |

## AMessage API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| notices | Message list. | `MessageNotice[]` | `[]` |
| top | Top offset. | `number` \|`string` | `8` |
| prefixCls | Custom class-name prefix. | `string` | - |
| rtl | Whether to enable the RTL class state. | `boolean` | `false` |
| classNames | Semantic DOM class names, as an object or function. | `MessageClassNames` | `{}` |
| styles | Semantic DOM styles, as an object or function. | `MessageStyles` | `{}` |
| stack | Whether to stack messages beyond a threshold. | `boolean \|{ threshold: number }` | `false` |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| close | Fired when a notice's close button is clicked. | `(key: string \| number) => void` |
| noticeMouseEnter | Fired when the pointer enters a notice. | `(key: string \|number) => void` |
| noticeMouseLeave | Fired when the pointer leaves a notice. | `(key: string \|number) => void` |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Root message host. |
| notice | Individual message notice. |
| icon | Notice icon. |
| content | Notice content. |
| close | Close button, rendered only when `closable` is enabled. |

## Theme Tokens

- `--aheart-color-success`
- `--aheart-color-info`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-shadow`
- `--aheart-radius`
