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
    :items="items"
    :item-render="(item, params, items, paths, index) => index + 1 + '. ' + item.title"
  />
</template>
```

## contentstyle

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

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| items | Configures `items`. | `BreadcrumbItem[]` | `[]` |
| params | Configures `params`. | `Record<string, string \|number>` | `{}` |
| separator | Configures `separator`. | `VNodeChild` | `/` |
| itemRender | Configures `itemRender`. | `BreadcrumbItemRender` | - |
| className | Configures `className`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `BreadcrumbClassNames` | `{}` |
| styles | Configures `styles`. | `BreadcrumbStyles` | `{}` |

### BreadcrumbItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
`BreadcrumbItem` can be a regular `BreadcrumbRouteItem` or a standalone `BreadcrumbSeparatorItem`.

### BreadcrumbRouteItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Configures `key`. | `string` \|`number` | - |
| type | Configures `type`. | `'item'` | - |
| title | Configures `title`. | `VNodeChild` | - |
| href | Configures `href`. | `string` | - |
| path | Configures `path`. | `string` | - |
| className | Configures `className`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |
| onClick | Configures `onClick`. | `(event, item, index) => void` | - |

### BreadcrumbSeparatorItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Configures `key`. | `string` \|`number` | - |
| type | Configures `type`. | `'separator'` | - |
| separator | Configures `separator`. | `VNodeChild` | `separator` prop |
| className | Configures `className`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |

### Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| list | Provides the `list` entry. |
| item | Provides the `item` entry. |
| link | Provides the `link` entry. |
| text | Provides the `text` entry. |
| separator | Provides the `separator` entry. |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-primary`
- `--aheart-color-border`
- `--aheart-spacing-sm`
