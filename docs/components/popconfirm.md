# Popconfirm 气泡确认框 <span class="aheart-status aheart-status--ready">Ready</span>

Popconfirm asks for confirmation near the triggering action before continuing.

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

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 确认标题 | `string` | - |
| description | 辅助说明 | `string` | - |
| placement | 气泡位置 | `FloatingPlacement` | `top` |
| trigger | 触发方式 | `hover` \| `focus` \| `click` \| `contextMenu` \| `FloatingTrigger[]` | `click` |
| open | 受控显示状态 | `boolean` | - |
| defaultOpen | 默认显示状态 | `boolean` | `false` |
| okText | 确认按钮文案 | `string` | `OK` |
| cancelText | 取消按钮文案 | `string` | `Cancel` |
| okType | 确认按钮类型 | `ButtonType` | `primary` |
| disabled | 禁用弹出确认框 | `boolean` | `false` |
| showCancel | 是否显示取消按钮 | `boolean` | `true` |
| arrow | 是否显示箭头 | `boolean` | `true` |
| zIndex | 自定义层级 | `number` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 显隐状态变化时触发 | `(open: boolean) => void` |
| openChange | 显隐状态变化时触发 | `(open: boolean) => void` |
| confirm | 点击确认按钮时触发 | `() => void` |
| cancel | 点击取消按钮时触发 | `() => void` |

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
