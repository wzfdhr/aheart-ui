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

## content

<div class="aheart-demo-panel">
  <ASpin description="Loading" />
</div>

```vue
<template>
  <ASpin description="Loading" />
</template>
```

## contentdisplay

<div class="aheart-demo-panel">
  <ASpin description="Loading" :delay="300" />
</div>

```vue
<template>
  <ASpin description="Loading" :delay="300" />
</template>
```

## customcontentandcontent

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

## content

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
    <div class="panel-content">
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
    <div class="panel-content">
      Semantic hooks can style precise Spin parts.
    </div>
  </ASpin>
</template>
```

## contentloading

```vue
<template>
  <ASpin fullscreen description="Loading page" />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| spinning | Configures `spinning`. | `boolean` | `true` |
| size | Configures `size`. | `large` \| `middle` \| `small` | `middle` |
| description | Configures `description`. | `VNodeChild` | - |
| tip | Configures `tip`. | `VNodeChild` | - |
| delay | Configures `delay`. | `number` | - |
| indicator | Configures `indicator`. | `VNodeChild \|() => VNodeChild` | - |
| percent | Configures `percent`. | `number \|'auto'` | - |
| fullscreen | Configures `fullscreen`. | `boolean` | `false` |
| wrapperClassName | Configures `wrapperClassName`. | `string` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `SpinClassNames` | `{}` |
| styles | Configures `styles`. | `SpinStyles` | `{}` |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |
| description | Provides the `description` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| section | Provides the `section` entry. |
| indicator | Provides the `indicator` entry. |
| dot | Provides the `dot` entry. |
| description | Provides the `description` entry. |
| tip | Provides the `tip` entry. |
| percent | Provides the `percent` entry. |
| container | Provides the `container` entry. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-text-secondary`
- `--aheart-color-bg-container`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
