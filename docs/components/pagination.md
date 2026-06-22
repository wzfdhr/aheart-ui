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

## 对齐与少量页码

<div class="aheart-demo-panel">
  <APagination :total="200" :current="10" :page-size="10" align="center" show-less-items />
</div>

```vue
<template>
  <APagination :total="200" :current="10" :page-size="10" align="center" show-less-items />
</template>
```

## 每页条数

<div class="aheart-demo-panel">
  <APagination :total="95" :current="2" :page-size="10" :page-size-options="[10, 20, 50]" />
</div>

```vue
<template>
  <APagination
    v-model:current="page"
    v-model:page-size="pageSize"
    :total="95"
    :page-size-options="[10, 20, 50]"
  />
</template>
```

## 快速跳转

<div class="aheart-demo-panel">
  <APagination :total="95" :current="1" :page-size="10" show-quick-jumper />
</div>

```vue
<template>
  <APagination :total="95" :page-size="10" show-quick-jumper />
</template>
```

## 自定义跳转按钮

<div class="aheart-demo-panel">
  <APagination :total="95" :current="1" :page-size="10" :show-quick-jumper="{ goButton: 'Jump' }" />
</div>

```vue
<template>
  <APagination :total="95" :page-size="10" :show-quick-jumper="{ goButton: 'Jump' }" />
</template>
```

## 自定义总数与项目渲染

<div class="aheart-demo-panel">
  <APagination
    :total="96"
    :current="3"
    :page-size="10"
    :show-total="(total, range) => range[0] + '-' + range[1] + ' / ' + total"
    :item-render="(page, type, original) => type === 'page' ? '#' + page : original"
  />
</div>

```vue
<template>
  <APagination
    :total="96"
    :current="3"
    :page-size="10"
    :show-total="(total, range) => range[0] + '-' + range[1] + ' / ' + total"
    :item-render="(page, type, original) => type === 'page' ? '#' + page : original"
  />
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <APagination
    :total="48"
    :current="2"
    :page-size="10"
    show-total
    show-size-changer
    show-quick-jumper
    class-name="demo-pagination"
    root-class-name="demo-pagination-root"
    :class-names="{ activePage: 'demo-pagination-active', quickJumper: 'demo-pagination-jumper' }"
    :styles="{ total: { minWidth: '120px' }, sizeChanger: { width: '104px' } }"
  />
</div>

```vue
<template>
  <APagination
    :total="48"
    :current="2"
    :page-size="10"
    show-total
    show-size-changer
    show-quick-jumper
    class-name="demo-pagination"
    root-class-name="demo-pagination-root"
    :class-names="{ activePage: 'demo-pagination-active', quickJumper: 'demo-pagination-jumper' }"
    :styles="{ total: { minWidth: '120px' }, sizeChanger: { width: '104px' } }"
  />
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
| showTotal | 是否显示总数，或自定义总数文本 | `boolean` \| `(total: number, range: [number, number]) => string \| number` | `false` |
| align | 对齐方式 | `start` \| `center` \| `end` | - |
| showLessItems | 是否显示较少页码 | `boolean` | `false` |
| showSizeChanger | 是否显示每页条数切换器；未设置时总数超过边界会自动显示 | `boolean` | `total > 50` |
| totalBoundaryShowSizeChanger | 自动显示每页条数切换器的总数边界 | `number` | `50` |
| pageSizeOptions | 每页条数选项 | `Array<number \| string>` | `[10, 20, 50, 100]` |
| showQuickJumper | 是否显示快速跳转，可传自定义跳转按钮 | `boolean` \| `{ goButton?: VNodeChild }` | `false` |
| itemRender | 自定义上一页、下一页和页码文本 | `(page: number, type: 'page' \| 'prev' \| 'next', originalElement: string) => string \| number` | - |
| className | 根节点 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化 class 映射 | `Record<'root' \| 'total' \| 'prev' \| 'next' \| 'page' \| 'activePage' \| 'sizeChanger' \| 'quickJumper', string>` | - |
| styles | 语义化 style 映射 | `Record<'root' \| 'total' \| 'prev' \| 'next' \| 'page' \| 'activePage' \| 'sizeChanger' \| 'quickJumper', StyleValue>` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:current | 当前页变化时触发 | `(current: number) => void` |
| update:pageSize | 每页条数变化时触发 | `(pageSize: number) => void` |
| change | 当前页变化时触发 | `(current: number, pageSize: number) => void` |
| showSizeChange | 每页条数变化时触发 | `(current: number, pageSize: number) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-border`
- `--aheart-color-bg`
- `--aheart-color-bg-disabled`
- `--aheart-control-height`
- `--aheart-radius-sm`
