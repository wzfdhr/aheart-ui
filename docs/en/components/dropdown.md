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
| menu | Configures `menu`. | `DropdownMenuConfig` | - |
| trigger | Configures `trigger`. | `Array<'click' \|'hover' \|'contextMenu'>` | `['hover']` |
| placement | Configures `placement`. | `top` \|`topLeft` \|`topRight` \|`bottom` \|`bottomLeft` \|`bottomRight` \|`left` \|`leftTop` \|`leftBottom` \|`right` \|`rightTop` \|`rightBottom` | `bottomLeft` |
| autoAdjustOverflow | Configures `autoAdjustOverflow`. | `boolean` | `true` |
| getPopupContainer | Configures `getPopupContainer`. | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| mouseEnterDelay | Configures `mouseEnterDelay`. | `number` | `0.1` |
| mouseLeaveDelay | Configures `mouseLeaveDelay`. | `number` | `0.1` |
| open | Configures `open`. | `boolean` | - |
| defaultOpen | Configures `defaultOpen`. | `boolean` | `false` |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| arrow | Configures `arrow`. | `boolean \|{ pointAtCenter?: boolean }` | `false` |
| destroyOnHidden | Configures `destroyOnHidden`. | `boolean` | `false` |
| destroyPopupOnHide | Configures `destroyPopupOnHide`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| overlayClassName | Configures `overlayClassName`. | `string` | - |
| overlayStyle | Configures `overlayStyle`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `DropdownSemanticClassNames \|(info: DropdownSemanticInfo) => DropdownSemanticClassNames` | - |
| styles | Configures `styles`. | `DropdownSemanticStyles \|(info: DropdownSemanticInfo) => DropdownSemanticStyles` | - |
| popupRender | Configures `popupRender`. | `(menus: VNodeChild) => VNodeChild` | - |
| dropdownRender | Configures `dropdownRender`. | `(menus: VNodeChild) => VNodeChild` | - |

## Dropdown.Button API

`ADropdownButton` groupcontentandcontenttriggercontent。contentpropertycontent `ADropdown`  menu、trigger、content、contentstyle、contentandrendercontent。

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| menu | Configures `menu`. | `DropdownMenuConfig` | - |
| trigger | Configures `trigger`. | `Array<'click' \|'hover' \|'contextMenu'>` | `['hover']` |
| placement | Configures `placement`. | `top` \|`topLeft` \|`topRight` \|`bottom` \|`bottomLeft` \|`bottomRight` \|`left` \|`leftTop` \|`leftBottom` \|`right` \|`rightTop` \|`rightBottom` | `bottomRight` |
| autoAdjustOverflow | Configures `autoAdjustOverflow`. | `boolean` | `true` |
| open | Configures `open`. | `boolean` | - |
| defaultOpen | Configures `defaultOpen`. | `boolean` | `false` |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| loading | Configures `loading`. | `boolean` \|`{ delay?: number; icon?: VNodeChild }` | `false` |
| type | Configures `type`. | `ButtonType` | `default` |
| danger | Configures `danger`. | `boolean` | `false` |
| size | Configures `size`. | `ButtonSize` | ConfigProvider size |
| htmlType | Configures `htmlType`. | `button` \|`submit` \|`reset` | - |
| nativeType | Configures `nativeType`. | `button` \|`submit` \|`reset` | `button` |
| href | Configures `href`. | `string` | - |
| target | Configures `target`. | `string` | - |
| title | Configures `title`. | `string` | - |
| icon | Configures `icon`. | `VNodeChild` | `v` |
| buttonsRender | Configures `buttonsRender`. | `(buttons: VNodeChild[]) => VNodeChild[]` | - |
| getPopupContainer | Configures `getPopupContainer`. | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| mouseEnterDelay | Configures `mouseEnterDelay`. | `number` | `0.1` |
| mouseLeaveDelay | Configures `mouseLeaveDelay`. | `number` | `0.1` |
| arrow | Configures `arrow`. | `boolean \|{ pointAtCenter?: boolean }` | `false` |
| destroyOnHidden | Configures `destroyOnHidden`. | `boolean` | `false` |
| destroyPopupOnHide | Configures `destroyPopupOnHide`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| overlayClassName | Configures `overlayClassName`. | `string` | - |
| overlayStyle | Configures `overlayStyle`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `DropdownSemanticClassNames \|(info: DropdownSemanticInfo) => DropdownSemanticClassNames` | - |
| styles | Configures `styles`. | `DropdownSemanticStyles \|(info: DropdownSemanticInfo) => DropdownSemanticStyles` | - |
| popupRender | Configures `popupRender`. | `(menus: VNodeChild) => VNodeChild` | - |
| dropdownRender | Configures `dropdownRender`. | `(menus: VNodeChild) => VNodeChild` | - |

### DropdownMenuConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| items | Configures `items`. | `MenuItem[]` | `[]` |
| selectable | Configures `selectable`. | `boolean` | `false` |
| selectedKeys | Configures `selectedKeys`. | `string[]` | - |
| defaultSelectedKeys | Configures `defaultSelectedKeys`. | `string[]` | `[]` |
| closeOnClick | Configures `closeOnClick`. | `boolean` | `true` |

### DropdownSemanticPart

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| trigger | Provides the `trigger` entry. |
| popup | Provides the `popup` entry. |
| menu | Provides the `menu` entry. |
| arrow | Provides the `arrow` entry. |

### DropdownSemanticInfo

| Field | Description | Type |
| --- | --- | --- |
| open | Describes `open`. | `boolean` |
| placement | Describes `placement`. | `DropdownPlacement` |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:open | Emitted when `update:open` occurs. | `(open: boolean) => void` |
| openChange | Emitted when `openChange` occurs. | `(open: boolean, info: { source: 'trigger' \|'menu' }) => void` |
| click | Emitted when `click` occurs. | `(info: MenuClickInfo) => void` |
| DropdownButton click | Emitted when `DropdownButton click` occurs. | `(event: MouseEvent) => void` |
| DropdownButton menuClick | Emitted when `DropdownButton menuClick` occurs. | `(info: MenuClickInfo) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |
| popup | Provides the `popup` entry. |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-shadow`
- `--aheart-radius`
- `--aheart-spacing-xs`
- `--aheart-spacing-md`
