# Icon 图标 <span class="aheart-status aheart-status--ready">Ready</span>

Icon renders inline symbols and custom SVG content.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace>
    <AIcon name="search" />
    <AIcon name="setting" color="#1677ff" />
    <AIcon name="loading" spin />
  </ASpace>
</div>

```vue
<template>
  <AIcon name="search" />
  <AIcon name="setting" color="#1677ff" />
  <AIcon name="loading" spin />
</template>
```

## 自定义 SVG

<div class="aheart-demo-panel">
  <AIcon :size="20" color="#52c41a">
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5z" />
    </svg>
  </AIcon>
</div>

```vue
<template>
  <AIcon :size="20" color="#52c41a">
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5z" />
    </svg>
  </AIcon>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 无插槽时显示的图标名称 | `string` | - |
| size | 图标尺寸 | `number` \| `string` | `1em` |
| color | 图标颜色 | `string` | `currentColor` |
| spin | 是否旋转 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义图标内容，通常是 SVG |
