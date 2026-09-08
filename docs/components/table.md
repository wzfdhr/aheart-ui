<script setup lang="ts">
import { computed, h, ref } from 'vue'

const tablePage = ref(1)
const tableServerPage = ref(5)

const d5Rows = [
  { key: 1, name: '数字键客户', score: 60 },
  { key: '1', name: '字符串键客户', score: 20 },
  { key: 2, name: '禁止选择客户', score: 90, locked: true },
  { key: 3, name: '第二页客户甲', score: 40 },
  { key: 4, name: '第二页客户乙', score: 80 },
  { key: 5, name: '第二页客户丙', score: 10 }
]

const d5bFilterOpen = ref(false)
const d5bRejectFilterOpen = ref(false)
const d5bLoading = ref(false)
const d5bError = ref(false)
const d5bEmpty = ref(false)
const d5bRetryCount = ref(0)
const d5bCustomActionCount = ref(0)
const d5bFilterValue = ref('')
const d5bRows = [
  { key: 'b-1', name: 'Ada', role: 'Architect', score: 96 },
  { key: 'b-2', name: 'Grace', role: 'Engineer', score: 88 },
  { key: 'b-3', name: 'Linus', role: 'Maintainer', score: 78 },
  { key: 'b-4', name: 'Margaret', role: 'Engineer', score: 91 },
  { key: 'b-5', name: 'James', role: 'Architect', score: 83 }
]
const d5bLongContent = ref(false)
const d5bDisplayRows = computed(() => d5bLongContent.value
  ? d5bRows.map(row => ({ ...row, score: `${row.score} ${'长内容'.repeat(420)}` }))
  : d5bRows)
const d5bExternalRows = Array.from({ length: 18 }, (_, index) => ({ key: `external-${index}`, name: `外部滚动行 ${index + 1}`, score: index + 1 }))
const d5bExternalColumns = [
  { title: '外部姓名', dataIndex: 'name', key: 'name', width: 180 },
  { title: '外部评分', dataIndex: 'score', key: 'score', width: 120 }
]
const d5bFilterDropdown = ({ selectedKeys, setSelectedKeys, confirm, clearFilters, close }: any) => h(
  'div',
  { class: 'd5b-filter-controls' },
  [
    h('input', {
      'data-d5b-filter-input': true,
      'aria-label': '筛选姓名',
      value: selectedKeys?.[0] ?? '',
      placeholder: '输入姓名',
      onInput: (event: Event) => {
        const value = (event.target as HTMLInputElement).value
        setSelectedKeys(value ? [value] : [])
      }
    }),
    h('button', { type: 'button', 'data-d5b-filter-confirm': true, onClick: () => { d5bFilterValue.value = selectedKeys?.[0] ?? ''; confirm() } }, '确认'),
    h('button', { type: 'button', 'data-d5b-filter-reset': true, onClick: () => { d5bFilterValue.value = ''; clearFilters() } }, 'Reset'),
    h('button', { type: 'button', 'data-d5b-filter-cancel': true, onClick: close }, 'Cancel')
  ]
)
const d5bColumns = computed(() => [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 160, fixed: 'left' as const, filterDropdown: d5bFilterDropdown, filterDropdownOpen: d5bFilterOpen.value },
  { title: '评分', dataIndex: 'score', key: 'score', sorter: true, customRender: ({ text }: { text: unknown }) => h('button', { type: 'button', 'data-d5b-custom-action': true, onClick: () => d5bCustomActionCount.value++ }, String(text)) },
  { title: '角色', dataIndex: 'role', key: 'role', width: 160, fixed: 'right' as const, filterDropdown: d5bFilterDropdown, filterDropdownOpen: d5bFilterOpen.value }
])
function d5bFilterOpenChange(_key: string, open: boolean) {
  if (open && d5bRejectFilterOpen.value) return
  d5bFilterOpen.value = open
}
function d5bRetry() {
  d5bRetryCount.value++
  d5bError.value = false
}
const d5Columns = [{ title: '客户', key: 'name', dataIndex: 'name' }, { title: '评分', key: 'score', dataIndex: 'score', sorter: true }]
const d5Selected = ref<Array<string | number>>([])
const d5AcceptSelection = ref(true)
const d5SelectionRequests = ref(0)
const d5Selection = computed(() => ({
  selectedRowKeys: d5Selected.value,
  getCheckboxProps: (row: { locked?: boolean }) => ({ disabled: Boolean(row.locked) }),
  preserveSelectedRowKeys: true
}))
function d5Select(keys: Array<string | number>) {
  d5SelectionRequests.value++
  if (d5AcceptSelection.value) d5Selected.value = [...keys]
}
const d5ServerRows = [{ key: 'remote-a', name: '服务器先返回高分', score: 90 }, { key: 'remote-b', name: '服务器后返回低分', score: 20 }]
const d5ServerPage = ref(2)
const d5ServerOrder = ref<'ascend' | 'descend' | null>(null)
const d5ServerFilters = ref<Array<number>>([])
const d5ServerColumns = computed(() => [
  { title: '服务端客户', key: 'name', dataIndex: 'name' },
  { title: '服务端评分', key: 'score', dataIndex: 'score', sorter: true, sortOrder: d5ServerOrder.value, filters: [{ text: '只看高分', value: 90 }], filteredValue: d5ServerFilters.value }
])
const d5Pending = ref<{ current: number; order: 'ascend' | 'descend' | null; filters: number[]; action: string } | null>(null)
function d5ServerChange(pagination: { current: number }, filters: Record<string, number[]>, sorter: { order?: 'ascend' | 'descend' }, extra: { action: string }) {
  d5Pending.value = { current: pagination.current, order: sorter.order ?? null, filters: [...(filters.score ?? [])], action: extra.action }
}
function d5AcceptServer() {
  if (!d5Pending.value) return
  d5ServerPage.value = d5Pending.value.current
  d5ServerOrder.value = d5Pending.value.order
  d5ServerFilters.value = [...d5Pending.value.filters]
  d5Pending.value = null
}
const d5Size = ref(10)
const d5Page = ref(5)
const d5AcceptPagination = ref(false)
const d5PageRequests = ref(0)
const d5RadioRequests = ref(0)
function d5PageChange(pagination: { current: number; pageSize: number }) {
  d5PageRequests.value++
  if (d5AcceptPagination.value) {
    d5Page.value = pagination.current
    d5Size.value = pagination.pageSize
  }
}

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

# Table 表格 <span class="aheart-status aheart-status--ready">已完成</span>

Table displays structured records with columns, sorting, selection, expansion, pagination, loading, and empty states.

默认空状态文案来自 ConfigProvider 的 `table.emptyText`；`empty-text` prop 仍优先于 locale。

```vue
<script setup lang="ts">
import { enUS } from 'aheart-ui'
</script>

<template>
  <AConfigProvider :locale="enUS">
    <ATable :columns="[]" :data-source="[]" />
  </AConfigProvider>
</template>
```

## 基础用法

<div class="aheart-demo-panel q4-table-basic-demo">
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

<div class="aheart-demo-panel q4-table-sort-demo">
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

<div class="aheart-demo-panel q4-table-custom-demo">
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

<div class="aheart-demo-panel q4-table-filter-demo">
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

<div class="aheart-demo-panel q4-table-renderable-demo">
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

<div class="aheart-demo-panel q4-table-selection-demo">
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

<div class="aheart-demo-panel q4-table-expand-demo">
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

<div class="aheart-demo-panel q4-table-pagination-demo">
  <AConfigProvider size="small">
    <ATable
      empty-text="No records"
      :pagination="{ current: tablePage, pageSize: 2, showTotal: true }"
      :columns="[
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Role', dataIndex: 'role', key: 'role' }
      ]"
      :data-source="[
        { key: 'ada', name: 'Ada', role: 'Architect' },
        { key: 'grace', name: 'Grace', role: 'Engineer' },
        { key: 'linus', name: 'Linus', role: 'Maintainer' }
      ]"
      @change="pagination => tablePage = pagination.current"
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

## 服务端分页

<div class="aheart-demo-panel q4-table-server-demo">
  <ATable
    :pagination="{ current: tableServerPage, pageSize: 10, total: 100, showTotal: true }"
    :columns="[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Role', dataIndex: 'role', key: 'role' }
    ]"
    :data-source="[{ key: 'page-5-record', name: 'Page 5 record', role: 'Remote result' }]"
    @change="pagination => tableServerPage = pagination.current"
  />
</div>

```vue
<template>
  <ATable
    :data-source="currentPageRows"
    :columns="columns"
    :pagination="{ current: page, pageSize: 10, total }"
    @change="loadPage"
  />
</template>
```

设置 `pagination.total` 后，`dataSource` 视为业务层已加载的当前页数据，Table 不会再次本地切片；分页事件仍通过 `change` 交给业务层请求下一页。

## D5-A 数据与受控行为

以下示例用于验证D5-A的数据/选择/分页契约，不表示筛选浮层、固定列、错误态或Table虚拟滚动已经完成。

### 本地分页、行禁用与跨页全选

<section class="aheart-demo-panel d5-table-selection" aria-label="D5 本地客户选择">
  <AButton :aria-pressed="!d5AcceptSelection" @click="d5AcceptSelection = !d5AcceptSelection">拒绝选择更新</AButton>
  <p role="status">已选：{{ d5Selected.map(key => `${typeof key}:${key}`).join('、') || '无' }}；选择请求：{{ d5SelectionRequests }}</p>
  <ATable data-mode="local" :columns="d5Columns" :data-source="d5Rows" :pagination="{ defaultPageSize: 3, total: 999, showSizeChanger: false }" :row-selection="d5Selection" @update:selected-row-keys="d5Select" />
</section>

显式`local`忽略传入的`pagination.total`，按本地筛选结果分页。全选仅改变当前页可选行，禁用行排除，其他页已选key保留；数字`1`与字符串`'1'`是两个不同身份。服务端/跨页场景必须提供稳定唯一的`rowKey`，不能依靠数组索引。

### 受控单选拒绝后恢复整组状态

<section class="aheart-demo-panel d5-table-radio" aria-label="D5 受控单选">
  <p role="status">父层保持第一个客户；单选请求：{{ d5RadioRequests }}</p>
  <ATable data-mode="local" :columns="d5Columns" :data-source="d5Rows.slice(0, 2)" :pagination="false" :row-selection="{ type: 'radio', selectedRowKeys: [1] }" @update:selected-row-keys="d5RadioRequests++" />
</section>

### 服务端数据只按响应顺序展示

<section class="aheart-demo-panel d5-table-server" aria-label="D5 服务端请求">
  <AButton :disabled="!d5Pending" @click="d5AcceptServer">接受服务端请求</AButton>
  <p role="status">{{ d5Pending ? `待接受：${d5Pending.action}，页码${d5Pending.current}` : '没有待接受请求' }}</p>
  <ATable data-mode="server" :columns="d5ServerColumns" :data-source="d5ServerRows" :pagination="{ current: d5ServerPage, pageSize: 2, total: 20, showSizeChanger: false }" @change="d5ServerChange" />
</section>

`server`不在浏览器内排序、筛选或二次切页；`change`只提出请求。受控字段未被父层接受前保持原值。此例用按钮模拟父层接受，不发真实网络请求；数据始终按当前传入响应顺序显示。

### 受控页大小：拒绝与接受

<section class="aheart-demo-panel d5-table-pagination" aria-label="D5 受控分页">
  <AButton :aria-pressed="d5AcceptPagination" @click="d5AcceptPagination = !d5AcceptPagination">接受分页更新</AButton>
  <p role="status">当前页：{{ d5Page }}；每页：{{ d5Size }}；分页请求：{{ d5PageRequests }}</p>
  <ATable data-mode="server" :columns="d5Columns" :data-source="d5ServerRows" :pagination="{ current: d5Page, pageSize: d5Size, total: 95, showSizeChanger: true, pageSizeOptions: [10, 20, 50], showQuickJumper: true }" @change="d5PageChange" />
</section>

`pageSize`被拒绝时，选择器和页码回到父层值；接受后Table与独立Pagination使用同一整数归一化边界。`loading`的交互策略本批保持原行为，`disabled`仍禁用用户操作。

## D5-C 虚拟表格运行工作台（RED 契约）

D5-C 的运行工作台覆盖 1k/10k 行、本地/服务端当前页、固定列、展开伴随行和选择组合。入口必须提供以下五个可审计区域：`D5-C 10k 本地虚拟表格`、`D5-C 服务端分页虚拟表格`、`D5-C 固定列展开选择组合`、`D5-C 兼容性回退`、`D5-C SSR 与嵌入式容器`。它们由 `e2e/d5-table-c.spec.ts` 驱动，移动视口、125% zoom、iframe ownerDocument 和 SSR hydration 也必须无控制台错误。

虚拟配置的冻结默认值为：`virtual.height` 优先于 `scroll.y`；没有 `virtual.height` 时，解析后的 `scroll.y` 必须严格大于 `320` 才启用虚拟化，`scroll.y <= 320` 回退 full DOM。估算行高为 `small=40`、`middle=48`、`large=56`，可用 `virtual.estimateSize` 覆盖为 number；`overscan=4`。`height` 与 `scroll.y` 冲突必须在开发环境告警。`virtual` 默认 `false`，显式 `true` 使用上述默认值。每个虚拟表必须公开逻辑 `aria-rowcount`、上下 spacer row；一个展开基础行及其 companion row 必须作为同一个 logical item，展开内容通过 `ResizeObserver` 动态测量并更新该 item 高度。`rowspan`、非法或重复 `rowKey` 必须告警并回退 full DOM。

虚拟化是 Table 的公开行为契约，不公开 TanStack 实例、`scrollToIndex` 或基于滚动阈值的 `auto` 模式；消费者只配置 `virtual`、`height`、`estimateSize` 与 `overscan`。

消费者与性能入口位于 `docs/superpowers/experiments/d5-c-consumer/` 和 `scripts/d5-table-c-perf.mjs`。性能脚本只接受真实构建消费者 URL，不会把缺失测量伪报为通过；目标门禁为 10k 首次虚拟化 ≤500ms、相对 full-DOM 中位数 ≤50%、long task ≤100ms、CLS ≤0.1，以及相对 D5-A gzip 增量 ≤12KB。

新用法请明确填写`dataMode='local'`或`'server'`。省略时保留历史兼容：始终本地排序/筛选，存在`pagination.total`时不再切片；不要将该混合路径视为推荐的服务端模式。

## D5-B 筛选、布局与韧性状态

下面的交互工作台覆盖 D5-B 的真实 DOM 行为：筛选草稿的确认、Reset、Cancel、Escape 和 outside 关闭；受控打开被父层拒绝时保持关闭；固定列与 selection/expand utility 列的连续偏移；`scroll.x` 窄屏横向滚动、`scroll.y` 表内滚动和 sticky 表头；loading 保留旧行并锁定交互，error 保留旧行且只允许 retry，empty 显示空态。该批不包含 D5-C 虚拟滚动。

<style>
.d5-table-b-utility-width .aheart-table__selection-cell,
.d5-table-b-utility-width .aheart-table__expand-cell {
  min-width: 80px !important;
}
</style>

<section class="aheart-demo-panel d5-table-b d5-table-b-utility-width" aria-label="D5-B 筛选布局状态">
  <div class="d5-table-b__actions">
    <AButton :aria-pressed="d5bRejectFilterOpen" @click="d5bRejectFilterOpen = !d5bRejectFilterOpen">{{ d5bRejectFilterOpen ? '允许筛选打开' : '拒绝筛选打开' }}</AButton>
    <AButton :aria-pressed="d5bLoading" @click="d5bLoading = !d5bLoading">{{ d5bLoading ? '结束 loading' : '开始 loading' }}</AButton>
    <AButton :aria-pressed="d5bError" :disabled="d5bLoading" @click="d5bError = !d5bError">{{ d5bError ? '清除 error' : '显示 error' }}</AButton>
    <AButton :aria-pressed="d5bEmpty" :disabled="d5bLoading || d5bError" @click="d5bEmpty = !d5bEmpty">{{ d5bEmpty ? '显示数据' : '显示 empty' }}</AButton>
    <AButton :aria-pressed="d5bLongContent" @click="d5bLongContent = !d5bLongContent">{{ d5bLongContent ? '恢复短内容' : '切换长内容' }}</AButton>
  </div>
  <p role="status">筛选值：{{ d5bFilterValue || '无' }}；retry：{{ d5bRetryCount }}；自定义操作：{{ d5bCustomActionCount }}；打开：{{ d5bFilterOpen ? '是' : '否' }}</p>
  <ATable
    :columns="d5bColumns"
    :data-source="d5bEmpty ? [] : d5bDisplayRows"
    :loading="d5bLoading"
    :error="d5bError ? { message: '当前数据加载失败', retryText: '重试数据请求' } : false"
    :scroll="{ x: true, y: 180 }"
    :sticky="{ offsetHeader: 8 }"
    :row-selection="{}"
    :expandable="{ expandedRowRender: row => `详情：${row.name}` }"
    @filter-dropdown-open-change="d5bFilterOpenChange"
    @retry="d5bRetry"
  />
</section>

<section class="aheart-demo-panel d5-table-b-external-sticky" aria-label="D5-B 外部滚动 sticky">
  <p>无 scroll.y 的外部滚动容器；滚动后表头应贴合容器顶部偏移。</p>
  <div class="d5b-external-scroll" style="height: 260px; overflow: auto; border: 1px solid var(--aheart-color-border);">
    <div style="height: 180px;" aria-hidden="true"></div>
    <ATable :columns="d5bExternalColumns" :data-source="d5bExternalRows" :pagination="{ pageSize: 10 }" :sticky="{ offsetHeader: 8 }" />
    <div style="height: 260px;" aria-hidden="true"></div>
  </div>
</section>

<style>
.d5b-filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.d5b-filter-controls input {
  flex: 1 1 100%;
  min-width: 0;
  min-height: 32px;
  padding: 4px 8px;
  color: var(--aheart-color-text);
  background: var(--aheart-color-bg);
  border: 1px solid var(--aheart-color-border);
  border-radius: var(--aheart-radius-sm);
}

.d5b-filter-controls button {
  min-height: 32px;
  padding: 4px 10px;
  color: var(--aheart-color-text);
  background: var(--aheart-color-bg);
  border: 1px solid var(--aheart-color-border);
  border-radius: var(--aheart-radius-sm);
}

.d5b-filter-controls input:focus-visible,
.d5b-filter-controls button:focus-visible {
  outline: 2px solid var(--aheart-color-primary);
  outline-offset: 2px;
}
</style>

`fixed: 'left'` 和 `fixed: 'right'` 只对连续的左前缀/右后缀生效，并且要求正数或可解析的 px 宽度；不合法的一组会整体降级为普通列。固定布局使用单个原生 `table` 与 `colgroup`，selection/expand utility 列参与固定偏移。`sticky` 可配 `offsetHeader`；有 `scroll.y` 时表内滚动，无 `y` 时依赖页面或祖先滚动容器。

`filterDropdown` 接收 `{ selectedKeys, setSelectedKeys, confirm, clearFilters, close }` 草稿上下文。`filterDropdownOpen` 是受控状态，`defaultFilterDropdownOpen` 只设置初始状态；Table 同时只显示一个浮层，并以触发器的 `ownerDocument` 作为 Teleport 容器和事件边界。父层拒绝打开请求时，DOM 保持关闭。

`loading` 优先于 `error`，保留父层传入的当前 `dataSource`，并锁定查询、分页、选择、展开和自定义操作。`error` 仅提供 retry 入口，不替换旧行；retry 事件由业务层决定何时恢复数据。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置 | `TableColumn[]` | `[]` |
| dataSource | 数据数组 | `Record<string, unknown>[]` | `[]` |
| dataMode | 显式数据模式；省略保留历史兼容路径 | `local` \| `server` | - |
| rowKey | 行 key | `string` \| `(record) => string \| number` | `key` |
| bordered | 是否显示边框 | `boolean` | `false` |
| loading | 是否显示加载遮罩 | `boolean` | `false` |
| size | 表格尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用交互 | `boolean` | ConfigProvider disabled |
| pagination | 分页配置，设为 `false` 时隐藏 | `false` \| `TablePaginationConfig` | 自动 |
| rowSelection | 行选择配置 | `TableRowSelection` | - |
| expandable | 展开行配置 | `TableExpandable` | - |
| scroll | 横向/纵向滚动；`x: true` 冻结自然宽度 | `{ x?: true \| number \| string; y?: number \| string }` | - |
| virtual | 是否启用虚拟化；对象模式可配置高度、估算行高和 overscan | `boolean \| { height?: number \| string; estimateSize?: number; overscan?: number }` | `false` |
| sticky | 固定表头，支持表头偏移 | `boolean \| { offsetHeader?: number }` | `false` |
| error | 错误状态及 retry 文案 | `boolean \| { message?: VNodeChild; retryText?: VNodeChild }` | `false` |
| getPopupContainer | 返回筛选浮层容器；默认是触发器 owner body | `(triggerNode) => HTMLElement \| false` | - |
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
| sortOrder | 受控排序方向，null明确无排序；undefined为未受控 | `ascend` \| `descend` \| `null` | - |
| defaultSortOrder | 默认排序方向 | `ascend` \| `descend` | - |
| filters | 筛选项 | `TableColumnFilter[]` | - |
| filteredValue | 受控筛选值 | `(string \| number \| boolean)[]` | - |
| defaultFilteredValue | 默认筛选值 | `(string \| number \| boolean)[]` | - |
| filterMultiple | 是否允许多选筛选 | `boolean` | `true` |
| filterDropdown | 自定义筛选浮层，接收草稿上下文 | `(context) => VNodeChild` | - |
| filterDropdownOpen | 受控筛选浮层打开状态 | `boolean` | - |
| defaultFilterDropdownOpen | 非受控初始打开状态 | `boolean` | `false` |
| fixed | 连续左前缀/右后缀固定方向 | `left` \| `right` | - |
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
| getCheckboxProps | 当前行是否禁止选择 | `(record) => { disabled?: boolean }` | - |
| preserveSelectedRowKeys | 保留当前dataSource之外的keys；false只裁剪未受控选择，不因本地筛选/换页裁剪 | `boolean` | `true` |

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
| showSizeChanger | 显示页大小选择器，省略时使用Pagination的总数边界策略 | `boolean` | - |
| totalBoundaryShowSizeChanger | 自动显示页大小选择器的总数边界 | `number` | `50` |
| pageSizeOptions | 可选页大小 | `(number \| string)[]` | `[10,20,50,100]` |
| showQuickJumper | 快速跳页，使用Pagination现有配置 | `boolean` \| `PaginationQuickJumperConfig` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 分页、筛选或排序变化时触发 | `(pagination, filters, sorter, extra) => void` |
| update:selectedRowKeys | 选择项变化时触发 | `(keys) => void` |
| select | 选择某一行时触发 | `(key, selected, record, selectedRowKeys) => void` |
| selectAll | 当前页全选/取消，keys为请求后的完整集合，changedRows只含本次改变的可选行 | `(selected, selectedRowKeys, changedRows) => void` |
| expand | 展开状态变化时触发 | `(expanded, record, key) => void` |
| update:expandedRowKeys | 展开 keys 变化时触发，可用于受控展开状态 | `(keys) => void` |
| filterDropdownOpenChange | 筛选浮层请求打开/关闭 | `(columnKey, open) => void` |
| retry | 错误态请求重试 | `() => void` |

### TableChangeExtra

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| currentDataSource | local/历史路径为筛选排序后数据；server为当前dataSource数组的浅拷贝，不伪造下一页 | `Record<string, unknown>[]` |
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
