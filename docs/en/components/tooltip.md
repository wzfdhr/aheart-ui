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
  <ATooltip :title="renderableTooltipTitle">
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

## content and placement

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
  <ATooltip title="Top left" placement="topLeft" color="#111827">
    <AButton>topLeft</AButton>
  </ATooltip>
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
  <ATooltip title="Hide arrow" :arrow="false">
    <AButton>No arrow</AButton>
  </ATooltip>
  <ATooltip title="Point arrow at center" :arrow="{ pointAtCenter: true }">
    <AButton>Centered arrow</AButton>
  </ATooltip>
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
  <ATooltip title="Keep DOM after closing" trigger="click">
    <AButton>Keep</AButton>
  </ATooltip>
  <ATooltip title="Destroy DOM after closing" trigger="click" destroy-on-hidden>
    <AButton>Destroy</AButton>
  </ATooltip>
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
| title | Configures `title`. | `VNodeChild` \|`() => VNodeChild` | - |
| placement | Configures `placement`. | `FloatingPlacement` | `top` |
| align | Configures `align`. | `{ offset?: [number, number] }` | - |
| autoAdjustOverflow | Configures `autoAdjustOverflow`. | `boolean` | `true` |
| trigger | Configures `trigger`. | `hover` \|`focus` \|`click` \|`contextMenu` \|`FloatingTrigger[]` | `hover` |
| open | Configures `open`. | `boolean` | - |
| defaultOpen | Configures `defaultOpen`. | `boolean` | `false` |
| color | Configures `color`. | `string` | - |
| arrow | Configures `arrow`. | `boolean \|{ pointAtCenter?: boolean }` | `true` |
| zIndex | Configures `zIndex`. | `number` | - |
| getPopupContainer | Configures `getPopupContainer`. | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| mouseEnterDelay | Configures `mouseEnterDelay`. | `number` | `0.1` |
| mouseLeaveDelay | Configures `mouseLeaveDelay`. | `number` | `0.1` |
| destroyOnHidden | Configures `destroyOnHidden`. | `boolean` | `false` |
| destroyTooltipOnHide | Configures `destroyTooltipOnHide`. | `boolean` | `false` |
| fresh | Configures `fresh`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| overlayClassName | Configures `overlayClassName`. | `string` | - |
| overlayStyle | Configures `overlayStyle`. | `StyleValue` | - |
| overlayInnerStyle | Configures `overlayInnerStyle`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `TooltipSemanticClassNames \|(info: TooltipSemanticInfo) => TooltipSemanticClassNames` | - |
| styles | Configures `styles`. | `TooltipSemanticStyles \|(info: TooltipSemanticInfo) => TooltipSemanticStyles` | - |

### FloatingPlacement

`top` \| `left` \| `right` \| `bottom` \| `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` \| `leftTop` \| `leftBottom` \| `rightTop` \| `rightBottom`

### TooltipSemanticPart

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| trigger | Provides the `trigger` entry. |
| popup | Provides the `popup` entry. |
| container | Provides the `container` entry. |
| content | Provides the `content` entry. |
| arrow | Provides the `arrow` entry. |

### TooltipSemanticInfo

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

## Theme Tokens

- `--aheart-color-text`
- `--aheart-font-size-sm`
- `--aheart-spacing-sm`
- `--aheart-radius-sm`
- `--aheart-shadow`
