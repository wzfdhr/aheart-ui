# Divider <span class="aheart-status aheart-status--ready">Ready</span>

Divider separates content groups with horizontal or vertical rules, title placement, and line variants.



## Basic Usage

<div class="aheart-demo-panel">
  <span>Text</span>
  <ADivider />
  <span>More text</span>
</div>

```vue
<template>
  <span>Text</span>
  <ADivider />
  <span>More text</span>
</template>
```

## With Text

<div class="aheart-demo-panel">
  <ADivider title-placement="start" orientation-margin="24px">Section</ADivider>
</div>

```vue
<template>
  <ADivider title-placement="start" orientation-margin="24px">Section</ADivider>
</template>
```

## Style Variants

<div class="aheart-demo-panel">
  <span>Solid</span>
  <ADivider />
  <span>Dotted</span>
  <ADivider variant="dotted" size="large" />
  <span>Dashed</span>
  <ADivider variant="dashed" />
</div>

```vue
<template>
  <ADivider />
  <ADivider variant="dotted" size="large" />
  <ADivider variant="dashed" />
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ADivider
    title-placement="start"
    orientation-margin="32px"
    class-name="demo-divider"
    root-class-name="demo-divider-root"
    :style="{ marginTop: '8px' }"
    :class-names="{ root: 'demo-divider-semantic-root', line: 'demo-divider-line', text: 'demo-divider-text' }"
    :styles="{ line: { borderColor: '#1677ff' }, text: { fontWeight: 600 } }"
  >
    Semantic
  </ADivider>
</div>

```vue
<template>
  <ADivider
    title-placement="start"
    orientation-margin="32px"
    class-name="demo-divider"
    root-class-name="demo-divider-root"
    :class-names="{ root: 'demo-divider-semantic-root', line: 'demo-divider-line', text: 'demo-divider-text' }"
    :styles="{ line: { borderColor: '#1677ff' }, text: { fontWeight: 600 } }"
  >
    Semantic
  </ADivider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| type | Configures `type`. | `horizontal` \|`vertical` | `horizontal` |
| vertical | Configures `vertical`. | `boolean` | `false` |
| orientation | Configures `orientation`. | `left` \|`center` \|`right` | `center` |
| titlePlacement | Configures `titlePlacement`. | `left` \|`center` \|`right` \|`start` \|`end` | - |
| orientationMargin | Configures `orientationMargin`. | `number` \|`string` | - |
| variant | Configures `variant`. | `solid` \|`dashed` \|`dotted` | `solid` |
| size | Configures `size`. | `small` \|`middle` \|`large` | `middle` |
| dashed | Configures `dashed`. | `boolean` | `false` |
| plain | Configures `plain`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'line' \| 'text', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'line' \| 'text', StyleValue>>` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| line | Provides the `line` entry. |
| text | Provides the `text` entry. |

## Theme Tokens

- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
