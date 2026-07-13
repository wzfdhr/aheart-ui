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

## contentstyle

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
| title | Configures `title`. | `VNodeChild` \|`() => VNodeChild` | - |
| content | Configures `content`. | `VNodeChild` \|`() => VNodeChild` | - |
| placement | Configures `placement`. | `FloatingPlacement` | `top` |
| autoAdjustOverflow | Configures `autoAdjustOverflow`. | `boolean` | `true` |
| trigger | Configures `trigger`. | `hover` \|`focus` \|`click` \|`contextMenu` \|`FloatingTrigger[]` | `hover` |
| open | Configures `open`. | `boolean` | - |
| defaultOpen | Configures `defaultOpen`. | `boolean` | `false` |
| color | Configures `color`. | `string` | - |
| mouseEnterDelay | Configures `mouseEnterDelay`. | `number` | `0.1` |
| mouseLeaveDelay | Configures `mouseLeaveDelay`. | `number` | `0.1` |
| destroyOnHidden | Configures `destroyOnHidden`. | `boolean` | `false` |
| destroyTooltipOnHide | Configures `destroyTooltipOnHide`. | `boolean` | `false` |
| fresh | Configures `fresh`. | `boolean` | `false` |
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
| classNames | Configures `classNames`. | `PopoverSemanticClassNames \|(info: PopoverSemanticInfo) => PopoverSemanticClassNames` | - |
| styles | Configures `styles`. | `PopoverSemanticStyles \|(info: PopoverSemanticInfo) => PopoverSemanticStyles` | - |

### PopoverSemanticPart

| value | Description |
| --- | --- |
| root | Provides the `root` entry. |
| trigger | Provides the `trigger` entry. |
| popup | Provides the `popup` entry. |
| container | Provides the `container` entry. |
| title | Provides the `title` entry. |
| content | Provides the `content` entry. |
| arrow | Provides the `arrow` entry. |

### PopoverSemanticInfo

| Field | Description |
| --- | --- |
| open | Provides the `open` entry. |
| placement | Provides the `placement` entry. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:open | Emitted when `update:open` occurs. | `(open: boolean) => void` |
| openChange | Emitted when `openChange` occurs. | `(open: boolean) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |
| title | Provides the `title` entry. |
| content | Provides the `content` entry. |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-radius`
- `--aheart-shadow`
