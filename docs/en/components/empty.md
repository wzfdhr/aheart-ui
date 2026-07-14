# Empty <span class="aheart-status aheart-status--ready">Ready</span>

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

## Basic Usage

<div class="aheart-demo-panel">
  <AEmpty />
</div>

```vue
<template>
<AEmpty />
</template>
```

## Custom Description

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

## Localized Text

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

## Custom Image

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
      <span style="font-size: 40px; line-height: 1;">⌕</span>
    </template>
    <AButton>Reset filters</AButton>
  </AEmpty>
</template>
```

## Image URL

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

## Built-in Image Presets

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

## Node Description

<div class="aheart-demo-panel">
  <AEmpty :description="richDescription">
    <AButton>View archive settings</AButton>
  </AEmpty>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const richDescription = h('span', { style: { color: 'var(--aheart-color-text)' } }, [
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

## Hidden Areas

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

## Custom Description Slot

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

## Semantic Styling

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

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| description | Empty-state description; set to `false` to hide it. | `VNodeChild` \| `false` | ConfigProvider locale |
| image | Custom image URL, node, or built-in preset; set to `false` to hide the image area. | `string` \| `VNodeChild` \| `Empty.PRESENTED_IMAGE_DEFAULT` \| `Empty.PRESENTED_IMAGE_SIMPLE` \| `false` | `Empty.PRESENTED_IMAGE_DEFAULT` |
| imageStyle | Style for the image area. | `StyleValue` | - |
| className | Compatible class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |
| classNames | Classes for semantic parts. | `Partial<Record<'root' \| 'image' \| 'description' \| 'footer', string>>` | - |
| styles | Styles for semantic parts. | `Partial<Record<'root' \| 'image' \| 'description' \| 'footer', StyleValue>>` | - |

## Slots

| Name | Description |
| --- | --- |
| image | Custom image area. |
| description | Custom description area. |
| default | Footer action area. |

## Static Constants

| Name | Description |
| --- | --- |
| Empty.PRESENTED_IMAGE_DEFAULT | Default empty-state image preset. |
| Empty.PRESENTED_IMAGE_SIMPLE | Simplified empty-state image preset. |

## Theme Tokens

- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
