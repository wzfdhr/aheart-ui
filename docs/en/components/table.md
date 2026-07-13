# Table <span class="aheart-status aheart-status--ready">Ready</span>

Table displays structured records with columns, sorting, selection, expansion, pagination, loading, and empty states.

<script setup lang="ts">
import { h } from 'vue'
const tableRenderableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: h('span', { style: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }, 'Engineer filter'),
        value: 'Engineer'
      }
    ]
  }
]
const tableRenderableEmptyText = h('span', { style: { color: 'var(--aheart-color-text)' } }, 'No matching engineers')
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ATable
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', align: 'right' },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
      { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' },
      { key: 'linus', name: 'Linus', age: 42, role: 'Maintainer' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const tableRenderableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: h('span', { style: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }, 'Engineer filter'),
        value: 'Engineer'
      }
    ]
  }
]
const tableRenderableEmptyText = h('span', { style: { color: 'var(--aheart-color-text)' } }, 'No matching engineers')
</script>

<template>
  <ATable
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', align: 'right' },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
      { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' },
      { key: 'linus', name: 'Linus', age: 42, role: 'Maintainer' }
    ]"
  />
</template>
```

## Sorting

<div class="aheart-demo-panel">
  <ATable
    bordered
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age, defaultSortOrder: 'ascend' },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
      { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' },
      { key: 'linus', name: 'Linus', age: 42, role: 'Maintainer' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const tableRenderableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: h('span', { style: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }, 'Engineer filter'),
        value: 'Engineer'
      }
    ]
  }
]
const tableRenderableEmptyText = h('span', { style: { color: 'var(--aheart-color-text)' } }, 'No matching engineers')
</script>

<template>
  <ATable
    bordered
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age, defaultSortOrder: 'ascend' },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
      { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' },
      { key: 'linus', name: 'Linus', age: 42, role: 'Maintainer' }
    ]"
  />
</template>
```

Use `defaultSortOrder` for initial sorting and `sortOrder` for controlled sorting. `sorter: true` performs a basic comparison using the current column `dataIndex`; a function supplies custom comparison logic.

## Custom Rendering and Hidden Columns

<div class="aheart-demo-panel">
  <ATable
    :columns="[
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        customRender: ({ text }) => text + ' ✓'
      },
      { title: 'Secret', dataIndex: 'secret', key: 'secret', hidden: true },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', secret: 'internal', role: 'Architect' },
      { key: 'grace', name: 'Grace', secret: 'internal', role: 'Engineer' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const tableRenderableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: h('span', { style: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }, 'Engineer filter'),
        value: 'Engineer'
      }
    ]
  }
]
const tableRenderableEmptyText = h('span', { style: { color: 'var(--aheart-color-text)' } }, 'No matching engineers')
</script>

<template>
  <ATable
    :columns="[
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        customRender: ({ text }) => text + ' ✓'
      },
      { title: 'Secret', dataIndex: 'secret', key: 'secret', hidden: true },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', secret: 'internal', role: 'Architect' },
      { key: 'grace', name: 'Grace', secret: 'internal', role: 'Engineer' }
    ]"
  />
</template>
```

`title`, `customRender`, and `expandedRowRender` render returned `VNodeChild` values. Columns with `hidden: true` are excluded from header, cell, filtering, sorting, and expanded-row column calculations.

## Filtering

<div class="aheart-demo-panel">
  <ATable
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        defaultFilteredValue: ['Engineer'],
        filters: [
          { text: 'Architect', value: 'Architect' },
          { text: 'Engineer', value: 'Engineer' },
          { text: 'Maintainer', value: 'Maintainer' }
        ]
      },
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: true }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
      { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' },
      { key: 'linus', name: 'Linus', age: 42, role: 'Maintainer' }
    ]"
    :pagination="{ pageSize: 2 }"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const tableRenderableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: h('span', { style: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }, 'Engineer filter'),
        value: 'Engineer'
      }
    ]
  }
]
const tableRenderableEmptyText = h('span', { style: { color: 'var(--aheart-color-text)' } }, 'No matching engineers')
</script>

<template>
  <ATable
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        defaultFilteredValue: ['Engineer'],
        filters: [
          { text: 'Architect', value: 'Architect' },
          { text: 'Engineer', value: 'Engineer' },
          { text: 'Maintainer', value: 'Maintainer' }
        ]
      },
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: true }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
      { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' },
      { key: 'linus', name: 'Linus', age: 42, role: 'Maintainer' }
    ]"
    :pagination="{ pageSize: 2 }"
  />
</template>
```

Filtering supports multiple values by default. Set `filterMultiple: false` to keep one value per column. Use `filteredValue` for controlled filtering and `defaultFilteredValue` for initial filter values.

## Filter Items and Empty State Nodes

<div class="aheart-demo-panel">
  <ATable
    :columns="tableRenderableColumns"
    :data-source="[]"
    :empty-text="tableRenderableEmptyText"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const tableRenderableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: h('span', { style: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }, 'Engineer filter'),
        value: 'Engineer'
      }
    ]
  }
]
const tableRenderableEmptyText = h('span', { style: { color: 'var(--aheart-color-text)' } }, 'No matching engineers')
</script>

<template>
  <ATable
    :columns="tableRenderableColumns"
    :data-source="[]"
    :empty-text="tableRenderableEmptyText"
  />
</template>
```

`filters[].text` and `emptyText` accept `VNodeChild`, allowing emphasized filter labels or reusable custom empty-state content.

## Row Selection

<div class="aheart-demo-panel">
  <ATable
    :row-selection="{ defaultSelectedRowKeys: ['ada'] }"
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
      { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const tableRenderableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: h('span', { style: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }, 'Engineer filter'),
        value: 'Engineer'
      }
    ]
  }
]
const tableRenderableEmptyText = h('span', { style: { color: 'var(--aheart-color-text)' } }, 'No matching engineers')
</script>

<template>
  <ATable
    :row-selection="{ defaultSelectedRowKeys: ['ada'] }"
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
      { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' }
    ]"
  />
</template>
```

## Expandable Rows

<div class="aheart-demo-panel">
  <ATable
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', role: 'Architect', detail: 'Owns design system architecture.' },
      { key: 'grace', name: 'Grace', role: 'Engineer', detail: 'Builds product workflows.' }
    ]"
    :expandable="{ expandedRowRender: (record) => record.detail }"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const tableRenderableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: h('span', { style: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }, 'Engineer filter'),
        value: 'Engineer'
      }
    ]
  }
]
const tableRenderableEmptyText = h('span', { style: { color: 'var(--aheart-color-text)' } }, 'No matching engineers')
</script>

<template>
  <ATable
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[
      { key: 'ada', name: 'Ada', role: 'Architect', detail: 'Owns design system architecture.' },
      { key: 'grace', name: 'Grace', role: 'Engineer', detail: 'Builds product workflows.' }
    ]"
    :expandable="{ expandedRowRender: (record) => record.detail }"
  />
</template>
```

## Pagination and Status

<div class="aheart-demo-panel">
  <AConfigProvider size="small">
    <ATable
      empty-text="No records"
      :pagination="{ current: 1, pageSize: 2, showTotal: true }"
      :columns="[
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Role', dataIndex: 'role', key: 'role' }
      ]"
      :data-source="[
        { key: 'ada', name: 'Ada', role: 'Architect' },
        { key: 'grace', name: 'Grace', role: 'Engineer' },
        { key: 'linus', name: 'Linus', role: 'Maintainer' }
      ]"
    />
  </AConfigProvider>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
const tableRenderableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: h('span', { style: { color: 'var(--aheart-color-primary)', fontWeight: 600 } }, 'Engineer filter'),
        value: 'Engineer'
      }
    ]
  }
]
const tableRenderableEmptyText = h('span', { style: { color: 'var(--aheart-color-text)' } }, 'No matching engineers')
</script>

<template>
  <AConfigProvider size="small">
    <ATable
      empty-text="No records"
      :pagination="{ current: 1, pageSize: 2, showTotal: true }"
      :columns="[
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Role', dataIndex: 'role', key: 'role' }
      ]"
      :data-source="[
        { key: 'ada', name: 'Ada', role: 'Architect' },
        { key: 'grace', name: 'Grace', role: 'Engineer' },
        { key: 'linus', name: 'Linus', role: 'Maintainer' }
      ]"
    />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Table column definitions. | `TableColumn[]` | `[]` |
| dataSource | The record array. | `Record<string, unknown>[]` | `[]` |
| rowKey | The row key field or resolver. | `string` \| `(record) => string \| number` | `key` |
| bordered | Whether to show borders. | `boolean` | `false` |
| loading | Whether to show a loading state. | `boolean` | `false` |
| size | The component size. | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| pagination | Pagination configuration; `false` hides pagination. | `false` \|`TablePaginationConfig` | automatic |
| rowSelection | Row-selection configuration. | `TableRowSelection` | - |
| expandable | Expandable-row configuration. | `TableExpandable` | - |
| showHeader | Whether to show the header. | `boolean` | `true` |
| emptyText | Empty-state content. | `VNodeChild` | ConfigProvider locale.empty.description |

### TableColumn

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| title | The column title. | `VNodeChild` | - |
| dataIndex | The record data path. | `string` \|`number` \|`(string \|number)[]` | - |
| key | The unique column key. | `string` | `dataIndex` |
| align | The column alignment. | `left` \|`center` \|`right` | `left` |
| width | The column width. | `string` \|`number` | - |
| className | A compatibility CSS class for the root element. | `string` | - |
| hidden | Whether to hide this column. | `boolean` | `false` |
| sorter | Whether to sort by column value, or a local sorter function. | `boolean` \|`(a, b) => number` | - |
| sortOrder | The controlled sort direction. | `ascend` \| `descend` | - |
| defaultSortOrder | The initial sort direction. | `ascend` \| `descend` | - |
| filters | Filter options. | `TableColumnFilter[]` | - |
| filteredValue | The controlled filter values. | `(string \| number \| boolean)[]` | - |
| defaultFilteredValue | The initial filter values. | `(string \| number \| boolean)[]` | - |
| filterMultiple | Whether multiple filter values are allowed. | `boolean` | `true` |
| ellipsis | Whether text is truncated with an ellipsis. | `boolean` | `false` |
| customRender | Custom cell renderer; its returned content is rendered as a node. | `(context) => VNodeChild` | - |

### TableColumnFilter

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| text | The copied text. | `VNodeChild` | - |
| value | The value. | `string` \| `number` \| `boolean` | - |

### TableRowSelection

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| selectedRowKeys | The controlled selected row keys. | `(string \| number)[]` | - |
| defaultSelectedRowKeys | The initial selected row keys. | `(string \| number)[]` | `[]` |
| type | The value type. | `checkbox` \|`radio` | `checkbox` |
| disabled | Whether the component is disabled. | `boolean` | `false` |

### TableExpandable

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| expandedRowKeys | The controlled expanded row keys. | `(string \| number)[]` | - |
| defaultExpandedRowKeys | The initial expanded row keys. | `(string \| number)[]` | `[]` |
| expandedRowRender | Expanded-row content; returned content is rendered as a node. | `(record, index) => VNodeChild` | - |
| rowExpandable | Whether a record may be expanded. | `(record) => boolean` | - |

### TablePaginationConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| current | The controlled current page. | `number` | - |
| defaultCurrent | The initial uncontrolled page. | `number` | `1` |
| pageSize | The controlled page size. | `number` | - |
| defaultPageSize | The initial uncontrolled page size. | `number` | `10` |
| total | The total number of records. | `number` | `dataSource.length` |
| simple | Whether to use simple pagination. | `boolean` | `false` |
| hideOnSinglePage | Whether to hide pagination when there is one page. | `boolean` | `false` |
| showTotal | Whether to show the total count. | `boolean` | `false` |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| change | Fires when pagination, filters, or sorting changes. | `(pagination, filters, sorter, extra) => void` |
| update:selectedRowKeys | Fires when row selection changes. | `(keys) => void` |
| select | Fires when a row is selected. | `(key, selected, record, selectedRowKeys) => void` |
| expand | Fires when a row’s expanded state changes. | `(expanded, record, key) => void` |

### TableChangeExtra

| Field | Description | Type |
| --- | --- | --- |
| currentDataSource | The data after current filtering and sorting. | `Record<string, unknown>[]` |
| action | The change source. | `paginate` \|`sort` \|`filter` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-color-bg`
- `--aheart-radius`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
