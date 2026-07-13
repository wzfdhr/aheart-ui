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
  />
</div>

```vue
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
| type | Configures `type`. | `success` \| `info` \| `warning` \| `error` | `info` |
| title | Configures `title`. | `VNodeChild` | - |
| message | Configures `message`. | `VNodeChild` | - |
| description | Configures `description`. | `VNodeChild` | - |
| showIcon | Configures `showIcon`. | `boolean` | `false` |
| closable | Configures `closable`. | `boolean` \|`AlertClosableConfig` | `false` |
| banner | Configures `banner`. | `boolean` | `false` |
| variant | Configures `variant`. | `outlined` \|`filled` | `outlined` |
| action | Configures `action`. | `VNodeChild` | - |
| icon | Configures `icon`. | `VNodeChild` | - |
| closeIcon | Configures `closeIcon`. | `VNodeChild` | - |
| role | Configures `role`. | `string` | `alert` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `AlertClassNames` | - |
| styles | Configures `styles`. | `AlertStyles` | - |

## AlertClosableConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| closeIcon | Configures `closeIcon`. | `VNodeChild` | - |
| ariaLabel | Configures `ariaLabel`. | `string` | `Close` |
| ariaLabelledby | Configures `ariaLabelledby`. | `string` | - |
| ariaDescribedby | Configures `ariaDescribedby`. | `string` | - |
| onClose | Configures `onClose`. | `(event: MouseEvent) => void` | - |
| afterClose | Configures `afterClose`. | `() => void` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| close | Emitted when `close` occurs. | `(event: MouseEvent) => void` |
| afterClose | Emitted when `afterClose` occurs. | `() => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |
| action | Provides the `action` entry. |
| icon | Provides the `icon` entry. |
| closeIcon | Provides the `closeIcon` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| icon | Provides the `icon` entry. |
| section | Provides the `section` entry. |
| content | Provides the `content` entry. |
| title | Provides the `title` entry. |
| description | Provides the `description` entry. |
| actions | Provides the `actions` entry. |
| action | Provides the `action` entry. |
| close | Provides the `close` entry. |

## Theme Tokens

- `--aheart-color-success`
- `--aheart-color-info`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-border`
- `--aheart-border-radius-md`
