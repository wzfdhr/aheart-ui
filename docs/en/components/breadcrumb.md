# Breadcrumb <span class="aheart-status aheart-status--ready">Ready</span>

Breadcrumb shows the user's position in a page hierarchy.



## Basic Usage

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

## Custom Separator

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

## Path Parameters

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

## Standalone Separators

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

## Joined Paths

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

Each `path` is joined with the preceding path segment to generate links such as `/projects` and `/projects/aheart`. `href` remains available when an item needs a fully custom link address.

## Custom Rendering

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
    :items="[
      { title: 'Workspace', href: '/' },
      { title: 'Members', href: '/members' },
      { title: 'Ada Lovelace' }
    ]"
    :item-render="(item, params, items, paths, index) => index + 1 + '. ' + item.title"
  />
</template>
```

## Semantic Styling

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
    :class-names="{ root: 'docs-breadcrumb-root', item: 'docs-breadcrumb-item', separator: 'docs-breadcrumb-separator' }"
    :styles="{ root: { padding: '4px 0' }, separator: { marginInline: '10px' } }"
    :items="[
      { title: 'Home', href: '/' },
      { title: 'Components', href: '/components/overview' },
      { title: 'Breadcrumb' }
    ]"
  />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| items | Breadcrumb items. | `BreadcrumbItem[]` | `[]` |
| params | Path parameters. | `Record<string, string \| number>` | `{}` |
| separator | Separator. | `VNodeChild` | `/` |
| itemRender | Custom item renderer. | `BreadcrumbItemRender` | - |
| className | Additional class for the root node. | `string` | - |
| style | Additional style for the root node. | `StyleValue` | - |
| classNames | Semantic DOM classes. | `BreadcrumbClassNames` | `{}` |
| styles | Semantic DOM styles. | `BreadcrumbStyles` | `{}` |

### BreadcrumbItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
`BreadcrumbItem` can be a regular `BreadcrumbRouteItem` or a standalone `BreadcrumbSeparatorItem`.

### BreadcrumbRouteItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Stable key. | `string` \| `number` | - |
| type | Item type. | `'item'` | - |
| title | Content to display. | `VNodeChild` | - |
| href | Link URL; takes precedence over `path`. | `string` | - |
| path | Path segment that can replace `params` and join preceding items. | `string` | - |
| className | Additional item class. | `string` | - |
| style | Additional item style. | `StyleValue` | - |
| disabled | Whether to disable the link. | `boolean` | `false` |
| onClick | Click callback. | `(event, item, index) => void` | - |

### BreadcrumbSeparatorItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Stable key. | `string` \| `number` | - |
| type | Item type. | `'separator'` | - |
| separator | Separator content. | `VNodeChild` | `separator` prop |
| className | Additional item class. | `string` | - |
| style | Additional item style. | `StyleValue` | - |

### Semantic DOM

| Name | Description |
| --- | --- |
| root | Root navigation container. |
| list | Ordered list. |
| item | Breadcrumb item. |
| link | Link node. |
| text | Text node. |
| separator | Separator node. |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-primary`
- `--aheart-color-border`
- `--aheart-spacing-sm`
