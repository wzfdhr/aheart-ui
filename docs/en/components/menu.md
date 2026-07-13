# Menu <span class="aheart-status aheart-status--ready">Ready</span>

Menu renders navigation and action lists from an Ant-style `items` tree.



## Basic Usage

<div class="aheart-demo-panel">
  <AMenu
    :items="[
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'workspace', label: 'Workspace' },
      { key: 'settings', label: 'Settings' }
    ]"
    :default-selected-keys="['dashboard']"
  />
</div>

```vue
<template>
<AMenu
    :items="[
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'workspace', label: 'Workspace' },
      { key: 'settings', label: 'Settings' }
    ]"
    :default-selected-keys="['dashboard']"
  />
</template>
```

## Submenus and Groups

<div class="aheart-demo-panel">
  <AMenu
    :default-open-keys="['workspace']"
    :items="[
      { key: 'dashboard', label: 'Dashboard' },
      {
        key: 'workspace',
        label: 'Workspace',
        children: [
          { key: 'projects', label: 'Projects' },
          { key: 'reports', label: 'Reports', disabled: true }
        ]
      },
      { type: 'group', key: 'manage', label: 'Manage', children: [{ key: 'users', label: 'Users' }] },
      { type: 'divider', key: 'divider' },
      { key: 'danger', label: 'Delete', danger: true }
    ]"
  />
</div>

```vue
<template>
<AMenu
    :default-open-keys="['workspace']"
    :items="[
      { key: 'dashboard', label: 'Dashboard' },
      {
        key: 'workspace',
        label: 'Workspace',
        children: [
          { key: 'projects', label: 'Projects' },
          { key: 'reports', label: 'Reports', disabled: true }
        ]
      },
      { type: 'group', key: 'manage', label: 'Manage', children: [{ key: 'users', label: 'Users' }] },
      { type: 'divider', key: 'divider' },
      { key: 'danger', label: 'Delete', danger: true }
    ]"
  />
</template>
```

## Horizontal and Dark Theme

<div class="aheart-demo-panel">
  <AMenu
    mode="horizontal"
    theme="dark"
    :default-selected-keys="['analytics']"
    :items="[
      { key: 'overview', label: 'Overview' },
      { key: 'analytics', label: 'Analytics' },
      { key: 'exports', label: 'Exports' }
    ]"
  />
</div>

```vue
<template>
<AMenu
    mode="horizontal"
    theme="dark"
    :default-selected-keys="['analytics']"
    :items="[
      { key: 'overview', label: 'Overview' },
      { key: 'analytics', label: 'Analytics' },
      { key: 'exports', label: 'Exports' }
    ]"
  />
</template>
```

## Icons, Extras, and Titles

<div class="aheart-demo-panel">
  <AMenu
    :items="[
      { key: 'dashboard', icon: 'D', label: 'Dashboard', extra: 'New', title: 'Open dashboard' },
      { key: 'command', icon: 'K', label: 'Command palette', extra: 'Ctrl K' },
      { type: 'divider', key: 'split', dashed: true },
      { key: 'danger', label: 'Delete workspace', danger: true }
    ]"
  />
</div>

```vue
<template>
<AMenu
    :items="[
      { key: 'dashboard', icon: 'D', label: 'Dashboard', extra: 'New', title: 'Open dashboard' },
      { key: 'command', icon: 'K', label: 'Command palette', extra: 'Ctrl K' },
      { type: 'divider', key: 'split', dashed: true },
      { key: 'danger', label: 'Delete workspace', danger: true }
    ]"
  />
</template>
```

## Submenu Rendering and Trigger

<div class="aheart-demo-panel">
  <AMenu
    force-sub-menu-render
    trigger-sub-menu-action="hover"
    expand-icon="+"
    :inline-indent="32"
    :items="[
      {
        key: 'workspace',
        label: 'Workspace',
        children: [
          { key: 'projects', label: 'Projects' },
          { key: 'reports', label: 'Reports' }
        ]
      }
    ]"
  />
</div>

```vue
<template>
<AMenu
    force-sub-menu-render
    trigger-sub-menu-action="hover"
    expand-icon="+"
    :inline-indent="32"
    :items="[
      {
        key: 'workspace',
        label: 'Workspace',
        children: [
          { key: 'projects', label: 'Projects' },
          { key: 'reports', label: 'Reports' }
        ]
      }
    ]"
  />
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <AMenu
    class-name="docs-menu"
    :class-names="{ root: 'docs-menu-root', itemButton: 'docs-menu-button', extra: 'docs-menu-extra' }"
    :styles="{ root: { maxWidth: '320px' }, itemButton: { borderRadius: '8px' } }"
    :items="[
      { key: 'inbox', label: 'Inbox', extra: '12' },
      { key: 'archive', label: 'Archive' }
    ]"
  />
</div>

```vue
<template>
<AMenu
    class-name="docs-menu"
    :class-names="{ root: 'docs-menu-root', itemButton: 'docs-menu-button', extra: 'docs-menu-extra' }"
    :styles="{ root: { maxWidth: '320px' }, itemButton: { borderRadius: '8px' } }"
    :items="[
      { key: 'inbox', label: 'Inbox', extra: '12' },
      { key: 'archive', label: 'Archive' }
    ]"
  />
</template>
```

## Multiple Selection and Disabled State

<div class="aheart-demo-panel">
  <AConfigProvider disabled>
    <AMenu
      multiple
      :default-selected-keys="['read', 'write']"
      :items="[
        { key: 'read', label: 'Read' },
        { key: 'write', label: 'Write' },
        { key: 'admin', label: 'Admin' }
      ]"
    />
  </AConfigProvider>
</div>

```vue
<template>
<AConfigProvider disabled>
    <AMenu
      multiple
      :default-selected-keys="['read', 'write']"
      :items="[
        { key: 'read', label: 'Read' },
        { key: 'write', label: 'Write' },
        { key: 'admin', label: 'Admin' }
      ]"
    />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| items | Menu item configuration. | `MenuItem[]` | `[]` |
| mode | Menu display mode. | `vertical` \|`horizontal` \|`inline` | `vertical` |
| theme | Menu theme. | `light` \|`dark` | `light` |
| selectedKeys | Currently selected keys. | `string[]` | - |
| defaultSelectedKeys | Initially selected keys. | `string[]` | `[]` |
| openKeys | Currently open keys in controlled mode. | `string[]` | - |
| defaultOpenKeys | Initially open keys. | `string[]` | `[]` |
| multiple | Whether multiple selection is allowed. | `boolean` | `false` |
| selectable | Whether items can be selected. | `boolean` | `true` |
| inlineCollapsed | Whether an inline menu is collapsed. | `boolean` | `false` |
| inlineIndent | Indent width for inline nesting. | `number` | `24` |
| forceSubMenuRender | Whether submenu DOM is always rendered. | `boolean` | `false` |
| triggerSubMenuAction | How a submenu is triggered. | `hover` \|`click` | `click` |
| expandIcon | Custom submenu expand icon. | `VNodeChild` \|`(info) => VNodeChild` | - |
| className | Compatibility class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `MenuClassNames` | `{}` |
| styles | Semantic DOM styles, as an object or function. | `MenuStyles` | `{}` |
| disabled | Whether interaction is disabled. | `boolean` | ConfigProvider disabled |

### MenuItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique identifier. | `string` | - |
| label | Item label content. | `VNodeChild` | - |
| icon | Custom icon. | `VNodeChild` | - |
| extra | Additional content. | `VNodeChild` | - |
| title | Native title tooltip for the interactive item. | `string` | - |
| disabled | Whether interaction is disabled. | `boolean` | `false` |
| danger | Whether to use danger styling. | `boolean` | `false` |
| dashed | Whether a divider is dashed. | `boolean` | `false` |
| type | Component type or visual style. | `item` \| `group` \| `divider` | `item` |
| children | Child items or content. | `MenuItem[]` | - |

### Semantic DOM

| Name | Description |
| --- | --- |
| root | Root navigation container. |
| list | Root menu list. |
| item | Standard menu-item container. |
| itemButton | Standard menu-item button. |
| submenu | Submenu container. |
| submenuTitle | Submenu title button. |
| submenuList | Submenu list. |
| group | Item-group container. |
| groupTitle | Item-group title. |
| divider | Divider. |
| icon | Icon area. |
| label | Text area. |
| extra | Additional-content area. |
| expandIcon | Expand-icon area. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Fired when a menu item is clicked. | `(info: MenuClickInfo) => void` |
| select | Fired when a menu item is selected. | `(info: MenuSelectInfo) => void` |
| deselect | Fired when a selected item is deselected in multiple-selection mode. | `(info: MenuSelectInfo) => void` |
| openChange | Fired when the expanded submenu keys change. | `(openKeys: string[]) => void` |
| update:selectedKeys | Fired when the selected keys change. | `(keys: string[]) => void` |
| update:openKeys | Fired when the expanded submenu keys change. | `(keys: string[]) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-control-height`
- `--aheart-radius`
