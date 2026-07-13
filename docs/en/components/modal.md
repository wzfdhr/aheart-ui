# Modal <span class="aheart-status aheart-status--ready">Ready</span>

Modal focuses attention in a blocking dialog for decisions, confirmations, and short workflows.

<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const basicOpen = ref(false)
const closeControlsOpen = ref(false)
const renderableOpen = ref(false)
const renderWrapperOpen = ref(false)
const maskConfigOpen = ref(false)
const focusOpen = ref(false)
const footerOpen = ref(false)
const centeredOpen = ref(false)
const responsiveWidthOpen = ref(false)
const loadingOpen = ref(false)
const styledOpen = ref(false)
const customCloseIcon = h('span', { class: 'docs-modal-close-icon' }, 'X')
const renderableTitle = h('span', { class: 'docs-modal-title-node' }, 'Renderable title')
const renderableOkText = h('span', { class: 'docs-modal-ok-node' }, 'Confirm')
const renderableCancelText = h('span', { class: 'docs-modal-cancel-node' }, 'Dismiss')
const renderableFooter = (
  _originNode: VNodeChild,
  { cancelButton, okButton }: { cancelButton: VNodeChild; okButton: VNodeChild }
) => h('div', { class: 'docs-modal-footer-render' }, [
  h('strong', null, 'Review actions'),
  cancelButton,
  okButton
])
const modalRender = (node: VNodeChild) => h('div', { class: 'docs-modal-render-shell' }, [node])
const semanticClassNames = ({ props }: { props: { open?: boolean } }) => ({
  container: props.open ? 'docs-modal-dialog' : '',
  wrapper: 'docs-modal-wrap',
  body: 'docs-modal-body'
})
const semanticStyles = ({ props }: { props: { open?: boolean } }): Record<string, CSSProperties> => ({
  body: {
    padding: props.open ? '24px' : '16px'
  }
})
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <AButton type="primary" @click="basicOpen = true">Open modal</AButton>
  <AModal v-model:open="basicOpen" title="Edit profile">
    Profile settings can be reviewed before saving.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const basicOpen = ref(false)
</script>

<template>
<AButton type="primary" @click="basicOpen = true">Open modal</AButton>
  <AModal v-model:open="basicOpen" title="Edit profile">
    Profile settings can be reviewed before saving.
  </AModal>
</template>
```

## Close Controls

<div class="aheart-demo-panel">
  <AButton @click="closeControlsOpen = true">Custom close</AButton>
  <AModal
    v-model:open="closeControlsOpen"
    title="Custom close"
    :closable="{ closeIcon: customCloseIcon }"
  >
    The close button can render custom content through `closeIcon` or object-form `closable`.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const closeControlsOpen = ref(false)
const customCloseIcon = h('span', { class: 'docs-modal-close-icon' }, 'X')
</script>

<template>
<AButton @click="closeControlsOpen = true">Custom close</AButton>
  <AModal
    v-model:open="closeControlsOpen"
    title="Custom close"
    :closable="{ closeIcon: customCloseIcon }"
  >
    The close button can render custom content through `closeIcon` or object-form `closable`.
  </AModal>
</template>
```

## Renderable Content

<div class="aheart-demo-panel">
  <AButton @click="renderableOpen = true">Renderable modal</AButton>
  <AModal
    v-model:open="renderableOpen"
    :title="renderableTitle"
    :ok-text="renderableOkText"
    :cancel-text="renderableCancelText"
    :footer="renderableFooter"
  >
    Modal title, action labels, and footer can all render custom node content.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const renderableOpen = ref(false)
const renderableTitle = h('span', { class: 'docs-modal-title-node' }, 'Renderable title')
const renderableOkText = h('span', { class: 'docs-modal-ok-node' }, 'Confirm')
const renderableCancelText = h('span', { class: 'docs-modal-cancel-node' }, 'Dismiss')
const renderableFooter = (
  _originNode: VNodeChild,
  { cancelButton, okButton }: { cancelButton: VNodeChild; okButton: VNodeChild }
) => h('div', { class: 'docs-modal-footer-render' }, [
  h('strong', null, 'Review actions'),
  cancelButton,
  okButton
])
</script>

<template>
<AButton @click="renderableOpen = true">Renderable modal</AButton>
  <AModal
    v-model:open="renderableOpen"
    :title="renderableTitle"
    :ok-text="renderableOkText"
    :cancel-text="renderableCancelText"
    :footer="renderableFooter"
  >
    Modal title, action labels, and footer can all render custom node content.
  </AModal>
</template>
```

## Custom Rendering

<div class="aheart-demo-panel">
  <AButton @click="renderWrapperOpen = true">Rendered shell</AButton>
  <AModal
    v-model:open="renderWrapperOpen"
    title="Rendered shell"
    :modal-render="modalRender"
  >
    modalRender can wrap the default dialog node while preserving actions.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const renderWrapperOpen = ref(false)
const modalRender = (node: VNodeChild) => h('div', { class: 'docs-modal-render-shell' }, [node])
</script>

<template>
<AButton @click="renderWrapperOpen = true">Rendered shell</AButton>
  <AModal
    v-model:open="renderWrapperOpen"
    title="Rendered shell"
    :modal-render="modalRender"
  >
    modalRender can wrap the default dialog node while preserving actions.
  </AModal>
</template>
```

## Mask Configuration

<div class="aheart-demo-panel">
  <AButton @click="maskConfigOpen = true">Mask config</AButton>
  <AModal
    v-model:open="maskConfigOpen"
    title="Mask config"
    :mask="{ blur: true, closable: false }"
  >
    The blurred mask stays visible, and mask clicks do not close this modal.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const maskConfigOpen = ref(false)
</script>

<template>
<AButton @click="maskConfigOpen = true">Mask config</AButton>
  <AModal
    v-model:open="maskConfigOpen"
    title="Mask config"
    :mask="{ blur: true, closable: false }"
  >
    The blurred mask stays visible, and mask clicks do not close this modal.
  </AModal>
</template>
```

## Focus Management

<div class="aheart-demo-panel">
  <AButton @click="focusOpen = true">Focus management</AButton>
  <AModal
    v-model:open="focusOpen"
    title="Focus management"
    :focusable="{ trap: true, focusTriggerAfterClose: true }"
  >
    This modal keeps Tab focus inside the dialog and restores focus to the opener after close.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const focusOpen = ref(false)
</script>

<template>
<AButton @click="focusOpen = true">Focus management</AButton>
  <AModal
    v-model:open="focusOpen"
    title="Focus management"
    :focusable="{ trap: true, focusTriggerAfterClose: true }"
  >
    This modal keeps Tab focus inside the dialog and restores focus to the opener after close.
  </AModal>
</template>
```

## Custom Footer

<div class="aheart-demo-panel">
  <AButton @click="footerOpen = true">Custom footer</AButton>
  <AModal v-model:open="footerOpen" title="Publish changes" :footer="false">
    This action publishes the current draft to production.
    <template #footer>
      <AButton @click="footerOpen = false">Keep editing</AButton>
      <AButton type="primary" @click="footerOpen = false">Publish</AButton>
    </template>
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const footerOpen = ref(false)
</script>

<template>
<AButton @click="footerOpen = true">Custom footer</AButton>
  <AModal v-model:open="footerOpen" title="Publish changes" :footer="false">
    This action publishes the current draft to production.
    <template #footer>
      <AButton @click="footerOpen = false">Keep editing</AButton>
      <AButton type="primary" @click="footerOpen = false">Publish</AButton>
    </template>
  </AModal>
</template>
```

## Centering and Width

<div class="aheart-demo-panel">
  <AButton @click="centeredOpen = true">Centered modal</AButton>
  <AModal v-model:open="centeredOpen" title="Invite members" centered :width="480">
    Send invitations after reviewing roles and access.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const centeredOpen = ref(false)
</script>

<template>
<AButton @click="centeredOpen = true">Centered modal</AButton>
  <AModal v-model:open="centeredOpen" title="Invite members" centered :width="480">
    Send invitations after reviewing roles and access.
  </AModal>
</template>
```

## Responsive Width

<div class="aheart-demo-panel">
  <AButton @click="responsiveWidthOpen = true">Responsive width</AButton>
  <AModal
    v-model:open="responsiveWidthOpen"
    title="Responsive modal"
    :width="{ xs: 320, md: 640, xl: '72vw' }"
  >
    The dialog width follows configured breakpoints.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const responsiveWidthOpen = ref(false)
</script>

<template>
<AButton @click="responsiveWidthOpen = true">Responsive width</AButton>
  <AModal
    v-model:open="responsiveWidthOpen"
    title="Responsive modal"
    :width="{ xs: 320, md: 640, xl: '72vw' }"
  >
    The dialog width follows configured breakpoints.
  </AModal>
</template>
```

## Loading and Button Configuration

<div class="aheart-demo-panel">
  <AButton @click="loadingOpen = true">Loading modal</AButton>
  <AModal
    v-model:open="loadingOpen"
    title="Sync workspace"
    loading
    ok-text="Sync"
    cancel-text="Later"
    :ok-button-props="{ danger: true }"
    :cancel-button-props="{ type: 'dashed' }"
  >
    Sync details appear after the request finishes; footer actions return with the content.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const loadingOpen = ref(false)
</script>

<template>
<AButton @click="loadingOpen = true">Loading modal</AButton>
  <AModal
    v-model:open="loadingOpen"
    title="Sync workspace"
    loading
    ok-text="Sync"
    cancel-text="Later"
    :ok-button-props="{ danger: true }"
    :cancel-button-props="{ type: 'dashed' }"
  >
    Sync details appear after the request finishes; footer actions return with the content.
  </AModal>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <AButton @click="styledOpen = true">Styled modal</AButton>
  <AModal
    v-model:open="styledOpen"
    title="Styled modal"
    root-class-name="docs-modal-root"
    class-name="docs-modal-dialog"
    :z-index="1210"
    :root-style="{ color: 'var(--aheart-color-text)' }"
    :style="{ maxWidth: '92vw' }"
    :class-names="semanticClassNames"
    :styles="semanticStyles"
  >
    Semantic class and style hooks make app-specific modal shells easier.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { h, ref, type CSSProperties, type VNodeChild } from 'vue'
const styledOpen = ref(false)
const semanticClassNames = ({ props }: { props: { open?: boolean } }) => ({
  container: props.open ? 'docs-modal-dialog' : '',
  wrapper: 'docs-modal-wrap',
  body: 'docs-modal-body'
})
const semanticStyles = ({ props }: { props: { open?: boolean } }): Record<string, CSSProperties> => ({
  body: {
    padding: props.open ? '24px' : '16px'
  }
})
</script>

<template>
<AButton @click="styledOpen = true">Styled modal</AButton>
  <AModal
    v-model:open="styledOpen"
    title="Styled modal"
    root-class-name="docs-modal-root"
    class-name="docs-modal-dialog"
    :z-index="1210"
    :root-style="{ color: 'var(--aheart-color-text)' }"
    :style="{ maxWidth: '92vw' }"
    :class-names="semanticClassNames"
    :styles="semanticStyles"
  >
    Semantic class and style hooks make app-specific modal shells easier.
  </AModal>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| open | Whether the dialog is visible. | `boolean` | `false` |
| title | Dialog title content. | `VNodeChild` | - |
| width | Dialog width; supports a breakpoint object. | `number` \|`string` \|`ModalResponsiveWidth` | `520` |
| centered | Whether to center the dialog vertically. | `boolean` | `false` |
| closable | Whether to show the top-right close control; the object form configures its icon, disabled state, and close callbacks. | `boolean` \|`ModalClosableConfig` | `true` |
| closeIcon | Custom close icon. Pass `false` or `null` to hide the close control. | `VNodeChild` | `×` |
| mask | Mask configuration. | `boolean` \|`{ enabled?: boolean; blur?: boolean; closable?: boolean }` | `true` |
| maskClosable | Whether clicking the mask closes the dialog. `mask.closable` takes precedence. | `boolean` | `true` |
| keyboard | Whether pressing Escape closes the dialog. | `boolean` | `true` |
| confirmLoading | Whether the OK button displays a loading state. | `boolean` | `false` |
| okText | Content of the OK button. | `VNodeChild` | `OK` |
| cancelText | Content of the Cancel button. | `VNodeChild` | `Cancel` |
| okType | Type of the OK button. | `ButtonType` | `primary` |
| okButtonProps | Props for the OK button. | `Partial<ButtonProps>` | - |
| cancelButtonProps | Props for the Cancel button. | `Partial<ButtonProps>` | - |
| zIndex | Stacking order of the root node. | `number` | `1000` |
| loading | Whether to show a skeleton in the content area and temporarily hide footer actions. | `boolean` | `false` |
| footer | Footer content. `false` or `null` hides the default footer. | `boolean` \|`VNodeChild` \|`ModalFooterRender` | `true` |
| focusable | Focus-management configuration. | `{ trap?: boolean; focusTriggerAfterClose?: boolean }` | - |
| focusTriggerAfterClose | Whether to focus the trigger after closing. Compatibility name; prefer `focusable.focusTriggerAfterClose`. | `boolean` | `true` |
| modalRender | Custom renderer for dialog content. | `(node: VNodeChild) => VNodeChild` | - |
| getContainer | Mount container for the Modal. Pass `false` to render inline. | `HTMLElement` \|`string` \|`() => HTMLElement` \|`false` | `document.body` |
| className | Custom class name for the dialog. | `string` | - |
| rootClassName | Custom class name for the root node. | `string` | - |
| wrapClassName | Custom class name for the dialog wrapper. | `string` | - |
| style | Custom dialog styles. | `CSSProperties` | - |
| rootStyle | Custom root-node styles. | `CSSProperties` | - |
| classNames | Semantic-structure class names. | `Partial<Record<ModalSemanticPart, string>>` \| `(info: ModalSemanticInfo) => Partial<Record<ModalSemanticPart, string>>` | - |
| styles | Semantic-structure styles. | `Partial<Record<ModalSemanticPart, CSSProperties>>` \| `(info: ModalSemanticInfo) => Partial<Record<ModalSemanticPart, CSSProperties>>` | - |
| forceRender | Pre-render the dialog structure even while it is closed. | `boolean` | `false` |
| destroyOnClose | Destroy content after closing; compatibility name. | `boolean` | `false` |
| destroyOnHidden | Destroy content after closing. | `boolean` | `false` |

### ModalMaskConfig

```ts
interface ModalMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}
```

### ModalResponsiveWidth

```ts
type ModalResponsiveWidth = Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number | string>>
```

### ModalClosableConfig

```ts
interface ModalClosableConfig {
  closeIcon?: VNodeChild
  disabled?: boolean
  onClose?: () => void
  afterClose?: () => void
}
```

### ModalFocusableConfig

```ts
interface ModalFocusableConfig {
  trap?: boolean
  focusTriggerAfterClose?: boolean
}
```

### ModalSemanticPart

`root`、`mask`、`wrap`、`wrapper`、`dialog`、`container`、`header`、`title`、`body`、`footer`、`close`

### ModalSemanticInfo

```ts
interface ModalSemanticInfo {
  props: Readonly<Record<string, unknown>>
}
```

### ModalFooterRender

```ts
type ModalFooterRender = (
  originNode: VNodeChild,
  extra: {
    okButton: VNodeChild
    cancelButton: VNodeChild
    OkBtn: () => VNodeChild
    CancelBtn: () => VNodeChild
  }
) => VNodeChild
```

### ModalGetContainer

```ts
type ModalGetContainer = HTMLElement | string | (() => HTMLElement) | false
```

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:open | Fired when visibility changes. | `(open: boolean) => void` |
| ok | Fired when the OK button is clicked. | `() => void` |
| cancel | Fired when the Cancel button is clicked. | `() => void` |
| close | Fired after the close button, mask, Cancel button, or Escape is used. | `() => void` |
| afterOpenChange | Fired after the visibility state has changed. | `(open: boolean) => void` |
| afterClose | Fired after the dialog has fully closed. | `() => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Dialog content. |
| title | Custom title. |
| footer | Custom footer. |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-shadow`
- `--aheart-radius`
