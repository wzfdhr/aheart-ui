<script setup lang="ts">
import { ref } from 'vue'

const sizes = ref([260, 420])
const setNavigationSize = (value: number | null) => {
  const navigationSize = Math.min(480, Math.max(120, value ?? 120))
  sizes.value = [navigationSize, 680 - navigationSize]
}
</script>

# Splitter 分割面板 <span class="aheart-status aheart-status--ready">Ready</span>

Splitter creates resizable adjacent panels. It is separate from Divider, which only provides visual separation.

## 基础用法

<div class="aheart-demo-panel" style="height: 180px; padding: 0; overflow: hidden;">
  <ASplitter :default-sizes="[180, 'auto']">
    <ASplitterPanel :min="120" style="padding: 16px;">Navigation</ASplitterPanel>
    <ASplitterPanel :min="160" style="padding: 16px;">Content</ASplitterPanel>
  </ASplitter>
</div>

```vue
<template>
  <ASplitter :default-sizes="[180, 'auto']">
    <ASplitterPanel :min="120">Navigation</ASplitterPanel>
    <ASplitterPanel :min="160">Content</ASplitterPanel>
  </ASplitter>
</template>
```

## 外部数字控制

<div class="aheart-demo-panel" style="height: 220px;">
  <ASpace direction="vertical" style="width: 100%; height: 100%;">
    <AInputNumber :model-value="sizes[0]" :min="120" :max="480" @update:model-value="setNavigationSize" />
    <div style="height: 160px; min-width: 0;">
      <ASplitter v-model:sizes="sizes">
        <ASplitterPanel :min="120" style="padding: 12px;">{{ sizes[0] }} px</ASplitterPanel>
        <ASplitterPanel :min="160" style="padding: 12px;">{{ sizes[1] }} px</ASplitterPanel>
      </ASplitter>
    </div>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const sizes = ref([260, 420])
const setNavigationSize = (value: number | null) => {
  const navigationSize = Math.min(480, Math.max(120, value ?? 120))
  sizes.value = [navigationSize, 680 - navigationSize]
}
</script>

<template>
  <AInputNumber :model-value="sizes[0]" :min="120" :max="480" @update:model-value="setNavigationSize" />
  <ASplitter v-model:sizes="sizes">
    <ASplitterPanel :min="120">Navigation</ASplitterPanel>
    <ASplitterPanel :min="160">Content</ASplitterPanel>
  </ASplitter>
</template>
```

## 垂直布局与键盘

```vue
<template>
  <ASplitter layout="vertical" :default-sizes="[180, 'auto']" style="height: 320px;">
    <ASplitterPanel :min="100">Top panel</ASplitterPanel>
    <ASplitterPanel :min="120">Bottom panel</ASplitterPanel>
  </ASplitter>
</template>
```

聚焦分隔柄后，水平方向使用左右方向键，垂直方向使用上下方向键。每次调整 `10px`，按住 Shift 调整 `50px`。

## API

### Splitter

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| sizes | 受控面板尺寸 | `SplitterSize[]` | - |
| defaultSizes | 非受控初始尺寸 | `SplitterSize[]` | `[]` |
| layout | 布局方向 | `horizontal` \| `vertical` | `horizontal` |
| lazy | 拖动过程中延迟提交 `update:sizes`，释放时统一提交 | `boolean` | `false` |
| disabled | 禁用分隔柄拖动、键盘调整和折叠操作 | `boolean` | `false` |

### SplitterPanel

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- |
| min | 最小尺寸，支持像素或百分比 | `number` \| `${number}%` | `0` |
| max | 最大尺寸，支持像素或百分比 | `number` \| `${number}%` | - |
| collapsible | 在相邻分隔柄上显示折叠/恢复控制 | `boolean` | `false` |

### Events

| 事件 | 说明 |
| --- | --- |
| update:sizes | 尺寸变化时触发，可用于 `v-model:sizes` |
| resize-start | 开始拖动分隔柄 |
| resize | 尺寸变化 |
| resize-end | 成功释放分隔柄后触发 |
