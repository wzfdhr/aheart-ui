# Space <span class="aheart-status aheart-status--ready">Ready</span>

<script setup lang="ts">


import { h } from 'vue'

const slashSeparator = h('strong', '/')
</script>

Space sets consistent spacing between inline or vertical elements, with Ant-style orientation and separators.

## Basic Usage

<div class="aheart-demo-panel">
  <ASpace>
    <AButton>Cancel</AButton>
    <AButton type="primary">Submit</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace>
    <AButton>Cancel</AButton>
    <AButton type="primary">Submit</AButton>
  </ASpace>
</template>
```

## verticalcontentcolumn

<div class="aheart-demo-panel">
  <ASpace orientation="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace orientation="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</template>
```

## separator

<div class="aheart-demo-panel">
  <ASpace separator="|">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</div>

```vue
<template>
  <ASpace separator="|">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</template>
```

## nodeseparator

<div class="aheart-demo-panel">
  <ASpace :separator="slashSeparator">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</div>

```vue
<template>
  <ASpace :separator="slashSeparator">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</template>

<script setup lang="ts">
import { h } from 'vue'

const slashSeparator = h('strong', '/')
</script>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ASpace
    separator="•"
    class-name="demo-space-class"
    root-class-name="demo-space-root"
    :style="{ padding: '8px' }"
    :class-names="{ root: 'demo-space-semantic-root', item: 'demo-space-item', separator: 'demo-space-separator' }"
    :styles="{ item: { paddingInline: '4px' }, separator: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }"
  >
    <AButton>Styled Button 1</AButton>
    <AButton>Styled Button 2</AButton>
    <AButton>Styled Button 3</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace
    separator="•"
    class-name="demo-space-class"
    root-class-name="demo-space-root"
    :style="{ padding: '8px' }"
    :class-names="{ root: 'demo-space-semantic-root', item: 'demo-space-item', separator: 'demo-space-separator' }"
    :styles="{ item: { paddingInline: '4px' }, separator: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }"
  >
    <AButton>Styled Button 1</AButton>
    <AButton>Styled Button 2</AButton>
    <AButton>Styled Button 3</AButton>
  </ASpace>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| size | Configures `size`. | `large` \| `middle` \| `small` \| `number` \| `[number, number]` | ConfigProvider size |
| direction | Configures `direction`. | `horizontal` \|`vertical` | `horizontal` |
| orientation | Configures `orientation`. | `horizontal` \|`vertical` | - |
| vertical | Configures `vertical`. | `boolean` | `false` |
| align | Configures `align`. | `start` \|`end` \|`center` \|`baseline` | - |
| wrap | Configures `wrap`. | `boolean` | `false` |
| separator | Configures `separator`. | `VNodeChild` | - |
| split | Configures `split`. | `VNodeChild` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `SpaceClassNames` | - |
| styles | Configures `styles`. | `SpaceStyles` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| item | Provides the `item` entry. |
| separator | Provides the `separator` entry. |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
