# Alert <span class="aheart-status aheart-status--ready">Ready</span>

Alert displays contextual information with optional icons, descriptions, and close controls.

<script setup lang="ts">
const handleClose = () => undefined
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AAlert type="success" message="Saved successfully" show-icon />
    <AAlert type="info" message="New version is available" show-icon />
    <AAlert type="warning" message="Storage is almost full" show-icon />
    <AAlert type="error" message="Sync failed" show-icon />
  </ASpace>
</div>

```vue
<template>
<ASpace direction="vertical" style="width: 100%">
    <AAlert type="success" message="Saved successfully" show-icon />
    <AAlert type="info" message="New version is available" show-icon />
    <AAlert type="warning" message="Storage is almost full" show-icon />
    <AAlert type="error" message="Sync failed" show-icon />
  </ASpace>
</template>
```

## With Description

<div class="aheart-demo-panel">
  <AAlert
    type="warning"
    message="Review required"
    description="This change affects billing settings and should be reviewed before publishing."
    show-icon
    closable
    @close="handleClose"
  />
</div>

```vue
<script setup lang="ts">
const handleClose = () => undefined
</script>

<template>
<AAlert
    type="warning"
    message="Review required"
    description="This change affects billing settings and should be reviewed before publishing."
    show-icon
    closable
    @close="handleClose"
  />
</template>
```

## Custom Description

<div class="aheart-demo-panel">
  <AAlert type="info" message="Maintenance window">
    Scheduled maintenance starts at 22:00 and should finish within 30 minutes.
  </AAlert>
</div>

```vue
<template>
<AAlert type="info" message="Maintenance window">
    Scheduled maintenance starts at 22:00 and should finish within 30 minutes.
  </AAlert>
</template>
```

## Banner

<div class="aheart-demo-panel">
  <AAlert banner title="Scheduled maintenance starts at 22:00" />
</div>

```vue
<template>
<AAlert banner title="Scheduled maintenance starts at 22:00" />
</template>
```

## Style Variants

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AAlert type="info" title="Outlined alert" variant="outlined" show-icon />
    <AAlert type="success" title="Filled alert" variant="filled" show-icon />
  </ASpace>
</div>

```vue
<template>
<ASpace direction="vertical" style="width: 100%">
    <AAlert type="info" title="Outlined alert" variant="outlined" show-icon />
    <AAlert type="success" title="Filled alert" variant="filled" show-icon />
  </ASpace>
</template>
```

## Actions

<div class="aheart-demo-panel">
  <AAlert type="warning" title="Update available" show-icon action="Restart now" />
</div>

```vue
<template>
<AAlert type="warning" title="Update available" show-icon action="Restart now" />
</template>
```

## Custom Icon

<div class="aheart-demo-panel">
  <AAlert
    type="info"
    title="Custom controls"
    description="Use icon and closeIcon for compact inline customization."
    show-icon
    icon="?"
    closable
    close-icon="dismiss"
  />
</div>

```vue
<template>
<AAlert
    type="info"
    title="Custom controls"
    description="Use icon and closeIcon for compact inline customization."
    show-icon
    icon="?"
    closable
    close-icon="dismiss"
  />
</template>
```

## Close Configuration

<div class="aheart-demo-panel">
  <AAlert
    type="info"
    message="Closable configuration"
    description="Use object closable to configure close icon and ARIA labels."
    :closable="{ closeIcon: 'Dismiss', ariaLabel: 'Dismiss alert', ariaDescribedby: 'alert-description' }"
  />
</div>

```vue
<template>
<AAlert
    type="info"
    message="Closable configuration"
    description="Use object closable to configure close icon and ARIA labels."
    :closable="{ closeIcon: 'Dismiss', ariaLabel: 'Dismiss alert', ariaDescribedby: 'alert-description' }"
  />
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <AAlert
    title="Semantic alert"
    description="Style individual Alert parts without depending on internal selectors."
    show-icon
    action="Details"
    :class-names="{ title: 'demo-alert-title', section: 'demo-alert-section', actions: 'demo-alert-actions' }"
    :styles="{ root: { marginBlockStart: '8px' }, actions: { marginInlineStart: '16px' } }"
  />
</div>

```vue
<template>
<AAlert
    title="Semantic alert"
    description="Style individual Alert parts without depending on internal selectors."
    show-icon
    action="Details"
    :class-names="{ title: 'demo-alert-title', section: 'demo-alert-section', actions: 'demo-alert-actions' }"
    :styles="{ root: { marginBlockStart: '8px' }, actions: { marginInlineStart: '16px' } }"
  />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| type | Alert severity. | `success` \| `info` \| `warning` \| `error` | `info` |
| title | Content displayed as the alert heading; takes precedence over `message`. | `VNodeChild` | - |
| message | Primary alert heading content. | `VNodeChild` | - |
| description | Supporting description. | `VNodeChild` | - |
| showIcon | Whether to show the severity icon. | `boolean` | `false` |
| closable | Whether to show a close button; accepts an object to configure it. | `boolean` \| `AlertClosableConfig` | `false` |
| banner | Whether to display as a top banner; shows the warning icon by default. | `boolean` | `false` |
| variant | Visual variant. | `outlined` \| `filled` | `outlined` |
| action | Content for the action area on the right. | `VNodeChild` | - |
| icon | Custom icon content. | `VNodeChild` | - |
| closeIcon | Custom close-button content. | `VNodeChild` | - |
| role | ARIA role for the root element. | `string` | `alert` |
| className | Compatible class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |
| classNames | Classes for semantic parts. | `AlertClassNames` | - |
| styles | Styles for semantic parts. | `AlertStyles` | - |

## AlertClosableConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| closeIcon | Close-button content; takes precedence over the `closeIcon` prop. | `VNodeChild` | - |
| ariaLabel | `aria-label` for the close button. | `string` | `Close` |
| ariaLabelledby | `aria-labelledby` for the close button. | `string` | - |
| ariaDescribedby | `aria-describedby` for the close button. | `string` | - |
| onClose | Callback after the close button is clicked. | `(event: MouseEvent) => void` | - |
| afterClose | Callback after the alert is hidden. | `() => void` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| close | Emitted when the close button is clicked. | `(event: MouseEvent) => void` |
| afterClose | Emitted after the alert is hidden. | `() => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Custom description content. |
| action | Custom action area on the right. |
| icon | Custom icon area. |
| closeIcon | Custom close area. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Root container. |
| icon | Icon area. |
| section | Content wrapper; Ant semantic alias. |
| content | Content wrapper; compatibility alias. |
| title | Title area. |
| description | Description area. |
| actions | Action area; Ant semantic alias. |
| action | Action area; compatibility alias. |
| close | Close button. |

## Theme Tokens

- `--aheart-color-success`
- `--aheart-color-info`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-border`
- `--aheart-border-radius-md`
