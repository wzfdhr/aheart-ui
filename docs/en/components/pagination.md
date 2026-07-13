# Pagination <span class="aheart-status aheart-status--ready">Ready</span>

Pagination navigates paged data with controlled or uncontrolled current page state.



## Basic Usage

<div class="aheart-demo-panel">
  <APagination :total="42" :page-size="10" :current="2" show-total />
</div>

```vue
<template>
<APagination :total="42" :page-size="10" :current="2" show-total />
</template>
```

## Simple Mode

<div class="aheart-demo-panel">
  <APagination :total="20" :current="1" :page-size="10" simple />
</div>

```vue
<template>
<APagination :total="20" :current="1" :page-size="10" simple />
</template>
```

## Alignment and Fewer Page Numbers

<div class="aheart-demo-panel">
  <APagination :total="200" :current="10" :page-size="10" align="center" show-less-items />
</div>

```vue
<template>
<APagination :total="200" :current="10" :page-size="10" align="center" show-less-items />
</template>
```

## Page Size

<div class="aheart-demo-panel">
  <APagination :total="95" :current="2" :page-size="10" :page-size-options="[10, 20, 50]" />
</div>

```vue
<template>
<APagination :total="95" :current="2" :page-size="10" :page-size-options="[10, 20, 50]" />
</template>
```

## Quick Jumper

<div class="aheart-demo-panel">
  <APagination :total="95" :current="1" :page-size="10" show-quick-jumper />
</div>

```vue
<template>
<APagination :total="95" :current="1" :page-size="10" show-quick-jumper />
</template>
```

## Custom Jump Button

<div class="aheart-demo-panel">
  <APagination :total="95" :current="1" :page-size="10" :show-quick-jumper="{ goButton: 'Jump' }" />
</div>

```vue
<template>
<APagination :total="95" :current="1" :page-size="10" :show-quick-jumper="{ goButton: 'Jump' }" />
</template>
```

## Custom Total and Item Rendering

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

## Semantic Styling

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

## Global Disabled State and Size

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

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| total | Total number of items. | `number` | `0` |
| current | Current page in controlled mode. | `number` | - |
| defaultCurrent | Initial current page. | `number` | `1` |
| pageSize | Items per page. | `number` | - |
| defaultPageSize | Initial items per page. | `number` | `10` |
| disabled | Whether interaction is disabled. | `boolean` | ConfigProvider disabled |
| size | Component size. | `large` \| `middle` \| `small` | ConfigProvider size |
| simple | Whether to use simple mode. | `boolean` | `false` |
| hideOnSinglePage | Whether to hide when there is only one page. | `boolean` | `false` |
| showTotal | Whether to show the total, or a renderer for total text. | `boolean` \|`(total: number, range: [number, number]) => string \|number` | `false` |
| align | Alignment. | `start` \|`center` \|`end` | - |
| showLessItems | Whether to show fewer page numbers. | `boolean` | `false` |
| showSizeChanger | Whether to show the page-size selector. | `boolean` | `total > 50` |
| totalBoundaryShowSizeChanger | Total threshold for automatically showing the page-size selector. | `number` | `50` |
| pageSizeOptions | Available page-size options. | `Array<number \|string>` | `[10, 20, 50, 100]` |
| showQuickJumper | Whether to show quick navigation, optionally with a custom button. | `boolean` \|`{ goButton?: VNodeChild }` | `false` |
| itemRender | Custom renderer for previous, next, and page labels. | `(page: number, type: 'page' \|'prev' \|'next', originalElement: string) => string \|number` | - |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `Record<'root' \|'total' \|'prev' \|'next' \|'page' \|'activePage' \|'sizeChanger' \|'quickJumper', string>` | - |
| styles | Semantic DOM styles, as an object or function. | `Record<'root' \|'total' \|'prev' \|'next' \|'page' \|'activePage' \|'sizeChanger' \|'quickJumper', StyleValue>` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:current | Fired when the current page changes. | `(current: number) => void` |
| update:pageSize | Fired when the page size changes. | `(pageSize: number) => void` |
| change | Fired when the current page changes. | `(current: number, pageSize: number) => void` |
| showSizeChange | Fired when the page size changes. | `(current: number, pageSize: number) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-border`
- `--aheart-color-bg`
- `--aheart-color-bg-disabled`
- `--aheart-control-height`
- `--aheart-radius-sm`
