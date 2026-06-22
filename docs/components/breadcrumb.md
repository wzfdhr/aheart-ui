# Breadcrumb 面包屑 <span class="aheart-status aheart-status--ready">Ready</span>

Breadcrumb shows the user's position in a page hierarchy.

## 基础用法

<div class="aheart-demo-panel">
  <ABreadcrumb
    :items="[
      { title: 'Home', href: '/' },
      { title: 'Components', href: '/components/overview' },
      { title: 'Breadcrumb' }
    ]"
  />
</div>

```vue
<template>
  <ABreadcrumb
    :items="[
      { title: 'Home', href: '/' },
      { title: 'Components', href: '/components/overview' },
      { title: 'Breadcrumb' }
    ]"
  />
</template>
```

## 自定义分隔符

<div class="aheart-demo-panel">
  <ABreadcrumb
    separator=">"
    :items="[
      { title: 'Workspace', href: '/' },
      { title: 'Admin', href: '/admin', disabled: true },
      { title: 'Users' }
    ]"
  />
</div>

```vue
<template>
  <ABreadcrumb
    separator=">"
    :items="[
      { title: 'Workspace', href: '/' },
      { title: 'Admin', href: '/admin', disabled: true },
      { title: 'Users' }
    ]"
  />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 面包屑项目 | `BreadcrumbItem[]` | `[]` |
| separator | 分隔符 | `string` | `/` |

### BreadcrumbItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 展示文本 | `string` | - |
| href | 链接地址 | `string` | - |
| disabled | 是否禁用链接 | `boolean` | `false` |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-primary`
- `--aheart-color-border`
- `--aheart-spacing-sm`
