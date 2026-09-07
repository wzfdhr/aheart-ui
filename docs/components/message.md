<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { message } from 'aheart-ui'

const messageContainer = ref<HTMLElement | null>(null)
const oneMessage = ref<{ close: () => void } | null>(null)
const actionResult = ref('准备就绪：等待一次真实消息服务调用')
const serviceContainer = () => messageContainer.value ?? document.body
const resetMessageConfig = () => {
  message.destroy()
  message.config({ getContainer: serviceContainer })
  message.info('已重置提示', 0)
  actionResult.value = '已销毁全部提示并恢复默认全局配置'
}
const showSuccess = () => {
  message.success({ content: '成功', duration: 0 })
  actionResult.value = '已挂载成功消息'
}
const startKeyed = () => {
  message.loading({ key: 'upload', content: '上传中', duration: 0 })
  actionResult.value = '已开始任务'
}
const finishKeyed = () => {
  message.success({ key: 'upload', content: '已上传', duration: 0 })
  actionResult.value = '已用同一 key 更新为已上传'
}
const stackMessages = () => {
  message.destroy()
  message.config({ getContainer: serviceContainer, stack: { threshold: 2 } })
  message.info('第一条提示', 0)
  message.info('第二条提示', 0)
  message.info('第三条提示', 0)
  actionResult.value = '已创建 3 条提示，阈值 2 折叠旧提示'
}
const closeOne = () => {
  if (!oneMessage.value) {
    oneMessage.value = message.info({ key: 'one', content: '单条提示', duration: 0 })
  }
  oneMessage.value?.close()
  oneMessage.value = null
  actionResult.value = '已销毁单条提示'
}
const closeAll = () => {
  message.destroy()
  message.config({ getContainer: serviceContainer })
  actionResult.value = '已销毁全部消息'
}
const showConfigured = () => {
  message.destroy()
  message.config({ getContainer: serviceContainer, top: 32, maxCount: 1 })
  message.info('已配置提示', 0)
  actionResult.value = '已应用 top=32、maxCount=1'
}
const showOne = () => {
  message.destroy()
  message.config({ getContainer: serviceContainer })
  oneMessage.value = message.info({ key: 'one', content: '第一条提示', duration: 0 })
  message.info({ key: 'two', content: '第二条提示', duration: 0 })
  actionResult.value = '已准备单条销毁样本'
}

onMounted(() => message.config({ getContainer: serviceContainer }))
onUnmounted(() => message.destroy())
</script>

# Message 全局提示 <span class="aheart-status aheart-status--ready">已完成</span>

Message displays global lightweight feedback through a static service or the `AMessage` host component.

## QG3 消息服务交互工作台

<section class="message-service-workbench" role="region" aria-label="消息服务交互工作台">
  <div class="message-service-workbench__toolbar">
    <div>
      <p class="message-service-workbench__eyebrow">MESSAGE SERVICE / QG3</p>
      <h3>真实服务入口与可观察状态</h3>
      <p>所有操作都通过公开的 message service 触发，提示会挂载到下方工作台容器。</p>
    </div>
    <div class="message-service-workbench__actions" aria-label="消息服务操作">
      <button type="button" @click="showSuccess">成功</button>
      <button type="button" @click="startKeyed">开始任务</button>
      <button type="button" @click="finishKeyed">完成任务</button>
      <button type="button" @click="stackMessages">堆叠阈值</button>
      <button type="button" @click="showOne">准备单条</button>
      <button type="button" @click="closeOne">关闭单条</button>
      <button type="button" @click="closeAll">关闭全部</button>
      <button type="button" @click="showConfigured">已配置提示</button>
      <button type="button" @click="resetMessageConfig">重置配置</button>
    </div>
  </div>
  <div ref="messageContainer" data-testid="message-service-container" class="message-service-workbench__container" aria-label="消息服务挂载容器" />
  <p class="message-service-workbench__result" aria-live="polite">{{ actionResult }}</p>
</section>

<style>
.message-service-workbench { display: grid; gap: 16px; margin: 20px 0 28px; color: #344054; background: #fff; border: 1px solid #d9e1ea; }
.message-service-workbench__toolbar { display: flex; gap: 24px; justify-content: space-between; padding: 24px; border-bottom: 1px solid #eef1f5; }
.message-service-workbench__toolbar h3 { margin: 4px 0 8px; color: #1d2939; }
.message-service-workbench__toolbar p { margin: 0; color: #667085; }
.message-service-workbench__eyebrow { font-size: 11px; letter-spacing: .12em; color: #1677ff !important; }
.message-service-workbench__actions { display: flex; flex-wrap: wrap; gap: 8px; align-content: flex-start; justify-content: flex-end; }
.message-service-workbench button { padding: 7px 11px; border: 1px solid #d9e1ea; border-radius: 6px; background: #fff; color: inherit; cursor: pointer; }
.message-service-workbench button:hover, .message-service-workbench button:focus-visible { border-color: #1677ff; color: #1677ff; }
.message-service-workbench__container { min-height: 56px; margin: 0 24px; border: 1px dashed #d9e1ea; }
.message-service-workbench__result { margin: 0; padding: 12px 24px; border-top: 1px solid #eef1f5; color: #667085; font-size: 13px; }
@media (max-width: 640px) { .message-service-workbench__toolbar { display: block; padding: 16px; } .message-service-workbench__actions { justify-content: flex-start; margin-top: 16px; } .message-service-workbench__container { margin: 0 16px; } .message-service-workbench__result { padding: 12px 16px; } }
</style>

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

## 手动关闭

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

默认提示不显示关闭按钮，以贴近 Ant Message 的轻量反馈样式。需要手动关闭入口时可设置 `closable: true`，也可以使用返回值的 `close()` 主动关闭。

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
      message.config({ top: 32, maxCount: 1 });
      message.info('Only one message')
    "
  >
    Configured message
  </AButton>
</div>

```ts
message.config({ top: 32, maxCount: 1 })
message.info('Only one message')
```

## 堆叠提示

<div class="aheart-demo-panel">
  <AButton
    @click="
      message.config({ stack: { threshold: 2 } });
      message.info('First stacked', 0);
      message.info('Second stacked', 0);
      message.info('Third stacked', 0)
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

设置 `stack` 后，当提示数量超过阈值时会折叠旧提示，只展示最新提示并显示隐藏数量。

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
| message.config | 设置全局 top、duration、maxCount、stack、getContainer、prefixCls、rtl、pauseOnHover |

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
| closable | 是否显示关闭按钮 | `boolean` | `false` |
| closeIcon | 自定义关闭按钮内容 | `VNodeChild` | `×` |
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
| stack | 超过阈值后堆叠提示；`true` 使用默认阈值 3 | `boolean \| { threshold: number }` | `false` |
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
| stack | 超过阈值后堆叠提示；`true` 使用默认阈值 3 | `boolean \| { threshold: number }` | `false` |

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
| close | 关闭按钮，仅在 `closable` 时渲染 |

## Theme Tokens

- `--aheart-color-success`
- `--aheart-color-info`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-shadow`
- `--aheart-radius`
