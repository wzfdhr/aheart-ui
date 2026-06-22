# Descriptions 描述列表 <span class="aheart-status aheart-status--ready">Ready</span>

Descriptions displays record details as label and content pairs.

## 基础用法

<div class="aheart-demo-panel">
  <ADescriptions
    title="Profile"
    extra="Updated"
    :items="[
      { label: 'User', content: 'Ada' },
      { label: 'Role', content: 'Admin' },
      { label: 'Status', content: 'Active' }
    ]"
  />
</div>

```vue
<template>
  <ADescriptions
    title="Profile"
    extra="Updated"
    :items="[
      { label: 'User', content: 'Ada' },
      { label: 'Role', content: 'Admin' },
      { label: 'Status', content: 'Active' }
    ]"
  />
</template>
```

## 带边框与垂直布局

<div class="aheart-demo-panel">
  <ADescriptions
    bordered
    layout="vertical"
    :column="2"
    :items="[
      { label: 'Product', content: 'Aheart UI' },
      { label: 'Version', content: '1.0.0' },
      { label: 'Summary', content: 'Ant-style Vue components', span: 2 }
    ]"
  />
</div>

```vue
<template>
  <ADescriptions
    bordered
    layout="vertical"
    :column="2"
    :items="[
      { label: 'Product', content: 'Aheart UI' },
      { label: 'Version', content: '1.0.0' },
      { label: 'Summary', content: 'Ant-style Vue components', span: 2 }
    ]"
  />
</template>
```

## 全局尺寸

<div class="aheart-demo-panel">
  <AConfigProvider size="large">
    <ADescriptions
      :items="[
        { label: 'Owner', content: 'Design System' },
        { label: 'State', content: 'Ready' }
      ]"
    />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large">
    <ADescriptions :items="items" />
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | - |
| extra | 右侧额外内容 | `string` | - |
| items | 描述项 | `DescriptionItem[]` | `[]` |
| bordered | 是否显示边框 | `boolean` | `false` |
| column | 每行列数 | `number` | `3` |
| layout | 排列方式 | `horizontal` \| `vertical` | `horizontal` |
| size | 描述列表尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |

### DescriptionItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签 | `string` | - |
| content | 内容 | `string` | - |
| span | 占用列数 | `number` | `1` |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-radius`
