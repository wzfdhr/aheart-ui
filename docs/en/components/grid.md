# Grid <span class="aheart-status aheart-status--ready">Ready</span>

Grid provides a 24-column responsive layout system with `ARow` and `ACol`.



## Basic Usage

<div class="aheart-demo-panel">
  <ARow>
    <ACol :span="8"><div class="aheart-grid-demo-cell">col-8</div></ACol>
    <ACol :span="8"><div class="aheart-grid-demo-cell">col-8</div></ACol>
    <ACol :span="8"><div class="aheart-grid-demo-cell">col-8</div></ACol>
  </ARow>
</div>

```vue
<template>
<ARow>
    <ACol :span="8"><div class="aheart-grid-demo-cell">col-8</div></ACol>
    <ACol :span="8"><div class="aheart-grid-demo-cell">col-8</div></ACol>
    <ACol :span="8"><div class="aheart-grid-demo-cell">col-8</div></ACol>
  </ARow>
</template>
```

## Gutter

<div class="aheart-demo-panel">
  <ARow :gutter="[16, 16]">
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
  </ARow>
</div>

```vue
<template>
<ARow :gutter="[16, 16]">
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
  </ARow>
</template>
```

## Alignment and Ordering

<div class="aheart-demo-panel">
  <ARow justify="center" align="middle" :gutter="12">
    <ACol :span="6" :order="2"><div class="aheart-grid-demo-cell">order-2</div></ACol>
    <ACol :span="6" :order="1" :offset="2"><div class="aheart-grid-demo-cell">offset-2</div></ACol>
  </ARow>
</div>

```vue
<template>
<ARow justify="center" align="middle" :gutter="12">
    <ACol :span="6" :order="2"><div class="aheart-grid-demo-cell">order-2</div></ACol>
    <ACol :span="6" :order="1" :offset="2"><div class="aheart-grid-demo-cell">offset-2</div></ACol>
  </ARow>
</template>
```

## Flex Fill

<div class="aheart-demo-panel">
  <ARow :gutter="12">
    <ACol :flex="120"><div class="aheart-grid-demo-cell">120px</div></ACol>
    <ACol flex="auto"><div class="aheart-grid-demo-cell">auto</div></ACol>
  </ARow>
</div>

```vue
<template>
<ARow :gutter="12">
    <ACol :flex="120"><div class="aheart-grid-demo-cell">120px</div></ACol>
    <ACol flex="auto"><div class="aheart-grid-demo-cell">auto</div></ACol>
  </ARow>
</template>
```

## Responsive

<div class="aheart-demo-panel">
  <ARow :gutter="{ xs: 8, md: 16, xl: 24 }">
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8 }">
      <div class="aheart-grid-demo-cell">responsive</div>
    </ACol>
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8, offset: 4 }">
      <div class="aheart-grid-demo-cell">responsive</div>
    </ACol>
  </ARow>
</div>

```vue
<template>
<ARow :gutter="{ xs: 8, md: 16, xl: 24 }">
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8 }">
      <div class="aheart-grid-demo-cell">responsive</div>
    </ACol>
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8, offset: 4 }">
      <div class="aheart-grid-demo-cell">responsive</div>
    </ACol>
  </ARow>
</template>
```

## Row API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| gutter | Grid gutter. | `number` \| `[GridGutter, GridGutter]` \| `GridResponsiveGutter` | `0` |
| justify | Horizontal alignment. | `start` \| `end` \| `center` \| `space-around` \| `space-between` \| `space-evenly` | - |
| align | Vertical alignment. | `top` \| `middle` \| `bottom` \| `stretch` | - |
| wrap | Whether rows wrap automatically. | `boolean` | `true` |

## Col API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| span | Number of grid units to occupy. | `number` | - |
| offset | Number of grid units to leave on the left. | `number` | - |
| order | Grid order. | `number` | - |
| pull | Number of grid units to move left. | `number` | - |
| push | Number of grid units to move right. | `number` | - |
| flex | Flex fill. | `string` \| `number` | - |
| xs | Responsive configuration below `576px`. | `number` \| `ColSpanConfig` | - |
| sm | Responsive configuration from `576px`. | `number` \| `ColSpanConfig` | - |
| md | Responsive configuration from `768px`. | `number` \| `ColSpanConfig` | - |
| lg | Responsive configuration from `992px`. | `number` \| `ColSpanConfig` | - |
| xl | Responsive configuration from `1200px`. | `number` \| `ColSpanConfig` | - |
| xxl | Responsive configuration from `1600px`. | `number` \| `ColSpanConfig` | - |

### ColSpanConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| span | Number of grid units to occupy. | `number` | - |
| offset | Number of grid units to leave on the left. | `number` | - |
| order | Grid order. | `number` | - |
| pull | Number of grid units to move left. | `number` | - |
| push | Number of grid units to move right. | `number` | - |
| flex | Flex fill. | `string` \| `number` | - |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`

<style>
.aheart-grid-demo-cell {
  min-height: 36px;
  padding: 8px 12px;
  color: #fff;
  text-align: center;
  background: var(--aheart-color-primary);
  border-radius: var(--aheart-radius-sm);
}
</style>
