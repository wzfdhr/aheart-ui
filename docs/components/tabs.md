# Tabs 标签页 <span class="aheart-status aheart-status--ready">已完成</span>

Tabs switch between related panels while keeping the surrounding page context stable.

<script setup lang="ts">
import { h } from 'vue'

const renderableTabsItems = [
  {
    key: 'profile',
    icon: h('span', { style: { color: 'var(--aheart-color-primary)' } }, 'P'),
    label: h('span', { style: { fontWeight: 600 } }, 'Profile'),
    children: h('span', 'Profile content from a VNode child')
  },
  {
    key: 'activity',
    icon: h('span', 'A'),
    label: h('span', 'Activity'),
    children: h('span', 'Activity content from a VNode child')
  }
]

const renderableTabsExtraContent = {
  left: h('span', { style: { color: 'var(--aheart-color-text-secondary)' } }, 'Workspace'),
  right: h('button', { type: 'button', class: 'aheart-button aheart-button--small' }, 'Sync')
}
</script>

## 基础用法

<div class="aheart-demo-panel">
  <ATabs
    :items="[
      { key: 'overview', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', label: 'Settings', children: 'Settings panel' },
      { key: 'disabled', label: 'Disabled', children: 'Disabled panel', disabled: true }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    :items="[
      { key: 'overview', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', label: 'Settings', children: 'Settings panel' },
      { key: 'disabled', label: 'Disabled', children: 'Disabled panel', disabled: true }
    ]"
  />
</template>
```

## 卡片样式

<div class="aheart-demo-panel">
  <ATabs
    type="card"
    default-active-key="metrics"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary metrics' },
      { key: 'metrics', label: 'Metrics', children: 'Usage and conversion data' },
      { key: 'logs', label: 'Logs', children: 'Recent activity logs' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    type="card"
    default-active-key="metrics"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary metrics' },
      { key: 'metrics', label: 'Metrics', children: 'Usage and conversion data' },
      { key: 'logs', label: 'Logs', children: 'Recent activity logs' }
    ]"
  />
</template>
```

## 标签位置

<div class="aheart-demo-panel">
  <ATabs
    tab-placement="start"
    :items="[
      { key: 'profile', label: 'Profile', children: 'Profile panel' },
      { key: 'security', label: 'Security', children: 'Security panel' },
      { key: 'billing', label: 'Billing', children: 'Billing panel' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    tab-placement="start"
    :items="[
      { key: 'profile', label: 'Profile', children: 'Profile panel' },
      { key: 'security', label: 'Security', children: 'Security panel' },
      { key: 'billing', label: 'Billing', children: 'Billing panel' }
    ]"
  />
</template>
```

## 额外内容与间距

<div class="aheart-demo-panel">
  <ATabs
    :tab-bar-gutter="24"
    :tab-bar-extra-content="{ left: 'Project', right: 'Actions' }"
    :items="[
      { key: 'tasks', label: 'Tasks', children: 'Task list' },
      { key: 'files', label: 'Files', children: 'File list' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    :tab-bar-gutter="24"
    :tab-bar-extra-content="{ left: 'Project', right: 'Actions' }"
    :items="[
      { key: 'tasks', label: 'Tasks', children: 'Task list' },
      { key: 'files', label: 'Files', children: 'File list' }
    ]"
  />
</template>
```

## 可渲染内容

<div class="aheart-demo-panel">
  <ATabs
    :items="renderableTabsItems"
    :tab-bar-extra-content="renderableTabsExtraContent"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const renderableTabsItems = [
  {
    key: 'profile',
    icon: h('span', { style: { color: 'var(--aheart-color-primary)' } }, 'P'),
    label: h('span', { style: { fontWeight: 600 } }, 'Profile'),
    children: h('span', 'Profile content from a VNode child')
  },
  {
    key: 'activity',
    icon: h('span', 'A'),
    label: h('span', 'Activity'),
    children: h('span', 'Activity content from a VNode child')
  }
]

const renderableTabsExtraContent = {
  left: h('span', { style: { color: 'var(--aheart-color-text-secondary)' } }, 'Workspace'),
  right: h('button', { type: 'button', class: 'aheart-button aheart-button--small' }, 'Sync')
}
</script>

<template>
  <ATabs
    :items="renderableTabsItems"
    :tab-bar-extra-content="renderableTabsExtraContent"
  />
</template>
```

## 指示器与动画

<div class="aheart-demo-panel">
  <ATabs
    active-key="usage"
    :animated="{ inkBar: true, tabPane: true }"
    :indicator="{ size: 28, align: 'center' }"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary panel' },
      { key: 'usage', label: 'Usage', children: 'Usage panel' },
      { key: 'health', label: 'Health', children: 'Health panel' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    active-key="usage"
    :animated="{ inkBar: true, tabPane: true }"
    :indicator="{ size: 28, align: 'center' }"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary panel' },
      { key: 'usage', label: 'Usage', children: 'Usage panel' },
      { key: 'health', label: 'Health', children: 'Health panel' }
    ]"
  />
</template>
```

## 图标与点击事件

<div class="aheart-demo-panel">
  <ATabs
    :items="[
      { key: 'overview', icon: 'O', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', icon: 'S', label: 'Settings', children: 'Settings panel' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    :items="[
      { key: 'overview', icon: 'O', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', icon: 'S', label: 'Settings', children: 'Settings panel' }
    ]"
    @tab-click="handleTabClick"
  />
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <ATabs
    class-name="demo-tabs"
    root-class-name="demo-tabs-root"
    :class-names="{ activeTab: 'demo-tabs-active', panel: 'demo-tabs-panel' }"
    :styles="{ navList: { gap: '20px' }, panel: { paddingTop: '20px' } }"
    :items="[
      { key: 'one', label: 'One', children: 'First panel' },
      { key: 'two', label: 'Two', children: 'Second panel' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    class-name="demo-tabs"
    root-class-name="demo-tabs-root"
    :class-names="{ activeTab: 'demo-tabs-active', panel: 'demo-tabs-panel' }"
    :styles="{ navList: { gap: '20px' }, panel: { paddingTop: '20px' } }"
    :items="[
      { key: 'one', label: 'One', children: 'First panel' },
      { key: 'two', label: 'Two', children: 'Second panel' }
    ]"
  />
</template>
```

## 全局尺寸

<div class="aheart-demo-panel">
  <AConfigProvider size="large">
    <ATabs
      centered
      :items="[
        { key: 'first', label: 'First', children: 'First panel' },
        { key: 'second', label: 'Second', children: 'Second panel' }
      ]"
    />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large">
    <ATabs
      centered
      :items="[
        { key: 'first', label: 'First', children: 'First panel' },
        { key: 'second', label: 'Second', children: 'Second panel' }
      ]"
    />
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 标签页项目 | `TabItem[]` | `[]` |
| activeKey | 当前激活项，受控模式 | `string` | - |
| defaultActiveKey | 默认激活项，非受控模式 | `string` | 首个可用项 |
| type | 标签页样式 | `line` \| `card` | `line` |
| size | 标签页尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| centered | 标签是否居中 | `boolean` | `false` |
| tabPlacement | 标签位置 | `top` \| `bottom` \| `start` \| `end` | `top` |
| tabPosition | Ant 兼容位置别名 | `top` \| `bottom` \| `left` \| `right` | - |
| tabBarExtraContent | 标签栏额外内容 | `VNodeChild` \| `{ left?: VNodeChild; right?: VNodeChild }` | - |
| tabBarGutter | 标签间距 | `number` | - |
| tabBarStyle | 标签栏样式 | `StyleValue` | - |
| indicator | 指示器配置 | `{ size?: number; align?: 'start' \| 'center' \| 'end' }` | - |
| animated | 是否启用动画 | `boolean` \| `{ inkBar?: boolean; tabPane?: boolean }` | `false` |
| className | 根节点 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化 class 映射 | `Record<'root' \| 'nav' \| 'navList' \| 'tab' \| 'activeTab' \| 'tabIcon' \| 'tabLabel' \| 'panel' \| 'extra' \| 'extraLeft' \| 'extraRight', string>` | - |
| styles | 语义化 style 映射 | `Record<'root' \| 'nav' \| 'navList' \| 'tab' \| 'activeTab' \| 'tabIcon' \| 'tabLabel' \| 'panel' \| 'extra' \| 'extraLeft' \| 'extraRight', StyleValue>` | - |

### TabItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string` | - |
| label | 标签内容 | `VNodeChild` | - |
| icon | 标签前置图标 | `VNodeChild` | - |
| children | 面板内容，低于 `tab-{key}` 插槽优先级 | `VNodeChild` | - |
| disabled | 是否禁用 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:activeKey | 激活项变化时触发 | `(key: string) => void` |
| change | 激活项变化时触发 | `(key: string) => void` |
| tabClick | 点击可用标签时触发 | `(key: string, event: MouseEvent) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| tab-{key} | 自定义指定 key 的面板内容，优先于 `TabItem.children` |
| extraLeft | 自定义标签栏左侧额外内容 |
| extraRight | 自定义标签栏右侧额外内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-control-height`
