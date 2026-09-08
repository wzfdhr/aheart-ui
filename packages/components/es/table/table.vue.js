import { defineComponent, ref, computed, watch, nextTick, onBeforeUpdate, onMounted, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, createVNode, unref, createElementVNode, createCommentVNode, normalizeStyle, normalizeProps, guardReactiveProps, Fragment, renderList, toDisplayString, createBlock, Teleport } from "vue";
import Pagination from "../pagination/index.js";
import { normalizePageSize, getPageCount, normalizeCurrent, normalizeTotal } from "../pagination/pagination-state.js";
import { useControllableState } from "../utils/use-controllable-state.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useStableId } from "../utils/use-stable-id.js";
import { tableProps, tableEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = ["aria-busy", "inert"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-table__error",
  role: "alert"
};
const _hoisted_3 = ["disabled"];
const _hoisted_4 = ["inert"];
const _hoisted_5 = ["checked", "indeterminate", "aria-checked", "disabled"];
const _hoisted_6 = {
  key: 1,
  class: "aheart-table__selection-title",
  "aria-hidden": "true"
};
const _hoisted_7 = ["aria-sort"];
const _hoisted_8 = { class: "aheart-table__head-content" };
const _hoisted_9 = ["disabled", "aria-label", "onClick"];
const _hoisted_10 = ["data-sort"];
const _hoisted_11 = {
  key: 1,
  class: "aheart-table__title"
};
const _hoisted_12 = ["data-table-filter-trigger", "aria-expanded", "disabled", "onClick"];
const _hoisted_13 = { class: "sr-only" };
const _hoisted_14 = ["aria-label"];
const _hoisted_15 = ["aria-pressed", "disabled", "onClick"];
const _hoisted_16 = ["type", "name", "checked", "disabled", "aria-label", "onChange"];
const _hoisted_17 = ["aria-expanded", "disabled", "onClick"];
const _hoisted_18 = {
  key: 0,
  class: "aheart-table__expanded-row"
};
const _hoisted_19 = ["colspan"];
const _hoisted_20 = { key: 0 };
const _hoisted_21 = ["colspan"];
const _hoisted_22 = {
  key: 1,
  class: "aheart-table__loading",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_23 = ["aria-label", "aria-disabled", "inert", "data-table-filter-popup"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATable"
  },
  __name: "table",
  props: tableProps,
  emits: tableEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = defineComponent({
      name: "ATableRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const hasOwn = (value, key) => Boolean(value && Object.prototype.hasOwnProperty.call(value, key));
    const selectedState = useControllableState({
      controlled: () => {
        var _a;
        return (_a = props.rowSelection) == null ? void 0 : _a.selectedRowKeys;
      },
      isControlled: () => hasOwn(props.rowSelection, "selectedRowKeys"),
      defaultValue: () => {
        var _a;
        return [...((_a = props.rowSelection) == null ? void 0 : _a.defaultSelectedRowKeys) ?? []];
      }
    });
    const expandedState = useControllableState({
      controlled: () => {
        var _a;
        return (_a = props.expandable) == null ? void 0 : _a.expandedRowKeys;
      },
      isControlled: () => hasOwn(props.expandable, "expandedRowKeys"),
      defaultValue: () => {
        var _a;
        return [...((_a = props.expandable) == null ? void 0 : _a.defaultExpandedRowKeys) ?? []];
      },
      onChange: (keys) => emit("update:expandedRowKeys", [...keys ?? []])
    });
    const currentState = useControllableState({
      controlled: () => props.pagination && typeof props.pagination === "object" ? props.pagination.current : void 0,
      isControlled: () => Boolean(props.pagination && typeof props.pagination === "object" && hasOwn(props.pagination, "current")),
      defaultValue: () => props.pagination && typeof props.pagination === "object" ? props.pagination.defaultCurrent ?? props.pagination.current ?? 1 : 1
    });
    const pageSizeState = useControllableState({
      controlled: () => props.pagination && typeof props.pagination === "object" ? props.pagination.pageSize : void 0,
      isControlled: () => Boolean(props.pagination && typeof props.pagination === "object" && hasOwn(props.pagination, "pageSize")),
      defaultValue: () => props.pagination && typeof props.pagination === "object" ? props.pagination.defaultPageSize ?? 10 : 10
    });
    const innerSort = ref({});
    const innerFilters = ref({});
    const activeFilterKey = ref(null);
    const filterDraft = ref([]);
    const closeRequestPending = ref(false);
    const filterTriggerElement = ref(null);
    const filterPopupElement = ref(null);
    const popupPositioned = ref(false);
    let popupGeneration = 0;
    const tableRoot = ref(null);
    const rootInteractionInert = ref(true);
    const hasInitializedSort = ref(false);
    const initializedFilterKeys = ref(/* @__PURE__ */ new Set());
    const radioName = useStableId(void 0, "aheart-table-selection").value;
    const normalizedColumns = computed(() => (props.columns ?? []).filter((column) => !column.hidden));
    const normalizedData = computed(() => props.dataSource ?? []);
    const initialFilterColumn = (props.columns ?? []).find((column) => !column.hidden && (column.defaultFilterDropdownOpen === true || column.filterDropdownOpen === true) && column.filterDropdown);
    if (initialFilterColumn) {
      activeFilterKey.value = initialFilterColumn.key ?? String(Array.isArray(initialFilterColumn.dataIndex) ? initialFilterColumn.dataIndex.join(".") : initialFilterColumn.dataIndex ?? initialFilterColumn.title);
      filterDraft.value = [...initialFilterColumn.filteredValue ?? initialFilterColumn.defaultFilteredValue ?? []];
    }
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const hasSelection = computed(() => Boolean(props.rowSelection));
    const hasExpandable = computed(() => {
      var _a;
      return Boolean((_a = props.expandable) == null ? void 0 : _a.expandedRowRender);
    });
    const selectionType = computed(() => {
      var _a;
      return ((_a = props.rowSelection) == null ? void 0 : _a.type) ?? "checkbox";
    });
    const isInteractionLocked = computed(() => isDisabled.value || props.loading || Boolean(props.error));
    const isSelectionDisabled = computed(() => {
      var _a;
      return isInteractionLocked.value || Boolean((_a = props.rowSelection) == null ? void 0 : _a.disabled);
    });
    const selectedKeys = computed(() => selectedState.state.value ?? []);
    const expandedKeys = computed(() => expandedState.state.value ?? []);
    const resolvedEmptyText = computed(
      () => {
        var _a, _b, _c, _d;
        return hasRenderableContent(props.emptyText) ? props.emptyText : ((_b = (_a = config.value.locale) == null ? void 0 : _a.table) == null ? void 0 : _b.emptyText) ?? ((_d = (_c = config.value.locale) == null ? void 0 : _c.empty) == null ? void 0 : _d.description) ?? "No Data";
      }
    );
    const resolvedLoadingText = computed(() => {
      var _a, _b;
      return ((_b = (_a = config.value.locale) == null ? void 0 : _a.table) == null ? void 0 : _b.loadingText) ?? "加载中";
    });
    const handleTableCapture = (event) => {
      var _a;
      if (!isInteractionLocked.value || ((_a = event.target) == null ? void 0 : _a.closest("[data-table-retry]")))
        return;
      event.preventDefault();
      event.stopPropagation();
    };
    const errorMessage = computed(() => typeof props.error === "object" && props.error.message !== void 0 ? props.error.message : "加载失败");
    const errorRetryText = computed(() => typeof props.error === "object" && props.error.retryText !== void 0 ? props.error.retryText : "重试");
    const paginationConfig = computed(() => props.pagination && typeof props.pagination === "object" ? props.pagination : {});
    const pageSize = computed(() => normalizePageSize(pageSizeState.state.value ?? 10));
    const rawCurrentPage = computed(() => currentState.state.value ?? 1);
    const paginationTotal = computed(() => getTotal(sortedData.value.length));
    const pageCount = computed(() => getPageCount(paginationTotal.value, pageSize.value));
    const currentPage = computed(() => normalizeCurrent(rawCurrentPage.value, paginationTotal.value, pageSize.value));
    const shouldShowPagination = computed(() => props.pagination !== false && (props.pagination !== void 0 || paginationTotal.value > pageSize.value));
    const columnCount = computed(() => normalizedColumns.value.length + (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0));
    const widthSnapshot = ref({});
    const layoutReady = ref(false);
    const layoutViewportWidth = ref(0);
    const headerShiftY = ref(0);
    const pxWidth = (value) => {
      if (typeof value === "number" && Number.isFinite(value) && value > 0)
        return value;
      if (typeof value === "string" && /^\s*(\d+(?:\.\d+)?)px\s*$/i.test(value)) {
        const parsed = Number.parseFloat(value);
        return parsed > 0 ? parsed : void 0;
      }
      return void 0;
    };
    const layoutColumns = computed(() => {
      const data = [];
      if (hasSelection.value)
        data.push({ id: "__selection", utility: "selection", width: widthSnapshot.value.__selection ?? "48px" });
      if (hasExpandable.value)
        data.push({ id: "__expand", utility: "expand", width: widthSnapshot.value.__expand ?? "48px" });
      normalizedColumns.value.forEach((column) => {
        const id = getColumnKey(column);
        const declaredWidth = pxWidth(column.width) ? `${pxWidth(column.width)}px` : typeof column.width === "string" ? column.width : void 0;
        data.push({ id, source: column, width: widthSnapshot.value[id] ?? declaredWidth, fixed: column.fixed });
      });
      const dataColumns = data.filter((item) => item.source);
      const leftCount = dataColumns.filter((item) => item.fixed === "left").length;
      const rightCount = dataColumns.filter((item) => item.fixed === "right").length;
      const leftStart = data.findIndex((item) => item.fixed === "left");
      const rightStart = data.length - rightCount;
      const utilityCount = (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0);
      const leftValid = leftCount === 0 || leftStart === utilityCount && data.slice(leftStart, leftStart + leftCount).every((item) => {
        var _a;
        return item.fixed === "left" && (pxWidth((_a = item.source) == null ? void 0 : _a.width) !== void 0 || widthSnapshot.value[item.id] !== void 0);
      });
      const rightValid = rightCount === 0 || rightStart >= 0 && data.slice(rightStart).every((item) => {
        var _a;
        return item.fixed === "right" && pxWidth((_a = item.source) == null ? void 0 : _a.width) !== void 0;
      });
      const leftEnabled = leftValid && leftCount > 0;
      const rightEnabled = rightValid && rightCount > 0;
      let left = 0;
      if (leftEnabled) {
        data.slice(0, leftStart).forEach((item) => {
          item.fixed = "left";
        });
        data.forEach((item, index) => {
          if (item.fixed === "left") {
            item.left = left;
            left += usedWidth(item);
          } else if (index >= leftStart && index < leftStart + leftCount)
            item.fixed = void 0;
        });
      }
      let right = 0;
      if (rightEnabled)
        [...data].reverse().forEach((item) => {
          if (item.fixed === "right") {
            item.right = right;
            right += usedWidth(item);
          }
        });
      if (layoutViewportWidth.value > 0 && leftEnabled && rightEnabled && left + right > Math.max(0, layoutViewportWidth.value - 48)) {
        data.forEach((item) => {
          item.fixed = void 0;
          item.left = void 0;
          item.right = void 0;
        });
      }
      return data;
    });
    const layoutById = computed(() => new Map(layoutColumns.value.map((item) => [item.id, item])));
    const stickyOffset = computed(() => typeof props.sticky === "object" && Number.isFinite(props.sticky.offsetHeader) ? Math.max(0, props.sticky.offsetHeader ?? 0) : 0);
    const isSticky = computed(() => Boolean(props.sticky));
    const headerSectionStyle = computed(() => headerShiftY.value ? { transform: `translateY(${headerShiftY.value}px)` } : void 0);
    const columnLayout = (column) => layoutById.value.get(getColumnKey(column));
    const usedWidth = (item) => {
      var _a;
      const snapshot = widthSnapshot.value[item.id];
      if (snapshot)
        return Number.parseFloat(snapshot) || 0;
      return pxWidth((_a = item.source) == null ? void 0 : _a.width) ?? (item.width ? Number.parseFloat(item.width) : 0);
    };
    const utilityStyle = (utility, header) => {
      const item = layoutById.value.get(`__${utility}`);
      return item ? cellLayoutStyle(item, header) : void 0;
    };
    const cellLayoutStyle = (item, header) => ({
      ...item.width ? { width: item.width } : {},
      ...item.fixed === "left" && item.left !== void 0 ? { position: "sticky", left: `${item.left}px`, zIndex: 2 } : {},
      ...item.fixed === "right" && item.right !== void 0 ? { position: "sticky", right: `${item.right}px`, zIndex: 2 } : {},
      ...isSticky.value && header ? { position: "sticky", top: `${stickyOffset.value}px`, zIndex: item.fixed ? 4 : 3 } : {}
    });
    const tableStyle = computed(() => {
      var _a;
      const x = (_a = props.scroll) == null ? void 0 : _a.x;
      const minWidth = x === true ? "max-content" : typeof x === "number" && Number.isFinite(x) ? `${x}px` : typeof x === "string" ? x : void 0;
      return minWidth ? { minWidth } : void 0;
    });
    const frozenTotalWidth = computed(() => layoutColumns.value.reduce((total, item) => total + usedWidth(item), 0));
    const tableAttrs = computed(() => {
      if (layoutReady.value && frozenTotalWidth.value > 0) {
        const width = `${frozenTotalWidth.value}px`;
        const style = { tableLayout: "fixed", width, minWidth: width };
        return { "data-table-layout-ready": "true", style };
      }
      return tableStyle.value ? { style: tableStyle.value } : {};
    });
    const containerStyle = computed(() => {
      var _a;
      const y = (_a = props.scroll) == null ? void 0 : _a.y;
      const leftExtent = Math.max(0, ...layoutColumns.value.filter((item) => item.left !== void 0).map((item) => (item.left ?? 0) + usedWidth(item)));
      const rightExtent = Math.max(0, ...layoutColumns.value.filter((item) => item.right !== void 0).map((item) => (item.right ?? 0) + usedWidth(item)));
      const style = {
        ...y === void 0 ? {} : { maxHeight: typeof y === "number" && Number.isFinite(y) ? `${y}px` : y, overflowY: "auto" },
        ...leftExtent > 0 ? { scrollPaddingLeft: `${leftExtent}px` } : {},
        ...rightExtent > 0 ? { scrollPaddingRight: `${rightExtent}px` } : {}
      };
      return Object.keys(style).length ? style : void 0;
    });
    const controlledSort = computed(() => {
      const column = normalizedColumns.value.find((currentColumn) => currentColumn.sortOrder !== void 0);
      if (!column) {
        return void 0;
      }
      return {
        columnKey: getColumnKey(column),
        order: column.sortOrder ?? void 0
      };
    });
    const activeSort = computed(() => controlledSort.value ?? innerSort.value);
    const activeFilters = computed(() => {
      const filters = {};
      normalizedColumns.value.forEach((column) => {
        const key = getColumnKey(column);
        const values = column.filteredValue ?? innerFilters.value[key] ?? [];
        if (values.length > 0) {
          filters[key] = [...values];
        }
      });
      return filters;
    });
    const tableClass = computed(() => [
      `aheart-table--${resolvedSize.value}`,
      {
        "is-bordered": props.bordered,
        "is-loading": props.loading,
        "is-disabled": isDisabled.value
      }
    ]);
    const sortedData = computed(() => getSortedRecords(activeFilters.value, activeSort.value));
    const allRows = computed(
      () => sortedData.value.map((record, index) => ({
        key: getRowKey(record, index),
        record,
        index
      }))
    );
    const pagedRows = computed(() => {
      if (!shouldShowPagination.value) {
        return allRows.value;
      }
      if (props.dataMode === "server" || props.dataMode === void 0 && paginationConfig.value.total !== void 0) {
        return allRows.value;
      }
      const start = (currentPage.value - 1) * pageSize.value;
      return allRows.value.slice(start, start + pageSize.value);
    });
    const selectableRows = computed(() => pagedRows.value.filter((row) => !isRowSelectionDisabled(row.record)));
    const allPageSelected = computed(() => selectableRows.value.length > 0 && selectableRows.value.every((row) => selectedKeys.value.includes(row.key)));
    const somePageSelected = computed(() => selectableRows.value.some((row) => selectedKeys.value.includes(row.key)));
    const querySignature = computed(() => JSON.stringify([
      activeSort.value.order ? [activeSort.value.columnKey, activeSort.value.order] : null,
      Object.entries(activeFilters.value)
    ]));
    watch(
      normalizedColumns,
      (columns) => {
        if (!hasInitializedSort.value) {
          const defaultSortColumn = columns.find((column) => column.sorter && column.defaultSortOrder);
          if (defaultSortColumn) {
            innerSort.value = {
              columnKey: getColumnKey(defaultSortColumn),
              order: defaultSortColumn.defaultSortOrder
            };
          }
          hasInitializedSort.value = true;
        }
        const nextFilters = { ...innerFilters.value };
        let shouldUpdateFilters = false;
        columns.forEach((column) => {
          var _a;
          const key = getColumnKey(column);
          if (initializedFilterKeys.value.has(key)) {
            return;
          }
          initializedFilterKeys.value.add(key);
          if (column.filteredValue === void 0 && ((_a = column.defaultFilteredValue) == null ? void 0 : _a.length)) {
            nextFilters[key] = [...column.defaultFilteredValue];
            shouldUpdateFilters = true;
          }
        });
        if (shouldUpdateFilters) {
          innerFilters.value = nextFilters;
        }
      },
      { immediate: true }
    );
    watch(querySignature, () => currentState.setState(1));
    watch(pageCount, (count) => {
      if (!currentState.isControlled.value && (currentState.state.value ?? 1) > count) {
        currentState.setState(count);
      }
    });
    const knownRowKeys = computed(() => normalizedData.value.map((record, index) => getRowKey(record, index)));
    watch([knownRowKeys, () => {
      var _a;
      return (_a = props.rowSelection) == null ? void 0 : _a.preserveSelectedRowKeys;
    }, selectedState.isControlled], () => {
      var _a;
      if (selectedState.isControlled.value || ((_a = props.rowSelection) == null ? void 0 : _a.preserveSelectedRowKeys) !== false)
        return;
      const known = new Set(knownRowKeys.value);
      const next = selectedKeys.value.filter((key) => known.has(key));
      if (next.length !== selectedKeys.value.length)
        selectedState.setState(next);
    }, { immediate: true });
    function getTotal(localTotal) {
      return normalizeTotal(props.dataMode === "local" ? localTotal : paginationConfig.value.total ?? localTotal);
    }
    function isRowSelectionDisabled(record) {
      var _a, _b, _c;
      return isSelectionDisabled.value || Boolean((_c = (_b = (_a = props.rowSelection) == null ? void 0 : _a.getCheckboxProps) == null ? void 0 : _b.call(_a, record)) == null ? void 0 : _c.disabled);
    }
    function getColumnKey(column) {
      return column.key ?? String(Array.isArray(column.dataIndex) ? column.dataIndex.join(".") : column.dataIndex ?? column.title);
    }
    function hasRenderableContent(value) {
      return value !== void 0 && value !== null && value !== false && value !== "";
    }
    function getRowKey(record, index) {
      const key = typeof props.rowKey === "function" ? props.rowKey(record) : record[props.rowKey];
      return typeof key === "string" || typeof key === "number" && Number.isFinite(key) ? key : index;
    }
    function getValueByDataIndex(record, dataIndex) {
      if (dataIndex === void 0) {
        return void 0;
      }
      const paths = Array.isArray(dataIndex) ? dataIndex : [dataIndex];
      return paths.reduce((current, path) => {
        if (current && typeof current === "object") {
          return current[String(path)];
        }
        return void 0;
      }, record);
    }
    function getFilteredRecords(filters) {
      return normalizedData.value.filter(
        (record) => normalizedColumns.value.every((column) => {
          const values = filters[getColumnKey(column)];
          if (!(values == null ? void 0 : values.length)) {
            return true;
          }
          const recordValue = getValueByDataIndex(record, column.dataIndex);
          return values.some((value) => String(recordValue) === String(value));
        })
      );
    }
    function getSortedRecords(filters, sortState) {
      if (props.dataMode === "server")
        return [...normalizedData.value];
      const records = getFilteredRecords(filters);
      const activeColumn = normalizedColumns.value.find((column) => getColumnKey(column) === sortState.columnKey);
      if (!activeColumn || !sortState.order || !activeColumn.sorter) {
        return records;
      }
      const direction = sortState.order === "ascend" ? 1 : -1;
      return [...records].sort((a, b) => compareRecords(activeColumn, a, b) * direction);
    }
    function compareRecords(column, a, b) {
      if (typeof column.sorter === "function") {
        return column.sorter(a, b);
      }
      const first = getValueByDataIndex(a, column.dataIndex);
      const second = getValueByDataIndex(b, column.dataIndex);
      if (typeof first === "number" && typeof second === "number") {
        return first - second;
      }
      return String(first ?? "").localeCompare(String(second ?? ""));
    }
    function getNormalizedFilters(filters) {
      return Object.entries(filters).reduce((normalized, [key, values]) => {
        if (values.length > 0) {
          normalized[key] = [...values];
        }
        return normalized;
      }, {});
    }
    const renderCell = (column, record, index) => {
      const text = getValueByDataIndex(record, column.dataIndex);
      if (column.customRender) {
        return column.customRender({ text, record, index, column });
      }
      return text === void 0 || text === null ? "" : String(text);
    };
    const renderExpanded = (record, index) => {
      var _a, _b;
      return ((_b = (_a = props.expandable) == null ? void 0 : _a.expandedRowRender) == null ? void 0 : _b.call(_a, record, index)) ?? "";
    };
    const headerColumnStyle = (column) => cellLayoutStyle(columnLayout(column) ?? { id: getColumnKey(column), source: column }, true);
    const bodyColumnStyle = (column) => cellLayoutStyle(columnLayout(column) ?? { id: getColumnKey(column), source: column }, false);
    const columnClass = (column) => {
      var _a;
      return [
        column.className,
        column.align ? `aheart-table__cell--${column.align}` : void 0,
        {
          "is-sortable": Boolean(column.sorter),
          "is-filtered": Boolean((_a = activeFilters.value[getColumnKey(column)]) == null ? void 0 : _a.length),
          "is-fixed-right": column.fixed === "right",
          "is-ellipsis": column.ellipsis
        }
      ];
    };
    const columnCellClass = (column) => [
      column.className,
      column.align ? `aheart-table__cell--${column.align}` : void 0,
      {
        "is-ellipsis": column.ellipsis
      }
    ];
    const getSortState = (column) => {
      const key = getColumnKey(column);
      if (activeSort.value.columnKey !== key || !activeSort.value.order) {
        return "none";
      }
      return activeSort.value.order;
    };
    const getColumnLabel = (column) => typeof column.title === "string" ? column.title : getColumnKey(column);
    const activeFilterColumn = computed(() => normalizedColumns.value.find((column) => getColumnKey(column) === activeFilterKey.value));
    const popupTargetDisabled = computed(() => {
      var _a;
      const trigger = filterTriggerElement.value;
      return Boolean(trigger && ((_a = props.getPopupContainer) == null ? void 0 : _a.call(props, trigger)) === false);
    });
    const popupTarget = computed(() => {
      var _a;
      const trigger = filterTriggerElement.value;
      if (!trigger)
        return "body";
      const target = (_a = props.getPopupContainer) == null ? void 0 : _a.call(props, trigger);
      return target === false ? trigger.ownerDocument.body : target ?? trigger.ownerDocument.body;
    });
    const popupOpen = computed(() => Boolean(activeFilterKey.value && activeFilterColumn.value));
    const { popupStyle, update: updateFloatingPosition } = useFloatingPosition({
      reference: filterTriggerElement,
      floating: filterPopupElement,
      open: popupOpen,
      placement: "bottomLeft",
      strategy: "absolute",
      viewportPadding: 8
    });
    const positionPopupAndFocus = async () => {
      var _a, _b;
      const generation = ++popupGeneration;
      const activeKey = activeFilterKey.value;
      popupPositioned.value = false;
      await nextTick();
      if (!popupOpen.value || generation !== popupGeneration || activeFilterKey.value !== activeKey)
        return;
      await updateFloatingPosition();
      const ownerWindow = (_a = filterPopupElement.value) == null ? void 0 : _a.ownerDocument.defaultView;
      await new Promise((resolve) => {
        if (ownerWindow == null ? void 0 : ownerWindow.requestAnimationFrame)
          ownerWindow.requestAnimationFrame(() => resolve());
        else if (ownerWindow == null ? void 0 : ownerWindow.setTimeout)
          ownerWindow.setTimeout(resolve, 0);
        else
          resolve();
      });
      if (!popupOpen.value || generation !== popupGeneration || activeFilterKey.value !== activeKey)
        return;
      popupPositioned.value = true;
      await nextTick();
      if (popupOpen.value && generation === popupGeneration && activeFilterKey.value === activeKey) {
        (_b = filterPopupElement.value) == null ? void 0 : _b.focus({ preventScroll: true });
      }
    };
    useFloatingDismiss({
      open: popupOpen,
      trigger: filterTriggerElement,
      floating: filterPopupElement,
      onDismiss: (reason, event) => {
        if (reason === "outside")
          event.preventDefault();
        const dismissalGeneration = popupGeneration;
        const dismissalKey = activeFilterKey.value;
        const dismissalTrigger = filterTriggerElement.value;
        const dismiss = () => {
          if (!isInteractionLocked.value && popupGeneration === dismissalGeneration && activeFilterKey.value === dismissalKey && filterTriggerElement.value === dismissalTrigger) {
            closeFilter();
          }
        };
        if (reason === "outside") {
          const ownerWindow = dismissalTrigger == null ? void 0 : dismissalTrigger.ownerDocument.defaultView;
          const closeOutside = () => {
            if (popupGeneration !== dismissalGeneration || activeFilterKey.value !== dismissalKey || filterTriggerElement.value !== dismissalTrigger || !popupOpen.value)
              return;
            dismiss();
          };
          if (ownerWindow == null ? void 0 : ownerWindow.setTimeout)
            ownerWindow.setTimeout(closeOutside, 32);
        } else
          dismiss();
      },
      restoreFocus: true
    });
    watch([filterTriggerElement, filterPopupElement, popupOpen], () => {
      if (popupOpen.value)
        void nextTick(updateFloatingPosition);
    }, { flush: "post" });
    watch(popupOpen, (open) => {
      if (open)
        void positionPopupAndFocus();
      else {
        popupGeneration++;
        popupPositioned.value = false;
      }
    }, { flush: "post", immediate: true });
    const isFilterPopupOpen = (column) => activeFilterKey.value === getColumnKey(column);
    let popupNodeCacheKey = null;
    let popupNodeCacheDraft = "";
    let popupNodeCache = null;
    const filterDisabledSnapshot = /* @__PURE__ */ new WeakMap();
    const activeFilterPopupNode = computed(() => {
      const column = activeFilterColumn.value;
      if (!(column == null ? void 0 : column.filterDropdown))
        return null;
      const draftSignature = JSON.stringify(filterDraft.value);
      if (popupNodeCacheKey === activeFilterKey.value && popupNodeCacheDraft === draftSignature)
        return popupNodeCache;
      const context = {
        selectedKeys: filterDraft.value,
        setSelectedKeys: (keys) => {
          filterDraft.value = [...keys];
        },
        confirm: () => confirmFilter(column),
        clearFilters: () => resetFilter(column),
        close: () => closeFilter()
      };
      popupNodeCacheKey = activeFilterKey.value;
      popupNodeCacheDraft = draftSignature;
      popupNodeCache = column.filterDropdown(context);
      return popupNodeCache;
    });
    const sanitizePopupMarker = () => {
      var _a;
      (_a = filterPopupElement.value) == null ? void 0 : _a.querySelectorAll("[data-table-filter-popup]").forEach((node) => node.removeAttribute("data-table-filter-popup"));
    };
    const syncFilterDisabled = () => {
      const popup = filterPopupElement.value;
      if (!popup)
        return;
      const controls = popup.querySelectorAll('button, input, select, textarea, [contenteditable="true"]');
      controls.forEach((control) => {
        if (isInteractionLocked.value) {
          if (!filterDisabledSnapshot.has(control))
            filterDisabledSnapshot.set(control, control.hasAttribute("disabled"));
          control.setAttribute("disabled", "");
        } else if (filterDisabledSnapshot.has(control)) {
          if (filterDisabledSnapshot.get(control))
            control.setAttribute("disabled", "");
          else
            control.removeAttribute("disabled");
          filterDisabledSnapshot.delete(control);
        }
      });
    };
    const activeFilterValues = (column) => column.filteredValue ?? activeFilters.value[getColumnKey(column)] ?? [];
    const requestFilterOpen = (column, open) => emit("filterDropdownOpenChange", getColumnKey(column), open);
    const toggleFilterPopup = (column, trigger) => {
      if (isInteractionLocked.value)
        return;
      const key = getColumnKey(column);
      filterTriggerElement.value = trigger;
      if (activeFilterKey.value === key) {
        closeFilter();
        return;
      }
      if (activeFilterKey.value) {
        const previous = normalizedColumns.value.find((item) => getColumnKey(item) === activeFilterKey.value);
        if (previous)
          requestFilterOpen(previous, false);
        closeFilter(false);
      }
      filterDraft.value = [...activeFilterValues(column)];
      activeFilterKey.value = key;
      requestFilterOpen(column, true);
      if (column.filterDropdownOpen !== void 0 && !column.filterDropdownOpen)
        activeFilterKey.value = null;
    };
    const closeFilter = (restoreFocus = true) => {
      if (isInteractionLocked.value)
        return;
      const column = activeFilterColumn.value;
      if ((column == null ? void 0 : column.filterDropdownOpen) !== void 0) {
        if (!closeRequestPending.value) {
          closeRequestPending.value = true;
          requestFilterOpen(column, false);
          queueMicrotask(() => {
            closeRequestPending.value = false;
          });
        }
        return;
      }
      if (column)
        requestFilterOpen(column, false);
      popupGeneration++;
      popupPositioned.value = false;
      activeFilterKey.value = null;
      filterDraft.value = [];
      closeRequestPending.value = false;
      if (restoreFocus) {
        const triggerKey = column ? getColumnKey(column) : void 0;
        const closeGeneration = popupGeneration;
        const restoreTrigger = filterTriggerElement.value;
        void nextTick(() => {
          var _a;
          const trigger = triggerKey ? ((_a = tableRoot.value) == null ? void 0 : _a.querySelector(`[data-table-filter-trigger="${triggerKey}"]`)) ?? restoreTrigger : restoreTrigger;
          const ownerWindow = trigger == null ? void 0 : trigger.ownerDocument.defaultView;
          const focus = () => {
            if (popupGeneration !== closeGeneration || popupOpen.value || activeFilterKey.value !== null)
              return;
            trigger == null ? void 0 : trigger.focus({ preventScroll: true });
          };
          if (ownerWindow == null ? void 0 : ownerWindow.requestAnimationFrame)
            ownerWindow.requestAnimationFrame(focus);
          else
            focus();
        });
      }
    };
    const commitFilter = (column, values) => {
      const key = getColumnKey(column);
      const nextFilters = { ...activeFilters.value };
      if (values.length)
        nextFilters[key] = [...values];
      else
        delete nextFilters[key];
      if (column.filteredValue === void 0)
        innerFilters.value = nextFilters;
      emitTableChange("filter", 1, pageSize.value, nextFilters, activeSort.value);
    };
    const confirmFilter = (column) => {
      if (isInteractionLocked.value)
        return;
      commitFilter(column, filterDraft.value);
      closeFilter();
    };
    const resetFilter = (column) => {
      if (isInteractionLocked.value)
        return;
      filterDraft.value = [];
      commitFilter(column, []);
      closeFilter();
    };
    const handleFilterPopupKeydown = (event) => {
      var _a;
      if (event.key === "Escape") {
        event.preventDefault();
        closeFilter();
        return;
      }
      if (event.key !== "Tab" || !filterPopupElement.value)
        return;
      const controls = Array.from(filterPopupElement.value.querySelectorAll([
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "a[href]",
        '[tabindex]:not([tabindex="-1"])'
      ].join(","))).filter((element) => !element.matches("[hidden], [inert]") && !element.closest("[hidden], [inert]"));
      if (!controls.length)
        return;
      const current = filterPopupElement.value.ownerDocument.activeElement;
      const index = controls.indexOf(current);
      const next = event.shiftKey ? index <= 0 ? controls.length - 1 : index - 1 : index >= controls.length - 1 ? 0 : index + 1;
      event.preventDefault();
      (_a = controls[next]) == null ? void 0 : _a.focus({ preventScroll: true });
      void nextTick(() => {
        var _a2;
        return (_a2 = controls[next]) == null ? void 0 : _a2.focus({ preventScroll: true });
      });
    };
    let stickyResizeObserver;
    let stickyOwnerWindow;
    let stickyScrollAncestor = null;
    const handleStickyAncestorScroll = () => {
      updateStickyGeometry();
      scheduleStickyGeometry();
    };
    let stickyRaf = 0;
    const findStickyScrollAncestor = (root, ownerWindow) => {
      let current = root.parentElement;
      while (current) {
        const style = ownerWindow.getComputedStyle(current);
        const overflowY = style.overflowY;
        if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay")
          return current;
        current = current.parentElement;
      }
      return null;
    };
    const updateStickyGeometry = () => {
      var _a, _b, _c;
      const root = tableRoot.value;
      if (!root || !isSticky.value || ((_a = props.scroll) == null ? void 0 : _a.y) !== void 0) {
        headerShiftY.value = 0;
        return;
      }
      if (!stickyScrollAncestor) {
        const ownerWindow = root.ownerDocument.defaultView;
        if (ownerWindow)
          stickyScrollAncestor = findStickyScrollAncestor(root, ownerWindow);
      }
      const rect = root.getBoundingClientRect();
      const tableRect = (_b = root.querySelector("table")) == null ? void 0 : _b.getBoundingClientRect();
      ((_c = root.ownerDocument.defaultView) == null ? void 0 : _c.innerHeight) ?? 0;
      const header = root.querySelector("thead");
      const firstHeaderCell = root.querySelector("thead th");
      const headerRect = header == null ? void 0 : header.getBoundingClientRect();
      const headerHeight = (headerRect == null ? void 0 : headerRect.height) ?? 0;
      if (!headerRect || !headerHeight) {
        headerShiftY.value = 0;
        return;
      }
      const visualHeaderTop = (firstHeaderCell == null ? void 0 : firstHeaderCell.getBoundingClientRect().top) ?? headerRect.top;
      const naturalHeaderTop = visualHeaderTop - headerShiftY.value;
      const ancestorRect = stickyScrollAncestor == null ? void 0 : stickyScrollAncestor.getBoundingClientRect();
      const targetTop = ((ancestorRect == null ? void 0 : ancestorRect.top) ?? 0) + ((stickyScrollAncestor == null ? void 0 : stickyScrollAncestor.clientTop) ?? 0) + stickyOffset.value;
      const maxShift = ((tableRect == null ? void 0 : tableRect.bottom) ?? rect.bottom) - headerHeight - naturalHeaderTop;
      const desiredShift = targetTop - visualHeaderTop + headerShiftY.value;
      const bounded = Math.max(0, Math.min(maxShift, desiredShift));
      headerShiftY.value = Number.isFinite(bounded) ? bounded : 0;
    };
    const scheduleStickyGeometry = () => {
      var _a;
      if (stickyRaf)
        return;
      const ownerWindow = (_a = tableRoot.value) == null ? void 0 : _a.ownerDocument.defaultView;
      const request = (ownerWindow == null ? void 0 : ownerWindow.requestAnimationFrame) ?? ((ownerWindow == null ? void 0 : ownerWindow.setTimeout) ? (callback) => ownerWindow.setTimeout(callback, 0) : void 0);
      if (!request) {
        measureLayout();
        updateStickyGeometry();
        return;
      }
      stickyRaf = request(() => {
        stickyRaf = 0;
        measureLayout();
        updateStickyGeometry();
      });
    };
    const measureLayout = () => {
      var _a;
      if (((_a = props.scroll) == null ? void 0 : _a.x) === void 0 || !tableRoot.value)
        return;
      const container = tableRoot.value.querySelector(".aheart-table__container");
      if (container)
        layoutViewportWidth.value = container.clientWidth;
      const cells = Array.from(tableRoot.value.querySelectorAll("thead th"));
      const cols = Array.from(tableRoot.value.querySelectorAll("colgroup col"));
      const next = { ...widthSnapshot.value };
      cells.forEach((cell, index) => {
        var _a2, _b, _c;
        const width = cell.getBoundingClientRect().width || ((_a2 = cols[index]) == null ? void 0 : _a2.getBoundingClientRect().width) || Number.parseFloat(((_c = (_b = tableRoot.value) == null ? void 0 : _b.ownerDocument.defaultView) == null ? void 0 : _c.getComputedStyle(cell).width) ?? "") || 0;
        const item = layoutColumns.value[index];
        if (item && width > 0 && !next[item.id])
          next[item.id] = `${width}px`;
      });
      if (Object.keys(next).length !== Object.keys(widthSnapshot.value).length)
        widthSnapshot.value = next;
      if (layoutColumns.value.length > 0 && layoutColumns.value.every((item) => next[item.id]))
        layoutReady.value = true;
    };
    watch([normalizedData, () => {
      var _a;
      return (_a = props.scroll) == null ? void 0 : _a.x;
    }], () => measureLayout(), { flush: "sync" });
    const bindStickyObservers = () => {
      const root = tableRoot.value;
      const ownerWindow = root == null ? void 0 : root.ownerDocument.defaultView;
      if (!root || !ownerWindow)
        return;
      stickyOwnerWindow = ownerWindow;
      stickyScrollAncestor = findStickyScrollAncestor(root, ownerWindow);
      ownerWindow.addEventListener("scroll", scheduleStickyGeometry, true);
      ownerWindow.addEventListener("resize", scheduleStickyGeometry);
      stickyScrollAncestor == null ? void 0 : stickyScrollAncestor.addEventListener("scroll", handleStickyAncestorScroll, { passive: true });
      const ResizeObserverConstructor = ownerWindow.ResizeObserver;
      if (ResizeObserverConstructor) {
        stickyResizeObserver = new ResizeObserverConstructor(() => {
          measureLayout();
          scheduleStickyGeometry();
        });
        stickyResizeObserver.observe(root);
        const container = root.querySelector(".aheart-table__container");
        if (container)
          stickyResizeObserver.observe(container);
        if (stickyScrollAncestor)
          stickyResizeObserver.observe(stickyScrollAncestor);
      }
      scheduleStickyGeometry();
    };
    const unbindStickyObservers = () => {
      if (stickyOwnerWindow) {
        stickyOwnerWindow.removeEventListener("scroll", scheduleStickyGeometry, true);
        stickyOwnerWindow.removeEventListener("resize", scheduleStickyGeometry);
      }
      stickyScrollAncestor == null ? void 0 : stickyScrollAncestor.removeEventListener("scroll", handleStickyAncestorScroll);
      stickyScrollAncestor = null;
      stickyResizeObserver == null ? void 0 : stickyResizeObserver.disconnect();
      stickyResizeObserver = void 0;
      if (stickyRaf) {
        stickyOwnerWindow == null ? void 0 : stickyOwnerWindow.cancelAnimationFrame(stickyRaf);
        stickyRaf = 0;
      }
      stickyOwnerWindow = void 0;
    };
    onBeforeUpdate(() => measureLayout());
    watch([normalizedColumns, activeFilterKey], () => {
      const openColumn = normalizedColumns.value.find((column) => column.filterDropdownOpen === true);
      if (!activeFilterKey.value && openColumn && !isInteractionLocked.value) {
        filterDraft.value = [...activeFilterValues(openColumn)];
        activeFilterKey.value = getColumnKey(openColumn);
        nextTick(() => {
          var _a;
          return (_a = filterPopupElement.value) == null ? void 0 : _a.focus();
        });
      }
      if (activeFilterKey.value && normalizedColumns.value.some((column) => getColumnKey(column) === activeFilterKey.value && column.filterDropdownOpen === false)) {
        closeRequestPending.value = false;
        activeFilterKey.value = null;
        filterDraft.value = [];
      }
    }, { immediate: true, deep: true });
    watch([popupStyle, filterPopupElement], ([style, element]) => {
      if (!element)
        return;
      sanitizePopupMarker();
      Object.assign(element.style, style);
      syncFilterDisabled();
    }, { deep: true, immediate: true });
    watch(isInteractionLocked, syncFilterDisabled);
    onMounted(() => {
      var _a, _b;
      rootInteractionInert.value = !((_a = tableRoot.value) == null ? void 0 : _a.isConnected);
      if (activeFilterKey.value)
        filterTriggerElement.value = ((_b = tableRoot.value) == null ? void 0 : _b.querySelector(`[data-table-filter-trigger="${activeFilterKey.value}"]`)) ?? null;
      void nextTick(() => {
        sanitizePopupMarker();
        measureLayout();
        updateFloatingPosition();
        bindStickyObservers();
      });
    });
    onBeforeUnmount(() => {
      unbindStickyObservers();
    });
    const getAriaSort = (column) => {
      const state = getSortState(column);
      return state === "ascend" ? "ascending" : state === "descend" ? "descending" : "none";
    };
    const getSortActionLabel = (column) => {
      const label = getColumnLabel(column);
      const state = getSortState(column);
      return state === "ascend" ? `Sort ${label} descending` : state === "descend" ? `Clear sort for ${label}` : `Sort ${label}`;
    };
    const toggleSort = (column) => {
      if (isDisabled.value) {
        return;
      }
      const key = getColumnKey(column);
      const currentOrder = activeSort.value.columnKey === key ? activeSort.value.order : void 0;
      const nextOrder = currentOrder === void 0 ? "ascend" : currentOrder === "ascend" ? "descend" : void 0;
      const nextSort = { columnKey: nextOrder ? key : void 0, order: nextOrder };
      if (controlledSort.value === void 0) {
        innerSort.value = nextSort;
      }
      emitTableChange("sort", 1, pageSize.value, activeFilters.value, nextSort);
    };
    const isFilterActive = (column, value) => {
      var _a;
      return Boolean((_a = activeFilters.value[getColumnKey(column)]) == null ? void 0 : _a.includes(value));
    };
    const toggleFilter = (column, value) => {
      if (isDisabled.value) {
        return;
      }
      const key = getColumnKey(column);
      const currentValues = activeFilters.value[key] ?? [];
      const isActive = currentValues.includes(value);
      const nextValues = column.filterMultiple === false ? isActive ? [] : [value] : isActive ? currentValues.filter((currentValue) => currentValue !== value) : [...currentValues, value];
      const nextFilters = { ...activeFilters.value, [key]: nextValues };
      if (nextValues.length === 0) {
        delete nextFilters[key];
      }
      if (column.filteredValue === void 0) {
        innerFilters.value = nextFilters;
      }
      emitTableChange("filter", 1, pageSize.value, nextFilters, activeSort.value);
    };
    const isSelected = (key) => selectedKeys.value.includes(key);
    const toggleSelection = (record, key, checked) => {
      if (isRowSelectionDisabled(record)) {
        return;
      }
      const nextKeys = selectionType.value === "radio" ? checked ? [key] : [] : checked ? Array.from(/* @__PURE__ */ new Set([...selectedKeys.value, key])) : selectedKeys.value.filter((currentKey) => currentKey !== key);
      selectedState.setState([...nextKeys]);
      emit("update:selectedRowKeys", [...nextKeys]);
      emit("select", key, checked, record, [...nextKeys]);
    };
    const handleSelectAll = (event) => {
      const input = event.target;
      const checked = input.checked;
      if (!isSelectionDisabled.value && selectionType.value === "checkbox") {
        const changedRows = selectableRows.value.filter((row) => isSelected(row.key) !== checked);
        if (changedRows.length > 0) {
          const visible = new Set(selectableRows.value.map((row) => row.key));
          const nextKeys = checked ? [.../* @__PURE__ */ new Set([...selectedKeys.value, ...selectableRows.value.map((row) => row.key)])] : selectedKeys.value.filter((key) => !visible.has(key));
          selectedState.setState([...nextKeys]);
          emit("update:selectedRowKeys", [...nextKeys]);
          emit("selectAll", checked, [...nextKeys], changedRows.map((row) => row.record));
        }
      }
      input.checked = allPageSelected.value;
      input.indeterminate = somePageSelected.value && !allPageSelected.value;
    };
    const isRowExpandable = (record) => {
      var _a, _b;
      return ((_b = (_a = props.expandable) == null ? void 0 : _a.rowExpandable) == null ? void 0 : _b.call(_a, record)) ?? true;
    };
    const isExpanded = (key) => expandedKeys.value.includes(key);
    const toggleExpand = (record, key) => {
      if (isDisabled.value) {
        return;
      }
      const nextExpanded = !isExpanded(key);
      const nextKeys = nextExpanded ? [...expandedKeys.value, key] : expandedKeys.value.filter((currentKey) => currentKey !== key);
      expandedState.setState(nextKeys);
      emit("expand", nextExpanded, record, key);
    };
    const handlePageChange = (current, nextPageSize) => {
      if (isDisabled.value)
        return;
      const nextSize = normalizePageSize(nextPageSize);
      const nextCurrent = normalizeCurrent(current, paginationTotal.value, nextSize);
      const sizeChanged = nextSize !== pageSize.value;
      pageSizeState.setState(nextSize);
      if (!sizeChanged || !pageSizeState.isControlled.value)
        currentState.setState(nextCurrent);
      emitTableChange("paginate", nextCurrent, nextSize, activeFilters.value, activeSort.value);
    };
    const emitTableChange = (action, current, nextPageSize, filters, sortState) => {
      const normalizedFilters = getNormalizedFilters(filters);
      const currentDataSource = getSortedRecords(normalizedFilters, sortState);
      const activeColumn = normalizedColumns.value.find((column) => getColumnKey(column) === sortState.columnKey);
      emit(
        "change",
        { current, pageSize: nextPageSize, total: getTotal(currentDataSource.length) },
        normalizedFilters,
        {
          column: activeColumn,
          columnKey: sortState.columnKey,
          field: activeColumn == null ? void 0 : activeColumn.dataIndex,
          order: sortState.order
        },
        {
          currentDataSource,
          action
        }
      );
    };
    const getEventChecked = (event) => {
      var _a;
      return Boolean((_a = event.target) == null ? void 0 : _a.checked);
    };
    const handleSelectionChange = (event, record, key) => {
      var _a;
      const input = event.target;
      toggleSelection(record, key, getEventChecked(event));
      if (input) {
        input.checked = isSelected(key);
        if (selectionType.value === "radio") {
          (_a = input.closest("table")) == null ? void 0 : _a.querySelectorAll(':scope > tbody > tr > .aheart-table__selection-cell > input[type="radio"]').forEach((rowInput, index) => {
            var _a2;
            rowInput.checked = isSelected((_a2 = pagedRows.value[index]) == null ? void 0 : _a2.key);
          });
        }
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", {
        ref_key: "tableRoot",
        ref: tableRoot,
        class: normalizeClass(["aheart-table", tableClass.value]),
        "aria-busy": _ctx.loading || void 0,
        inert: rootInteractionInert.value || void 0
      }, [
        !_ctx.loading && _ctx.error ? (openBlock(), createElementBlock("div", _hoisted_2, [
          createVNode(unref(ARenderNode), { node: errorMessage.value }, null, 8, ["node"]),
          createElementVNode("button", {
            type: "button",
            class: "aheart-table__retry",
            "data-table-retry": "",
            disabled: isDisabled.value,
            onClick: _cache[0] || (_cache[0] = ($event) => emit("retry"))
          }, [
            createVNode(unref(ARenderNode), { node: errorRetryText.value }, null, 8, ["node"])
          ], 8, _hoisted_3)
        ])) : createCommentVNode("", true),
        createElementVNode("div", {
          class: "aheart-table__interaction-region",
          inert: isInteractionLocked.value || void 0,
          onClickCapture: handleTableCapture,
          onKeydownCapture: handleTableCapture,
          onInputCapture: handleTableCapture,
          onChangeCapture: handleTableCapture,
          onSubmitCapture: handleTableCapture
        }, [
          createElementVNode("div", {
            class: "aheart-table__container",
            style: normalizeStyle(containerStyle.value)
          }, [
            createElementVNode("table", normalizeProps(guardReactiveProps(tableAttrs.value)), [
              createElementVNode("colgroup", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(layoutColumns.value, (column) => {
                  return openBlock(), createElementBlock("col", {
                    key: column.id,
                    style: normalizeStyle({ width: column.width })
                  }, null, 4);
                }), 128))
              ]),
              _ctx.showHeader ? (openBlock(), createElementBlock("thead", {
                key: 0,
                style: normalizeStyle(headerSectionStyle.value)
              }, [
                createElementVNode("tr", null, [
                  hasSelection.value ? (openBlock(), createElementBlock("th", {
                    key: 0,
                    class: "aheart-table__selection-cell",
                    scope: "col",
                    style: normalizeStyle(utilityStyle("selection", true))
                  }, [
                    selectionType.value === "checkbox" ? (openBlock(), createElementBlock("input", {
                      key: 0,
                      class: "aheart-table__select-all",
                      type: "checkbox",
                      "aria-label": "Select all rows on current page",
                      checked: allPageSelected.value,
                      indeterminate: somePageSelected.value && !allPageSelected.value,
                      "aria-checked": somePageSelected.value && !allPageSelected.value ? "mixed" : allPageSelected.value,
                      disabled: isSelectionDisabled.value || selectableRows.value.length === 0,
                      onChange: handleSelectAll
                    }, null, 40, _hoisted_5)) : (openBlock(), createElementBlock("span", _hoisted_6))
                  ], 4)) : createCommentVNode("", true),
                  hasExpandable.value ? (openBlock(), createElementBlock("th", {
                    key: 1,
                    class: "aheart-table__expand-cell",
                    scope: "col",
                    style: normalizeStyle(utilityStyle("expand", true))
                  }, [..._cache[1] || (_cache[1] = [
                    createElementVNode("span", {
                      class: "aheart-table__expand-title",
                      "aria-hidden": "true"
                    }, null, -1)
                  ])], 4)) : createCommentVNode("", true),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedColumns.value, (column) => {
                    var _a;
                    return openBlock(), createElementBlock("th", {
                      key: getColumnKey(column),
                      class: normalizeClass(columnClass(column)),
                      style: normalizeStyle(headerColumnStyle(column)),
                      "aria-sort": column.sorter ? getAriaSort(column) : void 0,
                      scope: "col"
                    }, [
                      createElementVNode("div", _hoisted_8, [
                        column.sorter ? (openBlock(), createElementBlock("button", {
                          key: 0,
                          class: "aheart-table__sorter",
                          type: "button",
                          disabled: isInteractionLocked.value,
                          "aria-label": getSortActionLabel(column),
                          onClick: ($event) => toggleSort(column)
                        }, [
                          createElementVNode("span", null, [
                            createVNode(unref(ARenderNode), {
                              node: column.title
                            }, null, 8, ["node"])
                          ]),
                          createElementVNode("span", {
                            class: "aheart-table__sort-icon",
                            "data-sort": getSortState(column),
                            "aria-hidden": "true"
                          }, null, 8, _hoisted_10)
                        ], 8, _hoisted_9)) : (openBlock(), createElementBlock("span", _hoisted_11, [
                          createVNode(unref(ARenderNode), {
                            node: column.title
                          }, null, 8, ["node"])
                        ])),
                        column.filterDropdown ? (openBlock(), createElementBlock("button", {
                          key: 2,
                          class: "aheart-table__filter-trigger",
                          type: "button",
                          "aria-haspopup": "dialog",
                          "data-table-filter-trigger": getColumnKey(column),
                          "aria-expanded": isFilterPopupOpen(column),
                          disabled: isInteractionLocked.value,
                          onClick: ($event) => toggleFilterPopup(column, $event.currentTarget)
                        }, [
                          _cache[2] || (_cache[2] = createElementVNode("span", { "aria-hidden": "true" }, "⌄", -1)),
                          createElementVNode("span", _hoisted_13, "Filter " + toDisplayString(getColumnLabel(column)), 1)
                        ], 8, _hoisted_12)) : createCommentVNode("", true),
                        ((_a = column.filters) == null ? void 0 : _a.length) ? (openBlock(), createElementBlock("div", {
                          key: 3,
                          class: "aheart-table__filters",
                          "aria-label": `${column.title} filters`
                        }, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(column.filters, (filter) => {
                            return openBlock(), createElementBlock("button", {
                              key: String(filter.value),
                              class: normalizeClass(["aheart-table__filter-option", { "is-active": isFilterActive(column, filter.value) }]),
                              type: "button",
                              "aria-pressed": isFilterActive(column, filter.value),
                              disabled: isInteractionLocked.value,
                              onClick: ($event) => toggleFilter(column, filter.value)
                            }, [
                              createVNode(unref(ARenderNode), {
                                node: filter.text
                              }, null, 8, ["node"])
                            ], 10, _hoisted_15);
                          }), 128))
                        ], 8, _hoisted_14)) : createCommentVNode("", true)
                      ])
                    ], 14, _hoisted_7);
                  }), 128))
                ])
              ], 4)) : createCommentVNode("", true),
              createElementVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(pagedRows.value, (row) => {
                  return openBlock(), createElementBlock(Fragment, {
                    key: row.key
                  }, [
                    createElementVNode("tr", {
                      class: normalizeClass({ "is-selected": isSelected(row.key) })
                    }, [
                      hasSelection.value ? (openBlock(), createElementBlock("td", {
                        key: 0,
                        class: "aheart-table__selection-cell",
                        style: normalizeStyle(utilityStyle("selection", false))
                      }, [
                        createElementVNode("input", {
                          type: selectionType.value,
                          name: unref(radioName),
                          checked: isSelected(row.key),
                          disabled: isRowSelectionDisabled(row.record),
                          "aria-label": `Select row ${row.key}`,
                          onChange: ($event) => handleSelectionChange($event, row.record, row.key)
                        }, null, 40, _hoisted_16)
                      ], 4)) : createCommentVNode("", true),
                      hasExpandable.value ? (openBlock(), createElementBlock("td", {
                        key: 1,
                        class: "aheart-table__expand-cell",
                        style: normalizeStyle(utilityStyle("expand", false))
                      }, [
                        isRowExpandable(row.record) ? (openBlock(), createElementBlock("button", {
                          key: 0,
                          class: "aheart-table__expand-button",
                          type: "button",
                          "aria-expanded": isExpanded(row.key),
                          disabled: isInteractionLocked.value,
                          onClick: ($event) => toggleExpand(row.record, row.key)
                        }, toDisplayString(isExpanded(row.key) ? "−" : "+"), 9, _hoisted_17)) : createCommentVNode("", true)
                      ], 4)) : createCommentVNode("", true),
                      (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedColumns.value, (column) => {
                        return openBlock(), createElementBlock("td", {
                          key: getColumnKey(column),
                          class: normalizeClass(columnCellClass(column)),
                          style: normalizeStyle(bodyColumnStyle(column))
                        }, [
                          createVNode(unref(ARenderNode), {
                            node: renderCell(column, row.record, row.index)
                          }, null, 8, ["node"])
                        ], 6);
                      }), 128))
                    ], 2),
                    hasExpandable.value && isExpanded(row.key) ? (openBlock(), createElementBlock("tr", _hoisted_18, [
                      createElementVNode("td", {
                        colspan: columnCount.value,
                        class: "aheart-table__expanded-cell"
                      }, [
                        createVNode(unref(ARenderNode), {
                          node: renderExpanded(row.record, row.index)
                        }, null, 8, ["node"])
                      ], 8, _hoisted_19)
                    ])) : createCommentVNode("", true)
                  ], 64);
                }), 128)),
                !_ctx.loading && !_ctx.error && pagedRows.value.length === 0 ? (openBlock(), createElementBlock("tr", _hoisted_20, [
                  createElementVNode("td", {
                    colspan: columnCount.value,
                    class: "aheart-table__empty"
                  }, [
                    createVNode(unref(ARenderNode), { node: resolvedEmptyText.value }, null, 8, ["node"])
                  ], 8, _hoisted_21)
                ])) : createCommentVNode("", true)
              ])
            ], 16)
          ], 4),
          shouldShowPagination.value ? (openBlock(), createBlock(unref(Pagination), {
            key: 0,
            class: "aheart-table__pagination",
            current: currentPage.value,
            "page-size": pageSize.value,
            total: paginationTotal.value,
            simple: paginationConfig.value.simple,
            "hide-on-single-page": paginationConfig.value.hideOnSinglePage,
            "show-total": paginationConfig.value.showTotal,
            "show-size-changer": paginationConfig.value.showSizeChanger,
            "page-size-options": paginationConfig.value.pageSizeOptions,
            "show-quick-jumper": paginationConfig.value.showQuickJumper,
            "total-boundary-show-size-changer": paginationConfig.value.totalBoundaryShowSizeChanger,
            disabled: isInteractionLocked.value,
            size: resolvedSize.value,
            onChange: handlePageChange
          }, null, 8, ["current", "page-size", "total", "simple", "hide-on-single-page", "show-total", "show-size-changer", "page-size-options", "show-quick-jumper", "total-boundary-show-size-changer", "disabled", "size"])) : createCommentVNode("", true)
        ], 40, _hoisted_4),
        _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_22, [
          _cache[3] || (_cache[3] = createElementVNode("span", {
            class: "aheart-table__loading-dot",
            "aria-hidden": "true"
          }, null, -1)),
          createElementVNode("span", null, toDisplayString(resolvedLoadingText.value), 1)
        ])) : createCommentVNode("", true),
        activeFilterColumn.value && activeFilterPopupNode.value !== null ? (openBlock(), createBlock(Teleport, {
          key: 2,
          to: popupTarget.value,
          disabled: popupTargetDisabled.value
        }, [
          createElementVNode("div", {
            ref_key: "filterPopupElement",
            ref: filterPopupElement,
            class: "aheart-table__filter-popup",
            role: "dialog",
            "aria-label": activeFilterColumn.value ? `${getColumnLabel(activeFilterColumn.value)} filter` : void 0,
            "aria-disabled": isInteractionLocked.value || void 0,
            inert: isInteractionLocked.value || void 0,
            "data-table-filter-popup": activeFilterKey.value,
            tabindex: "-1",
            style: normalizeStyle({ ...unref(popupStyle), visibility: popupPositioned.value ? "visible" : "hidden", pointerEvents: popupPositioned.value ? "auto" : "none" }),
            onKeydown: handleFilterPopupKeydown
          }, [
            createVNode(unref(ARenderNode), { node: activeFilterPopupNode.value }, null, 8, ["node"])
          ], 44, _hoisted_23)
        ], 8, ["to", "disabled"])) : createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
