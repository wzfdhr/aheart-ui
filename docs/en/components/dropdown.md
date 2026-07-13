# Dropdown <span class="aheart-status aheart-status--ready">Ready</span>

Dropdown exposes contextual actions from a trigger element and renders a Menu overlay. Its default trigger follows Ant Design and opens on hover.



## Basic Usage

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

## Click Trigger

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

## Button Dropdown

<div class="aheart-demo-panel">
  <ASpace>
    <ADropdownButton
      type="primary"
      :trigger="['click']"
      :menu="{
        items: [
          { key: 'create', label: 'Create item' },
          { key: 'import', label: 'Import data' }
        ]
      }"
      @click="() => undefined"
    >
      New item
    </ADropdownButton>
    <ADropdownButton
      loading
      :menu="{ items: [{ key: 'retry', label: 'Retry later' }] }"
    >
      Processing
    </ADropdownButton>
  </ASpace>
</div>

```vue
<template>
  <ADropdownButton type="primary" :trigger="['click']" :menu="{ items }" @click="create">
    New item
  </ADropdownButton>
  <ADropdownButton loading :menu="{ items: retryItems }">
    Processing
  </ADropdownButton>
</template>
```

`ADropdownButton` is also available as `Dropdown.Button` when using the component object directly.

## Context Menu

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

## Arrow

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

## Side Placement

<div class="aheart-demo-panel">
  <ASpace>
    <ADropdown
      :trigger="['click']"
      placement="leftTop"
      :menu="{ items: [{ key: 'copy', label: 'Copy' }, { key: 'rename', label: 'Rename' }] }"
    >
      <AButton>Left top</AButton>
    </ADropdown>
    <ADropdown
      :trigger="['click']"
      placement="rightBottom"
      :menu="{ items: [{ key: 'copy', label: 'Copy' }, { key: 'rename', label: 'Rename' }] }"
    >
      <AButton>Right bottom</AButton>
    </ADropdown>
  </ASpace>
</div>

```vue
<template>
  <ADropdown :trigger="['click']" placement="leftTop" :menu="{ items }">
    <AButton>Left top</AButton>
  </ADropdown>
  <ADropdown :trigger="['click']" placement="rightBottom" :menu="{ items }">
    <AButton>Right bottom</AButton>
  </ADropdown>
</template>
```

## Controlled Open State

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

## Destroy on Hide

<div class="aheart-demo-panel">
  <ASpace>
    <ADropdown
      :trigger="['click']"
      :menu="{ items: [{ key: 'edit', label: 'Edit' }] }"
    >
      <AButton>Keep overlay</AButton>
    </ADropdown>
    <ADropdown
      :trigger="['click']"
      destroy-on-hidden
      :menu="{ items: [{ key: 'edit', label: 'Edit' }] }"
    >
      <AButton>Destroy overlay</AButton>
    </ADropdown>
  </ASpace>
</div>

```vue
<template>
  <ADropdown :trigger="['click']" :menu="{ items }">
    <AButton>Keep overlay</AButton>
  </ADropdown>
  <ADropdown :trigger="['click']" destroy-on-hidden :menu="{ items }">
    <AButton>Destroy overlay</AButton>
  </ADropdown>
</template>
```

## Custom Overlay

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

## Semantic Styling

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

## Global Disabled State

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

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| menu | Menu configuration. | `DropdownMenuConfig` | - |
| trigger | Trigger method. | `Array<'click' \|'hover' \|'contextMenu'>` | `['hover']` |
| placement | Popup placement. | `top` \|`topLeft` \|`topRight` \|`bottom` \|`bottomLeft` \|`bottomRight` \|`left` \|`leftTop` \|`leftBottom` \|`right` \|`rightTop` \|`rightBottom` | `bottomLeft` |
| autoAdjustOverflow | Automatically adjusts placement or edge alignment when the popup overflows the viewport. | `boolean` | `true` |
| getPopupContainer | Container in which to mount the popup. | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| mouseEnterDelay | Delay before opening on hover, in seconds. | `number` | `0.1` |
| mouseLeaveDelay | Delay before closing on hover, in seconds. | `number` | `0.1` |
| open | Controlled visibility state. | `boolean` | - |
| defaultOpen | Initial visibility state. | `boolean` | `false` |
| disabled | Whether interaction is disabled. | `boolean` | ConfigProvider disabled |
| arrow | Whether to show an arrow, or configure it to point at the center. | `boolean \|{ pointAtCenter?: boolean }` | `false` |
| destroyOnHidden | Whether to destroy popup DOM after it closes. | `boolean` | `false` |
| destroyPopupOnHide | Compatibility alias for destroying popup DOM after close. | `boolean` | `false` |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| overlayClassName | Compatibility class name for the popup. | `string` | - |
| overlayStyle | Compatibility styles for the popup. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `DropdownSemanticClassNames \|(info: DropdownSemanticInfo) => DropdownSemanticClassNames` | - |
| styles | Semantic DOM styles, as an object or function. | `DropdownSemanticStyles \|(info: DropdownSemanticInfo) => DropdownSemanticStyles` | - |
| popupRender | Custom popup render function. | `(menus: VNodeChild) => VNodeChild` | - |
| dropdownRender | Compatibility alias for the custom popup render function. | `(menus: VNodeChild) => VNodeChild` | - |

## Dropdown.Button API

`ADropdownButton` combines a primary button with a dropdown trigger. Its dropdown-related props inherit `ADropdown` support for menu configuration, triggers, mounting, popup styles, semantic hooks, and render functions.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| menu | Menu configuration. | `DropdownMenuConfig` | - |
| trigger | Trigger method. | `Array<'click' \|'hover' \|'contextMenu'>` | `['hover']` |
| placement | Popup placement. | `top` \|`topLeft` \|`topRight` \|`bottom` \|`bottomLeft` \|`bottomRight` \|`left` \|`leftTop` \|`leftBottom` \|`right` \|`rightTop` \|`rightBottom` | `bottomRight` |
| autoAdjustOverflow | Automatically adjusts placement or edge alignment when the popup overflows the viewport. | `boolean` | `true` |
| open | Controlled visibility state. | `boolean` | - |
| defaultOpen | Initial visibility state. | `boolean` | `false` |
| disabled | Whether interaction is disabled. | `boolean` | ConfigProvider disabled |
| loading | Loading state. | `boolean` \|`{ delay?: number; icon?: VNodeChild }` | `false` |
| type | Component type or visual style. | `ButtonType` | `default` |
| danger | Whether to use danger styling. | `boolean` | `false` |
| size | Component size. | `ButtonSize` | ConfigProvider size |
| htmlType | Compatibility native `type` for the primary button. | `button` \|`submit` \|`reset` | - |
| nativeType | Native `type` for the primary button. | `button` \|`submit` \|`reset` | `button` |
| href | Link address. | `string` | - |
| target | Link target. | `string` | - |
| title | Title content. | `string` | - |
| icon | Custom icon. | `VNodeChild` | `v` |
| buttonsRender | Custom renderer for the primary and dropdown buttons. | `(buttons: VNodeChild[]) => VNodeChild[]` | - |
| getPopupContainer | Container in which to mount the popup. | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| mouseEnterDelay | Delay before opening on hover, in seconds. | `number` | `0.1` |
| mouseLeaveDelay | Delay before closing on hover, in seconds. | `number` | `0.1` |
| arrow | Whether to show an arrow, or configure it to point at the center. | `boolean \|{ pointAtCenter?: boolean }` | `false` |
| destroyOnHidden | Whether to destroy popup DOM after it closes. | `boolean` | `false` |
| destroyPopupOnHide | Compatibility alias for destroying popup DOM after close. | `boolean` | `false` |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| overlayClassName | Compatibility class name for the popup. | `string` | - |
| overlayStyle | Compatibility styles for the popup. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `DropdownSemanticClassNames \|(info: DropdownSemanticInfo) => DropdownSemanticClassNames` | - |
| styles | Semantic DOM styles, as an object or function. | `DropdownSemanticStyles \|(info: DropdownSemanticInfo) => DropdownSemanticStyles` | - |
| popupRender | Custom popup render function. | `(menus: VNodeChild) => VNodeChild` | - |
| dropdownRender | Compatibility alias for the custom popup render function. | `(menus: VNodeChild) => VNodeChild` | - |

### DropdownMenuConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| items | Component item configuration. | `MenuItem[]` | `[]` |
| selectable | Whether items can be selected. | `boolean` | `false` |
| selectedKeys | Currently selected keys. | `string[]` | - |
| defaultSelectedKeys | Initially selected keys. | `string[]` | `[]` |
| closeOnClick | Whether clicking a menu item closes the popup. | `boolean` | `true` |

### DropdownSemanticPart

| Name | Description |
| --- | --- |
| root | The `root` semantic DOM element. |
| trigger | The `trigger` semantic DOM element. |
| popup | The `popup` semantic DOM element. |
| menu | The `menu` semantic DOM element. |
| arrow | The `arrow` semantic DOM element. |

### DropdownSemanticInfo

| Field | Description | Type |
| --- | --- | --- |
| open | Details `open`. | `boolean` |
| placement | Details `placement`. | `DropdownPlacement` |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:open | Fired when `update:open` is triggered. | `(open: boolean) => void` |
| openChange | Fired when `openChange` is triggered. | `(open: boolean, info: { source: 'trigger' \|'menu' }) => void` |
| click | Fired when `click` is triggered. | `(info: MenuClickInfo) => void` |
| DropdownButton click | Fired when `DropdownButton click` is triggered. | `(event: MouseEvent) => void` |
| DropdownButton menuClick | Fired when `DropdownButton menuClick` is triggered. | `(info: MenuClickInfo) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | The `default` semantic DOM element. |
| popup | The `popup` semantic DOM element. |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-shadow`
- `--aheart-radius`
- `--aheart-spacing-xs`
- `--aheart-spacing-md`
