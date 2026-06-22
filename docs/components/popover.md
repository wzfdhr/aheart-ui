# Popover 气泡卡片 <span class="aheart-status aheart-status--ready">Ready</span>

Popover displays richer floating content with an optional title and body.

## 基础用法

<div class="aheart-demo-panel">
  <APopover title="Account" content="Owner, plan, and recent activity." trigger="click">
    <AButton>Open popover</AButton>
  </APopover>
</div>

```vue
<template>
  <APopover title="Account" content="Owner, plan, and recent activity." trigger="click">
    <AButton>Open popover</AButton>
  </APopover>
</template>
```

## 自定义内容

<div class="aheart-demo-panel">
  <APopover trigger="click" placement="rightTop">
    <AButton>Details</AButton>
    <template #title>Release status</template>
    <template #content>
      <ASpace direction="vertical">
        <span>Build complete</span>
        <AButton size="small" type="primary">View</AButton>
      </ASpace>
    </template>
  </APopover>
</div>

```vue
<template>
  <APopover trigger="click" placement="rightTop">
    <AButton>Details</AButton>
    <template #title>Release status</template>
    <template #content>
      <ASpace direction="vertical">
        <span>Build complete</span>
        <AButton size="small" type="primary">View</AButton>
      </ASpace>
    </template>
  </APopover>
</template>
```

## 触发方式

<div class="aheart-demo-panel">
  <ASpace>
    <APopover content="Hover content">
      <AButton>Hover</AButton>
    </APopover>
    <APopover content="Focus content" trigger="focus">
      <AButton>Focus</AButton>
    </APopover>
    <APopover content="Context content" trigger="contextMenu">
      <AButton>Context menu</AButton>
    </APopover>
  </ASpace>
</div>

```vue
<template>
  <APopover content="Context content" trigger="contextMenu">
    <AButton>Context menu</AButton>
  </APopover>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 卡片标题 | `string` | - |
| content | 卡片内容 | `string` | - |
| placement | 气泡位置 | `FloatingPlacement` | `top` |
| trigger | 触发方式 | `hover` \| `focus` \| `click` \| `contextMenu` \| `FloatingTrigger[]` | `hover` |
| open | 受控显示状态 | `boolean` | - |
| defaultOpen | 默认显示状态 | `boolean` | `false` |
| color | 自定义背景色 | `string` | - |
| arrow | 是否显示箭头 | `boolean` | `true` |
| zIndex | 自定义层级 | `number` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 显隐状态变化时触发 | `(open: boolean) => void` |
| openChange | 显隐状态变化时触发 | `(open: boolean) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 触发元素 |
| title | 自定义标题 |
| content | 自定义内容 |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-radius`
- `--aheart-shadow`
