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

## 语义化样式

<div class="aheart-demo-panel">
  <ADivider
    title-placement="start"
    orientation-margin="32px"
    class-name="demo-divider"
    root-class-name="demo-divider-root"
    :style="{ marginTop: '8px' }"
    :class-names="{ root: 'demo-divider-semantic-root', line: 'demo-divider-line', text: 'demo-divider-text' }"
    :styles="{ line: { borderColor: '#1677ff' }, text: { fontWeight: 600 } }"
  >
    Semantic
  </ADivider>
</div>

```vue
<template>
  <ADivider
    title-placement="start"
    orientation-margin="32px"
    class-name="demo-divider"
    root-class-name="demo-divider-root"
    :class-names="{ root: 'demo-divider-semantic-root', line: 'demo-divider-line', text: 'demo-divider-text' }"
    :styles="{ line: { borderColor: '#1677ff' }, text: { fontWeight: 600 } }"
  >
    Semantic
  </ADivider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 分割线方向 | `horizontal` \| `vertical` | `horizontal` |
| vertical | 垂直分割线快捷方式 | `boolean` | `false` |
| orientation | 文字位置，保留兼容别名 | `left` \| `center` \| `right` | `center` |
| titlePlacement | Ant 风格文字位置，优先于 `orientation` | `left` \| `center` \| `right` \| `start` \| `end` | - |
| orientationMargin | 标题距离边缘的距离，兼容旧写法 | `number` \| `string` | - |
| variant | 线条样式 | `solid` \| `dashed` \| `dotted` | `solid` |
| size | 线条粗细 | `small` \| `middle` \| `large` | `middle` |
| dashed | 是否虚线，等价于 `variant="dashed"` | `boolean` | `false` |
| plain | 文字是否普通样式 | `boolean` | `false` |
| className | 根节点 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'line' \| 'text', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'line' \| 'text', StyleValue>>` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 水平分割线中的标题内容 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根分割线容器 |
| line | 分割线线段；带标题时左右两段都会应用 |
| text | 标题文本容器，仅水平分割线带默认插槽时渲染 |

## Theme Tokens

- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
