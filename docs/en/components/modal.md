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
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AButton type="primary" @click="open = true">Open modal</AButton>
  <AModal v-model:open="open" title="Edit profile">
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
import { h, ref } from 'vue'

const open = ref(false)
const customCloseIcon = h('span', { class: 'modal-close-icon' }, 'X')
</script>

<template>
  <AModal
    v-model:open="open"
    title="Custom close"
    :closable="{ closeIcon: customCloseIcon }"
  >
    The close button can render custom content.
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
import { h, ref, type VNodeChild } from 'vue'

const open = ref(false)
const title = h('span', { class: 'modal-title-node' }, 'Renderable title')
const okText = h('span', { class: 'modal-ok-node' }, 'Confirm')
const cancelText = h('span', { class: 'modal-cancel-node' }, 'Dismiss')
const footer = (
  _originNode: VNodeChild,
  { cancelButton, okButton }: { cancelButton: VNodeChild; okButton: VNodeChild }
) => h('div', { class: 'modal-footer-render' }, [cancelButton, okButton])
</script>

<template>
  <AModal
    v-model:open="open"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    :footer="footer"
  >
    Modal title, action labels, and footer can render custom node content.
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
import { h, ref, type VNodeChild } from 'vue'

const open = ref(false)
const modalRender = (node: VNodeChild) =>
  h('div', { class: 'modal-render-shell' }, [node])
</script>

<template>
  <AModal v-model:open="open" title="Rendered shell" :modal-render="modalRender">
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
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AModal
    v-model:open="open"
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
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AButton @click="open = true">Focus management</AButton>
  <AModal
    v-model:open="open"
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
<template>
  <AModal v-model:open="open" title="Publish changes" :footer="false">
    This action publishes the current draft to production.
    <template #footer>
      <AButton @click="open = false">Keep editing</AButton>
      <AButton type="primary" @click="open = false">Publish</AButton>
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
<template>
  <AModal v-model:open="open" title="Invite members" centered :width="480">
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
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AButton type="primary" @click="open = true">Responsive width</AButton>
  <AModal v-model:open="open" title="Responsive modal" :width="{ xs: 320, md: 640, xl: '72vw' }">
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
<template>
  <AModal
    v-model:open="open"
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
import { ref, type CSSProperties } from 'vue'

const open = ref(false)
const semanticClassNames = ({ props }: { props: { open?: boolean } }) => ({
  container: props.open ? 'workspace-modal-dialog' : '',
  wrapper: 'workspace-modal-wrap',
  body: 'workspace-modal-body'
})
const semanticStyles = ({ props }: { props: { open?: boolean } }): Record<string, CSSProperties> => ({
  body: {
    padding: props.open ? '24px' : '16px'
  }
})
</script>

<template>
  <AModal
    v-model:open="open"
    title="Styled modal"
    root-class-name="workspace-modal-root"
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
| open | Configures `open`. | `boolean` | `false` |
| title | Configures `title`. | `VNodeChild` | - |
| width | Configures `width`. | `number` \|`string` \|`ModalResponsiveWidth` | `520` |
| centered | Configures `centered`. | `boolean` | `false` |
| closable | Configures `closable`. | `boolean` \|`ModalClosableConfig` | `true` |
| closeIcon | Configures `closeIcon`. | `VNodeChild` | `×` |
| mask | Configures `mask`. | `boolean` \|`{ enabled?: boolean; blur?: boolean; closable?: boolean }` | `true` |
| maskClosable | Configures `maskClosable`. | `boolean` | `true` |
| keyboard | Configures `keyboard`. | `boolean` | `true` |
| confirmLoading | Configures `confirmLoading`. | `boolean` | `false` |
| okText | Configures `okText`. | `VNodeChild` | `OK` |
| cancelText | Configures `cancelText`. | `VNodeChild` | `Cancel` |
| okType | Configures `okType`. | `ButtonType` | `primary` |
| okButtonProps | Configures `okButtonProps`. | `Partial<ButtonProps>` | - |
| cancelButtonProps | Configures `cancelButtonProps`. | `Partial<ButtonProps>` | - |
| zIndex | Configures `zIndex`. | `number` | `1000` |
| loading | Configures `loading`. | `boolean` | `false` |
| footer | Configures `footer`. | `boolean` \|`VNodeChild` \|`ModalFooterRender` | `true` |
| focusable | Configures `focusable`. | `{ trap?: boolean; focusTriggerAfterClose?: boolean }` | - |
| focusTriggerAfterClose | Configures `focusTriggerAfterClose`. | `boolean` | `true` |
| modalRender | Configures `modalRender`. | `(node: VNodeChild) => VNodeChild` | - |
| getContainer | Configures `getContainer`. | `HTMLElement` \|`string` \|`() => HTMLElement` \|`false` | `document.body` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| wrapClassName | Configures `wrapClassName`. | `string` | - |
| style | Configures `style`. | `CSSProperties` | - |
| rootStyle | Configures `rootStyle`. | `CSSProperties` | - |
| classNames | Configures `classNames`. | `Partial<Record<ModalSemanticPart, string>>` \| `(info: ModalSemanticInfo) => Partial<Record<ModalSemanticPart, string>>` | - |
| styles | Configures `styles`. | `Partial<Record<ModalSemanticPart, CSSProperties>>` \| `(info: ModalSemanticInfo) => Partial<Record<ModalSemanticPart, CSSProperties>>` | - |
| forceRender | Configures `forceRender`. | `boolean` | `false` |
| destroyOnClose | Configures `destroyOnClose`. | `boolean` | `false` |
| destroyOnHidden | Configures `destroyOnHidden`. | `boolean` | `false` |

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
| update:open | Emitted when `update:open` occurs. | `(open: boolean) => void` |
| ok | Emitted when `ok` occurs. | `() => void` |
| cancel | Emitted when `cancel` occurs. | `() => void` |
| close | Emitted when `close` occurs. | `() => void` |
| afterOpenChange | Emitted when `afterOpenChange` occurs. | `(open: boolean) => void` |
| afterClose | Emitted when `afterClose` occurs. | `() => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |
| title | Provides the `title` entry. |
| footer | Provides the `footer` entry. |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-shadow`
- `--aheart-radius`
