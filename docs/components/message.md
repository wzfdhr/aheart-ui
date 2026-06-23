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

## 自定义样式和图标

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

## Promise 接口

```ts
message
  .loading('Saving', 1)
  .then(() => {
    message.success('Saved')
  })
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

## 自定义容器

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
| message.config | 设置全局 top、duration、maxCount、getContainer、prefixCls、rtl、pauseOnHover |

所有打开提示的方法都会返回 `MessageHandle`，可调用 `close()` 主动关闭，也可通过 `.then()` 在关闭后继续执行。

### MessageHandle

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| key | 提示唯一标识 | `string \| number` |
| close | 主动关闭当前提示 | `() => void` |
| then | 关闭后的 thenable 接口 | `Promise<void>['then']` |

### MessageOpenConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识，相同 key 会更新同一条提示 | `string \| number` | 自动生成 |
| type | 提示类型 | `success` \| `info` \| `warning` \| `error` \| `loading` | `info` |
| content | 提示内容 | `VNodeChild` | - |
| duration | 自动关闭时间，单位秒；`0` 表示不自动关闭 | `number` | `3` |
| className | 提示节点类名 | `string` | - |
| style | 提示节点样式 | `StyleValue` | - |
| icon | 自定义图标 | `VNodeChild` | - |
| onClick | 点击提示回调 | `() => void` | - |
| onClose | 关闭回调 | `() => void` | - |
| pauseOnHover | 鼠标悬停时暂停关闭计时 | `boolean` | 全局配置 |
| classNames | 语义化 DOM 类名 | `MessageClassNames` | - |
| styles | 语义化 DOM 样式 | `MessageStyles` | - |

### MessageGlobalConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| top | 顶部偏移 | `number \| string` | `8` |
| duration | 默认自动关闭时间，单位秒 | `number` | `3` |
| maxCount | 最大显示数量 | `number` | - |
| getContainer | 自定义挂载容器 | `() => HTMLElement` | `document.body` |
| prefixCls | 自定义类名前缀 | `string` | - |
| rtl | 是否启用 RTL 类名状态 | `boolean` | `false` |
| pauseOnHover | 是否默认悬停暂停关闭计时 | `boolean` | `true` |

## AMessage API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| notices | 提示列表 | `MessageNotice[]` | `[]` |
| top | 顶部偏移 | `number` \| `string` | `8` |
| prefixCls | 自定义类名前缀 | `string` | - |
| rtl | 是否启用 RTL 类名状态 | `boolean` | `false` |
| classNames | 语义化 DOM 类名 | `MessageClassNames` | `{}` |
| styles | 语义化 DOM 样式 | `MessageStyles` | `{}` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭按钮时触发 | `(key: string \| number) => void` |
| noticeMouseEnter | 鼠标进入提示时触发 | `(key: string \| number) => void` |
| noticeMouseLeave | 鼠标离开提示时触发 | `(key: string \| number) => void` |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 消息宿主根节点 |
| notice | 单条提示节点 |
| icon | 图标节点 |
| content | 内容节点 |
| close | 关闭按钮 |

## Theme Tokens

- `--aheart-color-success`
- `--aheart-color-info`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-shadow`
- `--aheart-radius`
