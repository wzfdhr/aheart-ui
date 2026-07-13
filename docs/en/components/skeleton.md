# Skeleton <span class="aheart-status aheart-status--ready">Ready</span>

Skeleton displays loading placeholders before content is ready.



## Basic Usage

<div class="aheart-demo-panel">
  <ASkeleton />
</div>

```vue
<template>
<ASkeleton />
</template>
```

## Animation and Avatar

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

## Loaded State

<div class="aheart-demo-panel">
  <ASkeleton :loading="false">
    <ACard title="Loaded">Content is ready.</ACard>
  </ASkeleton>
</div>

```vue
<template>
<ASkeleton :loading="false">
    <ACard title="Loaded">Content is ready.</ACard>
  </ASkeleton>
</template>
```

## Button, Input, Image, and Node

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

## Semantic Styling

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
    :class-names="{ root: 'docs-skeleton-root', avatar: 'docs-skeleton-avatar', title: 'docs-skeleton-title' }"
    :styles="{ root: { padding: '8px' }, title: { width: '44%' } }"
  />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| loading | Loading state. | `boolean` | `true` |
| active | Whether to show animation. | `boolean` | `false` |
| avatar | Whether to show an avatar placeholder. | `boolean` \|`SkeletonAvatarConfig` | `false` |
| title | Whether to show a title placeholder, or its configuration. | `boolean` \|`SkeletonTitleConfig` | `true` |
| paragraph | Whether to show a paragraph placeholder. | `boolean` \|`SkeletonParagraphConfig` | `true` |
| button | Whether to show a button placeholder. | `boolean` \|`SkeletonButtonConfig` | `false` |
| input | Whether to show an input placeholder. | `boolean` \|`SkeletonInputConfig` | `false` |
| image | Whether to show an image placeholder. | `boolean` \|`SkeletonImageConfig` | `false` |
| node | Whether to show a custom node placeholder. | `boolean` \|`SkeletonNodeConfig` | `false` |
| round | Whether to use rounded placeholder lines. | `boolean` | `false` |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `SkeletonClassNames` | `{}` |
| styles | Semantic DOM styles, as an object or function. | `SkeletonStyles` | `{}` |

### SkeletonAvatarConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| size | Component size. | `number` \|`string` | `32` |
| shape | Shape. | `circle` \|`square` | `circle` |

### SkeletonTitleConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| width | Width. | `number` \| `string` | `38%` |

### SkeletonParagraphConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| rows | Number of paragraph rows. | `number` | `3` |
| width | Width. | `number` \|`string` \|`(number \|string)[]` | last row `61%` |

### SkeletonButtonConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| active | Whether to show animation. | `boolean` | `false` |
| block | Whether to fill a row. | `boolean` | `false` |
| shape | Shape. | `default` \|`round` \|`circle` | `default` |
| size | Component size. | `small` \| `default` \| `large` | `default` |
| width | Width. | `number` \| `string` | - |

### SkeletonInputConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| active | Whether to show animation. | `boolean` | `false` |
| block | Whether to fill a row. | `boolean` | `false` |
| size | Component size. | `small` \| `default` \| `large` | `default` |
| width | Width. | `number` \| `string` | - |

### SkeletonImageConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| active | Whether to show animation. | `boolean` | `false` |
| width | Width. | `number` \| `string` | `96` |
| height | Height. | `number` \| `string` | `96` |

### SkeletonNodeConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| active | Whether to show animation. | `boolean` | `false` |
| width | Width. | `number` \| `string` | `48` |
| height | Height. | `number` \| `string` | `48` |
| children | Child items or content. | `VNodeChild` | - |

### Semantic DOM

| Name | Description |
| --- | --- |
| root | Root container. |
| avatar | Avatar placeholder. |
| content | Container for title and paragraph placeholders. |
| title | Title placeholder. |
| paragraph | Paragraph container. |
| paragraphRow | Paragraph row. |
| button | Button placeholder. |
| input | Input placeholder. |
| image | Image placeholder. |
| node | Custom-node placeholder. |

## Slots

| Name | Description |
| --- | --- |
| default | Content rendered when `loading` is `false`. |

## Theme Tokens

- `--aheart-color-fill`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-radius-sm`
