# Icon 图标 <span class="aheart-status aheart-status--ready">已完成</span>

Icon 使用受控 Lucide 映射渲染一致的界面符号，也支持组件和自定义 SVG 内容。

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

## 自定义组件

通过 `component` 传入 Vue 图标组件。渲染优先级为默认插槽、`component`、已知 `name`。

```vue
<script setup lang="ts">
import { Bell } from '@lucide/vue'
</script>

<template>
  <AIcon :component="Bell" />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 内置图标名称，未知名称渲染为空 | `string` | - |
| component | 自定义 Vue 图标组件 | `Component` | - |
| size | 图标尺寸 | `number` \| `string` | `1em` |
| color | 图标颜色 | `string` | `currentColor` |
| spin | 是否旋转 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义图标内容，通常是 SVG |

当前内置名称包括 `search`、`setting`、`settings`、`loading`、`info`、`user`、`plus`、`check`、`close`、方向箭头、折线箭头和 `copy`。
