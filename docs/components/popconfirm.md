# Popconfirm 气泡确认框 <span class="aheart-status aheart-status--ready">Ready</span>

Popconfirm asks for confirmation near the triggering action before continuing.

<script setup lang="ts">
import { h } from 'vue'

const renderablePopconfirmTitle = () => h('span', { style: { fontWeight: 600 } }, 'Release candidate?')
const renderablePopconfirmDescription = h('span', [
  'This will publish ',
  h('strong', 'v2.4.0'),
  ' to production.'
])
const renderablePopconfirmIcon = h('span', { style: { color: 'var(--aheart-color-warning)' } }, '!')
</script>

## 基础用法

<div class="aheart-demo-panel">
  <APopconfirm title="Delete item?" description="This action cannot be undone.">
    <AButton type="danger">Delete</AButton>
  </APopconfirm>
</div>

```vue
<template>
  <APopconfirm title="Delete item?" description="This action cannot be undone." @confirm="remove">
    <AButton type="danger">Delete</AButton>
  </APopconfirm>
</template>
```

## 自定义按钮文案

<div class="aheart-demo-panel">
  <APopconfirm
    title="Publish changes?"
    description="Customers will see this version immediately."
    ok-text="Publish"
    cancel-text="Review"
    placement="bottomRight"
  >
    <AButton type="primary">Publish</AButton>
  </APopconfirm>
</div>

```vue
<template>
  <APopconfirm
    title="Publish changes?"
    description="Customers will see this version immediately."
    ok-text="Publish"
    cancel-text="Review"
    placement="bottomRight"
  >
    <AButton type="primary">Publish</AButton>
  </APopconfirm>
</template>
```

## 可渲染内容

<div class="aheart-demo-panel">
  <APopconfirm
    default-open
    :title="renderablePopconfirmTitle"
    :description="renderablePopconfirmDescription"
    :icon="renderablePopconfirmIcon"
    ok-text="Release"
  >
    <AButton type="primary">Release</AButton>
  </APopconfirm>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const renderablePopconfirmTitle = () => h('span', { style: { fontWeight: 600 } }, 'Release candidate?')
const renderablePopconfirmDescription = h('span', [
  'This will publish ',
  h('strong', 'v2.4.0'),
  ' to production.'
])
const renderablePopconfirmIcon = h('span', { style: { color: 'var(--aheart-color-warning)' } }, '!')
</script>

<template>
  <APopconfirm
    :title="renderablePopconfirmTitle"
    :description="renderablePopconfirmDescription"
    :icon="renderablePopconfirmIcon"
    ok-text="Release"
  >
    <AButton type="primary">Release</AButton>
  </APopconfirm>
</template>
```

## 自定义内容

<div class="aheart-demo-panel">
  <APopconfirm :show-cancel="false" ok-text="Got it">
    <AButton>Notice</AButton>
    <template #icon>i</template>
    <template #title>Heads up</template>
    <template #description>Only the OK action is shown in this compact confirmation.</template>
  </APopconfirm>
</div>

```vue
<template>
  <APopconfirm :show-cancel="false" ok-text="Got it">
    <AButton>Notice</AButton>
    <template #icon>i</template>
    <template #title>Heads up</template>
    <template #description>Only the OK action is shown.</template>
  </APopconfirm>
</template>
```

## 图标与颜色

<div class="aheart-demo-panel">
  <APopconfirm
    title="Archive item?"
    description="You can restore it from the archive later."
    icon="?"
    color="rgb(255, 251, 230)"
    ok-text="Archive"
  >
    <AButton>Archive</AButton>
  </APopconfirm>
</div>

```vue
<template>
  <APopconfirm
    title="Archive item?"
    description="You can restore it from the archive later."
    icon="?"
    color="rgb(255, 251, 230)"
    ok-text="Archive"
  >
    <AButton>Archive</AButton>
  </APopconfirm>
</template>
```

## 按钮属性

<div class="aheart-demo-panel">
  <APopconfirm
    title="Deploy now?"
    description="This starts a production deployment."
    ok-text="Deploy"
    cancel-text="Hold"
    :ok-button-props="{ danger: true, ghost: true }"
    :cancel-button-props="{ disabled: false }"
  >
    <AButton type="primary">Deploy</AButton>
  </APopconfirm>
</div>

```vue
<template>
  <APopconfirm
    title="Deploy now?"
    description="This starts a production deployment."
    ok-text="Deploy"
    cancel-text="Hold"
    :ok-button-props="{ danger: true, ghost: true }"
    :cancel-button-props="{ disabled: false }"
  >
    <AButton type="primary">Deploy</AButton>
  </APopconfirm>
</template>
```

## 弹层点击

<div class="aheart-demo-panel">
  <APopconfirm
    title="Open details?"
    description="Clicking inside the popup can be observed without closing it."
    @popup-click="() => undefined"
  >
    <AButton>Observe popup</AButton>
  </APopconfirm>
</div>

```vue
<template>
  <APopconfirm
    title="Open details?"
    description="Clicking inside the popup can be observed without closing it."
    @popup-click="handlePopupClick"
  >
    <AButton>Observe popup</AButton>
  </APopconfirm>
</template>
```

## 悬停延迟与箭头

<div class="aheart-demo-panel">
  <APopconfirm
    trigger="hover"
    title="Delayed confirm"
    description="Hover timing and centered arrow follow the shared floating API."
    :mouse-enter-delay="0.4"
    :mouse-leave-delay="0.2"
    :arrow="{ pointAtCenter: true }"
  >
    <AButton>Hover with delay</AButton>
  </APopconfirm>
</div>

```vue
<template>
  <APopconfirm
    trigger="hover"
    title="Delayed confirm"
    description="Hover timing and centered arrow follow the shared floating API."
    :mouse-enter-delay="0.4"
    :mouse-leave-delay="0.2"
    :arrow="{ pointAtCenter: true }"
  >
    <AButton>Hover with delay</AButton>
  </APopconfirm>
</template>
```

## 语义样式

<div class="aheart-demo-panel">
  <APopconfirm
    default-open
    title="Semantic hooks"
    description="Root, popup, text, and action parts can be styled directly."
    root-class-name="popconfirm-semantic-demo"
    :class-names="{
      popup: 'popconfirm-semantic-demo__popup',
      icon: 'popconfirm-semantic-demo__icon',
      okButton: 'popconfirm-semantic-demo__ok'
    }"
    :styles="{
      root: { maxWidth: '360px' },
      popup: { borderColor: 'var(--aheart-color-primary)' },
      icon: { backgroundColor: 'var(--aheart-color-primary)' },
      okButton: { marginLeft: '8px' }
    }"
  >
    <AButton>Styled popup</AButton>
  </APopconfirm>
</div>

```vue
<template>
  <APopconfirm
    default-open
    title="Semantic hooks"
    description="Root, popup, text, and action parts can be styled directly."
    root-class-name="popconfirm-semantic-demo"
    :class-names="{ popup: 'popconfirm-semantic-demo__popup', okButton: 'popconfirm-semantic-demo__ok' }"
    :styles="{ popup: { borderColor: 'var(--aheart-color-primary)' }, okButton: { marginLeft: '8px' } }"
  >
    <AButton>Styled popup</AButton>
  </APopconfirm>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 确认标题，`title` 插槽优先级更高 | `VNodeChild` \| `() => VNodeChild` | - |
| description | 辅助说明，`description` 插槽优先级更高 | `VNodeChild` \| `() => VNodeChild` | - |
| icon | 提示图标内容，`icon` 插槽优先级更高；传 `false` 或 `null` 时隐藏 | `VNodeChild` | `!` |
| placement | 气泡位置 | `FloatingPlacement` | `top` |
| trigger | 触发方式 | `hover` \| `focus` \| `click` \| `contextMenu` \| `FloatingTrigger[]` | `click` |
| open | 受控显示状态 | `boolean` | - |
| defaultOpen | 默认显示状态 | `boolean` | `false` |
| destroyOnHidden | 关闭后销毁弹层 DOM | `boolean` | `false` |
| destroyTooltipOnHide | 旧版关闭后销毁别名，等同 `destroyOnHidden` | `boolean` | `false` |
| fresh | 兼容 Ant Design 的内容刷新标记；Vue 响应式内容默认保持更新 | `boolean` | `false` |
| okText | 确认按钮文案 | `string` | `OK` |
| cancelText | 取消按钮文案 | `string` | `Cancel` |
| okType | 确认按钮类型 | `ButtonType` | `primary` |
| okButtonProps | 确认按钮属性 | `Partial<ButtonProps>` | - |
| cancelButtonProps | 取消按钮属性 | `Partial<ButtonProps>` | - |
| disabled | 禁用弹出确认框 | `boolean` | `false` |
| showCancel | 是否显示取消按钮 | `boolean` | `true` |
| color | 自定义弹层背景色 | `string` | - |
| mouseEnterDelay | hover 打开延迟，单位秒 | `number` | `0.1` |
| mouseLeaveDelay | hover 关闭延迟，单位秒 | `number` | `0.1` |
| arrow | 是否显示箭头，或配置箭头指向中心 | `boolean` \| `{ pointAtCenter?: boolean }` | `true` |
| zIndex | 自定义层级 | `number` | - |
| getPopupContainer | 指定浮层挂载容器 | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| className | 根元素 class | `string` | - |
| rootClassName | 根元素 class | `string` | - |
| style | 根元素样式 | `StyleValue` | - |
| classNames | 语义 DOM class 映射 | `Partial<Record<PopconfirmSemanticPart, string>>` | - |
| styles | 语义 DOM style 映射 | `Partial<Record<PopconfirmSemanticPart, StyleValue>>` | - |

### PopconfirmSemanticPart

| 值 | 说明 |
| --- | --- |
| root | 根元素 |
| trigger | 触发元素包裹层 |
| popup | 弹层 |
| arrow | 箭头 |
| message | 图标与文本区域 |
| icon | 图标 |
| text | 标题与描述容器 |
| title | 标题 |
| description | 描述 |
| actions | 操作按钮区域 |
| cancelButton | 取消按钮 |
| okButton | 确认按钮 |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 显隐状态变化时触发 | `(open: boolean) => void` |
| openChange | 显隐状态变化时触发 | `(open: boolean) => void` |
| confirm | 点击确认按钮时触发 | `() => void` |
| cancel | 点击取消按钮时触发 | `() => void` |
| popupClick | 点击弹层时触发 | `(event: MouseEvent) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 触发元素 |
| title | 自定义标题 |
| description | 自定义说明 |
| icon | 自定义提示图标 |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-warning`
- `--aheart-spacing-sm`
- `--aheart-radius`
- `--aheart-shadow`
