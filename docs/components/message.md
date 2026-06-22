# Message 全局提示 <span class="aheart-status aheart-status--ready">Ready</span>

Message displays global lightweight feedback through a static service or the `AMessage` host component.

## 基础用法

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

## 持久提示

<div class="aheart-demo-panel">
  <AButton @click="message.loading({ key: 'sync', content: 'Syncing', duration: 0 })">
    Persistent loading
  </AButton>
</div>

```ts
message.loading({ key: 'sync', content: 'Syncing', duration: 0 })
```

## 更新同一条提示

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

## 全局配置

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

## AMessage

<div class="aheart-demo-panel" style="position: relative; min-height: 96px;">
  <AMessage
    style="position: absolute;"
    :notices="[
      { key: 'saved', type: 'success', content: 'Saved' },
      { key: 'warning', type: 'warning', content: 'Check settings' }
    ]"
  />
</div>

```vue
<template>
  <AMessage :notices="notices" @close="removeNotice" />
</template>
```

## Service API

| 方法 | 说明 |
| --- | --- |
| message.open | 打开默认信息提示 |
| message.success | 打开成功提示 |
| message.info | 打开信息提示 |
| message.warning | 打开警告提示 |
| message.error | 打开错误提示 |
| message.loading | 打开加载提示 |
| message.destroy | 关闭某条或全部提示 |
| message.config | 设置全局 top、duration、maxCount |

### MessageOpenConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识，相同 key 会更新同一条提示 | `string` | 自动生成 |
| type | 提示类型 | `success` \| `info` \| `warning` \| `error` \| `loading` | `info` |
| content | 提示内容 | `string` | - |
| duration | 自动关闭时间，单位秒；`0` 表示不自动关闭 | `number` | `3` |
| onClose | 关闭回调 | `() => void` | - |

## AMessage API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| notices | 提示列表 | `MessageNotice[]` | `[]` |
| top | 顶部偏移 | `number` \| `string` | `8` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭按钮时触发 | `(key: string) => void` |

## Theme Tokens

- `--aheart-color-success`
- `--aheart-color-info`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-shadow`
- `--aheart-radius`
