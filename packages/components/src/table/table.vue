<template>
  <section
    ref="tableRoot"
    class="aheart-table"
    :class="tableClass"
    :style="tableNarrowStyle"
    :data-table-narrow-left="narrowLeftConstrained ? '' : undefined"
    :data-table-right-downgraded="rightFixedDowngraded ? '' : undefined"
    :data-table-virtual-fallback="virtualFallbackReason ? 'full-dom' : undefined"
    :data-fallback-reason="virtualFallbackReason || undefined"
    :aria-busy="loading || undefined"
    :inert="rootInteractionInert || undefined"
  >
    <div v-if="!loading && error" class="aheart-table__error" role="alert">
      <ARenderNode :node="errorMessage" />
      <button type="button" class="aheart-table__retry" data-table-retry :disabled="isDisabled" @click="emit('retry')">
        <ARenderNode :node="errorRetryText" />
      </button>
    </div>
    <div
      class="aheart-table__interaction-region"
      :inert="isInteractionLocked || undefined"
      @pointerdown.capture="pointerInteractionPending = true"
      @pointerup.capture="handlePointerup"
      @pointercancel.capture="handlePointercancel"
      @click.capture="handleTableClick"
      @keydown.capture="handleTableCapture"
      @input.capture="handleTableCapture"
      @change.capture="handleTableCapture"
      @submit.capture="handleTableCapture"
    >
    <div ref="virtualScroll" class="aheart-table__container" :data-aheart-virtual-scroll="virtualRuntime.enabled ? '' : undefined" :style="containerStyle" @scroll="virtualRuntime.enabled ? handleVirtualScroll : undefined">
      <div v-if="virtualRuntime.enabled" class="aheart-table__virtual-markers" aria-hidden="true">
        <span data-aheart-virtual-height :data-value="virtualRuntime.height" />
        <span data-aheart-virtual-estimate-size :data-value="virtualRuntime.estimateSize" />
        <span data-aheart-virtual-overscan :data-value="virtualRuntime.overscan" />
        <span data-aheart-virtual-measured-height :data-value="virtualMeasuredDisplay" />
      </div>
      <table v-bind="tableAttrs" :aria-rowcount="virtualRuntime.enabled ? pagedRows.length : undefined">
        <colgroup>
          <col v-for="column in layoutColumns" :key="column.id" :style="{ width: column.width }" />
        </colgroup>
        <thead v-if="showHeader" :style="headerSectionStyle">
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
              :data-fixed="column.fixed || undefined"
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
          <template v-for="entry in virtualRenderEntries" :key="entry.key">
          <tr v-if="entry.kind === 'gap'" data-aheart-virtual-spacer="true" :data-before="entry.position === 'before' ? '' : undefined" :data-after="entry.position === 'after' ? '' : undefined" :data-table-virtual-spacer="entry.position" :data-table-spacer-position="entry.position" :style="{ height: `${entry.height}px` }" :data-measured-height="virtualMeasuredDisplay" :data-aheart-virtual-measured-height="virtualMeasuredDisplay || undefined" aria-hidden="true"><td :colspan="columnCount" :style="{ height: `${entry.height}px` }" /></tr>
          <template v-else>
            <tr :data-table-row="String(entry.row.key)" :data-aheart-virtual-logical-item="entry.row.virtualIndex" :data-aheart-virtual-key="rowToken(entry.row.key)" :data-aheart-virtual-measured-height="virtualMeasuredFor(entry.row.virtualIndex) || undefined" :data-aheart-virtual-pinned="focusedRowKey === entry.row.key ? 'true' : undefined" :data-focus-pinned="focusedRowKey === entry.row.key ? 'true' : undefined" :aria-rowindex="virtualRuntime.enabled ? entry.row.virtualIndex + 1 : undefined" :class="{ 'is-selected': isSelected(entry.row.key) }" @focusin="handleRowFocusin(entry.row.key, $event)" @focusout="handleRowFocusout($event, entry.row.key)" @keydown="handleRowKeydown($event, entry.row.key)">
              <td v-if="hasSelection" class="aheart-table__selection-cell" :style="utilityStyle('selection', false)">
                <input
                  :type="selectionType"
                    :name="radioName"
                    :checked="isSelected(entry.row.key)"
                    :data-aheart-row-token="rowToken(entry.row.key)"
                    :disabled="isRowSelectionDisabled(entry.row.record)"
                    :aria-label="`Select row ${entry.row.key}`"
                    @change="handleSelectionChange($event, entry.row.record, entry.row.key)"
                />
              </td>
              <td v-if="hasExpandable" class="aheart-table__expand-cell" :style="utilityStyle('expand', false)">
                <button
                  v-if="isRowExpandable(entry.row.record)"
                  class="aheart-table__expand-button"
                  type="button"
                  :aria-expanded="isExpanded(entry.row.key)"
                  :aria-label="`${isExpanded(entry.row.key) ? 'Collapse' : 'Expand'} row ${entry.row.key}`"
                  :disabled="isInteractionLocked"
                  @click="toggleExpand(entry.row.record, entry.row.key)"
                >
                  {{ isExpanded(entry.row.key) ? '−' : '+' }}
                </button>
              </td>
              <td
                v-for="column in normalizedColumns"
                :key="getColumnKey(column)"
                :class="columnCellClass(column)"
                :data-fixed="column.fixed || undefined"
                :style="bodyColumnStyle(column)"
              >
                <ARenderNode :node="renderCell(column, entry.row.record, entry.row.index)" />
              </td>
            </tr>
            <tr v-if="hasExpandable && isExpanded(entry.row.key)" :data-table-expanded-row="String(entry.row.key)" :data-aheart-virtual-expanded-item="entry.row.virtualIndex" :data-aheart-virtual-key="rowToken(entry.row.key)" class="aheart-table__expanded-row" @focusin="handleRowFocusin(entry.row.key, $event)" @focusout="handleRowFocusout($event, entry.row.key)" @keydown="handleRowKeydown($event, entry.row.key)">
              <td :colspan="columnCount" class="aheart-table__expanded-cell">
                <ARenderNode :node="renderExpanded(entry.row.record, entry.row.index)" />
              </td>
            </tr>
          </template>
          </template>
          <tr v-if="!loading && !error && pagedRows.length === 0">
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
    <Teleport v-if="activeFilterColumn && activeFilterPopupNode !== null" :to="popupTarget" :disabled="popupTargetDisabled">
      <div
        ref="filterPopupElement"
        class="aheart-table__filter-popup"
        role="dialog"
        :aria-label="activeFilterColumn ? `${getColumnLabel(activeFilterColumn)} filter` : undefined"
        :aria-disabled="isInteractionLocked || undefined"
        :inert="isInteractionLocked || undefined"
        :data-table-filter-popup="activeFilterKey"
        tabindex="-1"
        :style="{ ...popupStyle, visibility: popupPositioned ? 'visible' : 'hidden', pointerEvents: popupPositioned ? 'auto' : 'none' }"
        @keydown="handleFilterPopupKeydown"
      >
        <ARenderNode :node="activeFilterPopupNode" />
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onBeforeUpdate, onMounted, ref, watch, type CSSProperties, type PropType, type VNodeChild } from 'vue'
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
import { normalizeTableVirtual } from './virtual-options'
import { useTableVirtual } from './use-table-virtual'
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

interface BusinessRow {
  key: TableKey
  record: TableRecord
  index: number
}

interface InternalRow extends BusinessRow {
  virtualIndex: number
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
const popupPositioned = ref(false)
let popupGeneration = 0
const tableRoot = ref<HTMLElement | null>(null)
const virtualScroll = ref<HTMLElement | null>(null)
const focusedRowKey = ref<TableKey | undefined>(undefined)
let focusedRowFrame: number | undefined
let pendingFocusedRowKey: TableKey | undefined
const rootInteractionInert = ref(true)
const hasInitializedSort = ref(false)
const initializedFilterKeys = ref(new Set<string>())
const radioName = useStableId(undefined, 'aheart-table-selection').value
const radioClickHandled = ref(false)
let pointerInteractionPending = false
const handlePointerup = () => {
  pointerInteractionPending = false
  if (pendingFocusedRowKey === undefined) return
  const key = pendingFocusedRowKey
  const ownerWindow = tableRoot.value?.ownerDocument.defaultView
  if (focusedRowFrame !== undefined) ownerWindow?.cancelAnimationFrame(focusedRowFrame)
  focusedRowFrame = ownerWindow?.requestAnimationFrame(() => {
    focusedRowFrame = undefined
    pendingFocusedRowKey = undefined
    focusedRowKey.value = key
  })
}
const handlePointercancel = () => {
  pointerInteractionPending = false
  if (focusedRowFrame !== undefined) tableRoot.value?.ownerDocument.defaultView?.cancelAnimationFrame(focusedRowFrame)
  focusedRowFrame = undefined
  pendingFocusedRowKey = undefined
}

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
const hasCustomRenderColumn = computed(() => normalizedColumns.value.some(column => typeof column.customRender === 'function'))
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
const handleTableClick = (event: MouseEvent) => {
  handleTableCapture(event)
  handleTableClickCapture(event)
}
const handleTableClickCapture = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  const focusButton = target?.closest<HTMLButtonElement>('button[aria-label^="Focus row "]')
  const focusRow = focusButton?.closest<HTMLElement>('tr[data-aheart-virtual-logical-item]')
  if (focusRow) {
    focusButton?.focus({ preventScroll: true })
    const index = Number(focusRow.dataset.aheartVirtualLogicalItem)
    const logical = Number.isFinite(index) ? pagedRows.value[index] : undefined
    if (logical) focusedRowKey.value = logical.key
  }
  if (selectionType.value !== 'radio') return
  const input = target?.closest<HTMLInputElement>('input[type="radio"][data-aheart-row-token]')
  const row = input?.closest<HTMLElement>('tr[data-aheart-virtual-logical-item]')
  if (!row || !row.querySelector('input[type="radio"]')) return
  const index = Number(row?.dataset.aheartVirtualLogicalItem)
  const logical = Number.isFinite(index) ? pagedRows.value[index] : undefined
  if (logical) handleRadioClick(event, logical.record, logical.key)
}
const errorMessage = computed<TableRenderable>(() =>
  typeof props.error === 'object' && props.error.message !== undefined
    ? props.error.message
    : config.value.locale?.table?.errorText ?? '加载失败'
)
const errorRetryText = computed<TableRenderable>(() =>
  typeof props.error === 'object' && props.error.retryText !== undefined
    ? props.error.retryText
    : config.value.locale?.table?.retryText ?? '重试'
)

const paginationConfig = computed(() => (props.pagination && typeof props.pagination === 'object' ? props.pagination : {}))
const pageSize = computed(() => normalizePageSize(pageSizeState.state.value ?? 10))
const rawCurrentPage = computed(() => currentState.state.value ?? 1)
const paginationTotal = computed(() => getTotal(sortedData.value.length))
const pageCount = computed(() => getPageCount(paginationTotal.value, pageSize.value))
const currentPage = computed(() => normalizeCurrent(rawCurrentPage.value, paginationTotal.value, pageSize.value))
const shouldShowPagination = computed(() => props.pagination !== false && (props.pagination !== undefined || paginationTotal.value > pageSize.value))
const columnCount = computed(() => normalizedColumns.value.length + (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0))
const virtualRuntime = computed(() => {
  const normalized = normalizeTableVirtual(props.virtual, props.scroll, resolvedSize.value)
  return virtualDataValid.value ? normalized : { ...normalized, enabled: false }
})

type LayoutColumn = { id: string; width?: string; source?: TableColumn; utility?: 'selection' | 'expand'; fixed?: 'left' | 'right'; left?: number; right?: number }
const widthSnapshot = ref<Record<string, string>>({})
const layoutReady = ref(false)
const layoutViewportWidth = ref(0)
const headerShiftY = ref(0)
const pxWidth = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value
  if (typeof value === 'string' && /^\s*(\d+(?:\.\d+)?)px\s*$/i.test(value)) {
    const parsed = Number.parseFloat(value)
    return parsed > 0 ? parsed : undefined
  }
  return undefined
}
const narrowLeftConstrained = computed(() => {
  const viewport = layoutViewportWidth.value
  if (viewport <= 0) return false
  const utilityCount = (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0)
  if (utilityCount === 0) return false
  const columns = normalizedColumns.value
  const leftCount = columns.filter((column) => column.fixed === 'left').length
  if (leftCount === 0) return false
  const utilityWidth = (utility: 'selection' | 'expand') => Number.parseFloat(widthSnapshot.value[`__${utility}`] ?? '48') || 48
  const requestedUtilities = (hasSelection.value ? utilityWidth('selection') : 0) + (hasExpandable.value ? utilityWidth('expand') : 0)
  const leftSourceWidth = columns.filter((column) => column.fixed === 'left').reduce((total, column) => total + (pxWidth(column.width) ?? (Number.parseFloat(widthSnapshot.value[getColumnKey(column)] ?? '0') || 0)), 0)
  return requestedUtilities + leftSourceWidth + 64 > viewport && viewport - leftSourceWidth - 64 >= utilityCount * 30
})
const narrowUtilityWidth = computed(() => {
  const utilityCount = (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0)
  if (!utilityCount) return '0px'
  const leftSourceWidth = normalizedColumns.value.filter((column) => column.fixed === 'left').reduce((total, column) => total + (pxWidth(column.width) ?? (Number.parseFloat(widthSnapshot.value[getColumnKey(column)] ?? '0') || 0)), 0)
  return `${Math.max(30, Math.floor((layoutViewportWidth.value - leftSourceWidth - 64) / utilityCount))}px`
})
const layoutColumns = computed<LayoutColumn[]>(() => {
  const data: LayoutColumn[] = []
  const utilityWidth = narrowLeftConstrained.value ? narrowUtilityWidth.value : undefined
  if (hasSelection.value) data.push({ id: '__selection', utility: 'selection', width: utilityWidth ?? widthSnapshot.value.__selection ?? '48px' })
  if (hasExpandable.value) data.push({ id: '__expand', utility: 'expand', width: utilityWidth ?? widthSnapshot.value.__expand ?? '48px' })
  normalizedColumns.value.forEach((column) => {
    const id = getColumnKey(column)
    const declaredWidth = pxWidth(column.width) ? `${pxWidth(column.width)}px` : typeof column.width === 'string' ? column.width : undefined
    data.push({ id, source: column, width: widthSnapshot.value[id] ?? declaredWidth, fixed: column.fixed })
  })
  const dataColumns = data.filter((item) => item.source)
  const leftCount = dataColumns.filter((item) => item.fixed === 'left').length
  const rightCount = dataColumns.filter((item) => item.fixed === 'right').length
  const leftStart = data.findIndex((item) => item.fixed === 'left')
  const rightStart = data.length - rightCount
  const utilityCount = (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0)
  const leftValid = leftCount === 0 || leftStart === utilityCount && data.slice(leftStart, leftStart + leftCount).every((item) => item.fixed === 'left' && (pxWidth(item.source?.width) !== undefined || widthSnapshot.value[item.id] !== undefined))
  const rightValid = rightCount === 0 || rightStart >= 0 && data.slice(rightStart).every((item) => item.fixed === 'right' && pxWidth(item.source?.width) !== undefined)
  const fixedWidth = data.filter((item) => item.utility || item.source?.fixed === 'left' || item.source?.fixed === 'right').reduce((total, item) => total + usedWidth(item), 0)
  const leftEnabled = leftValid && leftCount > 0
  const rightEnabled = rightValid && rightCount > 0 && (layoutViewportWidth.value === 0 || layoutViewportWidth.value > fixedWidth)
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
const rightFixedDowngraded = computed(() => {
  const requested = normalizedColumns.value.some((column) => column.fixed === 'right')
  return requested && layoutColumns.value.filter((item) => item.source?.fixed === 'right').every((item) => item.right === undefined)
})
watch(layoutViewportWidth, (width) => {
  const narrow = layoutColumns.value.filter((item) => item.source?.fixed === 'left' || item.source?.fixed === 'right').reduce((sum, item) => sum + usedWidth(item), 0) > width
  if (width > 0 && narrow && (import.meta as { env?: { DEV?: boolean } }).env?.DEV && layoutColumns.value.some((item) => item.source?.fixed === 'right')) console.warn('[ATable] fixed right columns are downgraded when fixed columns exceed the viewport width')
  if (width > 0 && narrowLeftConstrained.value && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) console.warn('[ATable] narrow viewport constrains fixed utility columns to preserve filter reachability')
})
const stickyOffset = computed(() => typeof props.sticky === 'object' && Number.isFinite(props.sticky.offsetHeader) ? Math.max(0, props.sticky.offsetHeader ?? 0) : 0)
const isSticky = computed(() => Boolean(props.sticky))
const headerSectionStyle = computed<CSSProperties | undefined>(() => headerShiftY.value ? { transform: `translateY(${headerShiftY.value}px)` } : undefined)
const columnLayout = (column: TableColumn) => layoutById.value.get(getColumnKey(column))
const usedWidth = (item: LayoutColumn) => {
  if (narrowLeftConstrained.value && item.utility && item.width) return Number.parseFloat(item.width) || 0
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
  ...(item.fixed === 'left' && item.left !== undefined ? { position: 'sticky', left: `${item.left}px`, zIndex: item.utility ? 3 : 2 } : {}),
  ...(item.fixed === 'right' && item.right !== undefined ? { position: 'sticky', right: `${item.right}px`, zIndex: 1 } : {}),
  ...(isSticky.value && header ? { position: 'sticky', top: `${stickyOffset.value}px`, zIndex: item.fixed === 'left' ? 4 : item.fixed === 'right' ? 1 : 3 } : {})
})
const tableStyle = computed<CSSProperties | undefined>(() => {
  const x = props.scroll?.x
  const minWidth = x === true ? 'max-content' : typeof x === 'number' && Number.isFinite(x) ? `${x}px` : typeof x === 'string' ? x : undefined
  return minWidth ? { minWidth } : undefined
})
const frozenTotalWidth = computed(() => layoutColumns.value.reduce((total, item) => total + usedWidth(item), 0))
const tableAttrs = computed(() => {
  if (layoutReady.value && frozenTotalWidth.value > 0) {
    const width = `${frozenTotalWidth.value}px`
    const style: CSSProperties = { tableLayout: 'fixed', width, minWidth: width }
    return { 'data-table-layout-ready': 'true', style }
  }
  return tableStyle.value ? { style: tableStyle.value } : {}
})
const containerStyle = computed<CSSProperties | undefined>(() => {
  const y = props.scroll?.y
  const leftExtent = Math.max(0, ...layoutColumns.value.filter((item) => item.left !== undefined).map((item) => (item.left ?? 0) + usedWidth(item)))
  const rightExtent = Math.max(0, ...layoutColumns.value.filter((item) => item.right !== undefined).map((item) => (item.right ?? 0) + usedWidth(item)))
  const style: CSSProperties = {
    ...(virtualRuntime.value.enabled ? { height: `${virtualRuntime.value.height}px`, overflowY: 'auto' as const } : y === undefined ? {} : { maxHeight: typeof y === 'number' && Number.isFinite(y) ? `${y}px` : y, overflowY: 'auto' as const }),
    ...(leftExtent > 0 ? { scrollPaddingLeft: `${leftExtent}px` } : {}),
    ...(rightExtent > 0 ? { scrollPaddingRight: `${rightExtent}px` } : {})
  }
  return Object.keys(style).length ? style : undefined
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
const tableNarrowStyle = computed<CSSProperties | undefined>(() => narrowLeftConstrained.value
  ? ({ '--aheart-table-narrow-utility-width': narrowUtilityWidth.value } as CSSProperties)
  : undefined)

const sortedData = computed(() => getSortedRecords(activeFilters.value, activeSort.value))

const allRows = computed<BusinessRow[]>(() =>
  sortedData.value.map((record, index) => ({
    key: getRowKey(record, index),
    record,
    index
  }))
)
const virtualDataValid = computed(() => {
  if (props.virtual === false || props.virtual === undefined) return true
  const keys = normalizedData.value.map((record, index) => typeof props.rowKey === 'function' ? props.rowKey(record) : record[props.rowKey])
  const invalid = keys.some((key) => (typeof key !== 'string' && typeof key !== 'number') || (typeof key === 'number' && !Number.isFinite(key)))
    || new Set(keys.map((key) => `${typeof key}:${String(key)}`)).size !== keys.length
    || normalizedColumns.value.some((column) => Object.prototype.hasOwnProperty.call(column, 'rowspan'))
  if (invalid && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) console.warn('[ATable] virtualization is disabled for invalid/duplicate row keys or unsupported rowspan.')
  return !invalid
})
const virtualFallbackReason = computed(() => {
  if (props.virtual === false || props.virtual === undefined) return ''
  const raw = normalizedData.value.map((record) => typeof props.rowKey === 'function' ? props.rowKey(record) : record[props.rowKey])
  if (normalizedColumns.value.some((column) => Object.prototype.hasOwnProperty.call(column, 'rowspan'))) return 'rowspan'
  if (raw.some((key) => typeof key !== 'string' && (typeof key !== 'number' || !Number.isFinite(key)))) return 'rowKey'
  if (new Set(raw.map((key) => `${typeof key}:${String(key)}`)).size !== raw.length) return 'duplicate-row-key'
  return ''
})

const pagedRows = computed(() => {
  let rows: BusinessRow[]
  if (!shouldShowPagination.value) {
    rows = allRows.value
  } else if (props.dataMode === 'server' || (props.dataMode === undefined && paginationConfig.value.total !== undefined)) {
    rows = allRows.value
  } else {
    const start = (currentPage.value - 1) * pageSize.value
    rows = allRows.value.slice(start, start + pageSize.value)
  }
  return rows.map((row, virtualIndex) => ({ ...row, virtualIndex }))
})

const rowToken = (key: TableKey) => `${typeof key}:${String(key)}`
const virtualKeys = computed(() => pagedRows.value.map((row) => rowToken(row.key)))
const virtualController = useTableVirtual(virtualRuntime, computed(() => pagedRows.value.length), virtualScroll, (index) => {
  const row = pagedRows.value[index]
  return row ? rowToken(row.key) : `index:${index}`
}, virtualKeys)
const handleVirtualScroll = () => {
  const activeRow = (tableRoot.value?.ownerDocument.activeElement as HTMLElement | null)?.closest<HTMLElement>('tr[data-aheart-virtual-logical-item]')
  const activeIndex = Number(activeRow?.dataset.aheartVirtualLogicalItem)
  const activeKey = Number.isFinite(activeIndex) ? pagedRows.value[activeIndex]?.key : undefined
  const keyToCommit = pendingFocusedRowKey ?? activeKey
  if (keyToCommit !== undefined) {
    const key = keyToCommit
    pendingFocusedRowKey = undefined
    if (focusedRowFrame !== undefined) tableRoot.value?.ownerDocument.defaultView?.cancelAnimationFrame(focusedRowFrame)
    focusedRowFrame = undefined
    focusedRowKey.value = key
  }
}
const virtualMeasuredTotal = computed(() => Array.from(virtualController.measured.value.values()).reduce((sum, value) => sum + value, 0))
const virtualMeasuredDisplay = computed(() => virtualMeasuredTotal.value)
const virtualMeasuredFor = (index: number) => virtualController.measured.value.get(virtualKeys.value[index])
type VirtualRenderEntry = { kind: 'gap'; position: 'before' | 'middle' | 'after'; height: number; key: string } | { kind: 'row'; row: InternalRow; key: string }
const virtualRenderEntries = computed<VirtualRenderEntry[]>(() => {
  if (!virtualRuntime.value.enabled) return pagedRows.value.map(row => ({ kind: 'row', row, key: `row:${rowToken(row.key)}` }))
  const items = [...virtualController.items.value].sort((a, b) => a.index - b.index)
  const entries: VirtualRenderEntry[] = []
  entries.push({ kind: 'gap', position: 'before', height: 0, key: 'gap-before' })
  let cursor = 0
  let previousIndex = -1
  const flush = () => {
    if (previousIndex < 0) return
    const item = items.find(candidate => candidate.index === previousIndex)
    if (item) cursor = item.end
  }
  for (const item of items) {
    if (previousIndex >= 0 && item.index > previousIndex + 1) flush()
    if (item.start > cursor) entries.push({ kind: 'gap', position: 'middle', height: item.start - cursor, key: `gap-middle-${item.index}` })
    const row = pagedRows.value[item.index]
    if (row) entries.push({ kind: 'row', row, key: `row:${rowToken(row.key)}` })
    cursor = item.end
    previousIndex = item.index
  }
  flush()
  const total = virtualController.virtualizer.value.getTotalSize()
  entries.push({ kind: 'gap', position: 'after', height: Math.max(0, total - cursor), key: 'gap-after' })
  return entries
})
watch([focusedRowKey, pagedRows, selectedKeys, selectionType], () => {
  const index = focusedRowKey.value === undefined ? undefined : pagedRows.value.findIndex((row) => row.key === focusedRowKey.value)
  virtualController.setPinnedIndexes(index !== undefined && index >= 0 ? [index] : [])
}, { immediate: true, flush: 'sync' })
const visibleRows = computed(() => {
  if (!virtualRuntime.value.enabled) return pagedRows.value
  const rows = virtualController.items.value.map((item) => pagedRows.value[item.index])
    .filter((row): row is InternalRow => Boolean(row))
  return rows
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
    'is-fixed-right': column.fixed === 'right',
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
const positionPopupAndFocus = async () => {
  const generation = ++popupGeneration
  const activeKey = activeFilterKey.value
  popupPositioned.value = false
  await nextTick()
  if (!popupOpen.value || generation !== popupGeneration || activeFilterKey.value !== activeKey) return
  await updateFloatingPosition()
  const ownerWindow = filterPopupElement.value?.ownerDocument.defaultView
  await new Promise<void>((resolve) => {
    if (ownerWindow?.requestAnimationFrame) ownerWindow.requestAnimationFrame(() => resolve())
    else if (ownerWindow?.setTimeout) ownerWindow.setTimeout(resolve, 0)
    else resolve()
  })
  if (!popupOpen.value || generation !== popupGeneration || activeFilterKey.value !== activeKey) return
  popupPositioned.value = true
  await nextTick()
  if (popupOpen.value && generation === popupGeneration && activeFilterKey.value === activeKey) {
    filterPopupElement.value?.focus({ preventScroll: true })
  }
}
useFloatingDismiss({
  open: popupOpen,
  trigger: filterTriggerElement,
  floating: filterPopupElement,
  onDismiss: (reason, event) => {
    if (reason === 'outside') event.preventDefault()
    const dismissalGeneration = popupGeneration
    const dismissalKey = activeFilterKey.value
    const dismissalTrigger = filterTriggerElement.value
    const dismiss = () => {
      if (!isInteractionLocked.value && popupGeneration === dismissalGeneration && activeFilterKey.value === dismissalKey && filterTriggerElement.value === dismissalTrigger) {
        closeFilter()
      }
    }
    if (reason === 'outside') {
      const closeOutside = () => {
        if (popupGeneration !== dismissalGeneration || activeFilterKey.value !== dismissalKey || filterTriggerElement.value !== dismissalTrigger || !popupOpen.value) return
        dismiss()
      }
      closeOutside()
    }
    else dismiss()
  },
  restoreFocus: true
})
watch([filterTriggerElement, filterPopupElement, popupOpen], () => {
  if (popupOpen.value) void nextTick(updateFloatingPosition)
}, { flush: 'post' })
watch(popupOpen, (open) => {
  if (open) void positionPopupAndFocus()
  else {
    popupGeneration++
    popupPositioned.value = false
  }
}, { flush: 'post', immediate: true })
const isFilterPopupOpen = (column: TableColumn) => activeFilterKey.value === getColumnKey(column)
let popupNodeCacheKey: string | null = null
let popupNodeCacheDraft = ''
let popupNodeCache: VNodeChild | null = null
const filterDisabledSnapshot = new WeakMap<Element, boolean>()
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
const syncFilterDisabled = () => {
  const popup = filterPopupElement.value
  if (!popup) return
  const controls = popup.querySelectorAll<HTMLElement>('button, input, select, textarea, [contenteditable="true"]')
  controls.forEach((control) => {
    if (isInteractionLocked.value) {
      if (!filterDisabledSnapshot.has(control)) filterDisabledSnapshot.set(control, control.hasAttribute('disabled'))
      control.setAttribute('disabled', '')
    } else if (filterDisabledSnapshot.has(control)) {
      if (filterDisabledSnapshot.get(control)) control.setAttribute('disabled', '')
      else control.removeAttribute('disabled')
      filterDisabledSnapshot.delete(control)
    }
  })
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
}
const closeFilter = (restoreFocus = true) => {
  if (isInteractionLocked.value) return
  const column = activeFilterColumn.value
  if (column?.filterDropdownOpen !== undefined) {
    if (!closeRequestPending.value) {
      closeRequestPending.value = true
      requestFilterOpen(column, false)
      queueMicrotask(() => { closeRequestPending.value = false })
    }
    return
  }
  if (column) requestFilterOpen(column, false)
  popupGeneration++
  popupPositioned.value = false
  activeFilterKey.value = null
  filterDraft.value = []
  closeRequestPending.value = false
  if (restoreFocus) {
    const triggerKey = column ? getColumnKey(column) : undefined
    const closeGeneration = popupGeneration
    const restoreTrigger = filterTriggerElement.value
    void nextTick(() => {
      const trigger = triggerKey
        ? tableRoot.value?.querySelector<HTMLElement>(`[data-table-filter-trigger="${triggerKey}"]`) ?? restoreTrigger
        : restoreTrigger
      const ownerWindow = trigger?.ownerDocument.defaultView
      const focus = () => {
        if (popupGeneration !== closeGeneration || popupOpen.value || activeFilterKey.value !== null) return
        trigger?.focus({ preventScroll: true })
      }
      if (ownerWindow?.requestAnimationFrame) ownerWindow.requestAnimationFrame(focus)
      else focus()
    })
  }
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
  const controls = Array.from(filterPopupElement.value.querySelectorAll<HTMLElement>([
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(','))).filter((element) => !element.matches('[hidden], [inert]') && !element.closest('[hidden], [inert]'))
  if (!controls.length) return
  const current = filterPopupElement.value.ownerDocument.activeElement
  const index = controls.indexOf(current as HTMLElement)
  const next = event.shiftKey ? (index <= 0 ? controls.length - 1 : index - 1) : (index >= controls.length - 1 ? 0 : index + 1)
  event.preventDefault()
  controls[next]?.focus({ preventScroll: true })
  void nextTick(() => controls[next]?.focus({ preventScroll: true }))
}
let stickyResizeObserver: ResizeObserver | undefined
let virtualResizeObserver: ResizeObserver | undefined
const observedVirtualRows = new Set<HTMLElement>()
const observedVirtualHeights = new Map<Element, number>()
let virtualResizeFrame: number | undefined
let virtualResizeOwnerWindow: Window | undefined
let virtualResizeGeneration = 0
let virtualResizeFlushedGeneration = 0
let stickyOwnerWindow: Window | undefined
let stickyScrollAncestor: HTMLElement | null = null
const handleStickyAncestorScroll = () => {
  updateStickyGeometry()
  scheduleStickyGeometry()
}
let stickyRaf = 0
const findStickyScrollAncestor = (root: HTMLElement, ownerWindow: Window) => {
  let current = root.parentElement
  while (current) {
    const style = ownerWindow.getComputedStyle(current)
    const overflowY = style.overflowY
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') return current
    current = current.parentElement
  }
  return null
}
const updateStickyGeometry = () => {
  const root = tableRoot.value
  if (!root || !isSticky.value || props.scroll?.y !== undefined) {
    headerShiftY.value = 0
    return
  }
  if (!stickyScrollAncestor) {
    const ownerWindow = root.ownerDocument.defaultView
    if (ownerWindow) stickyScrollAncestor = findStickyScrollAncestor(root, ownerWindow)
  }
  const rect = root.getBoundingClientRect()
  const tableRect = root.querySelector('table')?.getBoundingClientRect()
  const viewportHeight = root.ownerDocument.defaultView?.innerHeight ?? 0
  const header = root.querySelector<HTMLElement>('thead')
  const firstHeaderCell = root.querySelector<HTMLElement>('thead th')
  const headerRect = header?.getBoundingClientRect()
  const headerHeight = headerRect?.height ?? 0
  if (!headerRect || !headerHeight) {
    headerShiftY.value = 0
    return
  }
  const visualHeaderTop = firstHeaderCell?.getBoundingClientRect().top ?? headerRect.top
  const naturalHeaderTop = visualHeaderTop - headerShiftY.value
  const ancestorRect = stickyScrollAncestor?.getBoundingClientRect()
  const targetTop = (ancestorRect?.top ?? 0) + (stickyScrollAncestor?.clientTop ?? 0) + stickyOffset.value
  const maxShift = (tableRect?.bottom ?? rect.bottom) - headerHeight - naturalHeaderTop
  const desiredShift = targetTop - visualHeaderTop + headerShiftY.value
  const bounded = Math.max(0, Math.min(maxShift, desiredShift))
  headerShiftY.value = Number.isFinite(bounded) ? bounded : 0
}
const scheduleStickyGeometry = () => {
  if (stickyRaf) return
  const ownerWindow = tableRoot.value?.ownerDocument.defaultView
  const request = ownerWindow?.requestAnimationFrame
    ?? (ownerWindow?.setTimeout ? ((callback: FrameRequestCallback) => ownerWindow.setTimeout(callback, 0) as unknown as number) : undefined)
  if (!request) {
    measureLayout()
    updateStickyGeometry()
    return
  }
  stickyRaf = request(() => {
    stickyRaf = 0
    measureLayout()
    updateStickyGeometry()
  })
}
const measureLayout = () => {
  if (props.scroll?.x === undefined || !tableRoot.value) return
  const container = tableRoot.value.querySelector<HTMLElement>('.aheart-table__container')
  if (container) {
    const containerWidth = container.clientWidth || container.getBoundingClientRect().width
    const rootWidth = tableRoot.value.getBoundingClientRect().width || tableRoot.value.clientWidth
    layoutViewportWidth.value = rootWidth > 0 ? Math.min(containerWidth || rootWidth, rootWidth) : containerWidth
  }
  const cells = Array.from(tableRoot.value.querySelectorAll<HTMLElement>('thead th'))
  const cols = Array.from(tableRoot.value.querySelectorAll<HTMLElement>('colgroup col'))
  const next = { ...widthSnapshot.value }
  cells.forEach((cell, index) => {
    const width = cell.getBoundingClientRect().width || cols[index]?.getBoundingClientRect().width || Number.parseFloat(tableRoot.value?.ownerDocument.defaultView?.getComputedStyle(cell).width ?? '') || 0
    const item = layoutColumns.value[index]
    if (item && width > 0 && !next[item.id]) next[item.id] = `${width}px`
  })
  if (Object.keys(next).length !== Object.keys(widthSnapshot.value).length) widthSnapshot.value = next
  if (layoutColumns.value.length > 0 && layoutColumns.value.every((item) => next[item.id])) layoutReady.value = true
}
watch([normalizedData, () => props.scroll?.x], () => measureLayout(), { flush: 'sync' })
const bindStickyObservers = () => {
  const root = tableRoot.value
  const ownerWindow = root?.ownerDocument.defaultView
  if (!root || !ownerWindow) return
  stickyOwnerWindow = ownerWindow
  stickyScrollAncestor = findStickyScrollAncestor(root, ownerWindow)
  ownerWindow.addEventListener('scroll', scheduleStickyGeometry, true)
  ownerWindow.addEventListener('resize', scheduleStickyGeometry)
  stickyScrollAncestor?.addEventListener('scroll', handleStickyAncestorScroll, { passive: true })
  const ResizeObserverConstructor = ownerWindow.ResizeObserver
    if (ResizeObserverConstructor) {
    stickyResizeObserver = new ResizeObserverConstructor(() => {
      measureLayout()
      scheduleStickyGeometry()
    })
    stickyResizeObserver.observe(root)
    const container = root.querySelector<HTMLElement>('.aheart-table__container')
    if (container) stickyResizeObserver.observe(container)
    if (stickyScrollAncestor) stickyResizeObserver.observe(stickyScrollAncestor)
  }
  scheduleStickyGeometry()
}
const unbindStickyObservers = () => {
  if (stickyOwnerWindow) {
    stickyOwnerWindow.removeEventListener('scroll', scheduleStickyGeometry, true)
    stickyOwnerWindow.removeEventListener('resize', scheduleStickyGeometry)
  }
  stickyScrollAncestor?.removeEventListener('scroll', handleStickyAncestorScroll)
  stickyScrollAncestor = null
  stickyResizeObserver?.disconnect()
  stickyResizeObserver = undefined
  if (stickyRaf) {
    stickyOwnerWindow?.cancelAnimationFrame(stickyRaf)
    stickyRaf = 0
  }
  stickyOwnerWindow = undefined
}
onBeforeUpdate(() => measureLayout())
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
  syncFilterDisabled()
}, { deep: true, immediate: true })
watch(isInteractionLocked, syncFilterDisabled)
watch([visibleRows, expandedKeys], () => {
  void nextTick(() => {
    const rows = new Set<HTMLElement>(Array.from(tableRoot.value?.querySelectorAll<HTMLElement>('tbody tr[data-aheart-virtual-logical-item], tbody tr[data-aheart-virtual-expanded-item]') ?? []))
    observedVirtualRows.forEach((row) => {
      if (!rows.has(row)) {
        virtualResizeObserver?.unobserve(row)
        observedVirtualRows.delete(row)
        observedVirtualHeights.delete(row)
        if (row.matches('tr[data-table-expanded-row]')) {
          const index = Number(row.dataset.aheartVirtualExpandedItem)
          if (Number.isFinite(index)) virtualController.clearMeasured(index, 'expanded')
        }
      }
    })
    rows.forEach((row) => {
      if (!observedVirtualRows.has(row)) {
        virtualResizeObserver?.observe(row)
        observedVirtualRows.add(row)
      }
    })
  })
}, { flush: 'post' })
const setupVirtualResizeObserver = () => {
  if (virtualResizeObserver || !virtualRuntime.value.enabled) return
  const ownerWindow = tableRoot.value?.ownerDocument.defaultView
  const Constructor = ownerWindow?.ResizeObserver
  if (!Constructor) return
  const resizeOwnerWindow = ownerWindow
  virtualResizeOwnerWindow = resizeOwnerWindow
  virtualResizeObserver = new Constructor((entries) => {
    entries.forEach((entry) => { observedVirtualHeights.set(entry.target, entry.contentRect.height) })
    virtualResizeGeneration += 1
    const generation = virtualResizeGeneration
    const flush = () => {
      if (virtualResizeFlushedGeneration === virtualResizeGeneration) return
      virtualResizeFrame = undefined
      const heights = new Map<number, Map<string, number>>()
      observedVirtualHeights.forEach((height, target) => {
        const element = target as HTMLElement
        const index = Number(element.dataset.aheartVirtualLogicalItem ?? element.dataset.aheartVirtualExpandedItem)
        if (!Number.isFinite(index)) return
        const part = element.matches('tr[data-table-expanded-row]') ? 'expanded' : 'base'
        const parts = heights.get(index) ?? new Map<string, number>()
        parts.set(part, height)
        heights.set(index, parts)
      })
      heights.forEach((parts, index) => parts.forEach((height, part) => virtualController.setMeasured(index, height, part)))
      virtualResizeFlushedGeneration = generation
    }
    const testScheduler = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV === 'test'
    if (resizeOwnerWindow?.requestAnimationFrame && !testScheduler) {
      // ResizeObserver callbacks must never synchronously resize the observed
      // rows: WebKit reports that as a ResizeObserver loop. Coalesce delivery
      // into one owner-window frame and let a later callback schedule a new
      // frame only when it has newer measurements.
      if (virtualResizeFrame === undefined) virtualResizeFrame = resizeOwnerWindow.requestAnimationFrame(flush)
    } else {
      flush()
    }
  })
  tableRoot.value?.querySelectorAll<HTMLElement>('tbody tr[data-aheart-virtual-logical-item], tbody tr[data-aheart-virtual-expanded-item]').forEach((row) => { virtualResizeObserver?.observe(row); observedVirtualRows.add(row) })
}
onMounted(() => {
  rootInteractionInert.value = !tableRoot.value?.isConnected
  if (activeFilterKey.value) filterTriggerElement.value = tableRoot.value?.querySelector<HTMLElement>(`[data-table-filter-trigger="${activeFilterKey.value}"]`) ?? null
  bindStickyObservers()
  void nextTick(() => {
    sanitizePopupMarker()
    measureLayout()
    updateFloatingPosition()
    setupVirtualResizeObserver()
  })
})
watch(() => virtualRuntime.value.enabled, (enabled) => {
  if (enabled) void nextTick(setupVirtualResizeObserver)
  else {
    virtualResizeObserver?.disconnect()
    virtualResizeObserver = undefined
    observedVirtualRows.clear()
    observedVirtualHeights.clear()
    if (virtualResizeFrame !== undefined) virtualResizeOwnerWindow?.cancelAnimationFrame(virtualResizeFrame)
    virtualResizeFrame = undefined
    virtualResizeOwnerWindow = undefined
  }
})
onBeforeUnmount(() => {
  unbindStickyObservers()
  if (focusedRowFrame !== undefined) tableRoot.value?.ownerDocument.defaultView?.cancelAnimationFrame(focusedRowFrame)
  focusedRowFrame = undefined
  virtualResizeObserver?.disconnect()
  virtualResizeObserver = undefined
  if (virtualResizeFrame !== undefined) virtualResizeOwnerWindow?.cancelAnimationFrame(virtualResizeFrame)
  virtualResizeFrame = undefined
  virtualResizeGeneration = 0
  virtualResizeFlushedGeneration = 0
  virtualResizeOwnerWindow = undefined
  observedVirtualRows.clear()
  observedVirtualHeights.clear()
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
const handleRowFocusin = (key: TableKey, event: FocusEvent) => {
  // A focus event occurs between pointerdown and mouseup. Updating the
  // reactive virtual window here can replace the focused input before the
  // browser dispatches change (notably in fixed-column tables). Mark the
  // current row immediately, then commit the pin after this interaction turn.
  const row = (event.currentTarget as HTMLElement | null)
  row?.setAttribute('data-aheart-virtual-pinned', 'true')
  row?.setAttribute('data-focus-pinned', 'true')
  // Commit the pin before pointer/click handlers can trigger a virtual-window
  // update. This keeps the focused row mounted across fixed-column browsers.
  focusedRowKey.value = key
  const focusedIndex = pagedRows.value.findIndex((row) => row.key === key)
  virtualController.setPinnedIndexes(focusedIndex >= 0 ? [focusedIndex] : [])
  pendingFocusedRowKey = pointerInteractionPending ? key : undefined
  const ownerWindow = tableRoot.value?.ownerDocument.defaultView
  if (focusedRowFrame !== undefined) ownerWindow?.cancelAnimationFrame(focusedRowFrame)
  const commit = () => {
    focusedRowFrame = undefined
    pendingFocusedRowKey = undefined
    focusedRowKey.value = key
  }
  if (pointerInteractionPending && ownerWindow?.requestAnimationFrame) focusedRowFrame = ownerWindow.requestAnimationFrame(commit)
  else commit()
}
const handleRowFocusout = (event: FocusEvent, sourceKey: TableKey) => {
  const sourceToken = rowToken(sourceKey)
  const sourceRow = (event.currentTarget as HTMLElement | null)?.closest('tr')
  sourceRow?.removeAttribute('data-aheart-virtual-pinned')
  sourceRow?.removeAttribute('data-focus-pinned')
  const ownerDocument = tableRoot.value?.ownerDocument
  const ownerWindow = ownerDocument?.defaultView
  const clearIfOutsideGroup = () => {
    if (focusedRowKey.value !== sourceKey) return
    const active = ownerDocument?.activeElement as HTMLElement | null
    const activeRow = active?.closest<HTMLElement>('tr[data-table-row], tr[data-table-expanded-row]')
    if (activeRow?.dataset.aheartVirtualKey === sourceToken) return
    if (focusedRowFrame !== undefined) ownerWindow?.cancelAnimationFrame(focusedRowFrame)
    focusedRowFrame = undefined
    pendingFocusedRowKey = undefined
    focusedRowKey.value = undefined
    virtualController.setPinnedIndexes([])
    tableRoot.value?.querySelectorAll<HTMLElement>('tr[data-table-row], tr[data-table-expanded-row]').forEach((groupRow) => {
      if (groupRow.dataset.aheartVirtualKey !== sourceToken) return
      groupRow.removeAttribute('data-aheart-virtual-pinned')
      groupRow.removeAttribute('data-focus-pinned')
    })
    ;(event.currentTarget as HTMLElement | null)?.closest('tr')?.removeAttribute('data-aheart-virtual-pinned')
    ;(event.currentTarget as HTMLElement | null)?.closest('tr')?.removeAttribute('data-focus-pinned')
  }
  const related = event.relatedTarget as Node | null
  if (related && !tableRoot.value?.contains(related)) {
    clearIfOutsideGroup()
    return
  }
  void nextTick(() => {
    if (ownerWindow?.requestAnimationFrame) ownerWindow.requestAnimationFrame(clearIfOutsideGroup)
    if (ownerWindow?.setTimeout) ownerWindow.setTimeout(clearIfOutsideGroup, 0)
    else if (!ownerWindow?.requestAnimationFrame) clearIfOutsideGroup()
  })
}
const tabbableSelector = 'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])'
const rowsForToken = (token: string) => Array.from(tableRoot.value?.querySelectorAll<HTMLElement>('tr[data-aheart-virtual-key]') ?? []).filter(row => row.dataset.aheartVirtualKey === token)
const tabbablesForKey = (key: TableKey) => rowsForToken(rowToken(key)).flatMap(row => Array.from(row.querySelectorAll<HTMLElement>(tabbableSelector)))
const isActuallyTabbable = (element: HTMLElement) => {
  if (element.matches('[hidden], [inert], [aria-hidden="true"]') || element.closest('[hidden], [inert], [aria-hidden="true"]')) return false
  if ('disabled' in element && Boolean((element as HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement).disabled)) return false
  if (element.getAttribute('aria-disabled') === 'true') return false
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  return style?.display !== 'none' && style?.visibility !== 'hidden'
}
const focusOutsideTable = (forward: boolean) => {
  const root = tableRoot.value
  const doc = root?.ownerDocument
  if (!root || !doc) return false
  const candidates = Array.from(doc.querySelectorAll<HTMLElement>(tabbableSelector)).filter(isActuallyTabbable).filter(element => !root.contains(element))
  const related = candidates.filter(element => {
    const position = root.compareDocumentPosition(element)
    return forward ? Boolean(position & 4) : Boolean(position & 2)
  })
  const target = forward ? related[0] : related.at(-1)
  if (!target) return false
  target.focus({ preventScroll: true })
  return true
}
const mayHaveTabbable = (row: InternalRow) => {
  if (hasSelection.value && !isRowSelectionDisabled(row.record)) return true
  if (hasExpandable.value && isRowExpandable(row.record)) return true
  if (hasCustomRenderColumn.value) return true
  return false
}
const handleRowKeydown = (event: KeyboardEvent, key: TableKey) => {
  if (!virtualRuntime.value.enabled || event.key !== 'Tab') return
  const token = rowToken(key)
  const groupTabbables = tabbablesForKey(key)
  const current = event.target as HTMLElement | null
  const currentIndex = current ? groupTabbables.indexOf(current) : -1
  if (currentIndex < 0) return
  const atBoundary = event.shiftKey ? currentIndex === 0 : currentIndex === groupTabbables.length - 1
  if (!atBoundary) return
  const sourceRow = (event.currentTarget as HTMLElement | null)?.closest<HTMLElement>('tr[data-aheart-virtual-logical-item], tr[data-aheart-virtual-expanded-item]')
  const sourceIndex = Number(sourceRow?.dataset.aheartVirtualLogicalItem ?? sourceRow?.dataset.aheartVirtualExpandedItem)
  if (!Number.isFinite(sourceIndex)) return
  const direction = event.shiftKey ? -1 : 1
  const findCandidate = (from: number): InternalRow | undefined => {
    for (let index = from; index >= 0 && index < pagedRows.value.length; index += direction) {
      const candidate = pagedRows.value[index]
      if (mayHaveTabbable(candidate)) return candidate
    }
    return undefined
  }
  const candidate = findCandidate(sourceIndex + direction)
  if (!candidate) return
  const focusCandidate = (row: InternalRow): boolean => {
    const targetTabbables = tabbablesForKey(row.key)
    const next = event.shiftKey ? targetTabbables.at(-1) : targetTabbables[0]
    if (!next) return false
    focusedRowKey.value = row.key
    virtualController.setPinnedIndexes([row.virtualIndex])
    next.focus({ preventScroll: true })
    return true
  }
  if (focusCandidate(candidate)) {
    event.preventDefault()
    return
  }
  // The first logical candidate may be outside the current window. Pin it
  // temporarily, then only take over native Tab if rendering exposes a real
  // enabled tabbable. Otherwise continue in the same direction.
  event.preventDefault()
  virtualController.setPinnedIndexes([sourceIndex, candidate.virtualIndex])
  const settle = (row: InternalRow) => {
    if (focusCandidate(row)) return
    const next = findCandidate(row.virtualIndex + direction)
    if (!next) {
      focusedRowKey.value = undefined
      virtualController.setPinnedIndexes([])
      focusOutsideTable(!event.shiftKey)
      return
    }
    virtualController.setPinnedIndexes([sourceIndex, next.virtualIndex])
    void nextTick(() => settle(next))
  }
  void nextTick(() => settle(candidate))
}
const handleRadioClick = (event: MouseEvent, record: TableRecord, key: TableKey) => {
  if (selectionType.value !== 'radio') return
  event.preventDefault()
  radioClickHandled.value = true
  toggleSelection(record, key, true)
  const table = (event.target as HTMLElement | null)?.closest('table') ?? tableRoot.value?.querySelector('table')
  table?.querySelectorAll<HTMLInputElement>('input[type="radio"][data-aheart-row-token]').forEach((rowInput) => {
    const token = rowInput.dataset.aheartRowToken
    rowInput.checked = Boolean(token && pagedRows.value.some((row) => rowToken(row.key) === token && isSelected(row.key)))
  })
}

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
  if (selectionType.value === 'radio' && radioClickHandled.value) { radioClickHandled.value = false; return }
  toggleSelection(record, key, getEventChecked(event))

  if (input) {
    if (virtualRuntime.value.enabled && input === tableRoot.value?.ownerDocument.activeElement) {
      // The focused row must remain mounted while a controlled parent applies
      // the selection update; this write happens after the native click turn.
      pendingFocusedRowKey = undefined
    }
    if (!virtualRuntime.value.enabled) input.checked = isSelected(key)
    else {
      // Controlled parents may accept or reject the request. Reconcile after
      // Vue has applied the parent's update so the parent remains authoritative.
      void nextTick(() => nextTick(() => {
        const ownerWindow = input.ownerDocument.defaultView
        input.checked = getEventChecked(event)
        const reconcile = () => { if (input.isConnected) input.checked = isSelected(key) }
        if (ownerWindow?.setTimeout) ownerWindow.setTimeout(reconcile, 0)
        else reconcile()
      }))
    }
    // A native radio click also clears its previously checked sibling. When
    // the parent rejects the request Vue may not rerender, so restore the group.
    if (selectionType.value === 'radio') {
      input.closest('table')?.querySelectorAll<HTMLInputElement>('input[type="radio"][data-aheart-row-token]')
        .forEach((rowInput) => {
          const token = rowInput.dataset.aheartRowToken
          rowInput.checked = Boolean(token && pagedRows.value.some((row) => rowToken(row.key) === token && isSelected(row.key)))
        })
    }
  }
}
</script>
