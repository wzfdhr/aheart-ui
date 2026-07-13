# Flex <span class="aheart-status aheart-status--ready">Ready</span>

Flex provides a small layout helper for one-dimensional alignment and spacing.



## Basic Usage

<div class="aheart-demo-panel">
  <AFlex gap="middle" align="center">
    <AButton>Left</AButton>
    <AButton type="primary">Right</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex gap="middle" align="center">
    <AButton>Left</AButton>
    <AButton type="primary">Right</AButton>
  </AFlex>
</template>
```

## Space Between

<div class="aheart-demo-panel">
  <AFlex justify="between" align="center" gap="small">
    <span>Label</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex justify="between" align="center" gap="small">
    <span>Label</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</template>
```

## Custom Element and Flex

<div class="aheart-demo-panel">
  <AFlex component="section" orientation="horizontal" wrap="wrap-reverse" justify="space-between" align="flex-start" gap="2rem" flex="1 1 auto">
    <AButton>One</AButton>
    <AButton type="primary">Two</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex
    component="section"
    orientation="horizontal"
    wrap="wrap-reverse"
    justify="space-between"
    align="flex-start"
    gap="2rem"
    flex="1 1 auto"
  >
    <AButton>One</AButton>
    <AButton type="primary">Two</AButton>
  </AFlex>
</template>
```

## Root Styling

<div class="aheart-demo-panel">
  <AFlex
    class-name="demo-flex-class"
    root-class-name="demo-flex-root"
    :style="{ padding: '8px', border: '1px solid var(--aheart-color-border)' }"
    justify="between"
    align="center"
    gap="medium"
  >
    <span>Styled root</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex
    class-name="demo-flex-class"
    root-class-name="demo-flex-root"
    :style="{ padding: '8px', border: '1px solid var(--aheart-color-border)' }"
    justify="between"
    align="center"
    gap="medium"
  >
    <span>Styled root</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| vertical | Configures `vertical`. | `boolean` | `false` |
| orientation | Configures `orientation`. | `horizontal` \|`vertical` | `horizontal` |
| wrap | Configures `wrap`. | `boolean` \|`nowrap` \|`wrap` \|`wrap-reverse` \|`reverse` \|`string` | `false` |
| justify | Configures `justify`. | `string` | - |
| align | Configures `align`. | `string` | - |
| gap | Configures `gap`. | `large` \|`middle` \|`medium` \|`small` \|`number` \|`string` | - |
| flex | Configures `flex`. | `string` \|`number` | - |
| component | Configures `component`. | `string` \| `Component` | `div` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
