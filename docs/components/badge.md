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

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| count | 展示的数字或文本 | `number` \| `string` | - |
| dot | 是否显示小红点 | `boolean` | `false` |
| status | 状态点类型 | `success` \| `processing` \| `default` \| `error` \| `warning` | - |
| text | 状态点文本 | `string` | - |
| overflowCount | 数字封顶值 | `number` | `99` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 徽标包裹的内容 |

## Theme Tokens

- `--aheart-color-danger`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-primary`
- `--aheart-color-text`
- `--aheart-border-radius-full`
