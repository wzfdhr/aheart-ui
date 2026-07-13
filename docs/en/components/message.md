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
  <AButton @click="message.success('Saved')">Success</AButton>
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
<template>
  <AMessage
    prefix-cls="demo-message-host"
    :class-names="{ notice: 'demo-message-notice' }"
    :styles="{ root: { top: '12px' } }"
    :notices="notices"
    @close="removeNotice"
  />
</template>
```

## API

## Service API

| Method | Description |
| --- | --- |
| message.open | Provides the `message.open` entry. |
| message.success | Provides the `message.success` entry. |
| message.info | Provides the `message.info` entry. |
| message.warning | Provides the `message.warning` entry. |
| message.error | Provides the `message.error` entry. |
| message.loading | Provides the `message.loading` entry. |
| message.destroy | Provides the `message.destroy` entry. |
| message.config | Provides the `message.config` entry. |

Every message-opening method returns a `MessageHandle`. Call `close()` to dismiss it manually, or use `.then()` to continue after it closes.

### MessageHandle

| Field | Description | Type |
| --- | --- | --- |
| key | Describes `key`. | `string \|number` |
| close | Describes `close`. | `() => void` |
| then | Describes `then`. | `Promise<void>['then']` |

### MessageOpenConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Configures `key`. | `string \|number` | auto-generated |
| type | Configures `type`. | `success` \|`info` \|`warning` \|`error` \|`loading` | `info` |
| content | Configures `content`. | `VNodeChild` | - |
| duration | Configures `duration`. | `number` | `3` |
| className | Configures `className`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| icon | Configures `icon`. | `VNodeChild` | - |
| closable | Configures `closable`. | `boolean` | `false` |
| closeIcon | Configures `closeIcon`. | `VNodeChild` | `×` |
| onClick | Configures `onClick`. | `() => void` | - |
| onClose | Configures `onClose`. | `() => void` | - |
| pauseOnHover | Configures `pauseOnHover`. | `boolean` | global configuration |
| classNames | Configures `classNames`. | `MessageClassNames` | - |
| styles | Configures `styles`. | `MessageStyles` | - |

### MessageGlobalConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| top | Configures `top`. | `number \|string` | `8` |
| duration | Configures `duration`. | `number` | `3` |
| maxCount | Configures `maxCount`. | `number` | - |
| stack | Configures `stack`. | `boolean \|{ threshold: number }` | `false` |
| getContainer | Configures `getContainer`. | `() => HTMLElement` | `document.body` |
| prefixCls | Configures `prefixCls`. | `string` | - |
| rtl | Configures `rtl`. | `boolean` | `false` |
| pauseOnHover | Configures `pauseOnHover`. | `boolean` | `true` |

## AMessage API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| notices | Configures `notices`. | `MessageNotice[]` | `[]` |
| top | Configures `top`. | `number` \|`string` | `8` |
| prefixCls | Configures `prefixCls`. | `string` | - |
| rtl | Configures `rtl`. | `boolean` | `false` |
| classNames | Configures `classNames`. | `MessageClassNames` | `{}` |
| styles | Configures `styles`. | `MessageStyles` | `{}` |
| stack | Configures `stack`. | `boolean \|{ threshold: number }` | `false` |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| close | Emitted when `close` occurs. | `(key: string \| number) => void` |
| noticeMouseEnter | Emitted when `noticeMouseEnter` occurs. | `(key: string \|number) => void` |
| noticeMouseLeave | Emitted when `noticeMouseLeave` occurs. | `(key: string \|number) => void` |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| notice | Provides the `notice` entry. |
| icon | Provides the `icon` entry. |
| content | Provides the `content` entry. |
| close | Provides the `close` entry. |

## Theme Tokens

- `--aheart-color-success`
- `--aheart-color-info`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-shadow`
- `--aheart-radius`
