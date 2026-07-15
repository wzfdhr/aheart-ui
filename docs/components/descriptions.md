# Descriptions 描述列表 <span class="aheart-status aheart-status--ready">已完成</span>

Descriptions displays record details as label and content pairs.

<script setup>
import { h } from 'vue'

const renderableDescriptionItems = [
  {
    label: h('span', { style: { color: 'var(--aheart-color-primary)' } }, 'Owner'),
    content: h('strong', 'Design System')
  },
  {
    label: 'Status',
    children: h('span', { style: { fontWeight: 600 } }, 'Renderable')
  }
]
</script>

## 基础用法

<div class="aheart-demo-panel">
  <ADescriptions
    title="Profile"
    extra="Updated"
    :items="[
      { label: 'User', content: 'Ada' },
      { label: 'Role', content: 'Admin' },
      { label: 'Status', content: 'Active' }
    ]"
  />
</div>

```vue
<template>
  <ADescriptions
    title="Profile"
    extra="Updated"
    :items="[
      { label: 'User', content: 'Ada' },
      { label: 'Role', content: 'Admin' },
      { label: 'Status', content: 'Active' }
    ]"
  />
</template>
```

## 可渲染内容

<div class="aheart-demo-panel">
  <ADescriptions :items="renderableDescriptionItems">
    <template #title>
      <span>Profile <AIcon name="info" /></span>
    </template>
    <template #extra>
      <AButton size="small">Refresh</AButton>
    </template>
  </ADescriptions>
</div>

```vue
<script setup>
import { h } from 'vue'

const renderableDescriptionItems = [
  {
    label: h('span', { style: { color: 'var(--aheart-color-primary)' } }, 'Owner'),
    content: h('strong', 'Design System')
  },
  {
    label: 'Status',
    children: h('span', { style: { fontWeight: 600 } }, 'Renderable')
  }
]
</script>

<template>
  <ADescriptions :items="renderableDescriptionItems">
    <template #title>
      <span>Profile <AIcon name="info" /></span>
    </template>
    <template #extra>
      <AButton size="small">Refresh</AButton>
    </template>
  </ADescriptions>
</template>
```

## 带边框与垂直布局

<div class="aheart-demo-panel">
  <ADescriptions
    bordered
    layout="vertical"
    :column="2"
    :items="[
      { label: 'Product', content: 'Aheart UI' },
      { label: 'Version', content: '1.0.0' },
      { label: 'Summary', content: 'Ant-style Vue components', span: 2 }
    ]"
  />
</div>

```vue
<template>
  <ADescriptions
    bordered
    layout="vertical"
    :column="2"
    :items="[
      { label: 'Product', content: 'Aheart UI' },
      { label: 'Version', content: '1.0.0' },
      { label: 'Summary', content: 'Ant-style Vue components', span: 2 }
    ]"
  />
</template>
```

## 填满剩余列与冒号

<div class="aheart-demo-panel">
  <ADescriptions
    :column="3"
    :colon="false"
    :items="[
      { label: 'User', content: 'Ada' },
      { label: 'Summary', children: 'This item fills the remaining columns.', span: 'filled' }
    ]"
  />
</div>

```vue
<template>
  <ADescriptions
    :column="3"
    :colon="false"
    :items="[
      { label: 'User', content: 'Ada' },
      { label: 'Summary', children: 'This item fills the remaining columns.', span: 'filled' }
    ]"
  />
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <ADescriptions
    title="Semantic profile"
    extra="Custom"
    class-name="profile-descriptions"
    root-class-name="profile-descriptions-root"
    :class-names="{
      header: 'profile-descriptions-header',
      label: 'profile-descriptions-label',
      content: 'profile-descriptions-content'
    }"
    :styles="{
      root: { padding: '12px', backgroundColor: 'var(--aheart-color-fill)' },
      label: { fontWeight: 600 },
      content: { color: 'var(--aheart-color-primary)' }
    }"
    :items="[
      { label: 'Owner', content: 'Design System' },
      { label: 'State', content: 'Ready', contentStyle: { fontWeight: 600 } }
    ]"
  />
</div>

```vue
<template>
  <ADescriptions
    title="Semantic profile"
    extra="Custom"
    class-name="profile-descriptions"
    root-class-name="profile-descriptions-root"
    :class-names="{
      header: 'profile-descriptions-header',
      label: 'profile-descriptions-label',
      content: 'profile-descriptions-content'
    }"
    :styles="{
      root: { padding: '12px', backgroundColor: 'var(--aheart-color-fill)' },
      label: { fontWeight: 600 },
      content: { color: 'var(--aheart-color-primary)' }
    }"
    :items="items"
  />
</template>
```

## 全局尺寸

<div class="aheart-demo-panel">
  <AConfigProvider size="large">
    <ADescriptions
      :items="[
        { label: 'Owner', content: 'Design System' },
        { label: 'State', content: 'Ready' }
      ]"
    />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large">
    <ADescriptions :items="items" />
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题，`title` 插槽优先 | `VNodeChild` | - |
| extra | 右侧额外内容，`extra` 插槽优先 | `VNodeChild` | - |
| items | 描述项 | `DescriptionItem[]` | `[]` |
| bordered | 是否显示边框 | `boolean` | `false` |
| column | 每行列数 | `number` | `3` |
| layout | 排列方式 | `horizontal` \| `vertical` | `horizontal` |
| size | 描述列表尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| colon | 是否显示标签后的冒号 | `boolean` | `true` |
| labelStyle | 全局标签样式，兼容 Ant 旧 API | `StyleValue` | - |
| contentStyle | 全局内容样式，兼容 Ant 旧 API | `StyleValue` | - |
| className | 根元素类名 | `string` | - |
| rootClassName | 根元素类名 | `string` | - |
| style | 根元素样式 | `StyleValue` | - |
| classNames | 语义化 DOM 类名 | `Partial<Record<DescriptionsSemanticPart, string>>` | `{}` |
| styles | 语义化 DOM 样式 | `Partial<Record<DescriptionsSemanticPart, StyleValue>>` | `{}` |

### DescriptionItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 描述项 key | `string` \| `number` | `label + index` |
| label | 标签 | `VNodeChild` | - |
| content | 内容，优先于 `children` | `VNodeChild` | - |
| children | 内容备用字段 | `VNodeChild` | - |
| span | 占用列数，`filled` 会填满当前行剩余列 | `number` \| `filled` | `1` |
| className | 描述项类名 | `string` | - |
| style | 描述项样式 | `StyleValue` | - |
| labelStyle | 当前项标签样式 | `StyleValue` | - |
| contentStyle | 当前项内容样式 | `StyleValue` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| title | 自定义标题，优先于 `title` 属性 |
| extra | 自定义额外内容，优先于 `extra` 属性 |

### Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根元素 |
| header | 标题和额外内容容器 |
| title | 标题 |
| extra | 额外内容 |
| table | 描述列表表格容器 |
| row | 每一行 |
| item | 每个描述项 |
| label | 描述项标签 |
| content | 描述项内容 |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-radius`
