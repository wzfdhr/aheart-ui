# Menu 导航菜单 <span class="aheart-status aheart-status--ready">Ready</span>

Menu renders navigation and action lists from an Ant-style `items` tree.

## 基础用法

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

## 子菜单与分组

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

## 横向与深色主题

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

## 多选与禁用

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 菜单项配置 | `MenuItem[]` | `[]` |
| mode | 菜单模式 | `vertical` \| `horizontal` \| `inline` | `vertical` |
| theme | 主题 | `light` \| `dark` | `light` |
| selectedKeys | 当前选中 keys，受控 | `string[]` | - |
| defaultSelectedKeys | 默认选中 keys | `string[]` | `[]` |
| openKeys | 当前展开 keys，受控 | `string[]` | - |
| defaultOpenKeys | 默认展开 keys | `string[]` | `[]` |
| multiple | 是否多选 | `boolean` | `false` |
| selectable | 是否允许选择 | `boolean` | `true` |
| inlineCollapsed | 是否折叠 inline 菜单 | `boolean` | `false` |
| disabled | 是否禁用交互 | `boolean` | ConfigProvider disabled |

### MenuItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string` | - |
| label | 菜单文本 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| danger | 是否危险项 | `boolean` | `false` |
| type | 节点类型 | `item` \| `group` \| `divider` | `item` |
| children | 子菜单或分组项 | `MenuItem[]` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击菜单项时触发 | `(info: MenuClickInfo) => void` |
| select | 选中菜单项时触发 | `(info: MenuSelectInfo) => void` |
| deselect | 多选模式取消选中时触发 | `(info: MenuSelectInfo) => void` |
| openChange | 子菜单展开变化时触发 | `(openKeys: string[]) => void` |
| update:selectedKeys | 选中 keys 变化时触发 | `(keys: string[]) => void` |
| update:openKeys | 展开 keys 变化时触发 | `(keys: string[]) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-control-height`
- `--aheart-radius`
