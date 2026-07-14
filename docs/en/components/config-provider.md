# ConfigProvider <span class="aheart-status aheart-status--ready">Ready</span>

ConfigProvider provides shared configuration for Aheart UI components, including global size, disabled state, locale text, and local theme token overrides.



## Basic Usage

<div class="aheart-demo-panel">
  <AConfigProvider size="large">
    <div class="aheart-demo-row">
      <AButton>Default</AButton>
      <AButton type="primary">Primary</AButton>
    </div>
  </AConfigProvider>
</div>

```vue
<template>
<AConfigProvider size="large">
    <div class="aheart-demo-row">
      <AButton>Default</AButton>
      <AButton type="primary">Primary</AButton>
    </div>
  </AConfigProvider>
</template>
```

## Disabled State

<div class="aheart-demo-panel">
  <AConfigProvider disabled>
    <div class="aheart-demo-row">
      <AButton>Disabled</AButton>
      <AButton type="primary">Disabled Primary</AButton>
    </div>
  </AConfigProvider>
</div>

```vue
<template>
<AConfigProvider disabled>
    <div class="aheart-demo-row">
      <AButton>Disabled</AButton>
      <AButton type="primary">Disabled Primary</AButton>
    </div>
  </AConfigProvider>
</template>
```

## Theme Tokens

<div class="aheart-demo-panel">
  <AConfigProvider :theme="{ primaryColor: '#0958d9', borderRadius: '4px' }">
    <AButton type="primary">Custom Theme</AButton>
  </AConfigProvider>
</div>

```vue
<template>
<AConfigProvider :theme="{ primaryColor: '#0958d9', borderRadius: '4px' }">
    <AButton type="primary">Custom Theme</AButton>
  </AConfigProvider>
</template>
```

## Locale

Built-in copy defaults to Simplified Chinese. Import `enUS` from the package root to switch a subtree to English. Nested providers merge locale namespaces, so a local key can override one label without discarding its parent values.

```vue
<script setup lang="ts">
import { enUS } from 'aheart-ui'
</script>

<template>
  <AConfigProvider :locale="enUS">
    <APagination :total="42" show-total />
    <AModal open title="Delete item">This dialog uses English actions.</AModal>
  </AConfigProvider>

  <AConfigProvider :locale="enUS">
    <AConfigProvider :locale="{ modal: { okText: 'Proceed' } }">
      <AModal open title="Nested override" />
    </AConfigProvider>
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| size | Global component size. | `large` \| `middle` \| `small` | `middle` |
| disabled | Global disabled state. | `boolean` | `false` |
| locale | Built-in component copy in the `empty`, `pagination`, `modal`, and `table` namespaces. | `AheartLocale` | `zhCN` |
| theme | Local theme-token overrides. | `AheartTheme` | `{}` |

## Slots

| Name | Description |
| --- | --- |
| default | Component content that receives the configuration. |

## Theme Token Fields

`theme` currently supports:

- `primaryColor`
- `primaryHoverColor`
- `successColor`
- `warningColor`
- `dangerColor`
- `infoColor`
- `textColor`
- `textSecondaryColor`
- `borderColor`
- `fillColor`
- `backgroundColor`
- `borderRadius`
- `fontSize`
