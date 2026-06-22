# Flex 弹性布局 <span class="aheart-status aheart-status--ready">Ready</span>

Flex provides a small layout helper for one-dimensional alignment and spacing.

## 基础用法

<div class="aheart-demo-panel">
  <AFlex gap="middle" align="center">
    <AButton>Left</AButton>
    <AButton type="primary">Right</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex gap="middle" align="center">
    <AButton>Left</AButton>
    <AButton type="primary">Right</AButton>
  </AFlex>
</template>
```

## 两端对齐

<div class="aheart-demo-panel">
  <AFlex justify="between" align="center" gap="small">
    <span>Label</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex justify="between" align="center" gap="small">
    <span>Label</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| vertical | 是否垂直布局 | `boolean` | `false` |
| wrap | 换行方式 | `boolean` \| `nowrap` \| `reverse` | `false` |
| justify | 主轴对齐 | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` | - |
| align | 交叉轴对齐 | `start` \| `end` \| `center` \| `baseline` \| `stretch` | - |
| gap | 间距 | `large` \| `middle` \| `small` \| `number` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | Flex 内容 |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
