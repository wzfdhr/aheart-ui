<template>
  <section
    ref="tableRoot"
    class="aheart-table"
    :class="tableClass"
    :aria-busy="loading || undefined"
    :inert="rootInteractionInert || undefined"
  >
    <div
      class="aheart-table__interaction-region"
      :inert="isInteractionLocked || undefined"
      @click.capture="handleTableCapture"
      @keydown.capture="handleTableCapture"
      @input.capture="handleTableCapture"
      @change.capture="handleTableCapture"
      @submit.capture="handleTableCapture"
    >
    <div class="aheart-table__container" :style="containerStyle">
      <table v-bind="tableAttrs">
        <colgroup>
          <col v-for="column in layoutColumns" :key="column.id" :style="{ width: column.width }" />
        </colgroup>
        <thead v-if="showHeader">
          <tr>
            <th v-if="hasSelection" class="aheart-table__selection-cell" scope="col" :style="utilityStyle('selection', true)">
              <input
                v-if="selectionType === 'checkbox'"
                class="aheart-table__select-all"
                type="checkbox"
                aria-label="Select all rows on current page"
                :checked="allPageSelected"
                :indeterminate="somePageSelected && !allPageSelected"
                :aria-checked="somePageSelected && !allPageSelected ? 'mixed' : allPageSelected"
                :disabled="isSelectionDisabled || selectableRows.length === 0"
                @change="handleSelectAll"
              />
              <span v-else class="aheart-table__selection-title" aria-hidden="true" />
            </th>
            <th v-if="hasExpandable" class="aheart-table__expand-cell" scope="col" :style="utilityStyle('expand', true)">
              <span class="aheart-table__expand-title" aria-hidden="true" />
            </th>
            <th
              v-for="column in normalizedColumns"
              :key="getColumnKey(column)"
              :class="columnClass(column)"
              :style="headerColumnStyle(column)"
              :aria-sort="column.sorter ? getAriaSort(column) : undefined"
              scope="col"
            >
              <div class="aheart-table__head-content">
                <button
                  v-if="column.sorter"
                  class="aheart-table__sorter"
                  type="button"
                  :disabled="isInteractionLocked"
                  :aria-label="getSortActionLabel(column)"
                  @click="toggleSort(column)"
                >
                  <span>
                    <ARenderNode :node="column.title" />
                  </span>
                  <span class="aheart-table__sort-icon" :data-sort="getSortState(column)" aria-hidden="true" />
                </button>
                <span v-else class="aheart-table__title">
                  <ARenderNode :node="column.title" />
                </span>
                <button
                  v-if="column.filterDropdown"
                  class="aheart-table__filter-trigger"
                  type="button"
                  aria-haspopup="dialog"
                  :data-table-filter-trigger="getColumnKey(column)"
                  :aria-expanded="isFilterPopupOpen(column)"
                  :disabled="isInteractionLocked"
                  @click="toggleFilterPopup(column, $event.currentTarget as HTMLElement)"
                >
                  <span aria-hidden="true">⌄</span>
                  <span class="sr-only">Filter {{ getColumnLabel(column) }}</span>
                </button>
                <div v-if="column.filters?.length" class="aheart-table__filters" :aria-label="`${column.title} filters`">
                  <button
                    v-for="filter in column.filters"
                    :key="String(filter.value)"
                    class="aheart-table__filter-option"
                    :class="{ 'is-active': isFilterActive(column, filter.value) }"
                    type="button"
                    :aria-pressed="isFilterActive(column, filter.value)"
                    :disabled="isInteractionLocked"
                    @click="toggleFilter(column, filter.value)"
                  >
                    <ARenderNode :node="filter.text" />
                  </button>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in pagedRows" :key="row.key">
            <tr :class="{ 'is-selected': isSelected(row.key) }">
              <td v-if="hasSelection" class="aheart-table__selection-cell" :style="utilityStyle('selection', false)">
                <input
                  :type="selectionType"
                  :name="radioName"
                  :checked="isSelected(row.key)"
                  :disabled="isRowSelectionDisabled(row.record)"
                  :aria-label="`Select row ${row.key}`"
                  @change="handleSelectionChange($event, row.record, row.key)"
                />
              </td>
              <td v-if="hasExpandable" class="aheart-table__expand-cell" :style="utilityStyle('expand', false)">
                <button
                  v-if="isRowExpandable(row.record)"
                  class="aheart-table__expand-button"
                  type="button"
                  :aria-expanded="isExpanded(row.key)"
                  :disabled="isInteractionLocked"
                  @click="toggleExpand(row.record, row.key)"
                >
                  {{ isExpanded(row.key) ? '−' : '+' }}
                </button>
              </td>
              <td
                v-for="column in normalizedColumns"
                :key="getColumnKey(column)"
                :class="columnCellClass(column)"
                :style="bodyColumnStyle(column)"
              >
                <ARenderNode :node="renderCell(column, row.record, row.index)" />
              </td>
            </tr>
            <tr v-if="hasExpandable && isExpanded(row.key)" class="aheart-table__expanded-row">
              <td :colspan="columnCount" class="aheart-table__expanded-cell">
                <ARenderNode :node="renderExpanded(row.record, row.index)" />
              </td>
            </tr>
          </template>
          <tr v-if="!loading && pagedRows.length === 0">
            <td :colspan="columnCount" class="aheart-table__empty">
              <ARenderNode :node="resolvedEmptyText" />
            </td>
          </tr>
        </tbody>
      </table>
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
      :show-size-changer="paginationConfig.showSizeChanger"
      :page-size-options="paginationConfig.pageSizeOptions"
      :show-quick-jumper="paginationConfig.showQuickJumper"
      :total-boundary-show-size-changer="paginationConfig.totalBoundaryShowSizeChanger"
      :disabled="isInteractionLocked"
      :size="resolvedSize"
      @change="handlePageChange"
    />
    </div>
    <div v-if="loading" class="aheart-table__loading" role="status" aria-live="polite">
      <span class="aheart-table__loading-dot" aria-hidden="true" />
      <span>{{ resolvedLoadingText }}</span>
    </div>
    <div v-else-if="error" class="aheart-table__error" role="alert">
      <ARenderNode :node="errorMessage" />
      <button type="button" class="aheart-table__retry" data-table-retry :disabled="isDisabled" @click="emit('retry')">
        <ARenderNode :node="errorRetryText" />
      </button>
    </div>
    <Teleport v-if="activeFilterColumn && activeFilterPopupNode !== null" :to="popupTarget" :disabled="popupTargetDisabled">
      <div
        ref="filterPopupElement"
        class="aheart-table__filter-popup"
        role="dialog"
        :data-table-filter-popup="activeFilterKey"
        tabindex="-1"
        :style="popupStyle"
        @keydown="handleFilterPopupKeydown"
      >
        <ARenderNode :node="activeFilterPopupNode" />
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import APagination from '../pagination'
import { getPageCount, normalizeCurrent, normalizePageSize, normalizeTotal } from '../pagination/pagination-state'
import { useControllableState } from '../utils/use-controllable-state'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useStableId } from '../utils/use-stable-id'
import {
  tableEmits,
  tableProps,
  type TableChangeAction,
  type TableColumn,
  type TableFilterDropdownContext,
  type TableFilterValue,
  type TableFilters,
  type TableKey,
  type TableRenderable,
  type TableRecord,
  type TableSortOrder
} from './types'
import './style.css'

defineOptions({
  name: 'ATable'
})

const ARenderNode = defineComponent({
  name: 'ATableRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
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

const hasOwn = (value: object | undefined, key: string) => Boolean(value && Object.prototype.hasOwnProperty.call(value, key))
const selectedState = useControllableState<TableKey[]>({
  controlled: () => props.rowSelection?.selectedRowKeys,
  isControlled: () => hasOwn(props.rowSelection, 'selectedRowKeys'),
  defaultValue: () => [...(props.rowSelection?.defaultSelectedRowKeys ?? [])]
})
const expandedState = useControllableState<TableKey[]>({
  controlled: () => props.expandable?.expandedRowKeys,
  isControlled: () => hasOwn(props.expandable, 'expandedRowKeys'),
  defaultValue: () => [...(props.expandable?.defaultExpandedRowKeys ?? [])],
  onChange: (keys) => emit('update:expandedRowKeys', [...(keys ?? [])])
})
const currentState = useControllableState<number>({
  controlled: () => props.pagination && typeof props.pagination === 'object' ? props.pagination.current : undefined,
  isControlled: () => Boolean(props.pagination && typeof props.pagination === 'object' && hasOwn(props.pagination, 'current')),
  defaultValue: () => props.pagination && typeof props.pagination === 'object'
    ? props.pagination.defaultCurrent ?? props.pagination.current ?? 1
    : 1
})
const pageSizeState = useControllableState<number>({
  controlled: () => props.pagination && typeof props.pagination === 'object' ? props.pagination.pageSize : undefined,
  isControlled: () => Boolean(props.pagination && typeof props.pagination === 'object' && hasOwn(props.pagination, 'pageSize')),
  defaultValue: () => props.pagination && typeof props.pagination === 'object'
    ? props.pagination.defaultPageSize ?? 10
    : 10
})
const innerSort = ref<InternalSortState>({})
const innerFilters = ref<TableFilters>({})
const activeFilterKey = ref<string | null>(null)
const filterDraft = ref<TableFilterValue[]>([])
const closeRequestPending = ref(false)
const filterTriggerElement = ref<HTMLElement | null>(null)
const filterPopupElement = ref<HTMLElement | null>(null)
const tableRoot = ref<HTMLElement | null>(null)
const rootInteractionInert = ref(true)
const hasInitializedSort = ref(false)
const initializedFilterKeys = ref(new Set<string>())
const radioName = useStableId(undefined, 'aheart-table-selection').value

const normalizedColumns = computed(() => (props.columns ?? []).filter((column) => !column.hidden))
const normalizedData = computed(() => props.dataSource ?? [])
const initialFilterColumn = (props.columns ?? []).find((column) => !column.hidden && (column.defaultFilterDropdownOpen === true || column.filterDropdownOpen === true) && column.filterDropdown)
if (initialFilterColumn) {
  activeFilterKey.value = initialFilterColumn.key ?? String(Array.isArray(initialFilterColumn.dataIndex) ? initialFilterColumn.dataIndex.join('.') : initialFilterColumn.dataIndex ?? initialFilterColumn.title)
  filterDraft.value = [...(initialFilterColumn.filteredValue ?? initialFilterColumn.defaultFilteredValue ?? [])]
}
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const hasSelection = computed(() => Boolean(props.rowSelection))
const hasExpandable = computed(() => Boolean(props.expandable?.expandedRowRender))
const selectionType = computed(() => props.rowSelection?.type ?? 'checkbox')
const isInteractionLocked = computed(() => isDisabled.value || props.loading || Boolean(props.error))
const isSelectionDisabled = computed(() => isInteractionLocked.value || Boolean(props.rowSelection?.disabled))
const selectedKeys = computed(() => selectedState.state.value ?? [])
const expandedKeys = computed(() => expandedState.state.value ?? [])
const resolvedEmptyText = computed<TableRenderable>(() =>
  hasRenderableContent(props.emptyText)
    ? props.emptyText
    : config.value.locale?.table?.emptyText ?? config.value.locale?.empty?.description ?? 'No Data'
)
const resolvedLoadingText = computed(() => config.value.locale?.table?.loadingText ?? '加载中')
const handleTableCapture = (event: Event) => {
  if (!isInteractionLocked.value || (event.target as HTMLElement | null)?.closest('[data-table-retry]')) return
  event.preventDefault()
  event.stopPropagation()
}
const errorMessage = computed<TableRenderable>(() => typeof props.error === 'object' && props.error.message !== undefined ? props.error.message : '加载失败')
const errorRetryText = computed<TableRenderable>(() => typeof props.error === 'object' && props.error.retryText !== undefined ? props.error.retryText : '重试')

const paginationConfig = computed(() => (props.pagination && typeof props.pagination === 'object' ? props.pagination : {}))
const pageSize = computed(() => normalizePageSize(pageSizeState.state.value ?? 10))
const rawCurrentPage = computed(() => currentState.state.value ?? 1)
const paginationTotal = computed(() => getTotal(sortedData.value.length))
const pageCount = computed(() => getPageCount(paginationTotal.value, pageSize.value))
const currentPage = computed(() => normalizeCurrent(rawCurrentPage.value, paginationTotal.value, pageSize.value))
const shouldShowPagination = computed(() => props.pagination !== false && (props.pagination !== undefined || paginationTotal.value > pageSize.value))
const columnCount = computed(() => normalizedColumns.value.length + (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0))

type LayoutColumn = { id: string; width?: string; source?: TableColumn; utility?: 'selection' | 'expand'; fixed?: 'left' | 'right'; left?: number; right?: number }
const widthSnapshot = ref<Record<string, string>>({})
const headerShiftY = ref(0)
const pxWidth = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value
  if (typeof value === 'string' && /^\s*(\d+(?:\.\d+)?)px\s*$/i.test(value)) {
    const parsed = Number.parseFloat(value)
    return parsed > 0 ? parsed : undefined
  }
  return undefined
}
const layoutColumns = computed<LayoutColumn[]>(() => {
  const data: LayoutColumn[] = []
  if (hasSelection.value) data.push({ id: '__selection', utility: 'selection', width: '48px' })
  if (hasExpandable.value) data.push({ id: '__expand', utility: 'expand', width: '48px' })
  normalizedColumns.value.forEach((column) => data.push({ id: getColumnKey(column), source: column, width: pxWidth(column.width) ? `${pxWidth(column.width)}px` : typeof column.width === 'string' ? column.width : undefined, fixed: column.fixed }))
  const dataColumns = data.filter((item) => item.source)
  const leftCount = dataColumns.filter((item) => item.fixed === 'left').length
  const rightCount = dataColumns.filter((item) => item.fixed === 'right').length
  const leftStart = data.findIndex((item) => item.fixed === 'left')
  const rightStart = data.length - rightCount
  const utilityCount = (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0)
  const leftValid = leftCount === 0 || leftStart === utilityCount && data.slice(leftStart, leftStart + leftCount).every((item) => item.fixed === 'left' && (pxWidth(item.source?.width) !== undefined || widthSnapshot.value[item.id] !== undefined))
  const rightValid = rightCount === 0 || rightStart >= 0 && data.slice(rightStart).every((item) => item.fixed === 'right' && pxWidth(item.source?.width) !== undefined)
  const leftEnabled = leftValid && leftCount > 0
  const rightEnabled = rightValid && rightCount > 0
  let left = 0
  if (leftEnabled) {
    // Utility columns occupy the leading cells and therefore are part of the
    // fixed-prefix offset, even though they do not have a public `fixed` flag.
    data.slice(0, leftStart).forEach((item) => { item.fixed = 'left' })
    data.forEach((item, index) => { if (item.fixed === 'left') { item.left = left; left += usedWidth(item) } else if (index >= leftStart && index < leftStart + leftCount) item.fixed = undefined })
  }
  let right = 0
  if (rightEnabled) [...data].reverse().forEach((item) => { if (item.fixed === 'right') { item.right = right; right += usedWidth(item) } })
  return data
})
const layoutById = computed(() => new Map(layoutColumns.value.map((item) => [item.id, item])))
const stickyOffset = computed(() => typeof props.sticky === 'object' && Number.isFinite(props.sticky.offsetHeader) ? Math.max(0, props.sticky.offsetHeader ?? 0) : 0)
const isSticky = computed(() => Boolean(props.sticky))
const columnLayout = (column: TableColumn) => layoutById.value.get(getColumnKey(column))
const usedWidth = (item: LayoutColumn) => {
  const snapshot = widthSnapshot.value[item.id]
  if (snapshot) return Number.parseFloat(snapshot) || 0
  return pxWidth(item.source?.width) ?? (item.width ? Number.parseFloat(item.width) : 0)
}
const utilityStyle = (utility: 'selection' | 'expand', header: boolean) => {
  const item = layoutById.value.get(`__${utility}`)
  return item ? cellLayoutStyle(item, header) : undefined
}
const cellLayoutStyle = (item: LayoutColumn, header: boolean): CSSProperties => ({
  ...(item.width ? { width: item.width } : {}),
  ...(item.fixed === 'left' && item.left !== undefined ? { position: 'sticky', left: `${item.left}px`, zIndex: 2 } : {}),
  ...(item.fixed === 'right' && item.right !== undefined ? { position: 'sticky', right: `${item.right}px`, zIndex: 2 } : {}),
  ...(isSticky.value && header ? { position: 'sticky', top: `${stickyOffset.value + headerShiftY.value}px`, zIndex: 2 } : {})
})
const tableStyle = computed<CSSProperties | undefined>(() => {
  const x = props.scroll?.x
  const minWidth = x === true ? 'max-content' : typeof x === 'number' && Number.isFinite(x) ? `${x}px` : typeof x === 'string' ? x : undefined
  return minWidth ? { minWidth } : undefined
})
const tableAttrs = computed(() => tableStyle.value ? { style: tableStyle.value } : {})
const containerStyle = computed<CSSProperties | undefined>(() => {
  const y = props.scroll?.y
  if (y === undefined) return undefined
  const value = typeof y === 'number' && Number.isFinite(y) ? `${y}px` : y
  return { maxHeight: value, overflowY: 'auto' as const }
})

const controlledSort = computed<InternalSortState | undefined>(() => {
  const column = normalizedColumns.value.find((currentColumn) => currentColumn.sortOrder !== undefined)

  if (!column) {
    return undefined
  }

  return {
    columnKey: getColumnKey(column),
    order: column.sortOrder ?? undefined
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

  if (props.dataMode === 'server' || (props.dataMode === undefined && paginationConfig.value.total !== undefined)) {
    return allRows.value
  }

  const start = (currentPage.value - 1) * pageSize.value
  return allRows.value.slice(start, start + pageSize.value)
})

const selectableRows = computed(() => pagedRows.value.filter((row) => !isRowSelectionDisabled(row.record)))
const allPageSelected = computed(() => selectableRows.value.length > 0 && selectableRows.value.every((row) => selectedKeys.value.includes(row.key)))
const somePageSelected = computed(() => selectableRows.value.some((row) => selectedKeys.value.includes(row.key)))

// Only accepted query state resets an uncontrolled page. Rejected controlled
// requests never change this signature; equivalent prop arrays do not reset it.
const querySignature = computed(() => JSON.stringify([
  activeSort.value.order ? [activeSort.value.columnKey, activeSort.value.order] : null,
  Object.entries(activeFilters.value)
]))

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

watch(querySignature, () => currentState.setState(1))

watch(pageCount, (count) => {
  if (!currentState.isControlled.value && (currentState.state.value ?? 1) > count) {
    currentState.setState(count)
  }
})

const knownRowKeys = computed(() => normalizedData.value.map((record, index) => getRowKey(record, index)))
watch([knownRowKeys, () => props.rowSelection?.preserveSelectedRowKeys, selectedState.isControlled], () => {
  if (selectedState.isControlled.value || props.rowSelection?.preserveSelectedRowKeys !== false) return
  const known = new Set(knownRowKeys.value)
  const next = selectedKeys.value.filter((key) => known.has(key))
  // Data-derived pruning is silent; it is not a user selection request.
  if (next.length !== selectedKeys.value.length) selectedState.setState(next)
}, { immediate: true })

if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
  watch(() => normalizedData.value.map((record) => typeof props.rowKey === 'function' ? props.rowKey(record) : record[props.rowKey]), (keys) => {
    const valid = keys.every((key) => typeof key === 'string' || (typeof key === 'number' && Number.isFinite(key)))
    if (!valid || new Set(keys).size !== keys.length) {
      console.warn('[ATable] rowKey must be stable and unique; index fallback cannot preserve identity across data changes.')
    }
  }, { immediate: true })
}

function getTotal(localTotal: number) {
  return normalizeTotal(props.dataMode === 'local' ? localTotal : paginationConfig.value.total ?? localTotal)
}

function isRowSelectionDisabled(record: TableRecord) {
  return isSelectionDisabled.value || Boolean(props.rowSelection?.getCheckboxProps?.(record)?.disabled)
}

function getColumnKey(column: TableColumn) {
  return column.key ?? String(Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : column.dataIndex ?? column.title)
}

function hasRenderableContent(value: TableRenderable | undefined): value is TableRenderable {
  return value !== undefined && value !== null && value !== false && value !== ''
}

function getRowKey(record: TableRecord, index: number): TableKey {
  const key = typeof props.rowKey === 'function' ? props.rowKey(record) : record[props.rowKey]
  return typeof key === 'string' || (typeof key === 'number' && Number.isFinite(key)) ? key : index
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
  if (props.dataMode === 'server') return [...normalizedData.value]
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

const renderCell = (column: TableColumn, record: TableRecord, index: number): TableRenderable => {
  const text = getValueByDataIndex(record, column.dataIndex)

  if (column.customRender) {
    return column.customRender({ text, record, index, column })
  }

  return text === undefined || text === null ? '' : String(text)
}

const renderExpanded = (record: TableRecord, index: number) => {
  return props.expandable?.expandedRowRender?.(record, index) ?? ''
}

const headerColumnStyle = (column: TableColumn) => cellLayoutStyle(columnLayout(column) ?? { id: getColumnKey(column), source: column }, true)
const bodyColumnStyle = (column: TableColumn) => cellLayoutStyle(columnLayout(column) ?? { id: getColumnKey(column), source: column }, false)

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

const getColumnLabel = (column: TableColumn) => typeof column.title === 'string' ? column.title : getColumnKey(column)

const activeFilterColumn = computed(() => normalizedColumns.value.find((column) => getColumnKey(column) === activeFilterKey.value))
const popupTargetDisabled = computed(() => {
  const trigger = filterTriggerElement.value
  return Boolean(trigger && props.getPopupContainer?.(trigger) === false)
})
const popupTarget = computed<HTMLElement | string>(() => {
  const trigger = filterTriggerElement.value
  if (!trigger) return 'body'
  const target = props.getPopupContainer?.(trigger)
  return target === false ? trigger.ownerDocument.body : target ?? trigger.ownerDocument.body
})
const popupOpen = computed(() => Boolean(activeFilterKey.value && activeFilterColumn.value))
const { popupStyle, update: updateFloatingPosition } = useFloatingPosition({
  reference: filterTriggerElement,
  floating: filterPopupElement,
  open: popupOpen,
  placement: 'bottomLeft',
  strategy: 'absolute',
  viewportPadding: 8
})
useFloatingDismiss({
  open: popupOpen,
  trigger: filterTriggerElement,
  floating: filterPopupElement,
  onDismiss: () => closeFilter(),
  restoreFocus: true
})
watch([filterTriggerElement, filterPopupElement, popupOpen], () => {
  if (popupOpen.value) void nextTick(updateFloatingPosition)
}, { flush: 'post' })
const isFilterPopupOpen = (column: TableColumn) => activeFilterKey.value === getColumnKey(column)
let popupNodeCacheKey: string | null = null
let popupNodeCacheDraft = ''
let popupNodeCache: VNodeChild | null = null
const activeFilterPopupNode = computed(() => {
  const column = activeFilterColumn.value
  if (!column?.filterDropdown) return null
  const draftSignature = JSON.stringify(filterDraft.value)
  if (popupNodeCacheKey === activeFilterKey.value && popupNodeCacheDraft === draftSignature) return popupNodeCache
  const context: TableFilterDropdownContext = {
    selectedKeys: filterDraft.value,
    setSelectedKeys: (keys) => { filterDraft.value = [...keys] },
    confirm: () => confirmFilter(column),
    clearFilters: () => resetFilter(column),
    close: () => closeFilter()
  }
  popupNodeCacheKey = activeFilterKey.value
  popupNodeCacheDraft = draftSignature
  popupNodeCache = column.filterDropdown(context)
  return popupNodeCache
})
const sanitizePopupMarker = () => {
  filterPopupElement.value?.querySelectorAll('[data-table-filter-popup]').forEach((node) => node.removeAttribute('data-table-filter-popup'))
}
const activeFilterValues = (column: TableColumn) => column.filteredValue ?? activeFilters.value[getColumnKey(column)] ?? []
const requestFilterOpen = (column: TableColumn, open: boolean) => emit('filterDropdownOpenChange', getColumnKey(column), open)
const toggleFilterPopup = (column: TableColumn, trigger: HTMLElement) => {
  if (isInteractionLocked.value) return
  const key = getColumnKey(column)
  filterTriggerElement.value = trigger
  if (activeFilterKey.value === key) {
    closeFilter()
    return
  }
  if (activeFilterKey.value) {
    const previous = normalizedColumns.value.find((item) => getColumnKey(item) === activeFilterKey.value)
    if (previous) requestFilterOpen(previous, false)
    closeFilter(false)
  }
  filterDraft.value = [...activeFilterValues(column)]
  activeFilterKey.value = key
  requestFilterOpen(column, true)
  if (column.filterDropdownOpen !== undefined && !column.filterDropdownOpen) activeFilterKey.value = null
  else nextTick(() => filterPopupElement.value?.focus())
}
const closeFilter = (restoreFocus = true) => {
  const column = activeFilterColumn.value
  if (column?.filterDropdownOpen !== undefined) {
    if (!closeRequestPending.value) {
      closeRequestPending.value = true
      requestFilterOpen(column, false)
    }
    return
  }
  activeFilterKey.value = null
  filterDraft.value = []
  closeRequestPending.value = false
  if (restoreFocus) nextTick(() => filterTriggerElement.value?.focus())
}
const commitFilter = (column: TableColumn, values: TableFilterValue[]) => {
  const key = getColumnKey(column)
  const nextFilters = { ...activeFilters.value }
  if (values.length) nextFilters[key] = [...values]
  else delete nextFilters[key]
  if (column.filteredValue === undefined) innerFilters.value = nextFilters
  emitTableChange('filter', 1, pageSize.value, nextFilters, activeSort.value)
}
const confirmFilter = (column: TableColumn) => {
  if (isInteractionLocked.value) return
  commitFilter(column, filterDraft.value)
  closeFilter()
}
const resetFilter = (column: TableColumn) => {
  if (isInteractionLocked.value) return
  filterDraft.value = []
  commitFilter(column, [])
  closeFilter()
}
const handleFilterPopupKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeFilter()
    return
  }
  if (event.key !== 'Tab' || !filterPopupElement.value) return
  const controls = Array.from(filterPopupElement.value.querySelectorAll<HTMLElement>('input,button,select,textarea,[tabindex]:not([tabindex="-1"])'))
  if (!controls.length) return
  const current = filterPopupElement.value.ownerDocument.activeElement
  const index = controls.indexOf(current as HTMLElement)
  const next = event.shiftKey ? (index <= 0 ? controls.length - 1 : index - 1) : (index >= controls.length - 1 ? 0 : index + 1)
  event.preventDefault()
  controls[next]?.focus()
  void nextTick(() => controls[next]?.focus())
}
const handleFilterDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || !filterPopupElement.value || !activeFilterKey.value) return
  if (!filterPopupElement.value.contains(event.target as Node)) return
  handleFilterPopupKeydown(event)
}
let stickyResizeObserver: ResizeObserver | undefined
let stickyOwnerWindow: Window | undefined
let stickyRaf = 0
const updateStickyGeometry = () => {
  const root = tableRoot.value
  if (!root || !isSticky.value || props.scroll?.y !== undefined) {
    headerShiftY.value = 0
    return
  }
  const rect = root.getBoundingClientRect()
  const viewportHeight = root.ownerDocument.defaultView?.innerHeight ?? 0
  const headerHeight = root.querySelector<HTMLElement>('thead')?.getBoundingClientRect().height ?? 0
  const bounded = Math.max(0, Math.min(Math.max(0, viewportHeight - rect.bottom + headerHeight), stickyOffset.value - rect.top))
  headerShiftY.value = Number.isFinite(bounded) ? bounded : 0
}
const scheduleStickyGeometry = () => {
  if (stickyRaf) return
  const ownerWindow = tableRoot.value?.ownerDocument.defaultView
  const request = ownerWindow?.requestAnimationFrame ?? ((callback: FrameRequestCallback) => setTimeout(callback, 0) as unknown as number)
  stickyRaf = request(() => {
    stickyRaf = 0
    updateStickyGeometry()
  })
}
const measureLayout = () => {
  if (props.scroll?.x !== true || !tableRoot.value) return
  const cells = Array.from(tableRoot.value.querySelectorAll<HTMLElement>('thead th'))
  const next = { ...widthSnapshot.value }
  cells.forEach((cell, index) => {
    const width = cell.getBoundingClientRect().width
    const item = layoutColumns.value[index]
    if (item && width > 0 && !next[item.id]) next[item.id] = `${width}px`
  })
  if (Object.keys(next).length !== Object.keys(widthSnapshot.value).length) widthSnapshot.value = next
}
const bindStickyObservers = () => {
  const root = tableRoot.value
  const ownerWindow = root?.ownerDocument.defaultView
  if (!root || !ownerWindow) return
  stickyOwnerWindow = ownerWindow
  ownerWindow.addEventListener('scroll', scheduleStickyGeometry, true)
  ownerWindow.addEventListener('resize', scheduleStickyGeometry)
  const ResizeObserverConstructor = ownerWindow.ResizeObserver
  if (ResizeObserverConstructor) {
    stickyResizeObserver = new ResizeObserverConstructor(() => {
      measureLayout()
      scheduleStickyGeometry()
    })
    stickyResizeObserver.observe(root)
  }
  scheduleStickyGeometry()
}
const unbindStickyObservers = () => {
  if (stickyOwnerWindow) {
    stickyOwnerWindow.removeEventListener('scroll', scheduleStickyGeometry, true)
    stickyOwnerWindow.removeEventListener('resize', scheduleStickyGeometry)
  }
  stickyResizeObserver?.disconnect()
  stickyResizeObserver = undefined
  if (stickyRaf) {
    stickyOwnerWindow?.cancelAnimationFrame(stickyRaf)
    stickyRaf = 0
  }
  stickyOwnerWindow = undefined
}
watch([normalizedColumns, activeFilterKey], () => {
  const openColumn = normalizedColumns.value.find((column) => column.filterDropdownOpen === true)
  if (!activeFilterKey.value && openColumn && !isInteractionLocked.value) {
    filterDraft.value = [...activeFilterValues(openColumn)]
    activeFilterKey.value = getColumnKey(openColumn)
    nextTick(() => filterPopupElement.value?.focus())
  }
  if (activeFilterKey.value && normalizedColumns.value.some((column) => getColumnKey(column) === activeFilterKey.value && column.filterDropdownOpen === false)) {
    closeRequestPending.value = false
    activeFilterKey.value = null
    filterDraft.value = []
  }
}, { immediate: true, deep: true })
watch([popupStyle, filterPopupElement], ([style, element]) => {
  if (!element) return
  sanitizePopupMarker()
  Object.assign(element.style, style)
}, { deep: true, immediate: true })
onMounted(() => {
  rootInteractionInert.value = !tableRoot.value?.isConnected
  if (activeFilterKey.value) filterTriggerElement.value = tableRoot.value?.querySelector<HTMLElement>(`[data-table-filter-trigger="${activeFilterKey.value}"]`) ?? null
  const ownerDocument = tableRoot.value?.ownerDocument
  ownerDocument?.addEventListener('keydown', handleFilterDocumentKeydown, true)
  void nextTick(() => {
    sanitizePopupMarker()
    measureLayout()
    updateFloatingPosition()
    bindStickyObservers()
  })
})
onBeforeUnmount(() => {
  tableRoot.value?.ownerDocument.removeEventListener('keydown', handleFilterDocumentKeydown, true)
  unbindStickyObservers()
})

const getAriaSort = (column: TableColumn) => {
  const state = getSortState(column)
  return state === 'ascend' ? 'ascending' : state === 'descend' ? 'descending' : 'none'
}

const getSortActionLabel = (column: TableColumn) => {
  const label = getColumnLabel(column)
  const state = getSortState(column)
  return state === 'ascend' ? `Sort ${label} descending` : state === 'descend' ? `Clear sort for ${label}` : `Sort ${label}`
}

const toggleSort = (column: TableColumn) => {
  if (isDisabled.value) {
    return
  }

  const key = getColumnKey(column)
  const currentOrder = activeSort.value.columnKey === key ? activeSort.value.order : undefined
  const nextOrder: TableSortOrder | undefined = currentOrder === undefined ? 'ascend' : currentOrder === 'ascend' ? 'descend' : undefined
  const nextSort: InternalSortState = { columnKey: nextOrder ? key : undefined, order: nextOrder }

  if (controlledSort.value === undefined) {
    innerSort.value = nextSort
  }

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

  emitTableChange('filter', 1, pageSize.value, nextFilters, activeSort.value)
}

const isSelected = (key: TableKey) => selectedKeys.value.includes(key)

const toggleSelection = (record: TableRecord, key: TableKey, checked: boolean) => {
  if (isRowSelectionDisabled(record)) {
    return
  }

  const nextKeys = selectionType.value === 'radio'
    ? checked
      ? [key]
      : []
    : checked
      ? Array.from(new Set([...selectedKeys.value, key]))
      : selectedKeys.value.filter((currentKey) => currentKey !== key)

  selectedState.setState([...nextKeys])
  emit('update:selectedRowKeys', [...nextKeys])
  emit('select', key, checked, record, [...nextKeys])
}

const handleSelectAll = (event: Event) => {
  const input = event.target as HTMLInputElement
  const checked = input.checked
  if (!isSelectionDisabled.value && selectionType.value === 'checkbox') {
    const changedRows = selectableRows.value.filter((row) => isSelected(row.key) !== checked)
    if (changedRows.length > 0) {
      const visible = new Set(selectableRows.value.map((row) => row.key))
      const nextKeys = checked
        ? [...new Set([...selectedKeys.value, ...selectableRows.value.map((row) => row.key)])]
        : selectedKeys.value.filter((key) => !visible.has(key))
      selectedState.setState([...nextKeys])
      emit('update:selectedRowKeys', [...nextKeys])
      emit('selectAll', checked, [...nextKeys], changedRows.map((row) => row.record))
    }
  }
  input.checked = allPageSelected.value
  input.indeterminate = somePageSelected.value && !allPageSelected.value
}

const isRowExpandable = (record: TableRecord) => props.expandable?.rowExpandable?.(record) ?? true
const isExpanded = (key: TableKey) => expandedKeys.value.includes(key)

const toggleExpand = (record: TableRecord, key: TableKey) => {
  if (isDisabled.value) {
    return
  }

  const nextExpanded = !isExpanded(key)
  const nextKeys = nextExpanded ? [...expandedKeys.value, key] : expandedKeys.value.filter((currentKey) => currentKey !== key)

  expandedState.setState(nextKeys)
  emit('expand', nextExpanded, record, key)
}

const handlePageChange = (current: number, nextPageSize: number) => {
  if (isDisabled.value) return
  const nextSize = normalizePageSize(nextPageSize)
  const nextCurrent = normalizeCurrent(current, paginationTotal.value, nextSize)
  const sizeChanged = nextSize !== pageSize.value
  pageSizeState.setState(nextSize)
  // A rejected controlled size must not commit its proposed page clamp.
  if (!sizeChanged || !pageSizeState.isControlled.value) currentState.setState(nextCurrent)
  emitTableChange('paginate', nextCurrent, nextSize, activeFilters.value, activeSort.value)
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
    { current, pageSize: nextPageSize, total: getTotal(currentDataSource.length) },
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

const handleSelectionChange = (event: Event, record: TableRecord, key: TableKey) => {
  const input = event.target as HTMLInputElement | null
  toggleSelection(record, key, getEventChecked(event))

  if (input) {
    input.checked = isSelected(key)
    // A native radio click also clears its previously checked sibling. When
    // the parent rejects the request Vue may not rerender, so restore the group.
    if (selectionType.value === 'radio') {
      input.closest('table')?.querySelectorAll<HTMLInputElement>(':scope > tbody > tr > .aheart-table__selection-cell > input[type="radio"]')
        .forEach((rowInput, index) => { rowInput.checked = isSelected(pagedRows.value[index]?.key) })
    }
  }
}
</script>
