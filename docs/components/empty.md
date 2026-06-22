# Empty 空状态 <span class="aheart-status aheart-status--ready">Ready</span>

Empty presents an intentional empty state with optional custom image and action content.

## 基础用法

<div class="aheart-demo-panel">
  <AEmpty />
</div>

```vue
<template>
  <AEmpty />
</template>
```

## 自定义描述

<div class="aheart-demo-panel">
  <AEmpty description="No projects yet">
    <AButton type="primary">Create project</AButton>
  </AEmpty>
</div>

```vue
<template>
  <AEmpty description="No projects yet">
    <AButton type="primary">Create project</AButton>
  </AEmpty>
</template>
```

## 国际化文案

<div class="aheart-demo-panel">
  <AConfigProvider :locale="{ empty: { description: '暂无内容' } }">
    <AEmpty />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider :locale="{ empty: { description: '暂无内容' } }">
    <AEmpty />
  </AConfigProvider>
</template>
```

## 自定义图片

<div class="aheart-demo-panel">
  <AEmpty description="Nothing matched your filters">
    <template #image>
      <span style="font-size: 40px; line-height: 1;">⌕</span>
    </template>
    <AButton>Reset filters</AButton>
  </AEmpty>
</div>

```vue
<template>
  <AEmpty description="Nothing matched your filters">
    <template #image>
      <span class="empty-search">⌕</span>
    </template>
    <AButton>Reset filters</AButton>
  </AEmpty>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| description | 空状态描述文案 | `string` | ConfigProvider locale |

## Slots

| 名称 | 说明 |
| --- | --- |
| image | 自定义图片区域 |
| default | 底部操作区域 |

## Theme Tokens

- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
