# Popconfirm <span class="aheart-status aheart-status--ready">Ready</span>

Popconfirm asks for confirmation near the triggering action before continuing.



<script setup lang="ts">
import { h } from 'vue'

const renderablePopconfirmTitle = () => h('span', { style: { fontWeight: 600 } }, 'Release candidate?')
const renderablePopconfirmDescription = h('span', [
  'This will publish ',
  h('strong', 'v2.4.0'),
  ' to production.'
])
const renderablePopconfirmIcon = h('span', { style: { color: 'var(--aheart-color-warning)' } }, '!')
</script>

## Basic Usage

<div class="aheart-demo-panel">
  <APopconfirm title="Delete item?" description="This action cannot be undone.">
    <AButton type="danger">Delete</AButton>
  </APopconfirm>
</div>

```vue
<template>
<APopconfirm title="Delete item?" description="This action cannot be undone.">
    <AButton type="danger">Delete</AButton>
  </APopconfirm>
</template>
```

## Custom Button Text

<div class="aheart-demo-panel">
  <APopconfirm
    title="Publish changes?"
    description="Customers will see this version immediately."
    ok-text="Publish"
    cancel-text="Review"
    placement="bottomRight"
  >
    <AButton type="primary">Publish</AButton>
  </APopconfirm>
</div>

```vue
<template>
<APopconfirm
    title="Publish changes?"
    description="Customers will see this version immediately."
    ok-text="Publish"
    cancel-text="Review"
    placement="bottomRight"
  >
    <AButton type="primary">Publish</AButton>
  </APopconfirm>
</template>
```

## Renderable Content

<div class="aheart-demo-panel">
  <APopconfirm
    default-open
    :title="renderablePopconfirmTitle"
    :description="renderablePopconfirmDescription"
    :icon="renderablePopconfirmIcon"
    ok-text="Release"
  >
    <AButton type="primary">Release</AButton>
  </APopconfirm>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const renderablePopconfirmTitle = () => h('span', { style: { fontWeight: 600 } }, 'Release candidate?')
const renderablePopconfirmDescription = h('span', [
  'This will publish ',
  h('strong', 'v2.4.0'),
  ' to production.'
])
const renderablePopconfirmIcon = h('span', { style: { color: 'var(--aheart-color-warning)' } }, '!')
</script>

<template>
<APopconfirm
    default-open
    :title="renderablePopconfirmTitle"
    :description="renderablePopconfirmDescription"
    :icon="renderablePopconfirmIcon"
    ok-text="Release"
  >
    <AButton type="primary">Release</AButton>
  </APopconfirm>
</template>
```

## Custom Content

<div class="aheart-demo-panel">
  <APopconfirm :show-cancel="false" ok-text="Got it">
    <AButton>Notice</AButton>
    <template #icon>i</template>
    <template #title>Heads up</template>
    <template #description>Only the OK action is shown in this compact confirmation.</template>
  </APopconfirm>
</div>

```vue
<template>
<APopconfirm :show-cancel="false" ok-text="Got it">
    <AButton>Notice</AButton>
    <template #icon>i</template>
    <template #title>Heads up</template>
    <template #description>Only the OK action is shown in this compact confirmation.</template>
  </APopconfirm>
</template>
```

## Icon and Color

<div class="aheart-demo-panel">
  <APopconfirm
    title="Archive item?"
    description="You can restore it from the archive later."
    icon="?"
    color="rgb(255, 251, 230)"
    ok-text="Archive"
  >
    <AButton>Archive</AButton>
  </APopconfirm>
</div>

```vue
<template>
<APopconfirm
    title="Archive item?"
    description="You can restore it from the archive later."
    icon="?"
    color="rgb(255, 251, 230)"
    ok-text="Archive"
  >
    <AButton>Archive</AButton>
  </APopconfirm>
</template>
```

## Button Properties

<div class="aheart-demo-panel">
  <APopconfirm
    title="Deploy now?"
    description="This starts a production deployment."
    ok-text="Deploy"
    cancel-text="Hold"
    :ok-button-props="{ danger: true, ghost: true }"
    :cancel-button-props="{ disabled: false }"
  >
    <AButton type="primary">Deploy</AButton>
  </APopconfirm>
</div>

```vue
<template>
<APopconfirm
    title="Deploy now?"
    description="This starts a production deployment."
    ok-text="Deploy"
    cancel-text="Hold"
    :ok-button-props="{ danger: true, ghost: true }"
    :cancel-button-props="{ disabled: false }"
  >
    <AButton type="primary">Deploy</AButton>
  </APopconfirm>
</template>
```

## Popup Click

<div class="aheart-demo-panel">
  <APopconfirm
    title="Open details?"
    description="Clicking inside the popup can be observed without closing it."
    @popup-click="() => undefined"
  >
    <AButton>Observe popup</AButton>
  </APopconfirm>
</div>

```vue
<template>
<APopconfirm
    title="Open details?"
    description="Clicking inside the popup can be observed without closing it."
    @popup-click="() => undefined"
  >
    <AButton>Observe popup</AButton>
  </APopconfirm>
</template>
```

## Hover Delay and Arrow

<div class="aheart-demo-panel">
  <APopconfirm
    trigger="hover"
    title="Delayed confirm"
    description="Hover timing and centered arrow follow the shared floating API."
    :mouse-enter-delay="0.4"
    :mouse-leave-delay="0.2"
    :arrow="{ pointAtCenter: true }"
  >
    <AButton>Hover with delay</AButton>
  </APopconfirm>
</div>

```vue
<template>
<APopconfirm
    trigger="hover"
    title="Delayed confirm"
    description="Hover timing and centered arrow follow the shared floating API."
    :mouse-enter-delay="0.4"
    :mouse-leave-delay="0.2"
    :arrow="{ pointAtCenter: true }"
  >
    <AButton>Hover with delay</AButton>
  </APopconfirm>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <APopconfirm
    default-open
    title="Semantic hooks"
    description="Popup, container, text, and action parts can be styled directly."
    root-class-name="popconfirm-semantic-demo"
    overlay-class-name="popconfirm-semantic-demo__overlay"
    :overlay-style="{ minWidth: '260px' }"
    :overlay-inner-style="{ padding: '2px' }"
    :class-names="{
      popup: 'popconfirm-semantic-demo__popup',
      container: 'popconfirm-semantic-demo__container',
      icon: 'popconfirm-semantic-demo__icon',
      okButton: 'popconfirm-semantic-demo__ok'
    }"
    :styles="{
      root: { maxWidth: '360px' },
      popup: { borderColor: 'var(--aheart-color-primary)' },
      container: { maxWidth: '280px' },
      icon: { backgroundColor: 'var(--aheart-color-primary)' },
      okButton: { marginLeft: '8px' }
    }"
  >
    <AButton>Styled popup</AButton>
  </APopconfirm>
</div>

```vue
<template>
<APopconfirm
    default-open
    title="Semantic hooks"
    description="Popup, container, text, and action parts can be styled directly."
    root-class-name="popconfirm-semantic-demo"
    overlay-class-name="popconfirm-semantic-demo__overlay"
    :overlay-style="{ minWidth: '260px' }"
    :overlay-inner-style="{ padding: '2px' }"
    :class-names="{
      popup: 'popconfirm-semantic-demo__popup',
      container: 'popconfirm-semantic-demo__container',
      icon: 'popconfirm-semantic-demo__icon',
      okButton: 'popconfirm-semantic-demo__ok'
    }"
    :styles="{
      root: { maxWidth: '360px' },
      popup: { borderColor: 'var(--aheart-color-primary)' },
      container: { maxWidth: '280px' },
      icon: { backgroundColor: 'var(--aheart-color-primary)' },
      okButton: { marginLeft: '8px' }
    }"
  >
    <AButton>Styled popup</AButton>
  </APopconfirm>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Confirmation title. The `title` slot takes precedence. | `VNodeChild` \|`() => VNodeChild` | - |
| description | Supporting text. The `description` slot takes precedence. | `VNodeChild` \|`() => VNodeChild` | - |
| icon | Prompt icon. The `icon` slot takes precedence; pass `false` or `null` to hide it. | `VNodeChild` | `!` |
| placement | Popup placement. | `FloatingPlacement` | `top` |
| autoAdjustOverflow | Automatically adjusts placement or edge alignment when the popup overflows the viewport. | `boolean` | `true` |
| trigger | Trigger method. | `hover` \|`focus` \|`click` \|`contextMenu` \|`FloatingTrigger[]` | `click` |
| open | Controlled visibility state. | `boolean` | - |
| defaultOpen | Initial visibility state. | `boolean` | `false` |
| destroyOnHidden | Whether to destroy popup DOM after it closes. | `boolean` | `false` |
| destroyTooltipOnHide | Legacy alias for `destroyOnHidden`. | `boolean` | `false` |
| fresh | Ant Design compatibility flag for content refresh; Vue reactive content updates by default. | `boolean` | `false` |
| okText | OK button text. | `string` | `OK` |
| cancelText | Cancel button text. | `string` | `Cancel` |
| okType | OK button type. | `ButtonType` | `primary` |
| okButtonProps | Props for the OK button. | `Partial<ButtonProps>` | - |
| cancelButtonProps | Props for the Cancel button. | `Partial<ButtonProps>` | - |
| disabled | Whether interaction is disabled. | `boolean` | `false` |
| showCancel | Whether to show the Cancel button. | `boolean` | `true` |
| color | Custom color. | `string` | - |
| mouseEnterDelay | Delay before opening on hover, in seconds. | `number` | `0.1` |
| mouseLeaveDelay | Delay before closing on hover, in seconds. | `number` | `0.1` |
| align | Alignment. | `{ offset?: [number, number] }` | - |
| arrow | Whether to show an arrow, or configure it to point at the center. | `boolean` \|`{ pointAtCenter?: boolean }` | `true` |
| zIndex | Custom stacking order. | `number` | - |
| getPopupContainer | Container in which to mount the popup. | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| overlayClassName | Compatibility class name for the popup. | `string` | - |
| overlayStyle | Compatibility styles for the popup. | `StyleValue` | - |
| overlayInnerStyle | Compatibility styles for the popup inner container. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `PopconfirmSemanticClassNames \|(info: PopconfirmSemanticInfo) => PopconfirmSemanticClassNames` | - |
| styles | Semantic DOM styles, as an object or function. | `PopconfirmSemanticStyles \|(info: PopconfirmSemanticInfo) => PopconfirmSemanticStyles` | - |

### PopconfirmSemanticPart

| value | Description |
| --- | --- |
| root | Root element. |
| trigger | Trigger-element wrapper. |
| popup | Confirmation popup. |
| container | Inner popup content container. |
| arrow | Popup arrow. |
| message | Icon-and-text area. |
| icon | Prompt icon. |
| text | Title-and-description container. |
| title | Confirmation title. |
| description | Supporting description. |
| actions | Action-button area. |
| cancelButton | Cancel button. |
| okButton | Confirm button. |

### PopconfirmSemanticInfo

| Field | Description |
| --- | --- |
| open | Whether the popup is currently visible. |
| placement | Effective placement; may differ from the requested placement when `autoAdjustOverflow` is enabled. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:open | Fired when visibility changes. | `(open: boolean) => void` |
| openChange | Fired when visibility changes. | `(open: boolean) => void` |
| confirm | Fired when the confirmation button is clicked. | `() => void` |
| cancel | Fired when the cancel button is clicked. | `() => void` |
| popupClick | Fired when the popup is clicked. | `(event: MouseEvent) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Trigger element. |
| title | Custom title. |
| description | Custom supporting text. |
| icon | Custom prompt icon. |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-warning`
- `--aheart-spacing-sm`
- `--aheart-radius`
- `--aheart-shadow`
