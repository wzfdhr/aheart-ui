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
  <ASkeleton :loading="loaded === false">
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

## contentstyle

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

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| loading | Configures `loading`. | `boolean` | `true` |
| active | Configures `active`. | `boolean` | `false` |
| avatar | Configures `avatar`. | `boolean` \|`SkeletonAvatarConfig` | `false` |
| title | Configures `title`. | `boolean` \|`SkeletonTitleConfig` | `true` |
| paragraph | Configures `paragraph`. | `boolean` \|`SkeletonParagraphConfig` | `true` |
| button | Configures `button`. | `boolean` \|`SkeletonButtonConfig` | `false` |
| input | Configures `input`. | `boolean` \|`SkeletonInputConfig` | `false` |
| image | Configures `image`. | `boolean` \|`SkeletonImageConfig` | `false` |
| node | Configures `node`. | `boolean` \|`SkeletonNodeConfig` | `false` |
| round | Configures `round`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `SkeletonClassNames` | `{}` |
| styles | Configures `styles`. | `SkeletonStyles` | `{}` |

### SkeletonAvatarConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| size | Configures `size`. | `number` \|`string` | `32` |
| shape | Configures `shape`. | `circle` \|`square` | `circle` |

### SkeletonTitleConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| width | Configures `width`. | `number` \| `string` | `38%` |

### SkeletonParagraphConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| rows | Configures `rows`. | `number` | `3` |
| width | Configures `width`. | `number` \|`string` \|`(number \|string)[]` | last row `61%` |

### SkeletonButtonConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| active | Configures `active`. | `boolean` | `false` |
| block | Configures `block`. | `boolean` | `false` |
| shape | Configures `shape`. | `default` \|`round` \|`circle` | `default` |
| size | Configures `size`. | `small` \| `default` \| `large` | `default` |
| width | Configures `width`. | `number` \| `string` | - |

### SkeletonInputConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| active | Configures `active`. | `boolean` | `false` |
| block | Configures `block`. | `boolean` | `false` |
| size | Configures `size`. | `small` \| `default` \| `large` | `default` |
| width | Configures `width`. | `number` \| `string` | - |

### SkeletonImageConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| active | Configures `active`. | `boolean` | `false` |
| width | Configures `width`. | `number` \| `string` | `96` |
| height | Configures `height`. | `number` \| `string` | `96` |

### SkeletonNodeConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| active | Configures `active`. | `boolean` | `false` |
| width | Configures `width`. | `number` \| `string` | `48` |
| height | Configures `height`. | `number` \| `string` | `48` |
| children | Configures `children`. | `VNodeChild` | - |

### Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| avatar | Provides the `avatar` entry. |
| content | Provides the `content` entry. |
| title | Provides the `title` entry. |
| paragraph | Provides the `paragraph` entry. |
| paragraphRow | Provides the `paragraphRow` entry. |
| button | Provides the `button` entry. |
| input | Provides the `input` entry. |
| image | Provides the `image` entry. |
| node | Provides the `node` entry. |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |

## Theme Tokens

- `--aheart-color-fill`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-radius-sm`
