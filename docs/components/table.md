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

# Table 表格 <span class="aheart-status aheart-status--ready">Ready</span>

Table displays structured records with columns, sorting, selection, expansion, pagination, loading, and empty states.

## 基础用法

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

## 排序

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

使用 `defaultSortOrder` 设置默认排序，使用 `sortOrder` 接管排序状态。`sorter: true` 会按当前列 `dataIndex` 的值进行基础比较，传入函数时使用自定义比较逻辑。

## 自定义渲染与隐藏列

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

`title`、`customRender` 和 `expandedRowRender` 都会渲染返回的 `VNodeChild`；`hidden: true` 的列不会参与表头、单元格、筛选、排序和展开行列数计算。

## 筛选

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

筛选默认支持多选，设置 `filterMultiple: false` 后同一列只保留一个筛选值。使用 `filteredValue` 可以接管筛选状态，使用 `defaultFilteredValue` 可以设置初始筛选值。

## 筛选项与空态节点

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

`filters[].text` 和 `emptyText` 都支持 `VNodeChild`，可以用于强调筛选标签或复用自定义空态内容。

## 行选择

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

## 展开行

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

## 分页与状态

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置 | `TableColumn[]` | `[]` |
| dataSource | 数据数组 | `Record<string, unknown>[]` | `[]` |
| rowKey | 行 key | `string` \| `(record) => string \| number` | `key` |
| bordered | 是否显示边框 | `boolean` | `false` |
| loading | 是否显示加载遮罩 | `boolean` | `false` |
| size | 表格尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用交互 | `boolean` | ConfigProvider disabled |
| pagination | 分页配置，设为 `false` 时隐藏 | `false` \| `TablePaginationConfig` | 自动 |
| rowSelection | 行选择配置 | `TableRowSelection` | - |
| expandable | 展开行配置 | `TableExpandable` | - |
| showHeader | 是否显示表头 | `boolean` | `true` |
| emptyText | 空状态内容 | `VNodeChild` | ConfigProvider locale.empty.description |

### TableColumn

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列标题 | `VNodeChild` | - |
| dataIndex | 数据字段路径 | `string` \| `number` \| `(string \| number)[]` | - |
| key | 列唯一标识 | `string` | `dataIndex` |
| align | 对齐方式 | `left` \| `center` \| `right` | `left` |
| width | 列宽 | `string` \| `number` | - |
| className | 自定义类名 | `string` | - |
| hidden | 是否隐藏该列 | `boolean` | `false` |
| sorter | 是否按列值排序，或本地排序函数 | `boolean` \| `(a, b) => number` | - |
| sortOrder | 受控排序方向 | `ascend` \| `descend` | - |
| defaultSortOrder | 默认排序方向 | `ascend` \| `descend` | - |
| filters | 筛选项 | `TableColumnFilter[]` | - |
| filteredValue | 受控筛选值 | `(string \| number \| boolean)[]` | - |
| defaultFilteredValue | 默认筛选值 | `(string \| number \| boolean)[]` | - |
| filterMultiple | 是否允许多选筛选 | `boolean` | `true` |
| ellipsis | 是否省略文本 | `boolean` | `false` |
| customRender | 自定义单元格渲染函数，返回内容会作为节点渲染 | `(context) => VNodeChild` | - |

### TableColumnFilter

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 筛选按钮内容 | `VNodeChild` | - |
| value | 筛选值 | `string` \| `number` \| `boolean` | - |

### TableRowSelection

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| selectedRowKeys | 受控选中 keys | `(string \| number)[]` | - |
| defaultSelectedRowKeys | 默认选中 keys | `(string \| number)[]` | `[]` |
| type | 选择类型 | `checkbox` \| `radio` | `checkbox` |
| disabled | 是否禁用选择 | `boolean` | `false` |

### TableExpandable

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| expandedRowKeys | 受控展开 keys | `(string \| number)[]` | - |
| defaultExpandedRowKeys | 默认展开 keys | `(string \| number)[]` | `[]` |
| expandedRowRender | 展开行内容，返回内容会作为节点渲染 | `(record, index) => VNodeChild` | - |
| rowExpandable | 是否允许展开当前行 | `(record) => boolean` | - |

### TablePaginationConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| current | 当前页 | `number` | - |
| defaultCurrent | 默认当前页 | `number` | `1` |
| pageSize | 每页条数 | `number` | - |
| defaultPageSize | 默认每页条数 | `number` | `10` |
| total | 数据总数 | `number` | `dataSource.length` |
| simple | 是否简洁模式 | `boolean` | `false` |
| hideOnSinglePage | 只有一页时隐藏 | `boolean` | `false` |
| showTotal | 是否显示总数 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 分页、筛选或排序变化时触发 | `(pagination, filters, sorter, extra) => void` |
| update:selectedRowKeys | 选择项变化时触发 | `(keys) => void` |
| select | 选择某一行时触发 | `(key, selected, record, selectedRowKeys) => void` |
| expand | 展开状态变化时触发 | `(expanded, record, key) => void` |

### TableChangeExtra

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| currentDataSource | 当前筛选和排序后的数据 | `Record<string, unknown>[]` |
| action | 触发来源 | `paginate` \| `sort` \| `filter` |

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
