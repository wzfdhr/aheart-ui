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
  <AMenu :items="items" :default-open-keys="['workspace']" />
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
  <AMenu mode="horizontal" theme="dark" :items="items" />
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
    :items="items"
  />
</template>
```

## contentstyle

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
    :class-names="{ root: 'docs-menu-root', itemButton: 'docs-menu-button' }"
    :styles="{ root: { maxWidth: '320px' }, itemButton: { borderRadius: '8px' } }"
    :items="items"
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
    <AMenu multiple :default-selected-keys="['read', 'write']" :items="items" />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| items | Configures `items`. | `MenuItem[]` | `[]` |
| mode | Configures `mode`. | `vertical` \|`horizontal` \|`inline` | `vertical` |
| theme | Configures `theme`. | `light` \|`dark` | `light` |
| selectedKeys | Configures `selectedKeys`. | `string[]` | - |
| defaultSelectedKeys | Configures `defaultSelectedKeys`. | `string[]` | `[]` |
| openKeys | Configures `openKeys`. | `string[]` | - |
| defaultOpenKeys | Configures `defaultOpenKeys`. | `string[]` | `[]` |
| multiple | Configures `multiple`. | `boolean` | `false` |
| selectable | Configures `selectable`. | `boolean` | `true` |
| inlineCollapsed | Configures `inlineCollapsed`. | `boolean` | `false` |
| inlineIndent | Configures `inlineIndent`. | `number` | `24` |
| forceSubMenuRender | Configures `forceSubMenuRender`. | `boolean` | `false` |
| triggerSubMenuAction | Configures `triggerSubMenuAction`. | `hover` \|`click` | `click` |
| expandIcon | Configures `expandIcon`. | `VNodeChild` \|`(info) => VNodeChild` | - |
| className | Configures `className`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `MenuClassNames` | `{}` |
| styles | Configures `styles`. | `MenuStyles` | `{}` |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |

### MenuItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Configures `key`. | `string` | - |
| label | Configures `label`. | `VNodeChild` | - |
| icon | Configures `icon`. | `VNodeChild` | - |
| extra | Configures `extra`. | `VNodeChild` | - |
| title | Configures `title`. | `string` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |
| danger | Configures `danger`. | `boolean` | `false` |
| dashed | Configures `dashed`. | `boolean` | `false` |
| type | Configures `type`. | `item` \| `group` \| `divider` | `item` |
| children | Configures `children`. | `MenuItem[]` | - |

### Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| list | Provides the `list` entry. |
| item | Provides the `item` entry. |
| itemButton | Provides the `itemButton` entry. |
| submenu | Provides the `submenu` entry. |
| submenuTitle | Provides the `submenuTitle` entry. |
| submenuList | Provides the `submenuList` entry. |
| group | Provides the `group` entry. |
| groupTitle | Provides the `groupTitle` entry. |
| divider | Provides the `divider` entry. |
| icon | Provides the `icon` entry. |
| label | Provides the `label` entry. |
| extra | Provides the `extra` entry. |
| expandIcon | Provides the `expandIcon` entry. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Emitted when `click` occurs. | `(info: MenuClickInfo) => void` |
| select | Emitted when `select` occurs. | `(info: MenuSelectInfo) => void` |
| deselect | Emitted when `deselect` occurs. | `(info: MenuSelectInfo) => void` |
| openChange | Emitted when `openChange` occurs. | `(openKeys: string[]) => void` |
| update:selectedKeys | Emitted when `update:selectedKeys` occurs. | `(keys: string[]) => void` |
| update:openKeys | Emitted when `update:openKeys` occurs. | `(keys: string[]) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-control-height`
- `--aheart-radius`
