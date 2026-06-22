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

## 图标、附加内容与标题

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

## 子菜单渲染与触发

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

## 语义样式

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
| inlineIndent | inline 层级缩进宽度 | `number` | `24` |
| forceSubMenuRender | 是否始终渲染子菜单 DOM | `boolean` | `false` |
| triggerSubMenuAction | 子菜单触发方式 | `hover` \| `click` | `click` |
| expandIcon | 自定义子菜单展开图标 | `VNodeChild` \| `(info) => VNodeChild` | - |
| className | 根节点附加类名 | `string` | - |
| style | 根节点附加样式 | `StyleValue` | - |
| classNames | 语义 DOM 类名 | `MenuClassNames` | `{}` |
| styles | 语义 DOM 样式 | `MenuStyles` | `{}` |
| disabled | 是否禁用交互 | `boolean` | ConfigProvider disabled |

### MenuItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string` | - |
| label | 菜单内容 | `VNodeChild` | - |
| icon | 前置图标 | `VNodeChild` | - |
| extra | 右侧附加内容 | `VNodeChild` | - |
| title | 交互节点标题提示 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| danger | 是否危险项 | `boolean` | `false` |
| dashed | divider 是否为虚线 | `boolean` | `false` |
| type | 节点类型 | `item` \| `group` \| `divider` | `item` |
| children | 子菜单或分组项 | `MenuItem[]` | - |

### Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根导航容器 |
| list | 根菜单列表 |
| item | 普通菜单项容器 |
| itemButton | 普通菜单项按钮 |
| submenu | 子菜单容器 |
| submenuTitle | 子菜单标题按钮 |
| submenuList | 子菜单列表 |
| group | 分组容器 |
| groupTitle | 分组标题 |
| divider | 分割线 |
| icon | 图标区域 |
| label | 文本区域 |
| extra | 附加内容区域 |
| expandIcon | 展开图标区域 |

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
