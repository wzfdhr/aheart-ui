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
  dialog: props.open ? 'docs-modal-dialog' : '',
  body: 'docs-modal-body'
})
const semanticStyles = ({ props }: { props: { open?: boolean } }): Record<string, CSSProperties> => ({
  body: {
    padding: props.open ? '24px' : '16px'
  }
})
</script>

# Modal 对话框 <span class="aheart-status aheart-status--ready">Ready</span>

Modal focuses attention in a blocking dialog for decisions, confirmations, and short workflows.

## 基础用法

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

## 关闭控件

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

## 可渲染内容

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

## 自定义渲染

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

## 遮罩配置

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

## 焦点管理

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

## 自定义页脚

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

## 居中与宽度

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

## 加载与按钮配置

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
    Sync details appear after the request finishes.
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
    Sync details appear after the request finishes.
  </AModal>
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <AButton @click="styledOpen = true">Styled modal</AButton>
  <AModal
    v-model:open="styledOpen"
    title="Styled modal"
    root-class-name="docs-modal-root"
    wrap-class-name="docs-modal-wrap"
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
  dialog: props.open ? 'workspace-modal-dialog' : '',
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
    wrap-class-name="workspace-modal-wrap"
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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示对话框 | `boolean` | `false` |
| title | 标题内容 | `VNodeChild` | - |
| width | 对话框宽度 | `number` \| `string` | `520` |
| centered | 是否垂直居中 | `boolean` | `false` |
| closable | 是否显示右上角关闭按钮，可配置关闭图标或禁用关闭按钮 | `boolean` \| `{ closeIcon?: VNodeChild; disabled?: boolean }` | `true` |
| closeIcon | 自定义关闭图标，传入 `false` 或 `null` 时隐藏关闭按钮 | `VNodeChild` | `×` |
| mask | 遮罩配置 | `boolean` \| `{ enabled?: boolean; blur?: boolean; closable?: boolean }` | `true` |
| maskClosable | 点击遮罩是否关闭；优先使用 `mask.closable` | `boolean` | `true` |
| keyboard | 按下 Escape 是否关闭 | `boolean` | `true` |
| confirmLoading | OK 按钮是否显示加载态 | `boolean` | `false` |
| okText | OK 按钮文本 | `VNodeChild` | `OK` |
| cancelText | Cancel 按钮文本 | `VNodeChild` | `Cancel` |
| okType | OK 按钮类型 | `ButtonType` | `primary` |
| okButtonProps | OK 按钮属性 | `Partial<ButtonProps>` | - |
| cancelButtonProps | Cancel 按钮属性 | `Partial<ButtonProps>` | - |
| zIndex | 根节点层级 | `number` | `1000` |
| loading | 是否在内容区显示骨架屏 | `boolean` | `false` |
| footer | 页脚内容，`false` 或 `null` 时隐藏默认页脚 | `boolean` \| `VNodeChild` \| `ModalFooterRender` | `true` |
| focusable | 焦点管理配置 | `{ trap?: boolean; focusTriggerAfterClose?: boolean }` | - |
| focusTriggerAfterClose | 关闭后是否聚焦触发元素；兼容旧命名，优先使用 `focusable.focusTriggerAfterClose` | `boolean` | `true` |
| modalRender | 自定义渲染对话框内容 | `(node: VNodeChild) => VNodeChild` | - |
| className | 对话框自定义类名 | `string` | - |
| rootClassName | 根节点自定义类名 | `string` | - |
| wrapClassName | 对话框外层容器自定义类名 | `string` | - |
| style | 对话框自定义样式 | `CSSProperties` | - |
| rootStyle | 根节点自定义样式 | `CSSProperties` | - |
| classNames | 语义化结构类名 | `Partial<Record<ModalSemanticPart, string>>` \| `(info: ModalSemanticInfo) => Partial<Record<ModalSemanticPart, string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<ModalSemanticPart, CSSProperties>>` \| `(info: ModalSemanticInfo) => Partial<Record<ModalSemanticPart, CSSProperties>>` | - |
| forceRender | 关闭时也预渲染对话框结构 | `boolean` | `false` |
| destroyOnClose | 关闭后销毁内容；兼容旧命名 | `boolean` | `false` |
| destroyOnHidden | 关闭后销毁内容 | `boolean` | `false` |

### ModalMaskConfig

```ts
interface ModalMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
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

`root`、`mask`、`wrap`、`dialog`、`header`、`title`、`body`、`footer`、`close`

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

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 显隐状态变化时触发 | `(open: boolean) => void` |
| ok | 点击 OK 按钮时触发 | `() => void` |
| cancel | 点击 Cancel 按钮时触发 | `() => void` |
| close | 点击关闭按钮、遮罩、Cancel 或 Escape 时触发 | `() => void` |
| afterOpenChange | 显隐状态变化后触发 | `(open: boolean) => void` |
| afterClose | 对话框完全关闭后触发 | `() => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 对话框内容 |
| title | 自定义标题 |
| footer | 自定义页脚 |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-shadow`
- `--aheart-radius`
