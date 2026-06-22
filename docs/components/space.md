# Space 间距 <span class="aheart-status aheart-status--ready">Ready</span>

Space sets consistent spacing between inline or vertical elements.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace>
    <AButton>Cancel</AButton>
    <AButton type="primary">Submit</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace>
    <AButton>Cancel</AButton>
    <AButton type="primary">Submit</AButton>
  </ASpace>
</template>
```

## 垂直排列

<div class="aheart-demo-panel">
  <ASpace direction="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace direction="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 间距尺寸 | `large` \| `middle` \| `small` \| `number` \| `[number, number]` | ConfigProvider size |
| direction | 排列方向 | `horizontal` \| `vertical` | `horizontal` |
| align | 对齐方式 | `start` \| `end` \| `center` \| `baseline` | - |
| wrap | 是否自动换行 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 需要添加间距的内容 |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
