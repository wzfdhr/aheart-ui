# Spin 加载中 <span class="aheart-status aheart-status--ready">Ready</span>

Spin communicates loading state for standalone areas or nested content.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace>
    <ASpin size="small" />
    <ASpin />
    <ASpin size="large" />
  </ASpace>
</div>

```vue
<template>
  <ASpace>
    <ASpin size="small" />
    <ASpin />
    <ASpin size="large" />
  </ASpace>
</template>
```

## 提示文案

<div class="aheart-demo-panel">
  <ASpin description="Loading" />
</div>

```vue
<template>
  <ASpin description="Loading" />
</template>
```

## 延迟显示

<div class="aheart-demo-panel">
  <ASpin description="Loading" :delay="300" />
</div>

```vue
<template>
  <ASpin description="Loading" :delay="300" />
</template>
```

## 自定义指示符和进度

<div class="aheart-demo-panel">
  <ASpace>
    <ASpin indicator="Loading" description="Custom" />
    <ASpin description="Uploading" :percent="45" />
    <ASpin description="Syncing" percent="auto" />
  </ASpace>
</div>

```vue
<template>
  <ASpace>
    <ASpin indicator="Loading" description="Custom" />
    <ASpin description="Uploading" :percent="45" />
    <ASpin description="Syncing" percent="auto" />
  </ASpace>
</template>
```

## 包裹内容

<div class="aheart-demo-panel">
  <ASpin description="Saving" :spinning="true">
    <div style="padding: 16px; border: 1px solid var(--aheart-color-border); border-radius: var(--aheart-border-radius-md);">
      Content is visible while the loading indicator stays above it.
    </div>
  </ASpin>
</div>

```vue
<template>
  <ASpin description="Saving" :spinning="true">
    <div class="panel-content">
      Content is visible while the loading indicator stays above it.
    </div>
  </ASpin>
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <ASpin
    description="Styled"
    :percent="66"
    wrapper-class-name="demo-spin-wrapper"
    :class-names="{ indicator: 'demo-spin-indicator', description: 'demo-spin-description', percent: 'demo-spin-percent' }"
    :styles="{ description: { color: 'var(--aheart-color-primary)' } }"
  >
    <div style="padding: 16px; border: 1px solid var(--aheart-color-border); border-radius: var(--aheart-border-radius-md);">
      Semantic hooks can style precise Spin parts.
    </div>
  </ASpin>
</div>

```vue
<template>
  <ASpin
    description="Styled"
    :percent="66"
    wrapper-class-name="demo-spin-wrapper"
    :class-names="{ indicator: 'demo-spin-indicator', description: 'demo-spin-description', percent: 'demo-spin-percent' }"
    :styles="{ description: { color: 'var(--aheart-color-primary)' } }"
  >
    <div class="panel-content">
      Semantic hooks can style precise Spin parts.
    </div>
  </ASpin>
</template>
```

## 全屏加载

```vue
<template>
  <ASpin fullscreen description="Loading page" />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| spinning | 是否处于加载中 | `boolean` | `true` |
| size | 加载尺寸 | `large` \| `middle` \| `small` | `middle` |
| description | 自定义描述内容 | `VNodeChild` | - |
| tip | 兼容旧版提示内容，低于 `description` 优先级 | `VNodeChild` | - |
| delay | 延迟显示加载状态的毫秒数 | `number` | - |
| indicator | 自定义指示符 | `VNodeChild \| () => VNodeChild` | - |
| percent | 进度文本 | `number \| 'auto'` | - |
| fullscreen | 是否全屏展示加载态 | `boolean` | `false` |
| wrapperClassName | 包裹内容时的外层类名 | `string` | - |
| className | 根节点类名 | `string` | - |
| rootClassName | 根节点类名 | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化 DOM 类名 | `SpinClassNames` | `{}` |
| styles | 语义化 DOM 样式 | `SpinStyles` | `{}` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 被加载状态包裹的内容 |
| description | 自定义描述内容，优先于 `description` / `tip` 属性 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 外层根节点 |
| section | 包裹内容时的内部定位层 |
| indicator | 加载状态节点 |
| dot | 默认旋转点 |
| description | 描述内容节点 |
| tip | 描述内容节点兼容别名 |
| percent | 进度文本 |
| container | 被包裹内容容器 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-text-secondary`
- `--aheart-color-bg-container`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
