# Empty 空状态 <span class="aheart-status aheart-status--ready">Ready</span>

<script setup lang="ts">
import { h } from 'vue'
import { Empty, enUS } from 'aheart-ui'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const richDescription = h('span', { style: { color: 'var(--aheart-color-text)' } }, [
  'No archived ',
  h('strong', 'records'),
  ' are available.'
])
</script>

Empty presents an intentional empty state with optional custom image and action content.

## 基础用法

<div class="aheart-demo-panel">
  <AEmpty />
</div>

```vue
<template>
  <AEmpty />
</template>
```

## 自定义描述

<div class="aheart-demo-panel">
  <AEmpty description="No projects yet">
    <AButton type="primary">Create project</AButton>
  </AEmpty>
</div>

```vue
<template>
  <AEmpty description="No projects yet">
    <AButton type="primary">Create project</AButton>
  </AEmpty>
</template>
```

## 国际化文案

<div class="aheart-demo-panel">
  <AConfigProvider :locale="enUS">
    <AEmpty />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider :locale="enUS">
    <AEmpty />
  </AConfigProvider>
</template>
```

## 自定义图片

<div class="aheart-demo-panel">
  <AEmpty description="Nothing matched your filters">
    <template #image>
      <span style="font-size: 40px; line-height: 1;">⌕</span>
    </template>
    <AButton>Reset filters</AButton>
  </AEmpty>
</div>

```vue
<template>
  <AEmpty description="Nothing matched your filters">
    <template #image>
      <span class="empty-search">⌕</span>
    </template>
    <AButton>Reset filters</AButton>
  </AEmpty>
</template>
```

## 图片地址

<div class="aheart-demo-panel">
  <AEmpty image="/logo.svg" description="No matching records">
    <AButton>Refresh</AButton>
  </AEmpty>
</div>

```vue
<template>
  <AEmpty image="/logo.svg" description="No matching records">
    <AButton>Refresh</AButton>
  </AEmpty>
</template>
```

## 内置图片预设

<div class="aheart-demo-panel">
  <AEmpty :image="simpleImage" description="No lightweight records">
    <AButton>Import records</AButton>
  </AEmpty>
</div>

```vue
<script setup lang="ts">
import { Empty } from 'aheart-ui'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>

<template>
  <AEmpty :image="simpleImage" description="No lightweight records">
    <AButton>Import records</AButton>
  </AEmpty>
</template>
```

## 节点描述

<div class="aheart-demo-panel">
  <AEmpty :description="richDescription">
    <AButton>View archive settings</AButton>
  </AEmpty>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const richDescription = h('span', [
  'No archived ',
  h('strong', 'records'),
  ' are available.'
])
</script>

<template>
  <AEmpty :description="richDescription">
    <AButton>View archive settings</AButton>
  </AEmpty>
</template>
```

## 隐藏区域

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AEmpty :image="false" description="No illustration" />
    <AEmpty :description="false">
      <AButton>Only action</AButton>
    </AEmpty>
  </ASpace>
</div>

```vue
<template>
  <ASpace direction="vertical" style="width: 100%">
    <AEmpty :image="false" description="No illustration" />
    <AEmpty :description="false">
      <AButton>Only action</AButton>
    </AEmpty>
  </ASpace>
</template>
```

## 自定义描述插槽

<div class="aheart-demo-panel">
  <AEmpty>
    <template #description>
      <span>No deployments have run in this environment.</span>
    </template>
    <AButton type="primary">Run deployment</AButton>
  </AEmpty>
</div>

```vue
<template>
  <AEmpty>
    <template #description>
      <span>No deployments have run in this environment.</span>
    </template>
    <AButton type="primary">Run deployment</AButton>
  </AEmpty>
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <AEmpty
    description="Styled empty state"
    :image-style="{ width: '80px' }"
    :class-names="{ root: 'demo-empty-root', image: 'demo-empty-image', footer: 'demo-empty-footer' }"
    :styles="{ root: { padding: '20px' }, footer: { marginTop: '16px' } }"
  >
    <AButton>Configure</AButton>
  </AEmpty>
</div>

```vue
<template>
  <AEmpty
    description="Styled empty state"
    :image-style="{ width: '80px' }"
    :class-names="{ root: 'demo-empty-root', image: 'demo-empty-image', footer: 'demo-empty-footer' }"
    :styles="{ root: { padding: '20px' }, footer: { marginTop: '16px' } }"
  >
    <AButton>Configure</AButton>
  </AEmpty>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| description | 空状态描述内容，设置为 `false` 时隐藏 | `VNodeChild` \| `false` | ConfigProvider locale |
| image | 自定义图片地址、节点或内置预设，设置为 `false` 时隐藏图片区域 | `string` \| `VNodeChild` \| `Empty.PRESENTED_IMAGE_DEFAULT` \| `Empty.PRESENTED_IMAGE_SIMPLE` \| `false` | `Empty.PRESENTED_IMAGE_DEFAULT` |
| imageStyle | 图片区域样式 | `StyleValue` | - |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'image' \| 'description' \| 'footer', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'image' \| 'description' \| 'footer', StyleValue>>` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| image | 自定义图片区域 |
| description | 自定义描述区域 |
| default | 底部操作区域 |

## Static Constants

| 名称 | 说明 |
| --- | --- |
| Empty.PRESENTED_IMAGE_DEFAULT | 默认空状态图片预设 |
| Empty.PRESENTED_IMAGE_SIMPLE | 简洁空状态图片预设 |

## Theme Tokens

- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
