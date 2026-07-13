# Descriptions <span class="aheart-status aheart-status--ready">Ready</span>

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

## Basic Usage

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

## Renderable Content

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
<script setup lang="ts">
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

## Bordered and Vertical Layout

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

## Fill Remaining Columns and Colon

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

## Semantic Styling

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
    :items="[
      { label: 'Owner', content: 'Design System' },
      { label: 'State', content: 'Ready', contentStyle: { fontWeight: 600 } }
    ]"
  />
</template>
```

## Global Size

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
    <ADescriptions
      :items="[
        { label: 'Owner', content: 'Design System' },
        { label: 'State', content: 'Ready' }
      ]"
    />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Title; the `title` slot takes precedence. | `VNodeChild` | - |
| extra | Extra content on the right; the `extra` slot takes precedence. | `VNodeChild` | - |
| items | Description items. | `DescriptionItem[]` | `[]` |
| bordered | Whether to show borders. | `boolean` | `false` |
| column | Number of columns per row. | `number` | `3` |
| layout | Layout direction. | `horizontal` \| `vertical` | `horizontal` |
| size | Descriptions size. | `large` \| `middle` \| `small` | ConfigProvider size |
| colon | Whether to show a colon after labels. | `boolean` | `true` |
| labelStyle | Global label style; compatible with the legacy Ant API. | `StyleValue` | - |
| contentStyle | Global content style; compatible with the legacy Ant API. | `StyleValue` | - |
| className | Root element class. | `string` | - |
| rootClassName | Root element class. | `string` | - |
| style | Root element style. | `StyleValue` | - |
| classNames | Semantic DOM classes. | `Partial<Record<DescriptionsSemanticPart, string>>` | `{}` |
| styles | Semantic DOM styles. | `Partial<Record<DescriptionsSemanticPart, StyleValue>>` | `{}` |

### DescriptionItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Description-item key. | `string` \| `number` | `label + index` |
| label | Label. | `VNodeChild` | - |
| content | Content; takes precedence over `children`. | `VNodeChild` | - |
| children | Fallback content field. | `VNodeChild` | - |
| span | Number of columns to occupy; `filled` fills the remaining columns in the current row. | `number` \| `filled` | `1` |
| className | Description-item class. | `string` | - |
| style | Description-item style. | `StyleValue` | - |
| labelStyle | Style for the current item's label. | `StyleValue` | - |
| contentStyle | Style for the current item's content. | `StyleValue` | - |

## Slots

| Name | Description |
| --- | --- |
| title | Custom title; takes precedence over the `title` prop. |
| extra | Custom extra content; takes precedence over the `extra` prop. |

### Semantic DOM

| Name | Description |
| --- | --- |
| root | Root element. |
| header | Container for the title and extra content. |
| title | Title. |
| extra | Extra content. |
| table | Descriptions table container. |
| row | Each row. |
| item | Each description item. |
| label | Description-item label. |
| content | Description-item content. |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-radius`
