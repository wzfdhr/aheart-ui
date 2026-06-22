# Divider 分割线 <span class="aheart-status aheart-status--ready">Ready</span>

Divider separates content groups with horizontal or vertical rules, title placement, and line variants.

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
  <ADivider title-placement="start" orientation-margin="24px">Section</ADivider>
</div>

```vue
<template>
  <ADivider title-placement="start" orientation-margin="24px">Section</ADivider>
</template>
```

## 样式变体

<div class="aheart-demo-panel">
  <span>Solid</span>
  <ADivider />
  <span>Dotted</span>
  <ADivider variant="dotted" size="large" />
  <span>Dashed</span>
  <ADivider variant="dashed" />
</div>

```vue
<template>
  <ADivider />
  <ADivider variant="dotted" size="large" />
  <ADivider variant="dashed" />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 分割线方向 | `horizontal` \| `vertical` | `horizontal` |
| vertical | 垂直分割线快捷方式 | `boolean` | `false` |
| orientation | 文字位置，保留兼容别名 | `left` \| `center` \| `right` | `center` |
| titlePlacement | Ant 风格文字位置，优先于 `orientation` | `left` \| `center` \| `right` \| `start` \| `end` | - |
| orientationMargin | 标题距离边缘的距离 | `number` \| `string` | - |
| variant | 线条样式 | `solid` \| `dashed` \| `dotted` | `solid` |
| size | 线条粗细 | `small` \| `middle` \| `large` | `middle` |
| dashed | 是否虚线，等价于 `variant="dashed"` | `boolean` | `false` |
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
