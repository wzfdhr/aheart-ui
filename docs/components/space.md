# Space 间距 <span class="aheart-status aheart-status--ready">Ready</span>

Space sets consistent spacing between inline or vertical elements, with Ant-style orientation and separators.

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
  <ASpace orientation="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace orientation="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</template>
```

## 分隔符

<div class="aheart-demo-panel">
  <ASpace separator="|">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</div>

```vue
<template>
  <ASpace separator="|">
    <span>Profile</span>
    <span>Billing</span>
    <span>Security</span>
  </ASpace>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 间距尺寸 | `large` \| `middle` \| `small` \| `number` \| `[number, number]` | ConfigProvider size |
| direction | 排列方向，保留兼容别名 | `horizontal` \| `vertical` | `horizontal` |
| orientation | Ant 风格排列方向，优先于 `direction` | `horizontal` \| `vertical` | - |
| vertical | 垂直排列快捷方式 | `boolean` | `false` |
| align | 对齐方式 | `start` \| `end` \| `center` \| `baseline` | - |
| wrap | 是否自动换行 | `boolean` | `false` |
| separator | 子元素之间的分隔符 | `string` | - |
| split | 分隔符别名 | `string` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 需要添加间距的内容 |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
