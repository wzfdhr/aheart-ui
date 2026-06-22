# Badge 徽标 <span class="aheart-status aheart-status--ready">Ready</span>

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
| count | 展示的数字或文本 | `number` \| `string` | - |
| dot | 是否显示小红点 | `boolean` | `false` |
| status | 状态点类型 | `success` \| `processing` \| `default` \| `error` \| `warning` | - |
| text | 状态点文本 | `string` | - |
| overflowCount | 数字封顶值 | `number` | `99` |
| showZero | 当 `count` 为 `0` 时是否展示徽标 | `boolean` | `false` |
| size | 数字徽标尺寸 | `default` \| `medium` \| `small` | `medium` |
| offset | 设置徽标偏移量 | `[number, number]` | - |
| color | 自定义徽标或状态点颜色 | `string` | - |
| title | 设置数字或小红点的原生 `title` | `string` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'indicator', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'indicator', StyleValue>>` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 徽标包裹的内容 |
| count | 自定义数字徽标内容 |

## Theme Tokens

- `--aheart-color-danger`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-primary`
- `--aheart-color-text`
- `--aheart-border-radius-full`
