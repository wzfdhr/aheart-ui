<script setup lang="ts">
import { ref } from 'vue'

const sizes = ref([260, 420])
const setNavigationSize = (value: number | null) => {
  const navigationSize = Math.min(480, Math.max(120, value ?? 120))
  sizes.value = [navigationSize, 680 - navigationSize]
}
</script>

# Splitter <span class="aheart-status aheart-status--ready">Ready</span>

Splitter creates resizable adjacent panels. Divider remains a visual-only separator.

## Basic Usage

<div class="aheart-demo-panel" style="height: 180px; padding: 0; overflow: hidden;">
  <ASplitter :default-sizes="[180, 'auto']">
    <ASplitterPanel :min="120" style="padding: 16px;">Navigation</ASplitterPanel>
    <ASplitterPanel :min="160" style="padding: 16px;">Content</ASplitterPanel>
  </ASplitter>
</div>

```vue
<template>
  <ASplitter :default-sizes="[180, 'auto']">
    <ASplitterPanel :min="120">Navigation</ASplitterPanel>
    <ASplitterPanel :min="160">Content</ASplitterPanel>
  </ASplitter>
</template>
```

## External Numeric Control

<div class="aheart-demo-panel" style="height: 220px;">
  <ASpace direction="vertical" style="width: 100%; height: 100%;">
    <AInputNumber :model-value="sizes[0]" :min="120" :max="480" @update:model-value="setNavigationSize" />
    <div style="height: 160px; min-width: 0;">
      <ASplitter v-model:sizes="sizes">
        <ASplitterPanel :min="120" style="padding: 12px;">{{ sizes[0] }} px</ASplitterPanel>
        <ASplitterPanel :min="160" style="padding: 12px;">{{ sizes[1] }} px</ASplitterPanel>
      </ASplitter>
    </div>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const sizes = ref([260, 420])
const setNavigationSize = (value: number | null) => {
  const navigationSize = Math.min(480, Math.max(120, value ?? 120))
  sizes.value = [navigationSize, 680 - navigationSize]
}
</script>

<template>
  <AInputNumber :model-value="sizes[0]" :min="120" :max="480" @update:model-value="setNavigationSize" />
  <ASplitter v-model:sizes="sizes">
    <ASplitterPanel :min="120">Navigation</ASplitterPanel>
    <ASplitterPanel :min="160">Content</ASplitterPanel>
  </ASplitter>
</template>
```

## Vertical Layout and Keyboard

```vue
<template>
  <ASplitter layout="vertical" :default-sizes="[180, 'auto']" style="height: 320px;">
    <ASplitterPanel :min="100">Top panel</ASplitterPanel>
    <ASplitterPanel :min="120">Bottom panel</ASplitterPanel>
  </ASplitter>
</template>
```

Focus a handle and use Left/Right for horizontal layouts or Up/Down for vertical layouts. Each key changes the adjacent panels by `10px`; hold Shift for `50px`.

## API

### Splitter

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| sizes | Controlled panel sizes. | `SplitterSize[]` | - |
| defaultSizes | Initial uncontrolled sizes. | `SplitterSize[]` | `[]` |
| layout | Layout direction. | `horizontal` \| `vertical` | `horizontal` |
| lazy | Defers `update:sizes` until the handle is released. | `boolean` | `false` |
| disabled | Disables handle drag, keyboard resize, and collapse actions. | `boolean` | `false` |

### SplitterPanel

| Property | Description | Type | Default |
| --- | --- | --- |
| min | Minimum size in pixels or percent. | `number` \| `${number}%` | `0` |
| max | Maximum size in pixels or percent. | `number` \| `${number}%` | - |
| collapsible | Shows a collapse/restore control on an adjacent handle. | `boolean` | `false` |

### Events

| Event | Description |
| --- | --- |
| update:sizes | Emitted when sizes change; supports `v-model:sizes`. |
| resize-start | Emitted when a handle starts dragging. |
| resize | Emitted when sizes change. |
| resize-end | Emitted after a handle is successfully released. |
