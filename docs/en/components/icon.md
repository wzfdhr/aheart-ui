# Icon <span class="aheart-status aheart-status--ready">Ready</span>

Icon renders inline symbols and custom SVG content.



## Basic Usage

<div class="aheart-demo-panel">
  <ASpace>
    <AIcon name="search" />
    <AIcon name="setting" color="#1677ff" />
    <AIcon name="loading" spin />
  </ASpace>
</div>

```vue
<template>
  <ASpace>
    <AIcon name="search" />
    <AIcon name="setting" color="#1677ff" />
    <AIcon name="loading" spin />
  </ASpace>
</template>
```

## Custom SVG

<div class="aheart-demo-panel">
  <AIcon :size="20" color="#52c41a">
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5z" />
    </svg>
  </AIcon>
</div>

```vue
<template>
  <AIcon :size="20" color="#52c41a">
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5z" />
    </svg>
  </AIcon>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| name | Icon name to display when no slot is provided. | `string` | - |
| size | Icon size. | `number` \| `string` | `1em` |
| color | Icon color. | `string` | `currentColor` |
| spin | Whether the icon rotates. | `boolean` | `false` |

## Slots

| Name | Description |
| --- | --- |
| default | Custom icon content, typically an SVG. |
