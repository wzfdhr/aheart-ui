# Tag 标签 <span class="aheart-status aheart-status--ready">Ready</span>

Tag labels content with compact status or category information.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace wrap>
    <ATag>Default</ATag>
    <ATag color="primary">Primary</ATag>
    <ATag color="success">Success</ATag>
    <ATag color="warning">Warning</ATag>
    <ATag color="danger">Danger</ATag>
  </ASpace>
</div>

```vue
<template>
  <ASpace wrap>
    <ATag>Default</ATag>
    <ATag color="primary">Primary</ATag>
    <ATag color="success">Success</ATag>
    <ATag color="warning">Warning</ATag>
    <ATag color="danger">Danger</ATag>
  </ASpace>
</template>
```

## 可关闭

<div class="aheart-demo-panel">
  <ATag closable color="primary">Closable</ATag>
</div>

```vue
<template>
  <ATag closable color="primary" @close="handleClose">Closable</ATag>
</template>
```

## 自定义颜色

<div class="aheart-demo-panel">
  <ASpace wrap>
    <ATag color="#722ed1">Purple</ATag>
    <ATag color="#13c2c2">Cyan</ATag>
  </ASpace>
</div>

```vue
<template>
  <ASpace wrap>
    <ATag color="#722ed1">Purple</ATag>
    <ATag color="#13c2c2">Cyan</ATag>
  </ASpace>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 标签颜色 | `default` \| `primary` \| `success` \| `warning` \| `danger` \| `string` | `default` |
| closable | 是否显示关闭按钮 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭按钮时触发 | `(event: MouseEvent) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 标签内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-border`
- `--aheart-border-radius-sm`
