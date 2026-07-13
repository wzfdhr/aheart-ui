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
<span>Solid</span>
  <ADivider />
  <span>Dotted</span>
  <ADivider variant="dotted" size="large" />
  <span>Dashed</span>
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
    :style="{ marginTop: '8px' }"
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
| type | Divider orientation. | `horizontal` \| `vertical` | `horizontal` |
| vertical | Shortcut for a vertical divider. | `boolean` | `false` |
| orientation | Text position; retained as a compatibility alias. | `left` \| `center` \| `right` | `center` |
| titlePlacement | Ant-style text position; takes precedence over `orientation`. | `left` \| `center` \| `right` \| `start` \| `end` | - |
| orientationMargin | Distance between the title and edge; supports the legacy form. | `number` \| `string` | - |
| variant | Line style. | `solid` \| `dashed` \| `dotted` | `solid` |
| size | Line thickness. | `small` \| `middle` \| `large` | `middle` |
| dashed | Whether to use a dashed line; equivalent to `variant="dashed"`. | `boolean` | `false` |
| plain | Whether title text uses plain styling. | `boolean` | `false` |
| className | Class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |
| classNames | Classes for semantic parts. | `Partial<Record<'root' \| 'line' \| 'text', string>>` | - |
| styles | Styles for semantic parts. | `Partial<Record<'root' \| 'line' \| 'text', StyleValue>>` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Content rendered within a horizontal divider. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Root divider container. |
| line | Divider line; both sides receive the style when a title is present. |
| text | Title-text container; rendered only for a horizontal divider with default-slot content. |

## Theme Tokens

- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
