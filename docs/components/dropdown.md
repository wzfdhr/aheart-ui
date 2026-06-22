# Dropdown 下拉菜单 <span class="aheart-status aheart-status--ready">Ready</span>

Dropdown exposes contextual actions from a trigger element and renders a Menu overlay. Its default trigger follows Ant Design and opens on hover.

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
    <AButton>Hover actions</AButton>
  </ADropdown>
</div>

```vue
<template>
  <ADropdown :menu="{ items }">
    <AButton>Hover actions</AButton>
  </ADropdown>
</template>
```

## 点击触发

<div class="aheart-demo-panel">
  <ADropdown
    :trigger="['click']"
    placement="bottom"
    arrow
    :menu="{
      items: [
        { key: 'profile', label: 'Profile' },
        { key: 'billing', label: 'Billing' }
      ]
    }"
  >
    <AButton>Click me</AButton>
  </ADropdown>
</div>

```vue
<template>
  <ADropdown :trigger="['click']" placement="bottom" arrow :menu="{ items }">
    <AButton>Click me</AButton>
  </ADropdown>
</template>
```

## 右键菜单

<div class="aheart-demo-panel">
  <ADropdown
    :trigger="['contextMenu']"
    :menu="{
      items: [
        { key: 'copy', label: 'Copy' },
        { key: 'paste', label: 'Paste' }
      ]
    }"
  >
    <AButton>Right click</AButton>
  </ADropdown>
</div>

```vue
<template>
  <ADropdown :trigger="['contextMenu']" :menu="{ items }">
    <AButton>Right click</AButton>
  </ADropdown>
</template>
```

## 箭头

<div class="aheart-demo-panel">
  <ADropdown
    :arrow="{ pointAtCenter: true }"
    placement="bottom"
    :menu="{
      items: [
        { key: 'settings', label: 'Settings' },
        { key: 'logout', label: 'Logout' }
      ]
    }"
  >
    <AButton>Centered arrow</AButton>
  </ADropdown>
</div>

```vue
<template>
  <ADropdown :arrow="{ pointAtCenter: true }" placement="bottom" :menu="{ items }">
    <AButton>Centered arrow</AButton>
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

## 隐藏后销毁

<div class="aheart-demo-panel">
  <ASpace>
    <ADropdown
      :trigger="['click']"
      :menu="{ items: [{ key: 'edit', label: 'Edit' }] }"
    >
      <AButton>保留浮层</AButton>
    </ADropdown>
    <ADropdown
      :trigger="['click']"
      destroy-on-hidden
      :menu="{ items: [{ key: 'edit', label: 'Edit' }] }"
    >
      <AButton>销毁浮层</AButton>
    </ADropdown>
  </ASpace>
</div>

```vue
<template>
  <ADropdown :trigger="['click']" :menu="{ items }">
    <AButton>保留浮层</AButton>
  </ADropdown>
  <ADropdown :trigger="['click']" destroy-on-hidden :menu="{ items }">
    <AButton>销毁浮层</AButton>
  </ADropdown>
</template>
```

## 自定义弹层

<div class="aheart-demo-panel">
  <ADropdown :trigger="['click']" :menu="{ items: [{ key: 'edit', label: 'Edit' }] }">
    <AButton>Custom popup</AButton>
    <template #popup>
      <div style="padding: 10px 12px; min-width: 180px">
        <strong>Custom content</strong>
        <p style="margin: 6px 0 0; color: var(--aheart-color-text-secondary)">Use the popup slot to replace the menu overlay.</p>
      </div>
    </template>
  </ADropdown>
</div>

```vue
<template>
  <ADropdown :trigger="['click']" :menu="{ items }">
    <AButton>Custom popup</AButton>
    <template #popup>
      <div class="custom-popup">Custom content</div>
    </template>
  </ADropdown>
</template>
```

`popupRender` and deprecated `dropdownRender` can wrap the generated menu node when render functions are preferred.

```vue
<script setup lang="ts">
import { h } from 'vue'

const popupRender = (menus) => h('div', { class: 'custom-popup' }, [menus])
</script>
```

## 语义化样式

<div class="aheart-demo-panel">
  <ADropdown
    :trigger="['click']"
    class-name="demo-dropdown-class"
    root-class-name="demo-dropdown-root"
    overlay-class-name="demo-dropdown-popup"
    :style="{ color: 'var(--aheart-color-primary)' }"
    :overlay-style="{ minWidth: '220px' }"
    :class-names="{ trigger: 'demo-dropdown-trigger', menu: 'demo-dropdown-menu', arrow: 'demo-dropdown-arrow' }"
    :styles="{ popup: { maxWidth: '260px' }, menu: { padding: '4px' }, arrow: { backgroundColor: '#fff' } }"
    :arrow="{ pointAtCenter: true }"
    :menu="{ items: [{ key: 'edit', label: 'Edit' }, { key: 'archive', label: 'Archive' }] }"
  >
    <AButton>Semantic hooks</AButton>
  </ADropdown>
</div>

```vue
<template>
  <ADropdown
    class-name="demo-dropdown-class"
    root-class-name="demo-dropdown-root"
    overlay-class-name="demo-dropdown-popup"
    :class-names="{ trigger: 'demo-dropdown-trigger', menu: 'demo-dropdown-menu', arrow: 'demo-dropdown-arrow' }"
    :styles="{ popup: { maxWidth: '260px' }, menu: { padding: '4px' }, arrow: { backgroundColor: '#fff' } }"
    :arrow="{ pointAtCenter: true }"
    :menu="{ items }"
  >
    <AButton>Semantic hooks</AButton>
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
| trigger | 触发方式 | `Array<'click' \| 'hover' \| 'contextMenu'>` | `['hover']` |
| placement | 弹出位置 | `bottomLeft` \| `bottom` \| `bottomRight` \| `topLeft` \| `top` \| `topRight` | `bottomLeft` |
| open | 是否展开，受控 | `boolean` | - |
| defaultOpen | 默认是否展开 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| arrow | 是否显示箭头，或配置箭头指向中心 | `boolean \| { pointAtCenter?: boolean }` | `false` |
| destroyOnHidden | 关闭后是否销毁弹层 DOM | `boolean` | `false` |
| destroyPopupOnHide | 关闭后销毁弹层 DOM 的兼容别名 | `boolean` | `false` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| overlayClassName | 弹层 class 兼容属性 | `string` | - |
| overlayStyle | 弹层样式兼容属性 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<DropdownSemanticPart, string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<DropdownSemanticPart, StyleValue>>` | - |
| popupRender | 自定义弹层渲染函数 | `(menus: VNodeChild) => VNodeChild` | - |
| dropdownRender | 自定义弹层渲染函数兼容别名 | `(menus: VNodeChild) => VNodeChild` | - |

### DropdownMenuConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 菜单项 | `MenuItem[]` | `[]` |
| selectable | 菜单项是否可选 | `boolean` | `false` |
| selectedKeys | 当前选中 keys | `string[]` | - |
| defaultSelectedKeys | 默认选中 keys | `string[]` | `[]` |
| closeOnClick | 点击菜单项后是否关闭弹层 | `boolean` | `true` |

### DropdownSemanticPart

| 名称 | 说明 |
| --- | --- |
| root | 根包裹节点 |
| trigger | 触发区域 |
| popup | 弹层节点 |
| menu | 默认菜单包装节点 |
| arrow | 箭头 |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 展开状态变化时触发 | `(open: boolean) => void` |
| openChange | 由触发器交互导致展开状态变化时触发 | `(open: boolean, info: { source: 'trigger' \| 'menu' }) => void` |
| click | 点击菜单项时触发 | `(info: MenuClickInfo) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 触发器内容 |
| popup | 自定义弹层内容，优先级高于 `popupRender` |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-shadow`
- `--aheart-radius`
- `--aheart-spacing-xs`
- `--aheart-spacing-md`
