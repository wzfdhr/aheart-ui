# Button 按钮

用于触发一个操作。

## 基础用法

```vue
<template>
  <Button>默认按钮</Button>
  <Button type="primary">主要按钮</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
</script>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `default` \| `primary` \| `success` \| `warning` \| `danger` | `default` |
| size | 按钮尺寸 | `large` \| `normal` \| `small` \| `mini` | `normal` |
| nativeType | 原生按钮类型 | `button` \| `submit` \| `reset` | `button` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| block | 是否块级显示 | `boolean` | `false` |
| round | 是否圆角按钮 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |
