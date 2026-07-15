# Badge 徽标 <span class="aheart-status aheart-status--ready">已完成</span>

Badge shows counts, dots, and status markers around nearby content.

## 数字徽标

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

## 小红点

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

## 零值和小号

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

## 颜色和偏移

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

## 自定义计数

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
      <span class="custom-count">new</span>
    </template>
    <AButton>Deployments</AButton>
  </ABadge>
</template>
```

## 根节点控制

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

## 状态点

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

## 缎带

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
    <ACard title="Badge.Ribbon" size="small">
      This card is wrapped by a ribbon.
    </ACard>
  </ABadgeRibbon>
</template>
```

## 语义化样式

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| count | 展示的数字、文本或渲染节点 | `VNodeChild` | - |
| dot | 是否显示小红点 | `boolean` | `false` |
| status | 状态点类型 | `success` \| `processing` \| `default` \| `error` \| `warning` | - |
| text | 状态点文本或渲染节点 | `VNodeChild` | - |
| overflowCount | 数字封顶值 | `number` | `99` |
| showZero | 当 `count` 为 `0` 时是否展示徽标 | `boolean` | `false` |
| size | 数字徽标尺寸 | `default` \| `medium` \| `small` | `medium` |
| offset | 设置徽标偏移量 | `[number, number]` | - |
| color | 自定义徽标或状态点颜色 | `string` | - |
| title | 设置数字或小红点的原生 `title` | `string` | - |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'indicator', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'indicator', StyleValue>>` | - |

## BadgeRibbon API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 缎带内容 | `VNodeChild` | - |
| color | 缎带颜色 | `string` | - |
| placement | 缎带位置 | `start` \| `end` | `end` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'indicator' \| 'content', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'indicator' \| 'content', StyleValue>>` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 徽标包裹的内容 |
| count | 自定义数字徽标内容 |

## Semantic DOM

### Badge

| 名称 | 说明 |
| --- | --- |
| root | 根容器 |
| indicator | 数字徽标、小红点或状态点 |

### BadgeRibbon

| 名称 | 说明 |
| --- | --- |
| root | 缎带包裹容器 |
| indicator | 缎带主体 |
| content | 缎带内容 |

## Theme Tokens

- `--aheart-color-danger`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-primary`
- `--aheart-color-text`
- `--aheart-border-radius-full`
