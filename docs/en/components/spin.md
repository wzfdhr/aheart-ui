# Spin <span class="aheart-status aheart-status--ready">Ready</span>

Spin communicates loading state for standalone areas or nested content.



## Basic Usage

<div class="aheart-demo-panel">
  <ASpace>
    <ASpin size="small" />
    <ASpin />
    <ASpin size="large" />
  </ASpace>
</div>

```vue
<template>
<ASpace>
    <ASpin size="small" />
    <ASpin />
    <ASpin size="large" />
  </ASpace>
</template>
```

## Description

<div class="aheart-demo-panel">
  <ASpin description="Loading" />
</div>

```vue
<template>
<ASpin description="Loading" />
</template>
```

## Delayed Display

<div class="aheart-demo-panel">
  <ASpin description="Loading" :delay="300" />
</div>

```vue
<template>
<ASpin description="Loading" :delay="300" />
</template>
```

## Custom Indicator and Progress

<div class="aheart-demo-panel">
  <ASpace>
    <ASpin indicator="Loading" description="Custom" />
    <ASpin description="Uploading" :percent="45" />
    <ASpin description="Syncing" percent="auto" />
  </ASpace>
</div>

```vue
<template>
<ASpace>
    <ASpin indicator="Loading" description="Custom" />
    <ASpin description="Uploading" :percent="45" />
    <ASpin description="Syncing" percent="auto" />
  </ASpace>
</template>
```

## Wrapping Content

<div class="aheart-demo-panel">
  <ASpin description="Saving" :spinning="true">
    <div style="padding: 16px; border: 1px solid var(--aheart-color-border); border-radius: var(--aheart-border-radius-md);">
      Content is visible while the loading indicator stays above it.
    </div>
  </ASpin>
</div>

```vue
<template>
<ASpin description="Saving" :spinning="true">
    <div style="padding: 16px; border: 1px solid var(--aheart-color-border); border-radius: var(--aheart-border-radius-md);">
      Content is visible while the loading indicator stays above it.
    </div>
  </ASpin>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ASpin
    description="Styled"
    :percent="66"
    wrapper-class-name="demo-spin-wrapper"
    :class-names="{ indicator: 'demo-spin-indicator', description: 'demo-spin-description', percent: 'demo-spin-percent' }"
    :styles="{ description: { color: 'var(--aheart-color-primary)' } }"
  >
    <div style="padding: 16px; border: 1px solid var(--aheart-color-border); border-radius: var(--aheart-border-radius-md);">
      Semantic hooks can style precise Spin parts.
    </div>
  </ASpin>
</div>

```vue
<template>
<ASpin
    description="Styled"
    :percent="66"
    wrapper-class-name="demo-spin-wrapper"
    :class-names="{ indicator: 'demo-spin-indicator', description: 'demo-spin-description', percent: 'demo-spin-percent' }"
    :styles="{ description: { color: 'var(--aheart-color-primary)' } }"
  >
    <div style="padding: 16px; border: 1px solid var(--aheart-color-border); border-radius: var(--aheart-border-radius-md);">
      Semantic hooks can style precise Spin parts.
    </div>
  </ASpin>
</template>
```

## Fullscreen Loading

```vue
<template>
  <ASpin fullscreen description="Loading page" />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| spinning | Whether loading is active. | `boolean` | `true` |
| size | Component size. | `large` \| `middle` \| `small` | `middle` |
| description | Custom description content. | `VNodeChild` | - |
| tip | Legacy description content with lower precedence than `description`. | `VNodeChild` | - |
| delay | Delay before showing loading, in milliseconds. | `number` | - |
| indicator | Custom loading indicator. | `VNodeChild \|() => VNodeChild` | - |
| percent | Progress text or percentage. | `number \|'auto'` | - |
| fullscreen | Whether to show loading fullscreen. | `boolean` | `false` |
| wrapperClassName | Class name for the wrapper around content. | `string` | - |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `SpinClassNames` | `{}` |
| styles | Semantic DOM styles, as an object or function. | `SpinStyles` | `{}` |

## Slots

| Name | Description |
| --- | --- |
| default | Content wrapped by the loading state. |
| description | Custom description content; takes precedence over the `description` and `tip` props. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Outer root element. |
| section | Inner positioning layer used when content is wrapped. |
| indicator | Loading indicator element. |
| dot | Default rotating dot. |
| description | Description content. |
| tip | Compatibility alias for the description content. |
| percent | Progress text. |
| container | Wrapped-content container. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-text-secondary`
- `--aheart-color-bg-container`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
