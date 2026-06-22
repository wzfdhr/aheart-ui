# Popover 气泡卡片 <span class="aheart-status aheart-status--ready">Ready</span>

Popover displays richer floating content with an optional title and body.

## 基础用法

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

## 自定义内容

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

## 触发方式

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

## 颜色与箭头

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

## 悬停延迟

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

## 隐藏后销毁

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

## 语义样式

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 卡片标题 | `string` | - |
| content | 卡片内容 | `string` | - |
| placement | 气泡位置 | `FloatingPlacement` | `top` |
| trigger | 触发方式 | `hover` \| `focus` \| `click` \| `contextMenu` \| `FloatingTrigger[]` | `hover` |
| open | 受控显示状态 | `boolean` | - |
| defaultOpen | 默认显示状态 | `boolean` | `false` |
| color | 自定义背景色 | `string` | - |
| mouseEnterDelay | 鼠标移入后延迟显示，单位秒 | `number` | `0.1` |
| mouseLeaveDelay | 鼠标移出后延迟隐藏，单位秒 | `number` | `0.1` |
| destroyOnHidden | 关闭后是否销毁弹层 DOM | `boolean` | `false` |
| fresh | 保持与 Ant API 兼容；Vue 挂载内容会自然响应更新 | `boolean` | `false` |
| arrow | 是否显示箭头，或配置箭头指向触发器中心 | `boolean` \| `{ pointAtCenter?: boolean }` | `true` |
| zIndex | 自定义层级 | `number` | - |
| className | 根元素 class | `string` | - |
| rootClassName | 根元素 class | `string` | - |
| style | 根元素样式 | `StyleValue` | - |
| overlayClassName | 弹层 class，兼容旧 API | `string` | - |
| overlayStyle | 弹层样式，兼容旧 API | `StyleValue` | - |
| overlayInnerStyle | 弹层内部容器样式，兼容旧 API | `StyleValue` | - |
| classNames | 语义 DOM class 映射 | `Partial<Record<PopoverSemanticPart, string>>` | - |
| styles | 语义 DOM style 映射 | `Partial<Record<PopoverSemanticPart, StyleValue>>` | - |

### PopoverSemanticPart

| 值 | 说明 |
| --- | --- |
| root | 根元素 |
| trigger | 触发元素包裹层 |
| popup | 弹层 |
| container | 弹层内部容器 |
| title | 标题 |
| content | 内容 |
| arrow | 箭头 |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 显隐状态变化时触发 | `(open: boolean) => void` |
| openChange | 显隐状态变化时触发 | `(open: boolean) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 触发元素 |
| title | 自定义标题 |
| content | 自定义内容 |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-radius`
- `--aheart-shadow`
