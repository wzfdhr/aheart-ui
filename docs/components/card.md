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

## Meta 信息

<div class="aheart-demo-panel">
  <ACard hoverable>
    <ACardMeta title="Europe Street beat" description="www.instagram.com">
      <template #avatar>
        <AIcon name="user" />
      </template>
    </ACardMeta>
  </ACard>
</div>

```vue
<template>
  <ACard hoverable>
    <ACardMeta title="Europe Street beat" description="www.instagram.com">
      <template #avatar>
        <AIcon name="user" />
      </template>
    </ACardMeta>
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

## 变体与内嵌卡片

<div class="aheart-demo-panel">
  <div style="display: grid; gap: 12px;">
    <ACard title="Outlined" variant="outlined">
      Default outlined card.
    </ACard>
    <ACard title="Borderless" variant="borderless">
      Borderless card.
    </ACard>
    <ACard title="Parent">
      <ACard title="Inner" type="inner" size="small">
        Nested content.
      </ACard>
    </ACard>
  </div>
</div>

```vue
<template>
  <ACard title="Outlined" variant="outlined">
    Default outlined card.
  </ACard>
  <ACard title="Borderless" variant="borderless">
    Borderless card.
  </ACard>
  <ACard title="Parent">
    <ACard title="Inner" type="inner" size="small">
      Nested content.
    </ACard>
  </ACard>
</template>
```

## 操作项

<div class="aheart-demo-panel">
  <ACard title="Ticket" :actions="['Assign', 'Close']">
    A simple card with action items.
  </ACard>
</div>

```vue
<template>
  <ACard title="Ticket" :actions="['Assign', 'Close']">
    A simple card with action items.
  </ACard>
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <ACard
    title="Styled Card"
    extra="More"
    :actions="['Open']"
    class-name="demo-card-class"
    root-class-name="demo-card-root"
    :style="{ maxWidth: '360px' }"
    :head-style="{ background: 'var(--aheart-color-fill)' }"
    :body-style="{ minHeight: '72px' }"
    :class-names="{ root: 'demo-card-semantic-root', header: 'demo-card-header', body: 'demo-card-body', actions: 'demo-card-actions' }"
    :styles="{ title: { color: 'var(--aheart-color-primary)' }, actions: { justifyContent: 'flex-start' } }"
  >
    Semantic hooks can target the Card structure.
  </ACard>
</div>

```vue
<template>
  <ACard
    title="Styled Card"
    extra="More"
    :actions="['Open']"
    class-name="demo-card-class"
    root-class-name="demo-card-root"
    :style="{ maxWidth: '360px' }"
    :head-style="{ background: 'var(--aheart-color-fill)' }"
    :body-style="{ minHeight: '72px' }"
    :class-names="{ root: 'demo-card-semantic-root', header: 'demo-card-header', body: 'demo-card-body', actions: 'demo-card-actions' }"
    :styles="{ title: { color: 'var(--aheart-color-primary)' }, actions: { justifyContent: 'flex-start' } }"
  >
    Semantic hooks can target the Card structure.
  </ACard>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 卡片标题 | `string` | - |
| extra | 右侧额外内容 | `string` | - |
| bordered | 是否显示边框 | `boolean` | `true` |
| variant | 卡片变体，优先于 `bordered` | `outlined` \| `borderless` | - |
| type | 卡片类型 | `inner` | - |
| hoverable | 是否有 hover 阴影 | `boolean` | `false` |
| loading | 是否显示加载占位 | `boolean` | `false` |
| size | 卡片尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| actions | 底部操作项，`actions` 插槽优先 | `(string \| number)[]` | - |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| headStyle | 头部样式兼容属性 | `StyleValue` | - |
| bodyStyle | 内容区样式兼容属性 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'actions', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'actions', StyleValue>>` | - |

## CardMeta API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| avatar | 头像区域内容 | `VNodeChild` | - |
| title | 标题内容 | `VNodeChild` | - |
| description | 描述内容 | `VNodeChild` | - |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'section' \| 'avatar' \| 'title' \| 'description', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'section' \| 'avatar' \| 'title' \| 'description', StyleValue>>` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 卡片主体内容 |
| title | 自定义标题 |
| extra | 自定义额外内容 |
| cover | 封面区域 |
| actions | 底部操作区域 |

## CardMeta Slots

| 名称 | 说明 |
| --- | --- |
| avatar | 自定义头像区域，优先于 `avatar` 属性 |
| title | 自定义标题，优先于 `title` 属性 |
| description | 自定义描述，优先于 `description` 属性 |
| default | 当未提供 `title` / `description` 时作为内容区 fallback |

## Theme Tokens

- `--aheart-color-bg`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-color-primary-hover`
- `--aheart-radius`
- `--aheart-shadow`
