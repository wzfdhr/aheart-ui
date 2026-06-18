# Button 按钮 <span class="aheart-status aheart-status--ready">已完成</span>

Button 用于触发操作，并通过类型、尺寸、禁用、加载、块级和圆角等状态表达操作层级。

## 基础用法

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton>默认按钮</AButton>
    <AButton type="primary">主要按钮</AButton>
    <AButton type="success">成功按钮</AButton>
    <AButton type="warning">警告按钮</AButton>
    <AButton type="danger">危险按钮</AButton>
  </div>
</div>

```vue
<template>
  <Button>默认按钮</Button>
  <Button type="primary">主要按钮</Button>
  <Button type="success">成功按钮</Button>
  <Button type="warning">警告按钮</Button>
  <Button type="danger">危险按钮</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## 尺寸

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton size="large">大按钮</AButton>
    <AButton>默认按钮</AButton>
    <AButton size="small">小按钮</AButton>
    <AButton size="mini">迷你按钮</AButton>
  </div>
</div>

```vue
<template>
  <Button size="large">大按钮</Button>
  <Button>默认按钮</Button>
  <Button size="small">小按钮</Button>
  <Button size="mini">迷你按钮</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## 状态

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton disabled>禁用</AButton>
    <AButton type="primary" loading>加载中</AButton>
    <AButton block>块级按钮</AButton>
    <AButton round>圆角按钮</AButton>
  </div>
</div>

```vue
<template>
  <Button disabled>禁用</Button>
  <Button type="primary" loading>加载中</Button>
  <Button block>块级按钮</Button>
  <Button round>圆角按钮</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
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
| block | 是否以块级宽度显示 | `boolean` | `false` |
| round | 是否展示为圆角按钮 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |

## Theme Tokens

Button 使用 Aheart UI 的全局 CSS 变量：

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-radius`
- `--aheart-motion-duration`
