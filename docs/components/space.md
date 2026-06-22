# Space 间距 <span class="aheart-status aheart-status--ready">Ready</span>

<script setup lang="ts">
import { h } from 'vue'

const slashSeparator = h('strong', '/')
</script>

Space sets consistent spacing between inline or vertical elements, with Ant-style orientation and separators.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace>
    <AButton>Cancel</AButton>
    <AButton type="primary">Submit</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace>
    <AButton>Cancel</AButton>
    <AButton type="primary">Submit</AButton>
  </ASpace>
</template>
```

## 垂直排列

<div class="aheart-demo-panel">
  <ASpace orientation="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace orientation="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</template>
```

## 分隔符

<div class="aheart-demo-panel">
  <ASpace separator="|">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</div>

```vue
<template>
  <ASpace separator="|">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</template>
```

## 节点分隔符

<div class="aheart-demo-panel">
  <ASpace :separator="slashSeparator">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</div>

```vue
<template>
  <ASpace :separator="slashSeparator">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</template>

<script setup lang="ts">
import { h } from 'vue'

const slashSeparator = h('strong', '/')
</script>
```

## 语义化样式

<div class="aheart-demo-panel">
  <ASpace
    separator="•"
    class-name="demo-space-class"
    root-class-name="demo-space-root"
    :style="{ padding: '8px' }"
    :class-names="{ root: 'demo-space-semantic-root', item: 'demo-space-item', separator: 'demo-space-separator' }"
    :styles="{ item: { paddingInline: '4px' }, separator: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }"
  >
    <AButton>Styled Button 1</AButton>
    <AButton>Styled Button 2</AButton>
    <AButton>Styled Button 3</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace
    separator="•"
    class-name="demo-space-class"
    root-class-name="demo-space-root"
    :style="{ padding: '8px' }"
    :class-names="{ root: 'demo-space-semantic-root', item: 'demo-space-item', separator: 'demo-space-separator' }"
    :styles="{ item: { paddingInline: '4px' }, separator: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }"
  >
    <AButton>Styled Button 1</AButton>
    <AButton>Styled Button 2</AButton>
    <AButton>Styled Button 3</AButton>
  </ASpace>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 间距尺寸 | `large` \| `middle` \| `small` \| `number` \| `[number, number]` | ConfigProvider size |
| direction | 排列方向，保留兼容别名 | `horizontal` \| `vertical` | `horizontal` |
| orientation | Ant 风格排列方向，优先于 `direction` | `horizontal` \| `vertical` | - |
| vertical | 垂直排列快捷方式 | `boolean` | `false` |
| align | 对齐方式 | `start` \| `end` \| `center` \| `baseline` | - |
| wrap | 是否自动换行 | `boolean` | `false` |
| separator | 子元素之间的分隔符 | `VNodeChild` | - |
| split | 分隔符兼容别名，推荐使用 `separator` | `VNodeChild` | - |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class，支持对象或函数 | `SpaceClassNames` | - |
| styles | 语义化结构样式，支持对象或函数 | `SpaceStyles` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 需要添加间距的内容 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根间距容器 |
| item | 每个子节点的包装元素 |
| separator | 子节点之间的分隔符 |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
