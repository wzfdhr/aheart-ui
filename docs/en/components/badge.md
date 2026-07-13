# Badge <span class="aheart-status aheart-status--ready">Ready</span>

Badge shows counts, dots, and status markers around nearby content.



## Basic Usage

### Numeric Badge

<div class="aheart-demo-panel">
  <ASpace size="large">
    <ABadge :count="5">
      <AButton>Inbox</AButton>
    </ABadge>
    <ABadge :count="120" :overflow-count="99">
      <AButton>Messages</AButton>
    </ABadge>
  </ASpace>
</div>

```vue
<template>
<ASpace size="large">
    <ABadge :count="5">
      <AButton>Inbox</AButton>
    </ABadge>
    <ABadge :count="120" :overflow-count="99">
      <AButton>Messages</AButton>
    </ABadge>
  </ASpace>
</template>
```

## Dot Badge

<div class="aheart-demo-panel">
  <ABadge dot>
    <AButton>Updates</AButton>
  </ABadge>
</div>

```vue
<template>
<ABadge dot>
    <AButton>Updates</AButton>
  </ABadge>
</template>
```

## Zero and Small

<div class="aheart-demo-panel">
  <ASpace size="large">
    <ABadge :count="0">
      <AButton>Hidden zero</AButton>
    </ABadge>
    <ABadge :count="0" show-zero>
      <AButton>Visible zero</AButton>
    </ABadge>
    <ABadge :count="8" size="small">
      <AButton>Small</AButton>
    </ABadge>
  </ASpace>
</div>

```vue
<template>
<ASpace size="large">
    <ABadge :count="0">
      <AButton>Hidden zero</AButton>
    </ABadge>
    <ABadge :count="0" show-zero>
      <AButton>Visible zero</AButton>
    </ABadge>
    <ABadge :count="8" size="small">
      <AButton>Small</AButton>
    </ABadge>
  </ASpace>
</template>
```

## Color and Offset

<div class="aheart-demo-panel">
  <ASpace size="large">
    <ABadge dot color="#722ed1" title="Unread updates">
      <AButton>Custom dot</AButton>
    </ABadge>
    <ABadge :count="12" :offset="[8, -4]" color="#13c2c2">
      <AButton>Offset</AButton>
    </ABadge>
  </ASpace>
</div>

```vue
<template>
<ASpace size="large">
    <ABadge dot color="#722ed1" title="Unread updates">
      <AButton>Custom dot</AButton>
    </ABadge>
    <ABadge :count="12" :offset="[8, -4]" color="#13c2c2">
      <AButton>Offset</AButton>
    </ABadge>
  </ASpace>
</template>
```

## Custom Count

<div class="aheart-demo-panel">
  <ABadge :count="120" :overflow-count="99">
    <template #count>
      <span style="font-size: 10px;">new</span>
    </template>
    <AButton>Deployments</AButton>
  </ABadge>
</div>

```vue
<template>
<ABadge :count="120" :overflow-count="99">
    <template #count>
      <span style="font-size: 10px;">new</span>
    </template>
    <AButton>Deployments</AButton>
  </ABadge>
</template>
```

## Root Node Control

<div class="aheart-demo-panel">
  <ABadge
    count="hot"
    class-name="demo-badge-class"
    root-class-name="demo-badge-root"
    :style="{ marginInlineStart: '8px' }"
    :class-names="{ root: 'demo-badge-semantic-root', indicator: 'demo-badge-semantic-indicator' }"
    :styles="{ root: { padding: '2px' }, indicator: { boxShadow: '0 0 0 1px #fff' } }"
  >
    <AButton>Inbox</AButton>
  </ABadge>
</div>

```vue
<template>
<ABadge
    count="hot"
    class-name="demo-badge-class"
    root-class-name="demo-badge-root"
    :style="{ marginInlineStart: '8px' }"
    :class-names="{ root: 'demo-badge-semantic-root', indicator: 'demo-badge-semantic-indicator' }"
    :styles="{ root: { padding: '2px' }, indicator: { boxShadow: '0 0 0 1px #fff' } }"
  >
    <AButton>Inbox</AButton>
  </ABadge>
</template>
```

## Status Dot

<div class="aheart-demo-panel">
  <ASpace direction="vertical">
    <ABadge status="success" text="Online" />
    <ABadge status="processing" text="Syncing" />
    <ABadge status="warning" text="Pending" />
    <ABadge status="error" text="Failed" />
  </ASpace>
</div>

```vue
<template>
<ASpace direction="vertical">
    <ABadge status="success" text="Online" />
    <ABadge status="processing" text="Syncing" />
    <ABadge status="warning" text="Pending" />
    <ABadge status="error" text="Failed" />
  </ASpace>
</template>
```

## Ribbon

<div class="aheart-demo-panel">
  <ABadgeRibbon
    text="Limited"
    color="#722ed1"
    placement="end"
    :class-names="{ root: 'demo-ribbon-root', indicator: 'demo-ribbon-indicator', content: 'demo-ribbon-content' }"
    :styles="{ indicator: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }, content: { fontWeight: 700 } }"
  >
    <ACard title="Badge.Ribbon" size="small" style="width: 280px">
      This card is wrapped by a ribbon.
    </ACard>
  </ABadgeRibbon>
</div>

```vue
<template>
<ABadgeRibbon
    text="Limited"
    color="#722ed1"
    placement="end"
    :class-names="{ root: 'demo-ribbon-root', indicator: 'demo-ribbon-indicator', content: 'demo-ribbon-content' }"
    :styles="{ indicator: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }, content: { fontWeight: 700 } }"
  >
    <ACard title="Badge.Ribbon" size="small" style="width: 280px">
      This card is wrapped by a ribbon.
    </ACard>
  </ABadgeRibbon>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ABadge
    status="processing"
    text="Syncing"
    :class-names="{ root: 'demo-badge-root', indicator: 'demo-badge-indicator' }"
    :styles="{ root: { marginInlineStart: '8px' }, indicator: { backgroundColor: '#13c2c2' } }"
  />
</div>

```vue
<template>
<ABadge
    status="processing"
    text="Syncing"
    :class-names="{ root: 'demo-badge-root', indicator: 'demo-badge-indicator' }"
    :styles="{ root: { marginInlineStart: '8px' }, indicator: { backgroundColor: '#13c2c2' } }"
  />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| count | Number, text, or renderable node to display. | `VNodeChild` | - |
| dot | Whether to show a dot. | `boolean` | `false` |
| status | Status-dot type. | `success` \| `processing` \| `default` \| `error` \| `warning` | - |
| text | Status-dot text or renderable node. | `VNodeChild` | - |
| overflowCount | Maximum displayed count. | `number` | `99` |
| showZero | Whether to display the badge when `count` is `0`. | `boolean` | `false` |
| size | Numeric badge size. | `default` \| `medium` \| `small` | `medium` |
| offset | Badge offset. | `[number, number]` | - |
| color | Custom badge or status-dot color. | `string` | - |
| title | Native `title` for a numeric badge or dot. | `string` | - |
| className | Compatible class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |
| classNames | Classes for semantic parts. | `Partial<Record<'root' \| 'indicator', string>>` | - |
| styles | Styles for semantic parts. | `Partial<Record<'root' \| 'indicator', StyleValue>>` | - |

## BadgeRibbon API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| text | Ribbon content. | `VNodeChild` | - |
| color | Ribbon color. | `string` | - |
| placement | Ribbon placement. | `start` \| `end` | `end` |
| className | Compatible class for the root element. | `string` | - |
| rootClassName | Class for the root element. | `string` | - |
| style | Style for the root element. | `StyleValue` | - |
| classNames | Classes for semantic parts. | `Partial<Record<'root' \| 'indicator' \| 'content', string>>` | - |
| styles | Styles for semantic parts. | `Partial<Record<'root' \| 'indicator' \| 'content', StyleValue>>` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Content wrapped by the badge. |
| count | Custom numeric badge content. |

## Semantic DOM

### Badge

| Name | Description |
| --- | --- |
| root | Root container. |
| indicator | Numeric badge, dot, or status dot. |

### BadgeRibbon

| Name | Description |
| --- | --- |
| root | Ribbon wrapper container. |
| indicator | Ribbon body. |
| content | Ribbon content. |

## Theme Tokens

- `--aheart-color-danger`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-primary`
- `--aheart-color-text`
- `--aheart-border-radius-full`
