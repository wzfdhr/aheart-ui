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
      <div style="padding: 16px; background: var(--aheart-color-fill);">Cover area</div>
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
| title | Card title; the `title` slot takes precedence, and an empty string does not create a header. | `VNodeChild` | - |
| extra | Extra content on the right; the `extra` slot takes precedence, and an empty string does not create an extra area. | `VNodeChild` | - |
| bordered | Whether to show a border. | `boolean` | `true` |
| variant | Card variant; takes precedence over `bordered`. | `outlined` \| `borderless` | - |
| type | Card type. | `inner` | - |
| hoverable | Whether to show a shadow on hover. | `boolean` | `false` |
| loading | Whether to show the loading placeholder. | `boolean` | `false` |
| size | Card size. | `large` \| `middle` \| `small` | ConfigProvider size |
| actions | Bottom action items; the `actions` slot takes precedence. | `VNodeChild[]` | - |
| tabList | Tab list. | `CardTab[]` | - |
| activeTabKey | Active tab in controlled mode. | `string` | - |
| defaultActiveTabKey | Initially active tab in uncontrolled mode. | `string` | first available tab |
| tabBarExtraContent | Content on the right of the tab bar; the `tabBarExtraContent` slot takes precedence. | `VNodeChild` | - |
| tabProps | Tab-bar class, style, and spacing configuration. | `CardTabProps` | - |
| className | Compatible class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |
| headStyle | Compatible style prop for the header. | `StyleValue` | - |
| bodyStyle | Compatible style prop for the body. | `StyleValue` | - |
| classNames | Classes for semantic parts. | `Partial<Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'actions', string>>` | - |
| styles | Styles for semantic parts. | `Partial<Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'actions', StyleValue>>` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:activeTabKey | Emitted when an enabled inactive tab is clicked. | `(key: string) => void` |
| tabChange | Emitted when an enabled inactive tab is clicked. | `(key: string) => void` |

## CardTab API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique tab key. | `string` | - |
| tab | Tab title content. | `VNodeChild` | - |
| disabled | Whether to disable the tab. | `boolean` | `false` |
| children | Tab content; has lower precedence than the `tab-{key}` slot. | `VNodeChild` | - |

## CardTabProps API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| className | Compatible class for the tab-bar root element. | `string` | - |
| rootClassName | Class for the tab-bar root element. | `string` | - |
| style | Style for the tab-bar root element. | `StyleValue` | - |
| tabBarGutter | Spacing between tabs. | `number` | - |
| classNames | Classes for tab-bar semantic parts. | `Partial<Record<'root' \| 'list' \| 'tab' \| 'activeTab' \| 'tabLabel' \| 'extra', string>>` | - |
| styles | Styles for tab-bar semantic parts. | `Partial<Record<'root' \| 'list' \| 'tab' \| 'activeTab' \| 'tabLabel' \| 'extra', StyleValue>>` | - |

## CardMeta API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| avatar | Avatar-area content. | `VNodeChild` | - |
| title | Main heading displayed in the metadata block. | `VNodeChild` | - |
| description | Description content. | `VNodeChild` | - |
| className | Compatible class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |
| classNames | Classes for semantic parts. | `Partial<Record<'root' \| 'section' \| 'avatar' \| 'title' \| 'description', string>>` | - |
| styles | Styles for semantic parts. | `Partial<Record<'root' \| 'section' \| 'avatar' \| 'title' \| 'description', StyleValue>>` | - |

## CardGrid API

`ACardGrid` is also available through the `Card.Grid` / `ACard.Grid` compound form.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| hoverable | Whether to show a shadow on hover. | `boolean` | `true` |
| className | Compatible class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |
| classNames | Classes for semantic parts. | `Partial<Record<'root' \| 'content', string>>` | - |
| styles | Styles for semantic parts. | `Partial<Record<'root' \| 'content', StyleValue>>` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Card body content. |
| title | Custom title. |
| extra | Custom extra content. |
| cover | Cover area. |
| actions | Bottom action area. |
| tab-{key} | Tab content for the corresponding `tabList` key. |
| tabBarExtraContent | Custom content on the right of the tab bar; takes precedence over the prop. |

## CardMeta Slots

| Name | Description |
| --- | --- |
| avatar | Custom avatar area; takes precedence over the `avatar` prop. |
| title | Custom title; takes precedence over the `title` prop. |
| description | Custom description; takes precedence over the `description` prop. |
| default | Fallback content when neither `title` nor `description` is provided. |

## CardGrid Slots

| Name | Description |
| --- | --- |
| default | Grid-card content. |

## CardGrid Semantic DOM

| Name | Description |
| --- | --- |
| root | Grid-card root element. |
| content | Grid-card content container. |

## CardTab Semantic DOM

| Name | Description |
| --- | --- |
| root | Tab-bar root element. |
| list | Tab-button list. |
| tab | Tab button. |
| activeTab | Active tab button. |
| tabLabel | Tab-title container. |
| extra | Container for content on the right of the tab bar. |

## Theme Tokens

- `--aheart-color-bg`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-color-primary-hover`
- `--aheart-color-primary`
- `--aheart-radius`
- `--aheart-shadow`
