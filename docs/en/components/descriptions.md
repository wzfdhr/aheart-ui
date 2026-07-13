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
    :items="items"
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
    <ADescriptions :items="items" />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Configures `title`. | `VNodeChild` | - |
| extra | Configures `extra`. | `VNodeChild` | - |
| items | Configures `items`. | `DescriptionItem[]` | `[]` |
| bordered | Configures `bordered`. | `boolean` | `false` |
| column | Configures `column`. | `number` | `3` |
| layout | Configures `layout`. | `horizontal` \|`vertical` | `horizontal` |
| size | Configures `size`. | `large` \| `middle` \| `small` | ConfigProvider size |
| colon | Configures `colon`. | `boolean` | `true` |
| labelStyle | Configures `labelStyle`. | `StyleValue` | - |
| contentStyle | Configures `contentStyle`. | `StyleValue` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<DescriptionsSemanticPart, string>>` | `{}` |
| styles | Configures `styles`. | `Partial<Record<DescriptionsSemanticPart, StyleValue>>` | `{}` |

### DescriptionItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Configures `key`. | `string` \|`number` | `label + index` |
| label | Configures `label`. | `VNodeChild` | - |
| content | Configures `content`. | `VNodeChild` | - |
| children | Configures `children`. | `VNodeChild` | - |
| span | Configures `span`. | `number` \|`filled` | `1` |
| className | Configures `className`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| labelStyle | Configures `labelStyle`. | `StyleValue` | - |
| contentStyle | Configures `contentStyle`. | `StyleValue` | - |

## Slots

| Name | Description |
| --- | --- |
| title | Provides the `title` entry. |
| extra | Provides the `extra` entry. |

### Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| header | Provides the `header` entry. |
| title | Provides the `title` entry. |
| extra | Provides the `extra` entry. |
| table | Provides the `table` entry. |
| row | Provides the `row` entry. |
| item | Provides the `item` entry. |
| label | Provides the `label` entry. |
| content | Provides the `content` entry. |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-radius`
