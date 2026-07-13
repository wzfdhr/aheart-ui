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
| vertical | Whether to use a vertical layout. | `boolean` | `false` |
| orientation | Ant-style layout direction; takes precedence over `vertical`. | `horizontal` \| `vertical` | `horizontal` |
| wrap | Wrapping behavior. | `boolean` \| `nowrap` \| `wrap` \| `wrap-reverse` \| `reverse` \| `string` | `false` |
| justify | Main-axis alignment; supports CSS `justify-content` values and local aliases. | `string` | - |
| align | Cross-axis alignment; supports CSS `align-items` values and local aliases. | `string` | - |
| gap | Spacing; `medium` and the local `middle` both map to the md token. | `large` \| `middle` \| `medium` \| `small` \| `number` \| `string` | - |
| flex | CSS `flex` shorthand. | `string` \| `number` | - |
| component | Custom root element. | `string` \| `Component` | `div` |
| className | Compatible class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Flex content. |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
