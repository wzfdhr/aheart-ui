# Pagination 分页 <span class="aheart-status aheart-status--ready">Ready</span>

Pagination navigates paged data with controlled or uncontrolled current page state.

## 基础用法

<div class="aheart-demo-panel">
  <APagination :total="42" :page-size="10" :current="2" show-total />
</div>

```vue
<template>
  <APagination v-model:current="page" :total="42" :page-size="10" show-total />
</template>
```

## 简洁模式

<div class="aheart-demo-panel">
  <APagination :total="20" :current="1" :page-size="10" simple />
</div>

```vue
<template>
  <APagination :total="20" :current="1" :page-size="10" simple />
</template>
```

## 全局禁用与尺寸

<div class="aheart-demo-panel">
  <AConfigProvider size="small" disabled>
    <APagination :total="30" :current="1" :page-size="10" />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="small" disabled>
    <APagination :total="30" :current="1" :page-size="10" />
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| total | 数据总数 | `number` | `0` |
| current | 当前页，受控模式 | `number` | - |
| defaultCurrent | 默认当前页 | `number` | `1` |
| pageSize | 每页条数 | `number` | - |
| defaultPageSize | 默认每页条数 | `number` | `10` |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| size | 分页尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| simple | 是否简洁模式 | `boolean` | `false` |
| hideOnSinglePage | 只有一页时是否隐藏 | `boolean` | `false` |
| showTotal | 是否显示总数 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:current | 当前页变化时触发 | `(current: number) => void` |
| update:pageSize | 每页条数变化时触发 | `(pageSize: number) => void` |
| change | 当前页变化时触发 | `(current: number, pageSize: number) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-border`
- `--aheart-color-bg`
- `--aheart-color-bg-disabled`
- `--aheart-control-height`
- `--aheart-radius-sm`
