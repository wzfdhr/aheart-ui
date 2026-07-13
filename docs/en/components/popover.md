# Popover <span class="aheart-status aheart-status--ready">Ready</span>

Popover displays richer floating content with an optional title and body.



<script setup lang="ts">
import { h } from 'vue'

const renderablePopoverTitle = () => h('span', { style: { fontWeight: 600 } }, 'Workspace details')
const renderablePopoverContent = h('span', [
  'Owner: ',
  h('strong', 'Design System'),
  ' · Status: active'
])
</script>

## Basic Usage

<div class="aheart-demo-panel">
  <APopover title="Account" content="Owner, plan, and recent activity." trigger="click">
    <AButton>Open popover</AButton>
  </APopover>
</div>

```vue
<template>
  <APopover title="Account" content="Owner, plan, and recent activity." trigger="click">
    <AButton>Open popover</AButton>
  </APopover>
</template>
```

## Renderable Content

<div class="aheart-demo-panel">
  <APopover
    default-open
    trigger="click"
    :title="renderablePopoverTitle"
    :content="renderablePopoverContent"
  >
    <AButton>Workspace</AButton>
  </APopover>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const renderablePopoverTitle = () => h('span', { style: { fontWeight: 600 } }, 'Workspace details')
const renderablePopoverContent = h('span', [
  'Owner: ',
  h('strong', 'Design System'),
  ' · Status: active'
])
</script>

<template>
  <APopover
    trigger="click"
    :title="renderablePopoverTitle"
    :content="renderablePopoverContent"
  >
    <AButton>Workspace</AButton>
  </APopover>
</template>
```

## Custom Content

<div class="aheart-demo-panel">
  <APopover trigger="click" placement="rightTop">
    <AButton>Details</AButton>
    <template #title>Release status</template>
    <template #content>
      <ASpace direction="vertical">
        <span>Build complete</span>
        <AButton size="small" type="primary">View</AButton>
      </ASpace>
    </template>
  </APopover>
</div>

```vue
<template>
  <APopover trigger="click" placement="rightTop">
    <AButton>Details</AButton>
    <template #title>Release status</template>
    <template #content>
      <ASpace direction="vertical">
        <span>Build complete</span>
        <AButton size="small" type="primary">View</AButton>
      </ASpace>
    </template>
  </APopover>
</template>
```

## Trigger

<div class="aheart-demo-panel">
  <ASpace>
    <APopover content="Hover content">
      <AButton>Hover</AButton>
    </APopover>
    <APopover content="Focus content" trigger="focus">
      <AButton>Focus</AButton>
    </APopover>
    <APopover content="Context content" trigger="contextMenu">
      <AButton>Context menu</AButton>
    </APopover>
  </ASpace>
</div>

```vue
<template>
  <APopover content="Context content" trigger="contextMenu">
    <AButton>Context menu</AButton>
  </APopover>
</template>
```

## Color and Arrow

<div class="aheart-demo-panel">
  <APopover
    title="Centered arrow"
    content="The arrow can point at the center of the trigger."
    color="rgb(246, 255, 237)"
    :arrow="{ pointAtCenter: true }"
    trigger="click"
  >
    <AButton>Arrow options</AButton>
  </APopover>
</div>

```vue
<template>
  <APopover
    title="Centered arrow"
    content="The arrow can point at the center of the trigger."
    color="rgb(246, 255, 237)"
    :arrow="{ pointAtCenter: true }"
    trigger="click"
  >
    <AButton>Arrow options</AButton>
  </APopover>
</template>
```

## Hover Delay

<div class="aheart-demo-panel">
  <APopover
    content="This popup waits before opening and closing."
    :mouse-enter-delay="0.2"
    :mouse-leave-delay="0.3"
  >
    <AButton>Delayed hover</AButton>
  </APopover>
</div>

```vue
<template>
  <APopover content="This popup waits before opening and closing." :mouse-enter-delay="0.2" :mouse-leave-delay="0.3">
    <AButton>Delayed hover</AButton>
  </APopover>
</template>
```

## Destroy on Hide

<div class="aheart-demo-panel">
  <ASpace>
    <APopover content="Hidden DOM is preserved after first open." trigger="click">
      <AButton>Preserve</AButton>
    </APopover>
    <APopover content="Hidden DOM is removed." trigger="click" destroy-on-hidden>
      <AButton>Destroy</AButton>
    </APopover>
  </ASpace>
</div>

```vue
<template>
  <APopover content="Hidden DOM is preserved after first open." trigger="click">
    <AButton>Preserve</AButton>
  </APopover>
  <APopover content="Hidden DOM is removed." trigger="click" destroy-on-hidden>
    <AButton>Destroy</AButton>
  </APopover>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <APopover
    default-open
    title="Semantic hooks"
    content="Root, popup, container, title, content, and arrow can be styled directly."
    root-class-name="popover-semantic-demo"
    overlay-class-name="popover-semantic-demo__overlay"
    :overlay-inner-style="{ padding: '4px' }"
    :class-names="{
      popup: 'popover-semantic-demo__popup',
      container: 'popover-semantic-demo__container',
      arrow: 'popover-semantic-demo__arrow'
    }"
    :styles="{
      popup: { borderColor: 'var(--aheart-color-primary)' },
      title: { letterSpacing: '1px' },
      content: { lineHeight: '20px' }
    }"
  >
    <AButton>Styled popover</AButton>
  </APopover>
</div>

```vue
<template>
  <APopover
    default-open
    title="Semantic hooks"
    content="Root, popup, container, title, content, and arrow can be styled directly."
    root-class-name="popover-semantic-demo"
    overlay-class-name="popover-semantic-demo__overlay"
    :overlay-inner-style="{ padding: '4px' }"
    :class-names="{ popup: 'popover-semantic-demo__popup', container: 'popover-semantic-demo__container' }"
    :styles="{ popup: { borderColor: 'var(--aheart-color-primary)' }, title: { letterSpacing: '1px' } }"
  >
    <AButton>Styled popover</AButton>
  </APopover>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Card title. The `title` slot takes precedence. | `VNodeChild` \|`() => VNodeChild` | - |
| content | Card content. The `content` slot takes precedence. | `VNodeChild` \|`() => VNodeChild` | - |
| placement | Popup placement. | `FloatingPlacement` | `top` |
| autoAdjustOverflow | Automatically adjusts placement or edge alignment when the popup overflows the viewport. | `boolean` | `true` |
| trigger | Trigger method. | `hover` \|`focus` \|`click` \|`contextMenu` \|`FloatingTrigger[]` | `hover` |
| open | Controlled visibility state. | `boolean` | - |
| defaultOpen | Initial visibility state. | `boolean` | `false` |
| color | Custom background color. | `string` | - |
| mouseEnterDelay | Delay before showing after pointer entry, in seconds. | `number` | `0.1` |
| mouseLeaveDelay | Delay before hiding after pointer exit, in seconds. | `number` | `0.1` |
| destroyOnHidden | Whether to destroy popup DOM after it closes. | `boolean` | `false` |
| destroyTooltipOnHide | Legacy alias for `destroyOnHidden`. | `boolean` | `false` |
| fresh | Ant API compatibility flag; mounted Vue content naturally responds to updates. | `boolean` | `false` |
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
| classNames | Semantic DOM class names, as an object or function. | `PopoverSemanticClassNames \|(info: PopoverSemanticInfo) => PopoverSemanticClassNames` | - |
| styles | Semantic DOM styles, as an object or function. | `PopoverSemanticStyles \|(info: PopoverSemanticInfo) => PopoverSemanticStyles` | - |

### PopoverSemanticPart

| value | Description |
| --- | --- |
| root | The `root` semantic DOM element. |
| trigger | The `trigger` semantic DOM element. |
| popup | The `popup` semantic DOM element. |
| container | The `container` semantic DOM element. |
| title | The `title` semantic DOM element. |
| content | The `content` semantic DOM element. |
| arrow | The `arrow` semantic DOM element. |

### PopoverSemanticInfo

| Field | Description |
| --- | --- |
| open | The `open` semantic DOM element. |
| placement | The `placement` semantic DOM element. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:open | Fired when visibility changes. | `(open: boolean) => void` |
| openChange | Fired when visibility changes. | `(open: boolean) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Trigger element. |
| title | Custom title. |
| content | Custom content. |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-radius`
- `--aheart-shadow`
