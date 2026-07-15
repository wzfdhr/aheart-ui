# Breadcrumb 面包屑 <span class="aheart-status aheart-status--ready">已完成</span>

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

## 路径参数

<div class="aheart-demo-panel">
  <ABreadcrumb
    :params="{ projectId: 'aheart' }"
    :items="[
      { title: 'Projects', path: 'projects' },
      { title: 'Aheart UI', path: ':projectId' },
      { title: 'Settings' }
    ]"
  />
</div>

```vue
<template>
  <ABreadcrumb
    :params="{ projectId: 'aheart' }"
    :items="[
      { title: 'Projects', path: 'projects' },
      { title: 'Aheart UI', path: ':projectId' },
      { title: 'Settings' }
    ]"
  />
</template>
```

## 独立分隔符

<div class="aheart-demo-panel">
  <ABreadcrumb
    :items="[
      { title: 'Location', href: '/' },
      { type: 'separator', separator: ':' },
      { title: 'Application Center', path: 'application' },
      { title: 'Application List' }
    ]"
  />
</div>

```vue
<template>
  <ABreadcrumb
    :items="[
      { title: 'Location', href: '/' },
      { type: 'separator', separator: ':' },
      { title: 'Application Center', path: 'application' },
      { title: 'Application List' }
    ]"
  />
</template>
```

`type: 'separator'` follows Ant Design's `SeparatorType` shape. It renders a separator as its own item, so the previous route item does not also render the global `separator`.

## 连接路径

<div class="aheart-demo-panel">
  <ABreadcrumb
    :params="{ projectId: 'aheart' }"
    :items="[
      { title: 'Projects', path: 'projects' },
      { title: 'Aheart UI', path: ':projectId' },
      { title: 'Settings', path: 'settings' }
    ]"
  />
</div>

```vue
<template>
  <ABreadcrumb
    :params="{ projectId: 'aheart' }"
    :items="[
      { title: 'Projects', path: 'projects' },
      { title: 'Aheart UI', path: ':projectId' },
      { title: 'Settings', path: 'settings' }
    ]"
  />
</template>
```

每个 `path` 会作为路径片段与前序 `path` 连接，生成 `/projects`、`/projects/aheart` 这样的链接。`href` 仍可用于完全自定义某一项链接地址。

## 自定义渲染

<div class="aheart-demo-panel">
  <ABreadcrumb
    :items="[
      { title: 'Workspace', href: '/' },
      { title: 'Members', href: '/members' },
      { title: 'Ada Lovelace' }
    ]"
    :item-render="(item, params, items, paths, index) => index + 1 + '. ' + item.title"
  />
</div>

```vue
<template>
  <ABreadcrumb
    :items="items"
    :item-render="(item, params, items, paths, index) => index + 1 + '. ' + item.title"
  />
</template>
```

## 语义样式

<div class="aheart-demo-panel">
  <ABreadcrumb
    class-name="docs-breadcrumb"
    :class-names="{ root: 'docs-breadcrumb-root', item: 'docs-breadcrumb-item', separator: 'docs-breadcrumb-separator' }"
    :styles="{ root: { padding: '4px 0' }, separator: { marginInline: '10px' } }"
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
    class-name="docs-breadcrumb"
    :class-names="{ root: 'docs-breadcrumb-root', item: 'docs-breadcrumb-item' }"
    :styles="{ root: { padding: '4px 0' }, separator: { marginInline: '10px' } }"
    :items="items"
  />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 面包屑项目 | `BreadcrumbItem[]` | `[]` |
| params | 路径参数 | `Record<string, string \| number>` | `{}` |
| separator | 分隔符 | `VNodeChild` | `/` |
| itemRender | 自定义项目渲染 | `BreadcrumbItemRender` | - |
| className | 根节点附加类名 | `string` | - |
| style | 根节点附加样式 | `StyleValue` | - |
| classNames | 语义 DOM 类名 | `BreadcrumbClassNames` | `{}` |
| styles | 语义 DOM 样式 | `BreadcrumbStyles` | `{}` |

### BreadcrumbItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
`BreadcrumbItem` 可以是普通路径项 `BreadcrumbRouteItem`，也可以是独立分隔符项 `BreadcrumbSeparatorItem`。

### BreadcrumbRouteItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 稳定 key | `string` \| `number` | - |
| type | 项类型 | `'item'` | - |
| title | 展示内容 | `VNodeChild` | - |
| href | 链接地址，优先级高于 `path` | `string` | - |
| path | 可使用 `params` 替换并与前序项连接的路径片段 | `string` | - |
| className | 项目附加类名 | `string` | - |
| style | 项目附加样式 | `StyleValue` | - |
| disabled | 是否禁用链接 | `boolean` | `false` |
| onClick | 点击回调 | `(event, item, index) => void` | - |

### BreadcrumbSeparatorItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 稳定 key | `string` \| `number` | - |
| type | 项类型 | `'separator'` | - |
| separator | 分隔符内容 | `VNodeChild` | `separator` prop |
| className | 项目附加类名 | `string` | - |
| style | 项目附加样式 | `StyleValue` | - |

### Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根导航容器 |
| list | 有序列表 |
| item | 面包屑项 |
| link | 链接节点 |
| text | 文本节点 |
| separator | 分隔符节点 |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-primary`
- `--aheart-color-border`
- `--aheart-spacing-sm`
