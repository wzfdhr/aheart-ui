<script setup lang="ts">
import { ref } from 'vue'

const mounted = ref(true)
const sizes = ref([260, 420])
const lazySizes = ref([260, 420])
const lazyUpdateCount = ref(0)
const splitterStatus = ref('等待调整')
const setNavigationSize = (value: number | null) => {
  const navigationSize = Math.min(480, Math.max(120, value ?? 120))
  sizes.value = [navigationSize, 680 - navigationSize]
  splitterStatus.value = `外部输入：${navigationSize}px`
}
</script>

# Splitter 分割面板 <span class="aheart-status aheart-status--ready">已完成</span>

Splitter 创建可调整尺寸的相邻面板。它与只负责视觉分隔的 Divider 相互独立。

## 交互工作台

<div v-if="mounted" data-testid="splitter-fixture" data-mounted="true" style="display: grid; gap: 8px; padding: 16px; border: 1px solid #d9e1ea; border-radius: 8px; background: #fff;">
  <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; color: #536273; font-size: 13px;"><span>可见尺寸输出 · 键盘每次调整 10px</span><span data-testid="splitter-status" aria-live="polite" style="color: #1677ff;">{{ splitterStatus }}</span></div>
  <div data-testid="splitter-horizontal" style="height: 148px; min-width: 0; overflow: hidden; border: 1px solid #e5eaf0; border-radius: 6px;"><ASplitter :default-sizes="[120, 'auto']" @resize-end="splitterStatus = '键盘或指针调整已提交'"><ASplitterPanel :min="80" style="padding: 12px;">导航</ASplitterPanel><ASplitterPanel :min="120" style="padding: 12px;">内容</ASplitterPanel></ASplitter></div>
  <div data-testid="splitter-vertical" style="height: 148px; overflow: hidden; border: 1px solid #e5eaf0; border-radius: 6px;"><ASplitter layout="vertical" :default-sizes="[70, 'auto']"><ASplitterPanel :min="48" style="padding: 12px;">顶部</ASplitterPanel><ASplitterPanel :min="48" style="padding: 12px;">底部</ASplitterPanel></ASplitter></div>
  <div data-testid="splitter-triple" style="height: 148px; min-width: 0; overflow: hidden; border: 1px solid #e5eaf0; border-radius: 6px;"><ASplitter :default-sizes="[150, 'auto', 170]"><ASplitterPanel :min="120" style="padding: 12px;">左栏</ASplitterPanel><ASplitterPanel :min="160" style="padding: 12px;">主区</ASplitterPanel><ASplitterPanel :min="120" style="padding: 12px;">右栏</ASplitterPanel></ASplitter></div>
  <div data-testid="splitter-lazy" style="height: 148px; min-width: 0; overflow: hidden; border: 1px solid #e5eaf0; border-radius: 6px;"><ASplitter v-model:sizes="lazySizes" @update:sizes="lazyUpdateCount++" :default-sizes="[260, 420]" lazy><ASplitterPanel :min="120" style="padding: 12px;">延迟提交</ASplitterPanel><ASplitterPanel :min="160" style="padding: 12px;">释放后更新</ASplitterPanel></ASplitter></div>
  <span data-testid="splitter-lazy-output" style="color: #536273; font-size: 13px;">lazy：拖动过程中预览，释放后提交</span>
  <span data-testid="splitter-lazy-values">{{ JSON.stringify(lazySizes) }}</span><span data-testid="splitter-lazy-left">{{ lazySizes[0] }}</span><span data-testid="splitter-lazy-right">{{ lazySizes[1] }}</span><span data-testid="splitter-lazy-update-count">{{ lazyUpdateCount }}</span>
  <div data-testid="splitter-percent" style="height: 148px; min-width: 0; overflow: hidden; border: 1px solid #e5eaf0; border-radius: 6px;"><ASplitter :default-sizes="['35%', '65%']"><ASplitterPanel min="30%" max="70%" style="padding: 12px;">30% min / 70% max</ASplitterPanel><ASplitterPanel min="30%" style="padding: 12px;">百分比约束</ASplitterPanel></ASplitter></div>
  <div data-testid="splitter-input" style="display: grid; gap: 8px; min-width: 0;"><AInputNumber :model-value="sizes[0]" :min="120" :max="480" @update:model-value="setNavigationSize" /><div style="height: 148px; min-width: 0; overflow: hidden; border: 1px solid #e5eaf0; border-radius: 6px;"><ASplitter v-model:sizes="sizes"><ASplitterPanel :min="120" style="padding: 12px;"><span data-testid="splitter-input-output">{{ sizes[0] }} px</span></ASplitterPanel><ASplitterPanel :min="160" style="padding: 12px;">外部控制内容</ASplitterPanel></ASplitter></div></div>
  <div data-testid="splitter-iframe" style="height: 148px; min-width: 0; overflow: hidden; border: 1px solid #e5eaf0; border-radius: 6px;"><ASplitter :default-sizes="[260, 'auto']"><ASplitterPanel :min="160" style="padding: 12px;">编辑区</ASplitterPanel><ASplitterPanel :min="160" style="padding: 8px;"><iframe title="可见预览" srcdoc="<p style='font-family: sans-serif'>预览 iframe</p>" style="width: 100%; height: 100%; border: 1px solid #d9e1ea;"></iframe></ASplitterPanel></ASplitter></div>
  <button type="button" @click="mounted = false">卸载 Splitter</button>
</div>
<div v-else data-testid="splitter-fixture" data-mounted="false" style="display: grid; gap: 8px; padding: 16px; border: 1px dashed #d9e1ea; border-radius: 8px;"><span>Splitter fixture 已卸载</span><button type="button" @click="mounted = true">重新挂载 Splitter</button></div>

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
