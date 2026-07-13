# Pagination <span class="aheart-status aheart-status--ready">Ready</span>

Pagination navigates paged data with controlled or uncontrolled current page state.



## Basic Usage

<div class="aheart-demo-panel">
  <APagination :total="42" :page-size="10" :current="2" show-total />
</div>

```vue
<template>
  <APagination v-model:current="page" :total="42" :page-size="10" show-total />
</template>
```

## content

<div class="aheart-demo-panel">
  <APagination :total="20" :current="1" :page-size="10" simple />
</div>

```vue
<template>
  <APagination :total="20" :current="1" :page-size="10" simple />
</template>
```

## contentandcontent

<div class="aheart-demo-panel">
  <APagination :total="200" :current="10" :page-size="10" align="center" show-less-items />
</div>

```vue
<template>
  <APagination :total="200" :current="10" :page-size="10" align="center" show-less-items />
</template>
```

## content

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

## content

<div class="aheart-demo-panel">
  <APagination :total="95" :current="1" :page-size="10" show-quick-jumper />
</div>

```vue
<template>
  <APagination :total="95" :page-size="10" show-quick-jumper />
</template>
```

## customcontent

<div class="aheart-demo-panel">
  <APagination :total="95" :current="1" :page-size="10" :show-quick-jumper="{ goButton: 'Jump' }" />
</div>

```vue
<template>
  <APagination :total="95" :page-size="10" :show-quick-jumper="{ goButton: 'Jump' }" />
</template>
```

## customcontentanditemrender

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

## globaldisableandsize

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
| total | Configures `total`. | `number` | `0` |
| current | Configures `current`. | `number` | - |
| defaultCurrent | Configures `defaultCurrent`. | `number` | `1` |
| pageSize | Configures `pageSize`. | `number` | - |
| defaultPageSize | Configures `defaultPageSize`. | `number` | `10` |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| size | Configures `size`. | `large` \| `middle` \| `small` | ConfigProvider size |
| simple | Configures `simple`. | `boolean` | `false` |
| hideOnSinglePage | Configures `hideOnSinglePage`. | `boolean` | `false` |
| showTotal | Configures `showTotal`. | `boolean` \|`(total: number, range: [number, number]) => string \|number` | `false` |
| align | Configures `align`. | `start` \|`center` \|`end` | - |
| showLessItems | Configures `showLessItems`. | `boolean` | `false` |
| showSizeChanger | Configures `showSizeChanger`. | `boolean` | `total > 50` |
| totalBoundaryShowSizeChanger | Configures `totalBoundaryShowSizeChanger`. | `number` | `50` |
| pageSizeOptions | Configures `pageSizeOptions`. | `Array<number \|string>` | `[10, 20, 50, 100]` |
| showQuickJumper | Configures `showQuickJumper`. | `boolean` \|`{ goButton?: VNodeChild }` | `false` |
| itemRender | Configures `itemRender`. | `(page: number, type: 'page' \|'prev' \|'next', originalElement: string) => string \|number` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Record<'root' \|'total' \|'prev' \|'next' \|'page' \|'activePage' \|'sizeChanger' \|'quickJumper', string>` | - |
| styles | Configures `styles`. | `Record<'root' \|'total' \|'prev' \|'next' \|'page' \|'activePage' \|'sizeChanger' \|'quickJumper', StyleValue>` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:current | Emitted when `update:current` occurs. | `(current: number) => void` |
| update:pageSize | Emitted when `update:pageSize` occurs. | `(pageSize: number) => void` |
| change | Emitted when `change` occurs. | `(current: number, pageSize: number) => void` |
| showSizeChange | Emitted when `showSizeChange` occurs. | `(current: number, pageSize: number) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-border`
- `--aheart-color-bg`
- `--aheart-color-bg-disabled`
- `--aheart-control-height`
- `--aheart-radius-sm`
