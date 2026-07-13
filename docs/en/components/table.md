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
<template>
  <ATable :columns="columns" :data-source="dataSource" />
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
<template>
  <ATable
    bordered
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: true, defaultSortOrder: 'ascend' }
    ]"
    :data-source="dataSource"
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
<template>
  <ATable
    :columns="[
      {
        title: h('span', { class: 'column-title' }, 'Name'),
        dataIndex: 'name',
        key: 'name',
        customRender: ({ text }) => h('strong', String(text))
      },
      { title: 'Secret', dataIndex: 'secret', key: 'secret', hidden: true }
    ]"
    :data-source="dataSource"
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
<template>
  <ATable
    :columns="[
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        filters: [
          { text: 'Architect', value: 'Architect' },
          { text: 'Engineer', value: 'Engineer' }
        ],
        filterMultiple: false
      }
    ]"
    :data-source="dataSource"
    @change="handleTableChange"
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
<template>
  <ATable :columns="columns" :data-source="[]" :empty-text="emptyText" />
</template>

<script setup lang="ts">
import { h } from 'vue'

const columns = [
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [{ text: h('span', { class: 'filter-node' }, 'Engineer filter'), value: 'Engineer' }]
  }
]

const emptyText = h('span', { class: 'empty-node' }, 'No matching engineers')
</script>
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
<template>
  <ATable
    :row-selection="{ selectedRowKeys, type: 'checkbox' }"
    :columns="columns"
    :data-source="dataSource"
    @update:selected-row-keys="selectedRowKeys = $event"
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
<template>
  <ATable
    :columns="columns"
    :data-source="dataSource"
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
<template>
  <AConfigProvider size="small">
    <ATable
      :pagination="{ current: 1, pageSize: 2, showTotal: true }"
      :columns="columns"
      :data-source="dataSource"
    />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Configures `columns`. | `TableColumn[]` | `[]` |
| dataSource | Configures `dataSource`. | `Record<string, unknown>[]` | `[]` |
| rowKey | Configures `rowKey`. | `string` \| `(record) => string \| number` | `key` |
| bordered | Configures `bordered`. | `boolean` | `false` |
| loading | Configures `loading`. | `boolean` | `false` |
| size | Configures `size`. | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| pagination | Configures `pagination`. | `false` \|`TablePaginationConfig` | automatic |
| rowSelection | Configures `rowSelection`. | `TableRowSelection` | - |
| expandable | Configures `expandable`. | `TableExpandable` | - |
| showHeader | Configures `showHeader`. | `boolean` | `true` |
| emptyText | Configures `emptyText`. | `VNodeChild` | ConfigProvider locale.empty.description |

### TableColumn

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| title | Configures `title`. | `VNodeChild` | - |
| dataIndex | Configures `dataIndex`. | `string` \|`number` \|`(string \|number)[]` | - |
| key | Configures `key`. | `string` | `dataIndex` |
| align | Configures `align`. | `left` \|`center` \|`right` | `left` |
| width | Configures `width`. | `string` \|`number` | - |
| className | Configures `className`. | `string` | - |
| hidden | Configures `hidden`. | `boolean` | `false` |
| sorter | Configures `sorter`. | `boolean` \|`(a, b) => number` | - |
| sortOrder | Configures `sortOrder`. | `ascend` \| `descend` | - |
| defaultSortOrder | Configures `defaultSortOrder`. | `ascend` \| `descend` | - |
| filters | Configures `filters`. | `TableColumnFilter[]` | - |
| filteredValue | Configures `filteredValue`. | `(string \| number \| boolean)[]` | - |
| defaultFilteredValue | Configures `defaultFilteredValue`. | `(string \| number \| boolean)[]` | - |
| filterMultiple | Configures `filterMultiple`. | `boolean` | `true` |
| ellipsis | Configures `ellipsis`. | `boolean` | `false` |
| customRender | Configures `customRender`. | `(context) => VNodeChild` | - |

### TableColumnFilter

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| text | Configures `text`. | `VNodeChild` | - |
| value | Configures `value`. | `string` \| `number` \| `boolean` | - |

### TableRowSelection

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| selectedRowKeys | Configures `selectedRowKeys`. | `(string \| number)[]` | - |
| defaultSelectedRowKeys | Configures `defaultSelectedRowKeys`. | `(string \| number)[]` | `[]` |
| type | Configures `type`. | `checkbox` \|`radio` | `checkbox` |
| disabled | Configures `disabled`. | `boolean` | `false` |

### TableExpandable

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| expandedRowKeys | Configures `expandedRowKeys`. | `(string \| number)[]` | - |
| defaultExpandedRowKeys | Configures `defaultExpandedRowKeys`. | `(string \| number)[]` | `[]` |
| expandedRowRender | Configures `expandedRowRender`. | `(record, index) => VNodeChild` | - |
| rowExpandable | Configures `rowExpandable`. | `(record) => boolean` | - |

### TablePaginationConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| current | Configures `current`. | `number` | - |
| defaultCurrent | Configures `defaultCurrent`. | `number` | `1` |
| pageSize | Configures `pageSize`. | `number` | - |
| defaultPageSize | Configures `defaultPageSize`. | `number` | `10` |
| total | Configures `total`. | `number` | `dataSource.length` |
| simple | Configures `simple`. | `boolean` | `false` |
| hideOnSinglePage | Configures `hideOnSinglePage`. | `boolean` | `false` |
| showTotal | Configures `showTotal`. | `boolean` | `false` |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| change | Emitted when `change` occurs. | `(pagination, filters, sorter, extra) => void` |
| update:selectedRowKeys | Emitted when `update:selectedRowKeys` occurs. | `(keys) => void` |
| select | Emitted when `select` occurs. | `(key, selected, record, selectedRowKeys) => void` |
| expand | Emitted when `expand` occurs. | `(expanded, record, key) => void` |

### TableChangeExtra

| Field | Description | Type |
| --- | --- | --- |
| currentDataSource | Describes `currentDataSource`. | `Record<string, unknown>[]` |
| action | Describes `action`. | `paginate` \|`sort` \|`filter` |

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
