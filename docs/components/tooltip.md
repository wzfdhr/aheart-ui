# Tooltip 文字提示 <span class="aheart-status aheart-status--ready">Ready</span>

Tooltip displays compact explanatory text for controls and dense interface elements.

## 基础用法

<div class="aheart-demo-panel">
  <ATooltip title="Helpful text">
    <AButton>Hover me</AButton>
  </ATooltip>
</div>

```vue
<template>
  <ATooltip title="Helpful text">
    <AButton>Hover me</AButton>
  </ATooltip>
</template>
```

## 点击触发

<div class="aheart-demo-panel">
  <ATooltip title="Click trigger" trigger="click" placement="bottom">
    <AButton>Click me</AButton>
  </ATooltip>
</div>

```vue
<template>
  <ATooltip title="Click trigger" trigger="click" placement="bottom">
    <AButton>Click me</AButton>
  </ATooltip>
</template>
```

## 颜色与位置

<div class="aheart-demo-panel">
  <ASpace>
    <ATooltip title="Top left" placement="topLeft" color="#111827">
      <AButton>topLeft</AButton>
    </ATooltip>
    <ATooltip title="Bottom right" placement="bottomRight">
      <AButton>bottomRight</AButton>
    </ATooltip>
  </ASpace>
</div>

```vue
<template>
  <ATooltip title="Top left" placement="topLeft" color="#111827">
    <AButton>topLeft</AButton>
  </ATooltip>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 提示内容 | `string` | - |
| placement | 气泡位置 | `FloatingPlacement` | `top` |
| trigger | 触发方式 | `hover` \| `focus` \| `click` \| `contextMenu` \| `FloatingTrigger[]` | `hover` |
| open | 受控显示状态 | `boolean` | - |
| defaultOpen | 默认显示状态 | `boolean` | `false` |
| color | 自定义背景色 | `string` | - |
| arrow | 是否显示箭头 | `boolean` | `true` |
| zIndex | 自定义层级 | `number` | - |
| mouseEnterDelay | hover 打开延迟，单位秒 | `number` | `0` |
| mouseLeaveDelay | hover 关闭延迟，单位秒 | `number` | `0` |

### FloatingPlacement

`top` \| `left` \| `right` \| `bottom` \| `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` \| `leftTop` \| `leftBottom` \| `rightTop` \| `rightBottom`

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 显隐状态变化时触发 | `(open: boolean) => void` |
| openChange | 显隐状态变化时触发 | `(open: boolean) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 触发元素 |
| title | 自定义提示内容 |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-font-size-sm`
- `--aheart-spacing-sm`
- `--aheart-radius-sm`
- `--aheart-shadow`
