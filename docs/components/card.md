# Card 卡片 <span class="aheart-status aheart-status--ready">Ready</span>

Card groups related content in a bordered container with optional header, cover, actions, and loading state.

## 基础用法

<div class="aheart-demo-panel">
  <ACard title="Project" extra="More">
    Card body content.
  </ACard>
</div>

```vue
<template>
  <ACard title="Project" extra="More">
    Card body content.
  </ACard>
</template>
```

## 封面与操作

<div class="aheart-demo-panel">
  <ACard title="Report" hoverable>
    <template #cover>
      <div style="padding: 16px; background: var(--aheart-color-fill);">Cover area</div>
    </template>
    Conversion summary and business notes.
    <template #actions>
      <AButton size="small">Open</AButton>
      <AButton size="small" type="primary">Share</AButton>
    </template>
  </ACard>
</div>

```vue
<template>
  <ACard title="Report" hoverable>
    <template #cover>
      <div class="cover">Cover area</div>
    </template>
    Conversion summary and business notes.
    <template #actions>
      <AButton size="small">Open</AButton>
      <AButton size="small" type="primary">Share</AButton>
    </template>
  </ACard>
</template>
```

## 加载状态

<div class="aheart-demo-panel">
  <AConfigProvider size="small">
    <ACard title="Loading" loading>
      Hidden while loading.
    </ACard>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="small">
    <ACard title="Loading" loading>
      Hidden while loading.
    </ACard>
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 卡片标题 | `string` | - |
| extra | 右侧额外内容 | `string` | - |
| bordered | 是否显示边框 | `boolean` | `true` |
| hoverable | 是否有 hover 阴影 | `boolean` | `false` |
| loading | 是否显示加载占位 | `boolean` | `false` |
| size | 卡片尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 卡片主体内容 |
| title | 自定义标题 |
| extra | 自定义额外内容 |
| cover | 封面区域 |
| actions | 底部操作区域 |

## Theme Tokens

- `--aheart-color-bg`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-color-primary-hover`
- `--aheart-radius`
- `--aheart-shadow`
