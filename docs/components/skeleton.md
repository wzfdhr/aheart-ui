# Skeleton 骨架屏 <span class="aheart-status aheart-status--ready">Ready</span>

Skeleton displays loading placeholders before content is ready.

## 基础用法

<div class="aheart-demo-panel">
  <ASkeleton />
</div>

```vue
<template>
  <ASkeleton />
</template>
```

## 动画与头像

<div class="aheart-demo-panel">
  <ASkeleton
    active
    round
    :avatar="{ size: 40, shape: 'circle' }"
    :title="{ width: '60%' }"
    :paragraph="{ rows: 2, width: ['80%', '50%'] }"
  />
</div>

```vue
<template>
  <ASkeleton
    active
    round
    :avatar="{ size: 40, shape: 'circle' }"
    :title="{ width: '60%' }"
    :paragraph="{ rows: 2, width: ['80%', '50%'] }"
  />
</template>
```

## 加载完成

<div class="aheart-demo-panel">
  <ASkeleton :loading="false">
    <ACard title="Loaded">Content is ready.</ACard>
  </ASkeleton>
</div>

```vue
<template>
  <ASkeleton :loading="loaded === false">
    <ACard title="Loaded">Content is ready.</ACard>
  </ASkeleton>
</template>
```

## 按钮、输入框、图片与节点

<div class="aheart-demo-panel">
  <ASkeleton
    active
    :title="false"
    :paragraph="false"
    :button="{ shape: 'round', size: 'large', width: 160 }"
    :input="{ size: 'small', width: '70%' }"
    :image="{ width: 96, height: 72 }"
    :node="{ width: 48, height: 48, children: 'N' }"
  />
</div>

```vue
<template>
  <ASkeleton
    active
    :title="false"
    :paragraph="false"
    :button="{ shape: 'round', size: 'large', width: 160 }"
    :input="{ size: 'small', width: '70%' }"
    :image="{ width: 96, height: 72 }"
    :node="{ width: 48, height: 48, children: 'N' }"
  />
</template>
```

## 语义样式

<div class="aheart-demo-panel">
  <ASkeleton
    root-class-name="docs-skeleton"
    :avatar="true"
    :class-names="{ root: 'docs-skeleton-root', avatar: 'docs-skeleton-avatar', title: 'docs-skeleton-title' }"
    :styles="{ root: { padding: '8px' }, title: { width: '44%' } }"
  />
</div>

```vue
<template>
  <ASkeleton
    root-class-name="docs-skeleton"
    :avatar="true"
    :class-names="{ root: 'docs-skeleton-root', avatar: 'docs-skeleton-avatar' }"
    :styles="{ root: { padding: '8px' }, title: { width: '44%' } }"
  />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否显示骨架屏 | `boolean` | `true` |
| active | 是否显示动画 | `boolean` | `false` |
| avatar | 是否显示头像占位 | `boolean` \| `SkeletonAvatarConfig` | `false` |
| title | 是否显示标题占位 | `boolean` \| `SkeletonTitleConfig` | `true` |
| paragraph | 是否显示段落占位 | `boolean` \| `SkeletonParagraphConfig` | `true` |
| button | 是否显示按钮占位 | `boolean` \| `SkeletonButtonConfig` | `false` |
| input | 是否显示输入框占位 | `boolean` \| `SkeletonInputConfig` | `false` |
| image | 是否显示图片占位 | `boolean` \| `SkeletonImageConfig` | `false` |
| node | 是否显示自定义节点占位 | `boolean` \| `SkeletonNodeConfig` | `false` |
| round | 是否使用圆角线条 | `boolean` | `false` |
| className | 根节点附加类名 | `string` | - |
| rootClassName | 根节点附加类名 | `string` | - |
| style | 根节点附加样式 | `StyleValue` | - |
| classNames | 语义 DOM 类名 | `SkeletonClassNames` | `{}` |
| styles | 语义 DOM 样式 | `SkeletonStyles` | `{}` |

### SkeletonAvatarConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 头像尺寸 | `number` \| `string` | `32` |
| shape | 头像形状 | `circle` \| `square` | `circle` |

### SkeletonTitleConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 标题宽度 | `number` \| `string` | `38%` |

### SkeletonParagraphConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rows | 段落行数 | `number` | `3` |
| width | 段落宽度 | `number` \| `string` \| `(number \| string)[]` | 最后一行 `61%` |

### SkeletonButtonConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 是否单独显示动画 | `boolean` | `false` |
| block | 是否占满一行 | `boolean` | `false` |
| shape | 形状 | `default` \| `round` \| `circle` | `default` |
| size | 尺寸 | `small` \| `default` \| `large` | `default` |
| width | 宽度 | `number` \| `string` | - |

### SkeletonInputConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 是否单独显示动画 | `boolean` | `false` |
| block | 是否占满一行 | `boolean` | `false` |
| size | 尺寸 | `small` \| `default` \| `large` | `default` |
| width | 宽度 | `number` \| `string` | - |

### SkeletonImageConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 是否单独显示动画 | `boolean` | `false` |
| width | 宽度 | `number` \| `string` | `96` |
| height | 高度 | `number` \| `string` | `96` |

### SkeletonNodeConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 是否单独显示动画 | `boolean` | `false` |
| width | 宽度 | `number` \| `string` | `48` |
| height | 高度 | `number` \| `string` | `48` |
| children | 节点内容 | `VNodeChild` | - |

### Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根容器 |
| avatar | 头像占位 |
| content | 标题和段落内容容器 |
| title | 标题占位 |
| paragraph | 段落容器 |
| paragraphRow | 段落行 |
| button | 按钮占位 |
| input | 输入框占位 |
| image | 图片占位 |
| node | 自定义节点占位 |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | `loading=false` 时渲染的内容 |

## Theme Tokens

- `--aheart-color-fill`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-radius-sm`
