# Empty <span class="aheart-status aheart-status--ready">Ready</span>

<script setup lang="ts">


import { h } from 'vue'
import { Empty } from 'aheart-ui'

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
  <AConfigProvider :locale="{ empty: { description: 'No content' } }">
    <AEmpty />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider :locale="{ empty: { description: 'No content' } }">
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
      <span class="empty-search">⌕</span>
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
| description | Configures `description`. | `VNodeChild` \|`false` | ConfigProvider locale |
| image | Configures `image`. | `string` \|`VNodeChild` \|`Empty.PRESENTED_IMAGE_DEFAULT` \|`Empty.PRESENTED_IMAGE_SIMPLE` \|`false` | `Empty.PRESENTED_IMAGE_DEFAULT` |
| imageStyle | Configures `imageStyle`. | `StyleValue` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'image' \| 'description' \| 'footer', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'image' \| 'description' \| 'footer', StyleValue>>` | - |

## Slots

| Name | Description |
| --- | --- |
| image | Provides the `image` entry. |
| description | Provides the `description` entry. |
| default | Provides the `default` entry. |

## Static Constants

| Name | Description |
| --- | --- |
| Empty.PRESENTED_IMAGE_DEFAULT | Provides the `Empty.PRESENTED_IMAGE_DEFAULT` entry. |
| Empty.PRESENTED_IMAGE_SIMPLE | Provides the `Empty.PRESENTED_IMAGE_SIMPLE` entry. |

## Theme Tokens

- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
