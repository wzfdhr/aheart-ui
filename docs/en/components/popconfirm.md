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
  <APopconfirm title="Delete item?" description="This action cannot be undone." @confirm="remove">
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
    <template #description>Only the OK action is shown.</template>
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
    @popup-click="handlePopupClick"
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

## contentstyle

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
      okButton: 'popconfirm-semantic-demo__ok'
    }"
    :styles="{
      popup: { borderColor: 'var(--aheart-color-primary)' },
      container: { maxWidth: '280px' },
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
| title | Configures `title`. | `VNodeChild` \|`() => VNodeChild` | - |
| description | Configures `description`. | `VNodeChild` \|`() => VNodeChild` | - |
| icon | Configures `icon`. | `VNodeChild` | `!` |
| placement | Configures `placement`. | `FloatingPlacement` | `top` |
| autoAdjustOverflow | Configures `autoAdjustOverflow`. | `boolean` | `true` |
| trigger | Configures `trigger`. | `hover` \|`focus` \|`click` \|`contextMenu` \|`FloatingTrigger[]` | `click` |
| open | Configures `open`. | `boolean` | - |
| defaultOpen | Configures `defaultOpen`. | `boolean` | `false` |
| destroyOnHidden | Configures `destroyOnHidden`. | `boolean` | `false` |
| destroyTooltipOnHide | Configures `destroyTooltipOnHide`. | `boolean` | `false` |
| fresh | Configures `fresh`. | `boolean` | `false` |
| okText | Configures `okText`. | `string` | `OK` |
| cancelText | Configures `cancelText`. | `string` | `Cancel` |
| okType | Configures `okType`. | `ButtonType` | `primary` |
| okButtonProps | Configures `okButtonProps`. | `Partial<ButtonProps>` | - |
| cancelButtonProps | Configures `cancelButtonProps`. | `Partial<ButtonProps>` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |
| showCancel | Configures `showCancel`. | `boolean` | `true` |
| color | Configures `color`. | `string` | - |
| mouseEnterDelay | Configures `mouseEnterDelay`. | `number` | `0.1` |
| mouseLeaveDelay | Configures `mouseLeaveDelay`. | `number` | `0.1` |
| align | Configures `align`. | `{ offset?: [number, number] }` | - |
| arrow | Configures `arrow`. | `boolean` \|`{ pointAtCenter?: boolean }` | `true` |
| zIndex | Configures `zIndex`. | `number` | - |
| getPopupContainer | Configures `getPopupContainer`. | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| overlayClassName | Configures `overlayClassName`. | `string` | - |
| overlayStyle | Configures `overlayStyle`. | `StyleValue` | - |
| overlayInnerStyle | Configures `overlayInnerStyle`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `PopconfirmSemanticClassNames \|(info: PopconfirmSemanticInfo) => PopconfirmSemanticClassNames` | - |
| styles | Configures `styles`. | `PopconfirmSemanticStyles \|(info: PopconfirmSemanticInfo) => PopconfirmSemanticStyles` | - |

### PopconfirmSemanticPart

| value | Description |
| --- | --- |
| root | Provides the `root` entry. |
| trigger | Provides the `trigger` entry. |
| popup | Provides the `popup` entry. |
| container | Provides the `container` entry. |
| arrow | Provides the `arrow` entry. |
| message | Provides the `message` entry. |
| icon | Provides the `icon` entry. |
| text | Provides the `text` entry. |
| title | Provides the `title` entry. |
| description | Provides the `description` entry. |
| actions | Provides the `actions` entry. |
| cancelButton | Provides the `cancelButton` entry. |
| okButton | Provides the `okButton` entry. |

### PopconfirmSemanticInfo

| Field | Description |
| --- | --- |
| open | Provides the `open` entry. |
| placement | Provides the `placement` entry. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:open | Emitted when `update:open` occurs. | `(open: boolean) => void` |
| openChange | Emitted when `openChange` occurs. | `(open: boolean) => void` |
| confirm | Emitted when `confirm` occurs. | `() => void` |
| cancel | Emitted when `cancel` occurs. | `() => void` |
| popupClick | Emitted when `popupClick` occurs. | `(event: MouseEvent) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |
| title | Provides the `title` entry. |
| description | Provides the `description` entry. |
| icon | Provides the `icon` entry. |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-warning`
- `--aheart-spacing-sm`
- `--aheart-radius`
- `--aheart-shadow`
