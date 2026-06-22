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
  <ASpin tip="Loading" />
</div>

```vue
<template>
  <ASpin tip="Loading" />
</template>
```

## 包裹内容

<div class="aheart-demo-panel">
  <ASpin tip="Saving" :spinning="true">
    <div style="padding: 16px; border: 1px solid var(--aheart-color-border); border-radius: var(--aheart-border-radius-md);">
      Content is visible while the loading indicator stays above it.
    </div>
  </ASpin>
</div>

```vue
<template>
  <ASpin tip="Saving" :spinning="true">
    <div class="panel-content">
      Content is visible while the loading indicator stays above it.
    </div>
  </ASpin>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| spinning | 是否处于加载中 | `boolean` | `true` |
| size | 加载尺寸 | `large` \| `middle` \| `small` | `middle` |
| tip | 提示文案 | `string` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 被加载状态包裹的内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-text-secondary`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
