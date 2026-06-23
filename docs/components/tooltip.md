# Tooltip 文字提示 <span class="aheart-status aheart-status--ready">Ready</span>

Tooltip displays compact explanatory text for controls and dense interface elements.

<script setup lang="ts">
import { h } from 'vue'

const renderableTooltipTitle = () => h('span', [
  'Latency: ',
  h('strong', '42ms')
])
</script>

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

## 可渲染内容

<div class="aheart-demo-panel">
  <ATooltip default-open :title="renderableTooltipTitle">
    <AButton>Latency</AButton>
  </ATooltip>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const renderableTooltipTitle = () => h('span', [
  'Latency: ',
  h('strong', '42ms')
])
</script>

<template>
  <ATooltip :title="renderableTooltipTitle">
    <AButton>Latency</AButton>
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

## 箭头

<div class="aheart-demo-panel">
  <ASpace>
    <ATooltip title="隐藏箭头" :arrow="false">
      <AButton>无箭头</AButton>
    </ATooltip>
    <ATooltip title="箭头指向中心" :arrow="{ pointAtCenter: true }">
      <AButton>居中箭头</AButton>
    </ATooltip>
  </ASpace>
</div>

```vue
<template>
  <ATooltip title="隐藏箭头" :arrow="false">
    <AButton>无箭头</AButton>
  </ATooltip>
  <ATooltip title="箭头指向中心" :arrow="{ pointAtCenter: true }">
    <AButton>居中箭头</AButton>
  </ATooltip>
</template>
```

## 悬停延迟

<div class="aheart-demo-panel">
  <ATooltip title="0.4 秒后打开，0.2 秒后关闭" :mouse-enter-delay="0.4" :mouse-leave-delay="0.2">
    <AButton>Hover with delay</AButton>
  </ATooltip>
</div>

```vue
<template>
  <ATooltip title="0.4 秒后打开，0.2 秒后关闭" :mouse-enter-delay="0.4" :mouse-leave-delay="0.2">
    <AButton>Hover with delay</AButton>
  </ATooltip>
</template>
```

## 隐藏后销毁

<div class="aheart-demo-panel">
  <ASpace>
    <ATooltip title="默认关闭后保留 DOM" trigger="click">
      <AButton>保留</AButton>
    </ATooltip>
    <ATooltip title="关闭后销毁 DOM" trigger="click" destroy-on-hidden>
      <AButton>销毁</AButton>
    </ATooltip>
  </ASpace>
</div>

```vue
<template>
  <ATooltip title="默认关闭后保留 DOM" trigger="click">
    <AButton>保留</AButton>
  </ATooltip>
  <ATooltip title="关闭后销毁 DOM" trigger="click" destroy-on-hidden>
    <AButton>销毁</AButton>
  </ATooltip>
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <ATooltip
    title="通过语义化入口定制结构"
    class-name="demo-tooltip-class"
    root-class-name="demo-tooltip-root"
    overlay-class-name="demo-tooltip-popup"
    :style="{ color: 'var(--aheart-color-primary)' }"
    :overlay-style="{ minWidth: '180px' }"
    :overlay-inner-style="{ padding: '10px 12px' }"
    :class-names="{ trigger: 'demo-tooltip-trigger', content: 'demo-tooltip-content', arrow: 'demo-tooltip-arrow' }"
    :styles="{ content: { fontWeight: 600 }, arrow: { backgroundColor: '#111827' } }"
  >
    <AButton>Semantic hooks</AButton>
  </ATooltip>
</div>

```vue
<template>
  <ATooltip
    title="通过语义化入口定制结构"
    class-name="demo-tooltip-class"
    root-class-name="demo-tooltip-root"
    overlay-class-name="demo-tooltip-popup"
    :style="{ color: 'var(--aheart-color-primary)' }"
    :overlay-style="{ minWidth: '180px' }"
    :overlay-inner-style="{ padding: '10px 12px' }"
    :class-names="{ trigger: 'demo-tooltip-trigger', content: 'demo-tooltip-content', arrow: 'demo-tooltip-arrow' }"
    :styles="{ content: { fontWeight: 600 }, arrow: { backgroundColor: '#111827' } }"
  >
    <AButton>Semantic hooks</AButton>
  </ATooltip>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 提示内容，`title` 插槽优先级更高；为空字符串、`null` 或 `false` 时不显示 | `VNodeChild` \| `() => VNodeChild` | - |
| placement | 气泡位置 | `FloatingPlacement` | `top` |
| trigger | 触发方式 | `hover` \| `focus` \| `click` \| `contextMenu` \| `FloatingTrigger[]` | `hover` |
| open | 受控显示状态 | `boolean` | - |
| defaultOpen | 默认显示状态 | `boolean` | `false` |
| color | 自定义背景色 | `string` | - |
| arrow | 是否显示箭头，或配置箭头指向中心 | `boolean \| { pointAtCenter?: boolean }` | `true` |
| zIndex | 自定义层级 | `number` | - |
| mouseEnterDelay | hover 打开延迟，单位秒 | `number` | `0.1` |
| mouseLeaveDelay | hover 关闭延迟，单位秒 | `number` | `0.1` |
| destroyOnHidden | 关闭后是否销毁浮层 DOM | `boolean` | `false` |
| fresh | 保留兼容 API；Vue 挂载内容会保持响应式更新 | `boolean` | `false` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| overlayClassName | 浮层 class 兼容属性 | `string` | - |
| overlayStyle | 浮层样式兼容属性 | `StyleValue` | - |
| overlayInnerStyle | 浮层内部容器样式兼容属性 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<TooltipSemanticPart, string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<TooltipSemanticPart, StyleValue>>` | - |

### FloatingPlacement

`top` \| `left` \| `right` \| `bottom` \| `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` \| `leftTop` \| `leftBottom` \| `rightTop` \| `rightBottom`

### TooltipSemanticPart

| 名称 | 说明 |
| --- | --- |
| root | 根包裹节点 |
| trigger | 触发区域 |
| popup | 浮层节点 |
| container | 浮层内部容器 |
| content | 提示内容 |
| arrow | 箭头 |

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
