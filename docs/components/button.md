# Button 按钮 <span class="aheart-status aheart-status--ready">Ready</span>

Button is used to trigger an action. It supports visual type, size, loading, disabled, block, round, and native button type.

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
    <AButton size="large">Large</AButton>
    <AButton>Normal</AButton>
    <AButton size="small">Small</AButton>
    <AButton size="mini">Mini</AButton>
  </div>
</div>

```vue
<template>
  <Button size="large">Large</Button>
  <Button>Normal</Button>
  <Button size="small">Small</Button>
  <Button size="mini">Mini</Button>
</template>
```

## 状态

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton disabled>Disabled</AButton>
    <AButton type="primary" loading>Loading</AButton>
    <AButton round>Round</AButton>
  </div>
</div>

```vue
<template>
  <Button disabled>Disabled</Button>
  <Button type="primary" loading>Loading</Button>
  <Button round>Round</Button>
</template>
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

## Theme Tokens

Button uses the global Aheart UI CSS variables, including:

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-radius`
- `--aheart-motion-duration`
