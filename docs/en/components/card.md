# Card <span class="aheart-status aheart-status--ready">Ready</span>

Card groups related content in a bordered container with optional header, cover, actions, and loading state.



<script setup lang="ts">
import { h } from 'vue'

const renderableCardTitle = h('span', { style: { fontWeight: 700 } }, 'Node title')
const renderableCardExtra = h('a', { href: '#card-renderable-demo' }, 'Details')
const renderableCardActions = [
  h('button', { type: 'button', class: 'aheart-button aheart-button--small' }, 'Open'),
  h('button', { type: 'button', class: 'aheart-button aheart-button--small aheart-button--primary' }, 'Share')
]
</script>

## Basic Usage

<div class="aheart-demo-panel">
  <ACard title="Project" extra="More">
    Card body content.
  </ACard>
</div>

```vue
<template>
  <ACard title="Project" extra="More">
    Card body content.
  </ACard>
</template>
```

## Renderable Title and Actions

<div id="card-renderable-demo" class="aheart-demo-panel">
  <ACard
    :title="renderableCardTitle"
    :extra="renderableCardExtra"
    :actions="renderableCardActions"
  >
    Card title, extra, and actions can receive Vue nodes. Named slots keep priority when both are provided.
  </ACard>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const renderableCardTitle = h('span', { style: { fontWeight: 700 } }, 'Node title')
const renderableCardExtra = h('a', { href: '#card-renderable-demo' }, 'Details')
const renderableCardActions = [
  h('button', { type: 'button' }, 'Open'),
  h('button', { type: 'button' }, 'Share')
]
</script>

<template>
  <ACard
    :title="renderableCardTitle"
    :extra="renderableCardExtra"
    :actions="renderableCardActions"
  >
    Card title, extra, and actions can receive Vue nodes.
  </ACard>
</template>
```

## Cover and Actions

<div class="aheart-demo-panel">
  <ACard title="Report" hoverable>
    <template #cover>
      <div style="padding: 16px; background: var(--aheart-color-fill);">Cover area</div>
    </template>
    Conversion summary and business notes.
    <template #actions>
      <AButton size="small">Open</AButton>
      <AButton size="small" type="primary">Share</AButton>
    </template>
  </ACard>
</div>

```vue
<template>
  <ACard title="Report" hoverable>
    <template #cover>
      <div class="cover">Cover area</div>
    </template>
    Conversion summary and business notes.
    <template #actions>
      <AButton size="small">Open</AButton>
      <AButton size="small" type="primary">Share</AButton>
    </template>
  </ACard>
</template>
```

## Meta Information

<div class="aheart-demo-panel">
  <ACard hoverable>
    <ACardMeta title="Europe Street beat" description="www.instagram.com">
      <template #avatar>
        <AIcon name="user" />
      </template>
    </ACardMeta>
  </ACard>
</div>

```vue
<template>
  <ACard hoverable>
    <ACardMeta title="Europe Street beat" description="www.instagram.com">
      <template #avatar>
        <AIcon name="user" />
      </template>
    </ACardMeta>
  </ACard>
</template>
```

## Grid Cards

<div class="aheart-demo-panel">
  <ACard title="Project modules">
    <ACardGrid>Overview</ACardGrid>
    <ACardGrid>Reports</ACardGrid>
    <ACardGrid :hoverable="false">Read only</ACardGrid>
    <ACardGrid
      class-name="demo-card-grid"
      :class-names="{ content: 'demo-card-grid-content' }"
      :styles="{ content: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }"
    >
      Styled
    </ACardGrid>
  </ACard>
</div>

```vue
<template>
  <ACard title="Project modules">
    <ACardGrid>Overview</ACardGrid>
    <ACardGrid>Reports</ACardGrid>
    <ACardGrid :hoverable="false">Read only</ACardGrid>
    <ACardGrid
      class-name="demo-card-grid"
      :class-names="{ content: 'demo-card-grid-content' }"
      :styles="{ content: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }"
    >
      Styled
    </ACardGrid>
  </ACard>
</template>
```

## Tabbed Cards

<div class="aheart-demo-panel">
  <ACard
    title="Project"
    default-active-tab-key="overview"
    tab-bar-extra-content="More"
    :tab-props="{ tabBarGutter: 24 }"
    :tab-list="[
      { key: 'overview', tab: 'Overview' },
      { key: 'activity', tab: 'Activity' },
      { key: 'disabled', tab: 'Disabled', disabled: true }
    ]"
  >
    <template #tab-overview>
      Delivery health, timeline, and owner notes.
    </template>
    <template #tab-activity>
      Recent comments and workflow changes.
    </template>
  </ACard>
</div>

```vue
<template>
  <ACard
    title="Project"
    default-active-tab-key="overview"
    tab-bar-extra-content="More"
    :tab-props="{ tabBarGutter: 24 }"
    :tab-list="[
      { key: 'overview', tab: 'Overview' },
      { key: 'activity', tab: 'Activity' },
      { key: 'disabled', tab: 'Disabled', disabled: true }
    ]"
  >
    <template #tab-overview>
      Delivery health, timeline, and owner notes.
    </template>
    <template #tab-activity>
      Recent comments and workflow changes.
    </template>
  </ACard>
</template>
```

## Loading State

<div class="aheart-demo-panel">
  <AConfigProvider size="small">
    <ACard title="Loading" loading>
      Hidden while loading.
    </ACard>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="small">
    <ACard title="Loading" loading>
      Hidden while loading.
    </ACard>
  </AConfigProvider>
</template>
```

## Variants and Inner Cards

<div class="aheart-demo-panel">
  <div style="display: grid; gap: 12px;">
    <ACard title="Outlined" variant="outlined">
      Default outlined card.
    </ACard>
    <ACard title="Borderless" variant="borderless">
      Borderless card.
    </ACard>
    <ACard title="Parent">
      <ACard title="Inner" type="inner" size="small">
        Nested content.
      </ACard>
    </ACard>
  </div>
</div>

```vue
<template>
  <ACard title="Outlined" variant="outlined">
    Default outlined card.
  </ACard>
  <ACard title="Borderless" variant="borderless">
    Borderless card.
  </ACard>
  <ACard title="Parent">
    <ACard title="Inner" type="inner" size="small">
      Nested content.
    </ACard>
  </ACard>
</template>
```

## Actions

<div class="aheart-demo-panel">
  <ACard title="Ticket" :actions="['Assign', 'Close']">
    A simple card with action items.
  </ACard>
</div>

```vue
<template>
  <ACard title="Ticket" :actions="['Assign', 'Close']">
    A simple card with action items.
  </ACard>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ACard
    title="Styled Card"
    extra="More"
    :actions="['Open']"
    class-name="demo-card-class"
    root-class-name="demo-card-root"
    :style="{ maxWidth: '360px' }"
    :head-style="{ background: 'var(--aheart-color-fill)' }"
    :body-style="{ minHeight: '72px' }"
    :class-names="{ root: 'demo-card-semantic-root', header: 'demo-card-header', body: 'demo-card-body', actions: 'demo-card-actions' }"
    :styles="{ title: { color: 'var(--aheart-color-primary)' }, actions: { justifyContent: 'flex-start' } }"
  >
    Semantic hooks can target the Card structure.
  </ACard>
</div>

```vue
<template>
  <ACard
    title="Styled Card"
    extra="More"
    :actions="['Open']"
    class-name="demo-card-class"
    root-class-name="demo-card-root"
    :style="{ maxWidth: '360px' }"
    :head-style="{ background: 'var(--aheart-color-fill)' }"
    :body-style="{ minHeight: '72px' }"
    :class-names="{ root: 'demo-card-semantic-root', header: 'demo-card-header', body: 'demo-card-body', actions: 'demo-card-actions' }"
    :styles="{ title: { color: 'var(--aheart-color-primary)' }, actions: { justifyContent: 'flex-start' } }"
  >
    Semantic hooks can target the Card structure.
  </ACard>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Configures `title`. | `VNodeChild` | - |
| extra | Configures `extra`. | `VNodeChild` | - |
| bordered | Configures `bordered`. | `boolean` | `true` |
| variant | Configures `variant`. | `outlined` \|`borderless` | - |
| type | Configures `type`. | `inner` | - |
| hoverable | Configures `hoverable`. | `boolean` | `false` |
| loading | Configures `loading`. | `boolean` | `false` |
| size | Configures `size`. | `large` \|`middle` \|`small` | ConfigProvider size |
| actions | Configures `actions`. | `VNodeChild[]` | - |
| tabList | Configures `tabList`. | `CardTab[]` | - |
| activeTabKey | Configures `activeTabKey`. | `string` | - |
| defaultActiveTabKey | Configures `defaultActiveTabKey`. | `string` | first available tab |
| tabBarExtraContent | Configures `tabBarExtraContent`. | `VNodeChild` | - |
| tabProps | Configures `tabProps`. | `CardTabProps` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| headStyle | Configures `headStyle`. | `StyleValue` | - |
| bodyStyle | Configures `bodyStyle`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'actions', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'actions', StyleValue>>` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:activeTabKey | Emitted when `update:activeTabKey` occurs. | `(key: string) => void` |
| tabChange | Emitted when `tabChange` occurs. | `(key: string) => void` |

## CardTab API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Configures `key`. | `string` | - |
| tab | Configures `tab`. | `VNodeChild` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |
| children | Configures `children`. | `VNodeChild` | - |

## CardTabProps API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| tabBarGutter | Configures `tabBarGutter`. | `number` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \|'list' \|'tab' \|'activeTab' \|'tabLabel' \|'extra', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \|'list' \|'tab' \|'activeTab' \|'tabLabel' \|'extra', StyleValue>>` | - |

## CardMeta API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| avatar | Configures `avatar`. | `VNodeChild` | - |
| title | Configures `title`. | `VNodeChild` | - |
| description | Configures `description`. | `VNodeChild` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'section' \| 'avatar' \| 'title' \| 'description', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'section' \| 'avatar' \| 'title' \| 'description', StyleValue>>` | - |

## CardGrid API

`ACardGrid` is also available through the `Card.Grid` / `ACard.Grid` compound form.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| hoverable | Configures `hoverable`. | `boolean` | `true` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'content', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'content', StyleValue>>` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |
| title | Provides the `title` entry. |
| extra | Provides the `extra` entry. |
| cover | Provides the `cover` entry. |
| actions | Provides the `actions` entry. |
| tab-{key} | Provides the `tab-{key}` entry. |
| tabBarExtraContent | Provides the `tabBarExtraContent` entry. |

## CardMeta Slots

| Name | Description |
| --- | --- |
| avatar | Provides the `avatar` entry. |
| title | Provides the `title` entry. |
| description | Provides the `description` entry. |
| default | Provides the `default` entry. |

## CardGrid Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |

## CardGrid Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| content | Provides the `content` entry. |

## CardTab Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| list | Provides the `list` entry. |
| tab | Provides the `tab` entry. |
| activeTab | Provides the `activeTab` entry. |
| tabLabel | Provides the `tabLabel` entry. |
| extra | Provides the `extra` entry. |

## Theme Tokens

- `--aheart-color-bg`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-color-primary-hover`
- `--aheart-color-primary`
- `--aheart-radius`
- `--aheart-shadow`
