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
    <ACol :span="8">col-8</ACol>
    <ACol :span="8">col-8</ACol>
    <ACol :span="8">col-8</ACol>
  </ARow>
</template>
```

## Section Gutter

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
    <ACol :span="12">col-12</ACol>
    <ACol :span="12">col-12</ACol>
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
    <ACol :span="6" :order="2">order-2</ACol>
    <ACol :span="6" :order="1" :offset="2">offset-2</ACol>
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
    <ACol :flex="120">120px</ACol>
    <ACol flex="auto">auto</ACol>
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
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8 }">responsive</ACol>
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8, offset: 4 }">responsive</ACol>
  </ARow>
</template>
```

## API

## Row API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| gutter | Configures `gutter`. | `number` \|`[GridGutter, GridGutter]` \|`GridResponsiveGutter` | `0` |
| justify | Configures `justify`. | `start` \|`end` \|`center` \|`space-around` \|`space-between` \|`space-evenly` | - |
| align | Configures `align`. | `top` \|`middle` \|`bottom` \|`stretch` | - |
| wrap | Configures `wrap`. | `boolean` | `true` |

## Col API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| span | Configures `span`. | `number` | - |
| offset | Configures `offset`. | `number` | - |
| order | Configures `order`. | `number` | - |
| pull | Configures `pull`. | `number` | - |
| push | Configures `push`. | `number` | - |
| flex | Configures `flex`. | `string` \|`number` | - |
| xs | Configures `xs`. | `number` \|`ColSpanConfig` | - |
| sm | Configures `sm`. | `number` \|`ColSpanConfig` | - |
| md | Configures `md`. | `number` \|`ColSpanConfig` | - |
| lg | Configures `lg`. | `number` \|`ColSpanConfig` | - |
| xl | Configures `xl`. | `number` \|`ColSpanConfig` | - |
| xxl | Configures `xxl`. | `number` \|`ColSpanConfig` | - |

### ColSpanConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| span | Configures `span`. | `number` | - |
| offset | Configures `offset`. | `number` | - |
| order | Configures `order`. | `number` | - |
| pull | Configures `pull`. | `number` | - |
| push | Configures `push`. | `number` | - |
| flex | Configures `flex`. | `string` \|`number` | - |

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
