# Tooltip <span class="aheart-status aheart-status--ready">Ready</span>

Tooltip displays compact explanatory text for controls and dense interface elements.



<script setup lang="ts">
import { h } from 'vue'

const renderableTooltipTitle = () => h('span', [
  'Latency: ',
  h('strong', '42ms')
])
</script>

## Basic Usage

<div class="aheart-demo-panel">
  <ATooltip title="Helpful text">
    <AButton>Hover me</AButton>
  </ATooltip>
</div>

```vue
<template>
<ATooltip title="Helpful text">
    <AButton>Hover me</AButton>
  </ATooltip>
</template>
```

## Renderable Content

<div class="aheart-demo-panel">
  <ATooltip default-open :title="renderableTooltipTitle">
    <AButton>Latency</AButton>
  </ATooltip>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const renderableTooltipTitle = () => h('span', [
  'Latency: ',
  h('strong', '42ms')
])
</script>

<template>
<ATooltip default-open :title="renderableTooltipTitle">
    <AButton>Latency</AButton>
  </ATooltip>
</template>
```

## Click Trigger

<div class="aheart-demo-panel">
  <ATooltip title="Click trigger" trigger="click" placement="bottom">
    <AButton>Click me</AButton>
  </ATooltip>
</div>

```vue
<template>
<ATooltip title="Click trigger" trigger="click" placement="bottom">
    <AButton>Click me</AButton>
  </ATooltip>
</template>
```

## Color and Placement

<div class="aheart-demo-panel">
  <ASpace>
    <ATooltip title="Top left" placement="topLeft" color="#111827">
      <AButton>topLeft</AButton>
    </ATooltip>
    <ATooltip title="Bottom right" placement="bottomRight">
      <AButton>bottomRight</AButton>
    </ATooltip>
  </ASpace>
</div>

```vue
<template>
<ASpace>
    <ATooltip title="Top left" placement="topLeft" color="#111827">
      <AButton>topLeft</AButton>
    </ATooltip>
    <ATooltip title="Bottom right" placement="bottomRight">
      <AButton>bottomRight</AButton>
    </ATooltip>
  </ASpace>
</template>
```

## Arrow

<div class="aheart-demo-panel">
  <ASpace>
    <ATooltip title="Hide arrow" :arrow="false">
      <AButton>No arrow</AButton>
    </ATooltip>
    <ATooltip title="Point arrow at center" :arrow="{ pointAtCenter: true }">
      <AButton>Centered arrow</AButton>
    </ATooltip>
  </ASpace>
</div>

```vue
<template>
<ASpace>
    <ATooltip title="Hide arrow" :arrow="false">
      <AButton>No arrow</AButton>
    </ATooltip>
    <ATooltip title="Point arrow at center" :arrow="{ pointAtCenter: true }">
      <AButton>Centered arrow</AButton>
    </ATooltip>
  </ASpace>
</template>
```

## Hover Delay

<div class="aheart-demo-panel">
  <ATooltip title="Opens after 0.4 seconds and closes after 0.2 seconds" :mouse-enter-delay="0.4" :mouse-leave-delay="0.2">
    <AButton>Hover with delay</AButton>
  </ATooltip>
</div>

```vue
<template>
<ATooltip title="Opens after 0.4 seconds and closes after 0.2 seconds" :mouse-enter-delay="0.4" :mouse-leave-delay="0.2">
    <AButton>Hover with delay</AButton>
  </ATooltip>
</template>
```

## Destroy on Hide

<div class="aheart-demo-panel">
  <ASpace>
    <ATooltip title="Keep DOM after closing" trigger="click">
      <AButton>Keep</AButton>
    </ATooltip>
    <ATooltip title="Destroy DOM after closing" trigger="click" destroy-on-hidden>
      <AButton>Destroy</AButton>
    </ATooltip>
  </ASpace>
</div>

```vue
<template>
<ASpace>
    <ATooltip title="Keep DOM after closing" trigger="click">
      <AButton>Keep</AButton>
    </ATooltip>
    <ATooltip title="Destroy DOM after closing" trigger="click" destroy-on-hidden>
      <AButton>Destroy</AButton>
    </ATooltip>
  </ASpace>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ATooltip
    title="Customize structure through semantic hooks"
    class-name="demo-tooltip-class"
    root-class-name="demo-tooltip-root"
    overlay-class-name="demo-tooltip-popup"
    :style="{ color: 'var(--aheart-color-primary)' }"
    :overlay-style="{ minWidth: '180px' }"
    :overlay-inner-style="{ padding: '10px 12px' }"
    :class-names="{ trigger: 'demo-tooltip-trigger', content: 'demo-tooltip-content', arrow: 'demo-tooltip-arrow' }"
    :styles="{ content: { fontWeight: 600 }, arrow: { backgroundColor: '#111827' } }"
  >
    <AButton>Semantic hooks</AButton>
  </ATooltip>
</div>

```vue
<template>
<ATooltip
    title="Customize structure through semantic hooks"
    class-name="demo-tooltip-class"
    root-class-name="demo-tooltip-root"
    overlay-class-name="demo-tooltip-popup"
    :style="{ color: 'var(--aheart-color-primary)' }"
    :overlay-style="{ minWidth: '180px' }"
    :overlay-inner-style="{ padding: '10px 12px' }"
    :class-names="{ trigger: 'demo-tooltip-trigger', content: 'demo-tooltip-content', arrow: 'demo-tooltip-arrow' }"
    :styles="{ content: { fontWeight: 600 }, arrow: { backgroundColor: '#111827' } }"
  >
    <AButton>Semantic hooks</AButton>
  </ATooltip>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Tooltip content. The `title` slot takes precedence; an empty string, `null`, or `false` prevents the tooltip from rendering. | `VNodeChild` \|`() => VNodeChild` | - |
| placement | Popup placement. | `FloatingPlacement` | `top` |
| align | Popup alignment configuration; currently supports `align.offset`. | `{ offset?: [number, number] }` | - |
| autoAdjustOverflow | Automatically adjusts placement or edge alignment when the popup overflows the viewport. | `boolean` | `true` |
| trigger | Trigger method. | `hover` \|`focus` \|`click` \|`contextMenu` \|`FloatingTrigger[]` | `hover` |
| open | Controlled visibility state. | `boolean` | - |
| defaultOpen | Initial visibility state. | `boolean` | `false` |
| color | Custom background color. | `string` | - |
| arrow | Whether to show an arrow, or configure it to point at the center. | `boolean \|{ pointAtCenter?: boolean }` | `true` |
| zIndex | Custom stacking order. | `number` | - |
| getPopupContainer | Container in which to mount the popup. | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| mouseEnterDelay | Delay before opening on hover, in seconds. | `number` | `0.1` |
| mouseLeaveDelay | Delay before closing on hover, in seconds. | `number` | `0.1` |
| destroyOnHidden | Whether to destroy popup DOM after it closes. | `boolean` | `false` |
| destroyTooltipOnHide | Legacy alias for `destroyOnHidden`. | `boolean` | `false` |
| fresh | Compatibility API retained for Ant Design; mounted Vue content stays reactive. | `boolean` | `false` |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| overlayClassName | Compatibility class name for the popup. | `string` | - |
| overlayStyle | Compatibility styles for the popup. | `StyleValue` | - |
| overlayInnerStyle | Compatibility styles for the popup inner container. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `TooltipSemanticClassNames \|(info: TooltipSemanticInfo) => TooltipSemanticClassNames` | - |
| styles | Semantic DOM styles, as an object or function. | `TooltipSemanticStyles \|(info: TooltipSemanticInfo) => TooltipSemanticStyles` | - |

### FloatingPlacement

`top` \| `left` \| `right` \| `bottom` \| `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` \| `leftTop` \| `leftBottom` \| `rightTop` \| `rightBottom`

### TooltipSemanticPart

| Name | Description |
| --- | --- |
| root | Root wrapper. |
| trigger | Trigger area. |
| popup | Tooltip popup. |
| container | Inner popup container. |
| content | Tooltip content. |
| arrow | Popup arrow. |

### TooltipSemanticInfo

| Field | Description |
| --- | --- |
| open | Whether the popup is currently visible. |
| placement | Effective placement; may differ from the requested placement when `autoAdjustOverflow` is enabled. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:open | Fired when visibility changes. | `(open: boolean) => void` |
| openChange | Fired when visibility changes. | `(open: boolean) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Trigger element. |
| title | Custom tooltip content. |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-font-size-sm`
- `--aheart-spacing-sm`
- `--aheart-radius-sm`
- `--aheart-shadow`
