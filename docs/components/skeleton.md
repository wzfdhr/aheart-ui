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

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否显示骨架屏 | `boolean` | `true` |
| active | 是否显示动画 | `boolean` | `false` |
| avatar | 是否显示头像占位 | `boolean` \| `SkeletonAvatarConfig` | `false` |
| title | 是否显示标题占位 | `boolean` \| `SkeletonTitleConfig` | `true` |
| paragraph | 是否显示段落占位 | `boolean` \| `SkeletonParagraphConfig` | `true` |
| round | 是否使用圆角线条 | `boolean` | `false` |

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
