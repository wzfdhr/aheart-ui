# Drawer <span class="aheart-status aheart-status--ready">Ready</span>

Drawer presents a contextual panel from an edge of the screen without leaving the current page.

<script setup lang="ts">
import { h, ref, type VNodeChild } from 'vue'
const basicOpen = ref(false)
const leftOpen = ref(false)
const bottomOpen = ref(false)
const loadingOpen = ref(false)
const renderableOpen = ref(false)
const drawerRenderOpen = ref(false)
const closeControlsOpen = ref(false)
const maskConfigOpen = ref(false)
const focusOpen = ref(false)
const styledOpen = ref(false)
const renderableTitle = h('span', { class: 'docs-drawer-renderable-title' }, 'Review profile')
const renderableExtra = h('span', { class: 'docs-drawer-renderable-extra' }, 'Synced')
const renderableFooter = h('div', { class: 'docs-drawer-renderable-footer' }, 'Footer content can come from props.')
const drawerRender = (node: VNodeChild) => h('div', { class: 'docs-drawer-render-shell' }, [node])
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <AButton type="primary" @click="basicOpen = true">Open drawer</AButton>
  <ADrawer v-model:open="basicOpen" title="Account details">
    Review account metadata, ownership, and recent activity.
  </ADrawer>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AButton type="primary" @click="open = true">Open drawer</AButton>
  <ADrawer v-model:open="open" title="Account details">
    Review account metadata, ownership, and recent activity.
  </ADrawer>
</template>
```

## Extra Actions

<div class="aheart-demo-panel">
  <AButton @click="leftOpen = true">Open from left</AButton>
  <ADrawer v-model:open="leftOpen" title="Filters" placement="left" :width="320">
    <template #extra>
      <AButton size="small">Reset</AButton>
    </template>
    Filter fields can stay close to the table they affect.
  </ADrawer>
</div>

```vue
<template>
  <ADrawer v-model:open="open" title="Filters" placement="left" :width="320">
    <template #extra>
      <AButton size="small">Reset</AButton>
    </template>
    Filter fields can stay close to the table they affect.
  </ADrawer>
</template>
```

## Placements

<div class="aheart-demo-panel">
  <AButton @click="bottomOpen = true">Open from bottom</AButton>
  <ADrawer v-model:open="bottomOpen" title="Activity timeline" placement="bottom" height="42vh" footer>
    Recent events and audit notes appear here.
    <template #footer>
      <AButton type="primary" @click="bottomOpen = false">Done</AButton>
    </template>
  </ADrawer>
</div>

```vue
<template>
  <ADrawer v-model:open="open" title="Activity timeline" placement="bottom" height="42vh" footer>
    Recent events and audit notes appear here.
    <template #footer>
      <AButton type="primary" @click="open = false">Done</AButton>
    </template>
  </ADrawer>
</template>
```

## Size and Loading State

<div class="aheart-demo-panel">
  <AButton @click="loadingOpen = true">Large loading drawer</AButton>
  <ADrawer v-model:open="loadingOpen" title="Import history" size="large" loading extra="Preview">
    Loaded drawer content appears after data is ready.
  </ADrawer>
</div>

```vue
<template>
  <ADrawer v-model:open="open" title="Import history" size="large" loading extra="Preview">
    Loaded drawer content appears after data is ready.
  </ADrawer>
</template>
```

`size="default"` uses the standard drawer width or height, while `size="large"` gives workflows more room. A number or CSS length can be passed to `size`; `width` and `height` still override the resolved size for compatibility.

## Renderable Content

<div class="aheart-demo-panel">
  <AButton @click="renderableOpen = true">Renderable drawer</AButton>
  <ADrawer
    v-model:open="renderableOpen"
    :title="renderableTitle"
    :extra="renderableExtra"
    :footer="renderableFooter"
  >
    Title, extra, and footer can come from renderable props or slots.
  </ADrawer>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'

const open = ref(false)
const title = h('span', { class: 'workspace-title' }, 'Review profile')
const extra = h('span', { class: 'workspace-extra' }, 'Synced')
const footer = h('div', { class: 'workspace-footer' }, 'Footer content can come from props.')
</script>

<template>
  <ADrawer v-model:open="open" :title="title" :extra="extra" :footer="footer">
    Title, extra, and footer can come from renderable props or slots.
  </ADrawer>
</template>
```

## Custom Panel Rendering

<div class="aheart-demo-panel">
  <AButton @click="drawerRenderOpen = true">Rendered drawer shell</AButton>
  <ADrawer
    v-model:open="drawerRenderOpen"
    title="Rendered shell"
    :drawer-render="drawerRender"
  >
    drawerRender can wrap the default drawer panel while preserving close and focus behavior.
  </ADrawer>
</div>

```vue
<script setup lang="ts">
import { h, ref, type VNodeChild } from 'vue'

const open = ref(false)
const drawerRender = (node: VNodeChild) =>
  h('div', { class: 'workspace-drawer-shell' }, [node])
</script>

<template>
  <ADrawer v-model:open="open" title="Rendered shell" :drawer-render="drawerRender">
    drawerRender can wrap the default drawer panel while preserving close and focus behavior.
  </ADrawer>
</template>
```

## Close Button

<div class="aheart-demo-panel">
  <AButton @click="closeControlsOpen = true">Custom close control</AButton>
  <ADrawer
    v-model:open="closeControlsOpen"
    title="Close controls"
    :closable="{ closeIcon: 'Close', placement: 'end' }"
  >
    The close button can use custom content and move to the end of the header.
  </ADrawer>
</div>

```vue
<template>
  <ADrawer
    v-model:open="open"
    title="Close controls"
    :closable="{ closeIcon: 'Close', placement: 'end' }"
  >
    The close button can use custom content and move to the end of the header.
  </ADrawer>
</template>
```

## Mask Configuration

<div class="aheart-demo-panel">
  <AButton @click="maskConfigOpen = true">Blurred mask drawer</AButton>
  <ADrawer
    v-model:open="maskConfigOpen"
    title="Mask config"
    :mask="{ blur: true, closable: false }"
  >
    This drawer uses a blurred mask and ignores mask clicks.
  </ADrawer>
</div>

```vue
<template>
  <ADrawer
    v-model:open="open"
    title="Mask config"
    :mask="{ blur: true, closable: false }"
  >
    This drawer uses a blurred mask and ignores mask clicks.
  </ADrawer>
</template>
```

## Focus Management

<div class="aheart-demo-panel">
  <AButton @click="focusOpen = true">Focus management</AButton>
  <ADrawer
    v-model:open="focusOpen"
    title="Focus management"
    :focusable="{ trap: true, focusTriggerAfterClose: true }"
  >
    This drawer keeps Tab focus inside the panel and restores focus to the opener after close.
    <button type="button">Focusable control</button>
  </ADrawer>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AButton @click="open = true">Focus management</AButton>
  <ADrawer
    v-model:open="open"
    title="Focus management"
    :focusable="{ trap: true, focusTriggerAfterClose: true }"
  >
    This drawer keeps Tab focus inside the panel and restores focus to the opener after close.
    <button type="button">Focusable control</button>
  </ADrawer>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <AButton @click="styledOpen = true">Styled drawer</AButton>
  <ADrawer
    v-model:open="styledOpen"
    title="Styled drawer"
    root-class-name="docs-drawer-root"
    class-name="docs-drawer-panel"
    :z-index="1200"
    :root-style="{ color: 'var(--aheart-color-text)' }"
    :style="{ maxWidth: '92vw' }"
    :class-names="{ body: 'docs-drawer-body' }"
    :styles="{ body: { padding: '24px' } }"
  >
    Semantic class and style hooks make app-specific shell styling easier.
  </ADrawer>
</div>

```vue
<template>
  <ADrawer
    v-model:open="open"
    title="Styled drawer"
    root-class-name="workspace-drawer-root"
    class-name="workspace-drawer-panel"
    :z-index="1200"
    :root-style="{ color: 'var(--aheart-color-text)' }"
    :style="{ maxWidth: '92vw' }"
    :class-names="{ body: 'workspace-drawer-body' }"
    :styles="{ body: { padding: '24px' } }"
  >
    Semantic class and style hooks make app-specific shell styling easier.
  </ADrawer>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| open | Whether the drawer is visible. | `boolean` | `false` |
| title | Drawer title content. | `DrawerRenderable` | - |
| extra | Extra content on the right side of the header; use the `extra` slot for complex content. | `DrawerRenderable` | - |
| placement | Edge from which the drawer appears. | `top` \|`right` \|`bottom` \|`left` | `right` |
| size | Preset or custom drawer size. | `default` \|`large` \|`number` \|`string` | `default` |
| width | Width for left- and right-positioned drawers. | `number` \|`string` | `378` |
| height | Height for top- and bottom-positioned drawers. | `number` \|`string` | `378` |
| zIndex | Stacking order of the root node. | `number` | `1000` |
| closable | Whether to show the close control; the object form configures its icon, disabled state, and placement. | `boolean` \|`DrawerClosableConfig` | `true` |
| closeIcon | Custom close icon. Pass `false` or `null` to hide the close control. | `VNodeChild` | `×` |
| mask | Whether to show a mask; the object form configures visibility, blur, and click-to-close behavior. | `boolean` \|`DrawerMaskConfig` | `true` |
| maskClosable | Whether clicking the mask closes the drawer. | `boolean` | `true` |
| keyboard | Whether pressing Escape closes the drawer. | `boolean` | `true` |
| focusable | Focus-management configuration. | `{ trap?: boolean; focusTriggerAfterClose?: boolean }` | - |
| loading | Whether to show a skeleton in the content area. | `boolean` | `false` |
| footer | Footer content. `true` shows only the `footer` slot; `false` or `null` hides the footer. | `boolean` \|`DrawerRenderable` | - |
| getContainer | Mount container for the Drawer. Pass `false` to render inline. | `HTMLElement` \|`string` \|`() => HTMLElement` \|`false` | `document.body` |
| push | Whether opening a nested drawer pushes its parent drawer. | `boolean` \|`DrawerPushConfig` | `{ distance: 180 }` |
| resizable | Whether the drawer can be resized by dragging. | `boolean` \|`DrawerResizableConfig` | `false` |
| maxSize | Maximum width or height when resizing. | `number` | - |
| drawerRender | Custom renderer for the drawer panel. | `(node: VNodeChild) => VNodeChild` | - |
| className | Custom class name for the panel. | `string` | - |
| rootClassName | Custom class name for the root node. | `string` | - |
| style | Custom panel styles. | `CSSProperties` | - |
| rootStyle | Custom root-node styles. | `CSSProperties` | - |
| bodyStyle | Compatibility alias for content styles; prefer `styles.body` in new code. | `CSSProperties` | - |
| headerStyle | Compatibility alias for header styles; prefer `styles.header` in new code. | `CSSProperties` | - |
| footerStyle | Compatibility alias for footer styles; prefer `styles.footer` in new code. | `CSSProperties` | - |
| maskStyle | Compatibility alias for mask styles; prefer `styles.mask` in new code. | `CSSProperties` | - |
| drawerStyle | Compatibility alias for panel styles; prefer `styles.section` in new code. | `CSSProperties` | - |
| contentWrapperStyle | Compatibility alias for the panel wrapper style; currently maps to `styles.section`. | `CSSProperties` | - |
| classNames | Semantic-structure class names, as an object or function. | `Partial<Record<DrawerSemanticPart, string>>` \|`(info: DrawerSemanticInfo) => Partial<Record<DrawerSemanticPart, string>>` | - |
| styles | Semantic-structure styles, as an object or function. | `Partial<Record<DrawerSemanticPart, CSSProperties>>` \|`(info: DrawerSemanticInfo) => Partial<Record<DrawerSemanticPart, CSSProperties>>` | - |
| forceRender | Pre-render the drawer structure even while it is closed. | `boolean` | `false` |
| destroyOnClose | Destroy content after closing; compatibility name. | `boolean` | `false` |
| destroyOnHidden | Destroy content after closing. | `boolean` | `false` |
| destroyInactivePanel | Deprecated compatibility alias for destroying content after close; prefer `destroyOnHidden`. | `boolean` | `false` |

### DrawerSemanticPart

`root`、`mask`、`section`、`header`、`title`、`extra`、`body`、`footer`、`dragger`、`close`

### DrawerSemanticInfo

```ts
interface DrawerSemanticInfo {
  props: Readonly<Record<string, unknown>>
}
```

### DrawerGetContainer

```ts
type DrawerGetContainer = HTMLElement | string | (() => HTMLElement) | false
```

### DrawerPushConfig

```ts
interface DrawerPushConfig {
  distance?: number | string
}
```

### DrawerResizableConfig

```ts
interface DrawerResizableConfig {
  onResizeStart?: () => void
  onResize?: (size: number) => void
  onResizeEnd?: () => void
}
```

### DrawerRenderable

```ts
type DrawerRenderable = VNodeChild
```

### DrawerMaskConfig

```ts
interface DrawerMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}
```

### DrawerFocusableConfig

```ts
interface DrawerFocusableConfig {
  trap?: boolean
  focusTriggerAfterClose?: boolean
}
```

### DrawerClosableConfig

```ts
type DrawerClosePlacement = 'start' | 'end'
type DrawerCloseIcon = VNodeChild

interface DrawerClosableConfig {
  closeIcon?: DrawerCloseIcon
  disabled?: boolean
  placement?: DrawerClosePlacement
}
```

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:open | Fired when visibility changes. | `(open: boolean) => void` |
| close | Fired after the close button, mask, or Escape is used. | `() => void` |
| afterOpenChange | Fired after the visibility state has changed. | `(open: boolean) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Drawer content. |
| title | Custom title. |
| extra | Extra action on the right side of the header. |
| footer | Footer content. |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-shadow`
