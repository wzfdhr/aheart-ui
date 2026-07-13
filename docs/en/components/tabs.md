# Tabs <span class="aheart-status aheart-status--ready">Ready</span>

Tabs switch between related panels while keeping the surrounding page context stable.



<script setup lang="ts">
import { h } from 'vue'

const renderableTabsItems = [
  {
    key: 'profile',
    icon: h('span', { style: { color: 'var(--aheart-color-primary)' } }, 'P'),
    label: h('span', { style: { fontWeight: 600 } }, 'Profile'),
    children: h('span', 'Profile content from a VNode child')
  },
  {
    key: 'activity',
    icon: h('span', 'A'),
    label: h('span', 'Activity'),
    children: h('span', 'Activity content from a VNode child')
  }
]

const renderableTabsExtraContent = {
  left: h('span', { style: { color: 'var(--aheart-color-text-secondary)' } }, 'Workspace'),
  right: h('button', { type: 'button', class: 'aheart-button aheart-button--small' }, 'Sync')
}
</script>

## Basic Usage

<div class="aheart-demo-panel">
  <ATabs
    :items="[
      { key: 'overview', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', label: 'Settings', children: 'Settings panel' },
      { key: 'disabled', label: 'Disabled', children: 'Disabled panel', disabled: true }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    :items="[
      { key: 'overview', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', label: 'Settings', children: 'Settings panel' },
      { key: 'disabled', label: 'Disabled', children: 'Disabled panel', disabled: true }
    ]"
  />
</template>
```

## Card Style

<div class="aheart-demo-panel">
  <ATabs
    type="card"
    default-active-key="metrics"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary metrics' },
      { key: 'metrics', label: 'Metrics', children: 'Usage and conversion data' },
      { key: 'logs', label: 'Logs', children: 'Recent activity logs' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    type="card"
    default-active-key="metrics"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary metrics' },
      { key: 'metrics', label: 'Metrics', children: 'Usage and conversion data' },
      { key: 'logs', label: 'Logs', children: 'Recent activity logs' }
    ]"
  />
</template>
```

## Tab Placement

<div class="aheart-demo-panel">
  <ATabs
    tab-placement="start"
    :items="[
      { key: 'profile', label: 'Profile', children: 'Profile panel' },
      { key: 'security', label: 'Security', children: 'Security panel' },
      { key: 'billing', label: 'Billing', children: 'Billing panel' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    tab-placement="start"
    :items="[
      { key: 'profile', label: 'Profile', children: 'Profile panel' },
      { key: 'security', label: 'Security', children: 'Security panel' },
      { key: 'billing', label: 'Billing', children: 'Billing panel' }
    ]"
  />
</template>
```

## Extra Content and Gutter

<div class="aheart-demo-panel">
  <ATabs
    :tab-bar-gutter="24"
    :tab-bar-extra-content="{ left: 'Project', right: 'Actions' }"
    :items="[
      { key: 'tasks', label: 'Tasks', children: 'Task list' },
      { key: 'files', label: 'Files', children: 'File list' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    :tab-bar-gutter="24"
    :tab-bar-extra-content="{ left: 'Project', right: 'Actions' }"
    :items="[
      { key: 'tasks', label: 'Tasks', children: 'Task list' },
      { key: 'files', label: 'Files', children: 'File list' }
    ]"
  />
</template>
```

## Renderable Content

<div class="aheart-demo-panel">
  <ATabs
    :items="renderableTabsItems"
    :tab-bar-extra-content="renderableTabsExtraContent"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const renderableTabsItems = [
  {
    key: 'profile',
    icon: h('span', { style: { color: 'var(--aheart-color-primary)' } }, 'P'),
    label: h('span', { style: { fontWeight: 600 } }, 'Profile'),
    children: h('span', 'Profile content from a VNode child')
  },
  {
    key: 'activity',
    icon: h('span', 'A'),
    label: h('span', 'Activity'),
    children: h('span', 'Activity content from a VNode child')
  }
]

const renderableTabsExtraContent = {
  left: h('span', { style: { color: 'var(--aheart-color-text-secondary)' } }, 'Workspace'),
  right: h('button', { type: 'button', class: 'aheart-button aheart-button--small' }, 'Sync')
}
</script>

<template>
  <ATabs
    :items="renderableTabsItems"
    :tab-bar-extra-content="renderableTabsExtraContent"
  />
</template>
```

## Indicator and Animation

<div class="aheart-demo-panel">
  <ATabs
    active-key="usage"
    :animated="{ inkBar: true, tabPane: true }"
    :indicator="{ size: 28, align: 'center' }"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary panel' },
      { key: 'usage', label: 'Usage', children: 'Usage panel' },
      { key: 'health', label: 'Health', children: 'Health panel' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    active-key="usage"
    :animated="{ inkBar: true, tabPane: true }"
    :indicator="{ size: 28, align: 'center' }"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary panel' },
      { key: 'usage', label: 'Usage', children: 'Usage panel' },
      { key: 'health', label: 'Health', children: 'Health panel' }
    ]"
  />
</template>
```

## Icons and Click Events

<div class="aheart-demo-panel">
  <ATabs
    :items="[
      { key: 'overview', icon: 'O', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', icon: 'S', label: 'Settings', children: 'Settings panel' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    :items="[
      { key: 'overview', icon: 'O', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', icon: 'S', label: 'Settings', children: 'Settings panel' }
    ]"
    @tab-click="handleTabClick"
  />
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ATabs
    class-name="demo-tabs"
    root-class-name="demo-tabs-root"
    :class-names="{ activeTab: 'demo-tabs-active', panel: 'demo-tabs-panel' }"
    :styles="{ navList: { gap: '20px' }, panel: { paddingTop: '20px' } }"
    :items="[
      { key: 'one', label: 'One', children: 'First panel' },
      { key: 'two', label: 'Two', children: 'Second panel' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    class-name="demo-tabs"
    root-class-name="demo-tabs-root"
    :class-names="{ activeTab: 'demo-tabs-active', panel: 'demo-tabs-panel' }"
    :styles="{ navList: { gap: '20px' }, panel: { paddingTop: '20px' } }"
    :items="[
      { key: 'one', label: 'One', children: 'First panel' },
      { key: 'two', label: 'Two', children: 'Second panel' }
    ]"
  />
</template>
```

## Global Size

<div class="aheart-demo-panel">
  <AConfigProvider size="large">
    <ATabs
      centered
      :items="[
        { key: 'first', label: 'First', children: 'First panel' },
        { key: 'second', label: 'Second', children: 'Second panel' }
      ]"
    />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large">
    <ATabs
      centered
      :items="[
        { key: 'first', label: 'First', children: 'First panel' },
        { key: 'second', label: 'Second', children: 'Second panel' }
      ]"
    />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| items | Configures `items`. | `TabItem[]` | `[]` |
| activeKey | Configures `activeKey`. | `string` | - |
| defaultActiveKey | Configures `defaultActiveKey`. | `string` | first available item |
| type | Configures `type`. | `line` \|`card` | `line` |
| size | Configures `size`. | `large` \|`middle` \|`small` | ConfigProvider size |
| centered | Configures `centered`. | `boolean` | `false` |
| tabPlacement | Configures `tabPlacement`. | `top` \| `bottom` \| `start` \| `end` | `top` |
| tabPosition | Configures `tabPosition`. | `top` \|`bottom` \|`left` \|`right` | - |
| tabBarExtraContent | Configures `tabBarExtraContent`. | `VNodeChild` \|`{ left?: VNodeChild; right?: VNodeChild }` | - |
| tabBarGutter | Configures `tabBarGutter`. | `number` | - |
| tabBarStyle | Configures `tabBarStyle`. | `StyleValue` | - |
| indicator | Configures `indicator`. | `{ size?: number; align?: 'start' \|'center' \|'end' }` | - |
| animated | Configures `animated`. | `boolean` \|`{ inkBar?: boolean; tabPane?: boolean }` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Record<'root' \|'nav' \|'navList' \|'tab' \|'activeTab' \|'tabIcon' \|'tabLabel' \|'panel' \|'extra' \|'extraLeft' \|'extraRight', string>` | - |
| styles | Configures `styles`. | `Record<'root' \|'nav' \|'navList' \|'tab' \|'activeTab' \|'tabIcon' \|'tabLabel' \|'panel' \|'extra' \|'extraLeft' \|'extraRight', StyleValue>` | - |

### TabItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| key | Configures `key`. | `string` | - |
| label | Configures `label`. | `VNodeChild` | - |
| icon | Configures `icon`. | `VNodeChild` | - |
| children | Configures `children`. | `VNodeChild` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:activeKey | Emitted when `update:activeKey` occurs. | `(key: string) => void` |
| change | Emitted when `change` occurs. | `(key: string) => void` |
| tabClick | Emitted when `tabClick` occurs. | `(key: string, event: MouseEvent) => void` |

## Slots

| Name | Description |
| --- | --- |
| tab-{key} | Provides the `tab-{key}` entry. |
| extraLeft | Provides the `extraLeft` entry. |
| extraRight | Provides the `extraRight` entry. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-control-height`
