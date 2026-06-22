<template>
  <section class="aheart-table" :class="tableClass">
    <div class="aheart-table__container">
      <table>
        <thead v-if="showHeader">
          <tr>
            <th v-if="hasSelection" class="aheart-table__selection-cell" scope="col">
              <span class="aheart-table__selection-title" aria-hidden="true" />
            </th>
            <th v-if="hasExpandable" class="aheart-table__expand-cell" scope="col">
              <span class="aheart-table__expand-title" aria-hidden="true" />
            </th>
            <th
              v-for="column in normalizedColumns"
              :key="getColumnKey(column)"
              :class="columnClass(column)"
              :style="columnStyle(column)"
              scope="col"
            >
              <div class="aheart-table__head-content">
                <button
                  v-if="column.sorter"
                  class="aheart-table__sorter"
                  type="button"
                  :disabled="isDisabled"
                  @click="toggleSort(column)"
                >
                  <span>{{ column.title }}</span>
                  <span class="aheart-table__sort-icon" :data-sort="getSortState(column)" aria-hidden="true" />
                </button>
                <span v-else class="aheart-table__title">{{ column.title }}</span>
                <div v-if="column.filters?.length" class="aheart-table__filters" :aria-label="`${column.title} filters`">
                  <button
                    v-for="filter in column.filters"
                    :key="String(filter.value)"
                    class="aheart-table__filter-option"
                    :class="{ 'is-active': isFilterActive(column, filter.value) }"
                    type="button"
                    :aria-pressed="isFilterActive(column, filter.value)"
                    :disabled="isDisabled"
                    @click="toggleFilter(column, filter.value)"
                  >
                    {{ filter.text }}
                  </button>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in pagedRows" :key="row.key">
            <tr :class="{ 'is-selected': isSelected(row.key) }">
              <td v-if="hasSelection" class="aheart-table__selection-cell">
                <input
                  :type="selectionType"
                  :name="radioName"
                  :checked="isSelected(row.key)"
                  :disabled="isSelectionDisabled"
                  :aria-label="`Select row ${row.key}`"
                  @change="toggleSelection(row.record, row.key, getEventChecked($event))"
                />
              </td>
              <td v-if="hasExpandable" class="aheart-table__expand-cell">
                <button
                  v-if="isRowExpandable(row.record)"
                  class="aheart-table__expand-button"
                  type="button"
                  :aria-expanded="isExpanded(row.key)"
                  :disabled="isDisabled"
                  @click="toggleExpand(row.record, row.key)"
                >
                  {{ isExpanded(row.key) ? '−' : '+' }}
                </button>
              </td>
              <td
                v-for="column in normalizedColumns"
                :key="getColumnKey(column)"
                :class="columnCellClass(column)"
                :style="columnStyle(column)"
              >
                {{ renderCell(column, row.record, row.index) }}
              </td>
            </tr>
            <tr v-if="hasExpandable && isExpanded(row.key)" class="aheart-table__expanded-row">
              <td :colspan="columnCount" class="aheart-table__expanded-cell">
                {{ renderExpanded(row.record, row.index) }}
              </td>
            </tr>
          </template>
          <tr v-if="!loading && pagedRows.length === 0">
            <td :colspan="columnCount" class="aheart-table__empty">{{ resolvedEmptyText }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="loading" class="aheart-table__loading" role="status" aria-live="polite">
        <span class="aheart-table__loading-dot" aria-hidden="true" />
        <span>Loading</span>
      </div>
    </div>
    <APagination
      v-if="shouldShowPagination"
      class="aheart-table__pagination"
      :current="currentPage"
      :page-size="pageSize"
      :total="paginationTotal"
      :simple="paginationConfig.simple"
      :hide-on-single-page="paginationConfig.hideOnSinglePage"
      :show-total="paginationConfig.showTotal"
      :disabled="isDisabled"
      :size="resolvedSize"
      @change="handlePageChange"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import APagination from '../pagination'
import {
  tableEmits,
  tableProps,
  type TableChangeAction,
  type TableColumn,
  type TableFilterValue,
  type TableFilters,
  type TableKey,
  type TableRecord,
  type TableSortOrder
} from './types'
import './style.css'

defineOptions({
  name: 'ATable'
})

const props = defineProps(tableProps)
const emit = defineEmits(tableEmits)
const config = useAheartConfig()

interface InternalRow {
  key: TableKey
  record: TableRecord
  index: number
}

interface InternalSortState {
  columnKey?: string
  order?: TableSortOrder
}

const innerSelectedRowKeys = ref<TableKey[]>(props.rowSelection?.defaultSelectedRowKeys ?? [])
const innerExpandedRowKeys = ref<TableKey[]>(props.expandable?.defaultExpandedRowKeys ?? [])
const innerCurrent = ref(props.pagination && typeof props.pagination === 'object' ? (props.pagination.defaultCurrent ?? props.pagination.current ?? 1) : 1)
const innerSort = ref<InternalSortState>({})
const innerFilters = ref<TableFilters>({})
const hasInitializedSort = ref(false)
const initializedFilterKeys = ref(new Set<string>())
const radioName = `aheart-table-selection-${Math.random().toString(36).slice(2)}`

const normalizedColumns = computed(() => props.columns ?? [])
const normalizedData = computed(() => props.dataSource ?? [])
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const hasSelection = computed(() => Boolean(props.rowSelection))
const hasExpandable = computed(() => Boolean(props.expandable?.expandedRowRender))
const selectionType = computed(() => props.rowSelection?.type ?? 'checkbox')
const isSelectionDisabled = computed(() => isDisabled.value || Boolean(props.rowSelection?.disabled))
const selectedKeys = computed(() => props.rowSelection?.selectedRowKeys ?? innerSelectedRowKeys.value)
const expandedKeys = computed(() => props.expandable?.expandedRowKeys ?? innerExpandedRowKeys.value)
const resolvedEmptyText = computed(() => props.emptyText || config.value.locale?.empty?.description || 'No Data')

const paginationConfig = computed(() => (props.pagination && typeof props.pagination === 'object' ? props.pagination : {}))
const pageSize = computed(() => paginationConfig.value.pageSize ?? paginationConfig.value.defaultPageSize ?? 10)
const currentPage = computed(() => paginationConfig.value.current ?? innerCurrent.value)
const paginationTotal = computed(() => paginationConfig.value.total ?? sortedData.value.length)
const shouldShowPagination = computed(() => props.pagination !== false && (props.pagination !== undefined || sortedData.value.length > pageSize.value))
const columnCount = computed(() => normalizedColumns.value.length + (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0))

const controlledSort = computed<InternalSortState | undefined>(() => {
  const column = normalizedColumns.value.find((currentColumn) => currentColumn.sortOrder !== undefined)

  if (!column) {
    return undefined
  }

  return {
    columnKey: getColumnKey(column),
    order: column.sortOrder
  }
})

const activeSort = computed<InternalSortState>(() => controlledSort.value ?? innerSort.value)

const activeFilters = computed<TableFilters>(() => {
  const filters: TableFilters = {}

  normalizedColumns.value.forEach((column) => {
    const key = getColumnKey(column)
    const values = column.filteredValue ?? innerFilters.value[key] ?? []

    if (values.length > 0) {
      filters[key] = [...values]
    }
  })

  return filters
})

const tableClass = computed(() => [
  `aheart-table--${resolvedSize.value}`,
  {
    'is-bordered': props.bordered,
    'is-loading': props.loading,
    'is-disabled': isDisabled.value
  }
])

const sortedData = computed(() => getSortedRecords(activeFilters.value, activeSort.value))

const allRows = computed<InternalRow[]>(() =>
  sortedData.value.map((record, index) => ({
    key: getRowKey(record, index),
    record,
    index
  }))
)

const pagedRows = computed(() => {
  if (!shouldShowPagination.value) {
    return allRows.value
  }

  const start = (currentPage.value - 1) * pageSize.value
  return allRows.value.slice(start, start + pageSize.value)
})

watch(
  () => props.rowSelection?.defaultSelectedRowKeys,
  (keys) => {
    if (!props.rowSelection?.selectedRowKeys && keys) {
      innerSelectedRowKeys.value = keys
    }
  }
)

watch(
  normalizedColumns,
  (columns) => {
    if (!hasInitializedSort.value) {
      const defaultSortColumn = columns.find((column) => column.sorter && column.defaultSortOrder)

      if (defaultSortColumn) {
        innerSort.value = {
          columnKey: getColumnKey(defaultSortColumn),
          order: defaultSortColumn.defaultSortOrder
        }
      }

      hasInitializedSort.value = true
    }

    const nextFilters: TableFilters = { ...innerFilters.value }
    let shouldUpdateFilters = false

    columns.forEach((column) => {
      const key = getColumnKey(column)

      if (initializedFilterKeys.value.has(key)) {
        return
      }

      initializedFilterKeys.value.add(key)

      if (column.filteredValue === undefined && column.defaultFilteredValue?.length) {
        nextFilters[key] = [...column.defaultFilteredValue]
        shouldUpdateFilters = true
      }
    })

    if (shouldUpdateFilters) {
      innerFilters.value = nextFilters
    }
  },
  { immediate: true }
)

function getColumnKey(column: TableColumn) {
  return column.key ?? String(Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : column.dataIndex ?? column.title)
}

function getRowKey(record: TableRecord, index: number): TableKey {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(record)
  }

  const key = record[props.rowKey]
  return typeof key === 'string' || typeof key === 'number' ? key : index
}

function getValueByDataIndex(record: TableRecord, dataIndex?: TableColumn['dataIndex']) {
  if (dataIndex === undefined) {
    return undefined
  }

  const paths = Array.isArray(dataIndex) ? dataIndex : [dataIndex]
  return paths.reduce<unknown>((current, path) => {
    if (current && typeof current === 'object') {
      return (current as TableRecord)[String(path)]
    }

    return undefined
  }, record)
}

function getFilteredRecords(filters: TableFilters) {
  return normalizedData.value.filter((record) =>
    normalizedColumns.value.every((column) => {
      const values = filters[getColumnKey(column)]

      if (!values?.length) {
        return true
      }

      const recordValue = getValueByDataIndex(record, column.dataIndex)
      return values.some((value) => String(recordValue) === String(value))
    })
  )
}

function getSortedRecords(filters: TableFilters, sortState: InternalSortState) {
  const records = getFilteredRecords(filters)
  const activeColumn = normalizedColumns.value.find((column) => getColumnKey(column) === sortState.columnKey)

  if (!activeColumn || !sortState.order || !activeColumn.sorter) {
    return records
  }

  const direction = sortState.order === 'ascend' ? 1 : -1

  return [...records].sort((a, b) => compareRecords(activeColumn, a, b) * direction)
}

function compareRecords(column: TableColumn, a: TableRecord, b: TableRecord) {
  if (typeof column.sorter === 'function') {
    return column.sorter(a, b)
  }

  const first = getValueByDataIndex(a, column.dataIndex)
  const second = getValueByDataIndex(b, column.dataIndex)

  if (typeof first === 'number' && typeof second === 'number') {
    return first - second
  }

  return String(first ?? '').localeCompare(String(second ?? ''))
}

function getNormalizedFilters(filters: TableFilters) {
  return Object.entries(filters).reduce<TableFilters>((normalized, [key, values]) => {
    if (values.length > 0) {
      normalized[key] = [...values]
    }

    return normalized
  }, {})
}

const renderCell = (column: TableColumn, record: TableRecord, index: number) => {
  const text = getValueByDataIndex(record, column.dataIndex)

  if (column.customRender) {
    return column.customRender({ text, record, index, column })
  }

  return text ?? ''
}

const renderExpanded = (record: TableRecord, index: number) => {
  return props.expandable?.expandedRowRender?.(record, index) ?? ''
}

const columnStyle = (column: TableColumn) => ({
  width: typeof column.width === 'number' ? `${column.width}px` : column.width
})

const columnClass = (column: TableColumn) => [
  column.className,
  column.align ? `aheart-table__cell--${column.align}` : undefined,
  {
    'is-sortable': Boolean(column.sorter),
    'is-filtered': Boolean(activeFilters.value[getColumnKey(column)]?.length),
    'is-ellipsis': column.ellipsis
  }
]

const columnCellClass = (column: TableColumn) => [
  column.className,
  column.align ? `aheart-table__cell--${column.align}` : undefined,
  {
    'is-ellipsis': column.ellipsis
  }
]

const getSortState = (column: TableColumn) => {
  const key = getColumnKey(column)

  if (activeSort.value.columnKey !== key || !activeSort.value.order) {
    return 'none'
  }

  return activeSort.value.order
}

const toggleSort = (column: TableColumn) => {
  if (isDisabled.value) {
    return
  }

  const key = getColumnKey(column)
  const currentOrder = activeSort.value.columnKey === key ? activeSort.value.order : undefined
  const nextOrder: TableSortOrder | undefined = currentOrder === undefined ? 'ascend' : currentOrder === 'ascend' ? 'descend' : undefined
  const nextSort: InternalSortState = { columnKey: nextOrder ? key : undefined, order: nextOrder }

  if (column.sortOrder === undefined) {
    innerSort.value = nextSort
  }

  resetInnerCurrent()
  emitTableChange('sort', 1, pageSize.value, activeFilters.value, nextSort)
}

const isFilterActive = (column: TableColumn, value: TableFilterValue) => {
  return Boolean(activeFilters.value[getColumnKey(column)]?.includes(value))
}

const toggleFilter = (column: TableColumn, value: TableFilterValue) => {
  if (isDisabled.value) {
    return
  }

  const key = getColumnKey(column)
  const currentValues = activeFilters.value[key] ?? []
  const isActive = currentValues.includes(value)
  const nextValues = column.filterMultiple === false
    ? isActive
      ? []
      : [value]
    : isActive
      ? currentValues.filter((currentValue) => currentValue !== value)
      : [...currentValues, value]
  const nextFilters = { ...activeFilters.value, [key]: nextValues }

  if (nextValues.length === 0) {
    delete nextFilters[key]
  }

  if (column.filteredValue === undefined) {
    innerFilters.value = nextFilters
  }

  resetInnerCurrent()
  emitTableChange('filter', 1, pageSize.value, nextFilters, activeSort.value)
}

const resetInnerCurrent = () => {
  if (paginationConfig.value.current === undefined) {
    innerCurrent.value = 1
  }
}

const isSelected = (key: TableKey) => selectedKeys.value.includes(key)

const toggleSelection = (record: TableRecord, key: TableKey, checked: boolean) => {
  if (isSelectionDisabled.value) {
    return
  }

  const nextKeys = selectionType.value === 'radio'
    ? checked
      ? [key]
      : []
    : checked
      ? Array.from(new Set([...selectedKeys.value, key]))
      : selectedKeys.value.filter((currentKey) => currentKey !== key)

  if (!props.rowSelection?.selectedRowKeys) {
    innerSelectedRowKeys.value = nextKeys
  }

  emit('update:selectedRowKeys', nextKeys)
  emit('select', key, checked, record, nextKeys)
}

const isRowExpandable = (record: TableRecord) => props.expandable?.rowExpandable?.(record) ?? true
const isExpanded = (key: TableKey) => expandedKeys.value.includes(key)

const toggleExpand = (record: TableRecord, key: TableKey) => {
  if (isDisabled.value) {
    return
  }

  const nextExpanded = !isExpanded(key)
  const nextKeys = nextExpanded ? [...expandedKeys.value, key] : expandedKeys.value.filter((currentKey) => currentKey !== key)

  if (!props.expandable?.expandedRowKeys) {
    innerExpandedRowKeys.value = nextKeys
  }

  emit('expand', nextExpanded, record, key)
}

const handlePageChange = (current: number, nextPageSize: number) => {
  if (paginationConfig.value.current === undefined) {
    innerCurrent.value = current
  }

  emitTableChange('paginate', current, nextPageSize, activeFilters.value, activeSort.value)
}

const emitTableChange = (
  action: TableChangeAction,
  current: number,
  nextPageSize: number,
  filters: TableFilters,
  sortState: InternalSortState
) => {
  const normalizedFilters = getNormalizedFilters(filters)
  const currentDataSource = getSortedRecords(normalizedFilters, sortState)
  const activeColumn = normalizedColumns.value.find((column) => getColumnKey(column) === sortState.columnKey)

  emit(
    'change',
    { current, pageSize: nextPageSize, total: paginationConfig.value.total ?? currentDataSource.length },
    normalizedFilters,
    {
      column: activeColumn,
      columnKey: sortState.columnKey,
      field: activeColumn?.dataIndex,
      order: sortState.order
    },
    {
      currentDataSource,
      action
    }
  )
}

const getEventChecked = (event: Event) => {
  return Boolean((event.target as HTMLInputElement | null)?.checked)
}
</script>
