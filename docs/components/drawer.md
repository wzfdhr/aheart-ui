<script setup lang="ts">
import { ref } from 'vue'

const basicOpen = ref(false)
const leftOpen = ref(false)
const bottomOpen = ref(false)
</script>

# Drawer 抽屉 <span class="aheart-status aheart-status--ready">Ready</span>

Drawer presents a contextual panel from an edge of the screen without leaving the current page.

## 基础用法

<div class="aheart-demo-panel">
  <AButton type="primary" @click="basicOpen = true">Open drawer</AButton>
  <ADrawer v-model:open="basicOpen" title="Account details">
    Review account metadata, ownership, and recent activity.
  </ADrawer>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AButton type="primary" @click="open = true">Open drawer</AButton>
  <ADrawer v-model:open="open" title="Account details">
    Review account metadata, ownership, and recent activity.
  </ADrawer>
</template>
```

## 额外操作

<div class="aheart-demo-panel">
  <AButton @click="leftOpen = true">Open from left</AButton>
  <ADrawer v-model:open="leftOpen" title="Filters" placement="left" :width="320">
    <template #extra>
      <AButton size="small">Reset</AButton>
    </template>
    Filter fields can stay close to the table they affect.
  </ADrawer>
</div>

```vue
<template>
  <ADrawer v-model:open="open" title="Filters" placement="left" :width="320">
    <template #extra>
      <AButton size="small">Reset</AButton>
    </template>
    Filter fields can stay close to the table they affect.
  </ADrawer>
</template>
```

## 不同位置

<div class="aheart-demo-panel">
  <AButton @click="bottomOpen = true">Open from bottom</AButton>
  <ADrawer v-model:open="bottomOpen" title="Activity timeline" placement="bottom" height="42vh" footer>
    Recent events and audit notes appear here.
    <template #footer>
      <AButton type="primary" @click="bottomOpen = false">Done</AButton>
    </template>
  </ADrawer>
</div>

```vue
<template>
  <ADrawer v-model:open="open" title="Activity timeline" placement="bottom" height="42vh" footer>
    Recent events and audit notes appear here.
    <template #footer>
      <AButton type="primary" @click="open = false">Done</AButton>
    </template>
  </ADrawer>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示抽屉 | `boolean` | `false` |
| title | 标题内容 | `string` | - |
| placement | 抽屉出现位置 | `top` \| `right` \| `bottom` \| `left` | `right` |
| width | 左右方向抽屉宽度 | `number` \| `string` | `378` |
| height | 上下方向抽屉高度 | `number` \| `string` | `378` |
| closable | 是否显示关闭按钮 | `boolean` | `true` |
| mask | 是否显示遮罩 | `boolean` | `true` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| keyboard | 按下 Escape 是否关闭 | `boolean` | `true` |
| footer | 是否显示页脚区域 | `boolean` | `false` |
| destroyOnClose | 关闭时销毁内容的语义开关；当前实现关闭后不渲染节点 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 显隐状态变化时触发 | `(open: boolean) => void` |
| close | 点击关闭按钮、遮罩或 Escape 时触发 | `() => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 抽屉内容 |
| title | 自定义标题 |
| extra | 标题栏右侧额外操作 |
| footer | 页脚内容 |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-shadow`
