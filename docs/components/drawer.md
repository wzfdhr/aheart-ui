<script setup lang="ts">
import { h, ref } from 'vue'

const basicOpen = ref(false)
const leftOpen = ref(false)
const bottomOpen = ref(false)
const loadingOpen = ref(false)
const renderableOpen = ref(false)
const closeControlsOpen = ref(false)
const maskConfigOpen = ref(false)
const focusOpen = ref(false)
const styledOpen = ref(false)
const renderableTitle = h('span', { class: 'docs-drawer-renderable-title' }, 'Review profile')
const renderableExtra = h('span', { class: 'docs-drawer-renderable-extra' }, 'Synced')
const renderableFooter = h('div', { class: 'docs-drawer-renderable-footer' }, 'Footer content can come from props.')
</script>

# Drawer 抽屉 <span class="aheart-status aheart-status--ready">Ready</span>

Drawer presents a contextual panel from an edge of the screen without leaving the current page.

## 基础用法

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

## 额外操作

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

## 不同位置

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

## 尺寸与加载状态

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

## 可渲染内容

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

## 关闭按钮

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

## 遮罩配置

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

## 焦点管理

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

## 语义化样式

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示抽屉 | `boolean` | `false` |
| title | 标题内容 | `DrawerRenderable` | - |
| extra | 标题栏右侧额外内容；复杂内容也可使用 `extra` slot | `DrawerRenderable` | - |
| placement | 抽屉出现位置 | `top` \| `right` \| `bottom` \| `left` | `right` |
| size | 抽屉预设尺寸或自定义尺寸 | `default` \| `large` \| `number` \| `string` | `default` |
| width | 左右方向抽屉宽度 | `number` \| `string` | `378` |
| height | 上下方向抽屉高度 | `number` \| `string` | `378` |
| zIndex | 根节点层级 | `number` | `1000` |
| closable | 是否显示关闭按钮；对象形式可配置图标、禁用状态和位置 | `boolean` \| `DrawerClosableConfig` | `true` |
| closeIcon | 自定义关闭图标；传入 `false` 或 `null` 隐藏关闭按钮 | `VNodeChild` | `×` |
| mask | 是否显示遮罩；对象形式可配置显示、模糊和点击关闭 | `boolean` \| `DrawerMaskConfig` | `true` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| keyboard | 按下 Escape 是否关闭 | `boolean` | `true` |
| focusable | 焦点管理配置 | `{ trap?: boolean; focusTriggerAfterClose?: boolean }` | - |
| loading | 是否在内容区显示骨架屏 | `boolean` | `false` |
| footer | 页脚内容；`true` 可只显示 footer slot，`false` 或 `null` 隐藏页脚 | `boolean` \| `DrawerRenderable` | - |
| getContainer | 指定 Drawer 挂载容器；传入 `false` 时保持内联渲染 | `HTMLElement` \| `string` \| `() => HTMLElement` \| `false` | `document.body` |
| className | 面板自定义类名 | `string` | - |
| rootClassName | 根节点自定义类名 | `string` | - |
| style | 面板自定义样式 | `CSSProperties` | - |
| rootStyle | 根节点自定义样式 | `CSSProperties` | - |
| classNames | 语义化结构类名 | `Partial<Record<DrawerSemanticPart, string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<DrawerSemanticPart, CSSProperties>>` | - |
| forceRender | 关闭时也预渲染抽屉结构 | `boolean` | `false` |
| destroyOnClose | 关闭后销毁内容；兼容旧命名 | `boolean` | `false` |
| destroyOnHidden | 关闭后销毁内容 | `boolean` | `false` |

### DrawerSemanticPart

`root`、`mask`、`section`、`header`、`title`、`extra`、`body`、`footer`、`close`

### DrawerGetContainer

```ts
type DrawerGetContainer = HTMLElement | string | (() => HTMLElement) | false
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

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 显隐状态变化时触发 | `(open: boolean) => void` |
| close | 点击关闭按钮、遮罩或 Escape 时触发 | `() => void` |
| afterOpenChange | 显隐状态变化后触发 | `(open: boolean) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 抽屉内容 |
| title | 自定义标题 |
| extra | 标题栏右侧额外操作 |
| footer | 页脚内容 |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-shadow`
