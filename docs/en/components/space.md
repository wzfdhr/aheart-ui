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

## Vertical Layout

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

## Separator

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

## Node Separator

<div class="aheart-demo-panel">
  <ASpace :separator="slashSeparator">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const slashSeparator = h('strong', '/')
</script>

<template>
<ASpace :separator="slashSeparator">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</template>
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
| size | Spacing size. | `large` \| `middle` \| `small` \| `number` \| `[number, number]` | ConfigProvider size |
| direction | Layout direction; retained as a compatibility alias. | `horizontal` \| `vertical` | `horizontal` |
| orientation | Ant-style layout direction; takes precedence over `direction`. | `horizontal` \| `vertical` | - |
| vertical | Shortcut for a vertical layout. | `boolean` | `false` |
| align | Alignment. | `start` \| `end` \| `center` \| `baseline` | - |
| wrap | Whether to wrap automatically. | `boolean` | `false` |
| separator | Separator between child elements. | `VNodeChild` | - |
| split | Compatibility alias for the separator; `separator` is recommended. | `VNodeChild` | - |
| className | Compatible class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |
| classNames | Classes for semantic parts; accepts an object or function. | `SpaceClassNames` | - |
| styles | Styles for semantic parts; accepts an object or function. | `SpaceStyles` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Content to which spacing is applied. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Root spacing container. |
| item | Wrapper for each child node. |
| separator | Separator between child nodes. |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
