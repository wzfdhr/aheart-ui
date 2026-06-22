# Flex 弹性布局 <span class="aheart-status aheart-status--ready">Ready</span>

Flex provides a small layout helper for one-dimensional alignment and spacing.

## 基础用法

<div class="aheart-demo-panel">
  <AFlex gap="middle" align="center">
    <AButton>Left</AButton>
    <AButton type="primary">Right</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex gap="middle" align="center">
    <AButton>Left</AButton>
    <AButton type="primary">Right</AButton>
  </AFlex>
</template>
```

## 两端对齐

<div class="aheart-demo-panel">
  <AFlex justify="between" align="center" gap="small">
    <span>Label</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex justify="between" align="center" gap="small">
    <span>Label</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</template>
```

## 自定义元素与 flex

<div class="aheart-demo-panel">
  <AFlex component="section" orientation="horizontal" wrap="wrap-reverse" justify="space-between" align="flex-start" gap="2rem" flex="1 1 auto">
    <AButton>One</AButton>
    <AButton type="primary">Two</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex
    component="section"
    orientation="horizontal"
    wrap="wrap-reverse"
    justify="space-between"
    align="flex-start"
    gap="2rem"
    flex="1 1 auto"
  >
    <AButton>One</AButton>
    <AButton type="primary">Two</AButton>
  </AFlex>
</template>
```

## 根节点样式

<div class="aheart-demo-panel">
  <AFlex
    class-name="demo-flex-class"
    root-class-name="demo-flex-root"
    :style="{ padding: '8px', border: '1px solid var(--aheart-color-border)' }"
    justify="between"
    align="center"
    gap="medium"
  >
    <span>Styled root</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex
    class-name="demo-flex-class"
    root-class-name="demo-flex-root"
    :style="{ padding: '8px', border: '1px solid var(--aheart-color-border)' }"
    justify="between"
    align="center"
    gap="medium"
  >
    <span>Styled root</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| vertical | 是否垂直布局 | `boolean` | `false` |
| orientation | Ant 风格排列方向，优先于 `vertical` | `horizontal` \| `vertical` | `horizontal` |
| wrap | 换行方式 | `boolean` \| `nowrap` \| `wrap` \| `wrap-reverse` \| `reverse` \| `string` | `false` |
| justify | 主轴对齐，支持 CSS `justify-content` 值和本地别名 | `string` | - |
| align | 交叉轴对齐，支持 CSS `align-items` 值和本地别名 | `string` | - |
| gap | 间距，`medium` 与本地 `middle` 均映射到 md token | `large` \| `middle` \| `medium` \| `small` \| `number` \| `string` | - |
| flex | CSS `flex` 简写 | `string` \| `number` | - |
| component | 自定义根元素 | `string` \| `Component` | `div` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | Flex 内容 |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
