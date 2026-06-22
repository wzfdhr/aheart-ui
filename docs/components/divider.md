# Divider 分割线 <span class="aheart-status aheart-status--ready">Ready</span>

Divider separates content groups with horizontal or vertical rules.

## 基础用法

<div class="aheart-demo-panel">
  <span>Text</span>
  <ADivider />
  <span>More text</span>
</div>

```vue
<template>
  <span>Text</span>
  <ADivider />
  <span>More text</span>
</template>
```

## 带文字

<div class="aheart-demo-panel">
  <ADivider orientation="left">Section</ADivider>
</div>

```vue
<template>
  <ADivider orientation="left">Section</ADivider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 分割线方向 | `horizontal` \| `vertical` | `horizontal` |
| orientation | 文字位置 | `left` \| `center` \| `right` | `center` |
| dashed | 是否虚线 | `boolean` | `false` |
| plain | 文字是否普通样式 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 水平分割线中的标题内容 |

## Theme Tokens

- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
