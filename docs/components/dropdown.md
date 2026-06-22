# Dropdown 下拉菜单 <span class="aheart-status aheart-status--ready">Ready</span>

Dropdown exposes contextual actions from a trigger element and renders a Menu overlay.

## 基础用法

<div class="aheart-demo-panel">
  <ADropdown
    :menu="{
      items: [
        { key: 'edit', label: 'Edit' },
        { key: 'archive', label: 'Archive' },
        { key: 'delete', label: 'Delete', danger: true }
      ]
    }"
  >
    <AButton>Actions</AButton>
  </ADropdown>
</div>

```vue
<template>
  <ADropdown :menu="{ items }">
    <AButton>Actions</AButton>
  </ADropdown>
</template>
```

## 悬浮触发

<div class="aheart-demo-panel">
  <ADropdown
    :trigger="['hover']"
    placement="bottom"
    arrow
    :menu="{
      items: [
        { key: 'profile', label: 'Profile' },
        { key: 'billing', label: 'Billing' }
      ]
    }"
  >
    <AButton>Hover me</AButton>
  </ADropdown>
</div>

```vue
<template>
  <ADropdown :trigger="['hover']" placement="bottom" arrow :menu="{ items }">
    <AButton>Hover me</AButton>
  </ADropdown>
</template>
```

## 受控展开

<div class="aheart-demo-panel">
  <ADropdown
    :open="true"
    placement="bottomRight"
    :menu="{
      items: [
        { key: 'download', label: 'Download' },
        { key: 'share', label: 'Share' }
      ]
    }"
  >
    <AButton type="primary">Open</AButton>
  </ADropdown>
</div>

```vue
<template>
  <ADropdown v-model:open="open" placement="bottomRight" :menu="{ items }">
    <AButton type="primary">Open</AButton>
  </ADropdown>
</template>
```

## 全局禁用

<div class="aheart-demo-panel">
  <AConfigProvider disabled>
    <ADropdown
      :menu="{ items: [{ key: 'edit', label: 'Edit' }] }"
    >
      <AButton>Disabled</AButton>
    </ADropdown>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider disabled>
    <ADropdown :menu="{ items }">
      <AButton>Disabled</AButton>
    </ADropdown>
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| menu | 菜单配置 | `DropdownMenuConfig` | - |
| trigger | 触发方式 | `Array<'click' \| 'hover'>` | `['click']` |
| placement | 弹出位置 | `bottomLeft` \| `bottom` \| `bottomRight` \| `topLeft` \| `top` \| `topRight` | `bottomLeft` |
| open | 是否展开，受控 | `boolean` | - |
| defaultOpen | 默认是否展开 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| arrow | 是否显示箭头 | `boolean` | `false` |

### DropdownMenuConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 菜单项 | `MenuItem[]` | `[]` |
| selectable | 菜单项是否可选 | `boolean` | `false` |
| selectedKeys | 当前选中 keys | `string[]` | - |
| defaultSelectedKeys | 默认选中 keys | `string[]` | `[]` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 展开状态变化时触发 | `(open: boolean) => void` |
| openChange | 展开状态变化时触发 | `(open: boolean) => void` |
| click | 点击菜单项时触发 | `(info: MenuClickInfo) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 触发器内容 |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-shadow`
- `--aheart-radius`
- `--aheart-spacing-xs`
- `--aheart-spacing-md`
