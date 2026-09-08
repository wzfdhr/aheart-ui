"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../pagination/index.js");
const paginationState = require("../pagination/pagination-state.js");
const useControllableState = require("../utils/use-controllable-state.js");
const useFloatingDismiss = require("../utils/use-floating-dismiss.js");
const useFloatingPosition = require("../utils/use-floating-position.js");
const useStableId = require("../utils/use-stable-id.js");
const types = require("./types.js");
const virtualOptions = require("./virtual-options.js");
const useTableVirtual = require("./use-table-virtual.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["aria-busy", "inert"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-table__error",
  role: "alert"
};
const _hoisted_3 = ["disabled"];
const _hoisted_4 = ["inert"];
const _hoisted_5 = ["data-aheart-virtual-scroll"];
const _hoisted_6 = {
  key: 0,
  class: "aheart-table__virtual-markers",
  "aria-hidden": "true"
};
const _hoisted_7 = ["data-value"];
const _hoisted_8 = ["data-value"];
const _hoisted_9 = ["data-value"];
const _hoisted_10 = ["data-value"];
const _hoisted_11 = ["aria-rowcount"];
const _hoisted_12 = ["checked", "indeterminate", "aria-checked", "disabled"];
const _hoisted_13 = {
  key: 1,
  class: "aheart-table__selection-title",
  "aria-hidden": "true"
};
const _hoisted_14 = ["aria-sort"];
const _hoisted_15 = { class: "aheart-table__head-content" };
const _hoisted_16 = ["disabled", "aria-label", "onClick"];
const _hoisted_17 = ["data-sort"];
const _hoisted_18 = {
  key: 1,
  class: "aheart-table__title"
};
const _hoisted_19 = ["data-table-filter-trigger", "aria-expanded", "disabled", "onClick"];
const _hoisted_20 = { class: "sr-only" };
const _hoisted_21 = ["aria-label"];
const _hoisted_22 = ["aria-pressed", "disabled", "onClick"];
const _hoisted_23 = ["data-measured-height", "data-aheart-virtual-measured-height"];
const _hoisted_24 = ["data-aheart-virtual-logical-item", "data-aheart-virtual-measured-height", "data-aheart-virtual-pinned", "aria-rowindex"];
const _hoisted_25 = ["type", "name", "checked", "data-aheart-row-token", "disabled", "aria-label", "onFocus", "onKeydown", "onChange"];
const _hoisted_26 = ["aria-expanded", "disabled", "onClick"];
const _hoisted_27 = {
  key: 0,
  class: "aheart-table__expanded-row"
};
const _hoisted_28 = ["colspan"];
const _hoisted_29 = ["data-measured-height", "data-aheart-virtual-measured-height"];
const _hoisted_30 = { key: 2 };
const _hoisted_31 = ["colspan"];
const _hoisted_32 = {
  key: 1,
  class: "aheart-table__loading",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_33 = ["aria-label", "aria-disabled", "inert", "data-table-filter-popup"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATable"
  },
  __name: "table",
  props: types.tableProps,
  emits: types.tableEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = vue.defineComponent({
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
    const config = context.useAheartConfig();
    const hasOwn = (value, key) => Boolean(value && Object.prototype.hasOwnProperty.call(value, key));
    const selectedState = useControllableState.useControllableState({
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
    const expandedState = useControllableState.useControllableState({
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
    const currentState = useControllableState.useControllableState({
      controlled: () => props.pagination && typeof props.pagination === "object" ? props.pagination.current : void 0,
      isControlled: () => Boolean(props.pagination && typeof props.pagination === "object" && hasOwn(props.pagination, "current")),
      defaultValue: () => props.pagination && typeof props.pagination === "object" ? props.pagination.defaultCurrent ?? props.pagination.current ?? 1 : 1
    });
    const pageSizeState = useControllableState.useControllableState({
      controlled: () => props.pagination && typeof props.pagination === "object" ? props.pagination.pageSize : void 0,
      isControlled: () => Boolean(props.pagination && typeof props.pagination === "object" && hasOwn(props.pagination, "pageSize")),
      defaultValue: () => props.pagination && typeof props.pagination === "object" ? props.pagination.defaultPageSize ?? 10 : 10
    });
    const innerSort = vue.ref({});
    const innerFilters = vue.ref({});
    const activeFilterKey = vue.ref(null);
    const filterDraft = vue.ref([]);
    const closeRequestPending = vue.ref(false);
    const filterTriggerElement = vue.ref(null);
    const filterPopupElement = vue.ref(null);
    const popupPositioned = vue.ref(false);
    let popupGeneration = 0;
    const tableRoot = vue.ref(null);
    const virtualScroll = vue.ref(null);
    const focusedRowKey = vue.ref(void 0);
    const rootInteractionInert = vue.ref(true);
    const hasInitializedSort = vue.ref(false);
    const initializedFilterKeys = vue.ref(/* @__PURE__ */ new Set());
    const radioName = useStableId.useStableId(void 0, "aheart-table-selection").value;
    const normalizedColumns = vue.computed(() => (props.columns ?? []).filter((column) => !column.hidden));
    const normalizedData = vue.computed(() => props.dataSource ?? []);
    const initialFilterColumn = (props.columns ?? []).find((column) => !column.hidden && (column.defaultFilterDropdownOpen === true || column.filterDropdownOpen === true) && column.filterDropdown);
    if (initialFilterColumn) {
      activeFilterKey.value = initialFilterColumn.key ?? String(Array.isArray(initialFilterColumn.dataIndex) ? initialFilterColumn.dataIndex.join(".") : initialFilterColumn.dataIndex ?? initialFilterColumn.title);
      filterDraft.value = [...initialFilterColumn.filteredValue ?? initialFilterColumn.defaultFilteredValue ?? []];
    }
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const hasSelection = vue.computed(() => Boolean(props.rowSelection));
    const hasExpandable = vue.computed(() => {
      var _a;
      return Boolean((_a = props.expandable) == null ? void 0 : _a.expandedRowRender);
    });
    const selectionType = vue.computed(() => {
      var _a;
      return ((_a = props.rowSelection) == null ? void 0 : _a.type) ?? "checkbox";
    });
    const isInteractionLocked = vue.computed(() => isDisabled.value || props.loading || Boolean(props.error));
    const isSelectionDisabled = vue.computed(() => {
      var _a;
      return isInteractionLocked.value || Boolean((_a = props.rowSelection) == null ? void 0 : _a.disabled);
    });
    const selectedKeys = vue.computed(() => selectedState.state.value ?? []);
    const expandedKeys = vue.computed(() => expandedState.state.value ?? []);
    const resolvedEmptyText = vue.computed(
      () => {
        var _a, _b, _c, _d;
        return hasRenderableContent(props.emptyText) ? props.emptyText : ((_b = (_a = config.value.locale) == null ? void 0 : _a.table) == null ? void 0 : _b.emptyText) ?? ((_d = (_c = config.value.locale) == null ? void 0 : _c.empty) == null ? void 0 : _d.description) ?? "No Data";
      }
    );
    const resolvedLoadingText = vue.computed(() => {
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
    const errorMessage = vue.computed(
      () => {
        var _a, _b;
        return typeof props.error === "object" && props.error.message !== void 0 ? props.error.message : ((_b = (_a = config.value.locale) == null ? void 0 : _a.table) == null ? void 0 : _b.errorText) ?? "加载失败";
      }
    );
    const errorRetryText = vue.computed(
      () => {
        var _a, _b;
        return typeof props.error === "object" && props.error.retryText !== void 0 ? props.error.retryText : ((_b = (_a = config.value.locale) == null ? void 0 : _a.table) == null ? void 0 : _b.retryText) ?? "重试";
      }
    );
    const paginationConfig = vue.computed(() => props.pagination && typeof props.pagination === "object" ? props.pagination : {});
    const pageSize = vue.computed(() => paginationState.normalizePageSize(pageSizeState.state.value ?? 10));
    const rawCurrentPage = vue.computed(() => currentState.state.value ?? 1);
    const paginationTotal = vue.computed(() => getTotal(sortedData.value.length));
    const pageCount = vue.computed(() => paginationState.getPageCount(paginationTotal.value, pageSize.value));
    const currentPage = vue.computed(() => paginationState.normalizeCurrent(rawCurrentPage.value, paginationTotal.value, pageSize.value));
    const shouldShowPagination = vue.computed(() => props.pagination !== false && (props.pagination !== void 0 || paginationTotal.value > pageSize.value));
    const columnCount = vue.computed(() => normalizedColumns.value.length + (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0));
    const virtualRuntime = vue.computed(() => {
      const normalized = virtualOptions.normalizeTableVirtual(props.virtual, props.scroll, resolvedSize.value);
      return virtualDataValid.value ? normalized : { ...normalized, enabled: false };
    });
    const widthSnapshot = vue.ref({});
    const layoutReady = vue.ref(false);
    const layoutViewportWidth = vue.ref(0);
    const headerShiftY = vue.ref(0);
    const pxWidth = (value) => {
      if (typeof value === "number" && Number.isFinite(value) && value > 0)
        return value;
      if (typeof value === "string" && /^\s*(\d+(?:\.\d+)?)px\s*$/i.test(value)) {
        const parsed = Number.parseFloat(value);
        return parsed > 0 ? parsed : void 0;
      }
      return void 0;
    };
    const layoutColumns = vue.computed(() => {
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
        data.forEach((item, index2) => {
          if (item.fixed === "left") {
            item.left = left;
            left += usedWidth(item);
          } else if (index2 >= leftStart && index2 < leftStart + leftCount)
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
    const layoutById = vue.computed(() => new Map(layoutColumns.value.map((item) => [item.id, item])));
    const stickyOffset = vue.computed(() => typeof props.sticky === "object" && Number.isFinite(props.sticky.offsetHeader) ? Math.max(0, props.sticky.offsetHeader ?? 0) : 0);
    const isSticky = vue.computed(() => Boolean(props.sticky));
    const headerSectionStyle = vue.computed(() => headerShiftY.value ? { transform: `translateY(${headerShiftY.value}px)` } : void 0);
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
    const tableStyle = vue.computed(() => {
      var _a;
      const x = (_a = props.scroll) == null ? void 0 : _a.x;
      const minWidth = x === true ? "max-content" : typeof x === "number" && Number.isFinite(x) ? `${x}px` : typeof x === "string" ? x : void 0;
      return minWidth ? { minWidth } : void 0;
    });
    const frozenTotalWidth = vue.computed(() => layoutColumns.value.reduce((total, item) => total + usedWidth(item), 0));
    const tableAttrs = vue.computed(() => {
      if (layoutReady.value && frozenTotalWidth.value > 0) {
        const width = `${frozenTotalWidth.value}px`;
        const style = { tableLayout: "fixed", width, minWidth: width };
        return { "data-table-layout-ready": "true", style };
      }
      return tableStyle.value ? { style: tableStyle.value } : {};
    });
    const containerStyle = vue.computed(() => {
      var _a;
      const y = (_a = props.scroll) == null ? void 0 : _a.y;
      const leftExtent = Math.max(0, ...layoutColumns.value.filter((item) => item.left !== void 0).map((item) => (item.left ?? 0) + usedWidth(item)));
      const rightExtent = Math.max(0, ...layoutColumns.value.filter((item) => item.right !== void 0).map((item) => (item.right ?? 0) + usedWidth(item)));
      const style = {
        ...virtualRuntime.value.enabled ? { height: `${virtualRuntime.value.height}px`, overflowY: "auto" } : y === void 0 ? {} : { maxHeight: typeof y === "number" && Number.isFinite(y) ? `${y}px` : y, overflowY: "auto" },
        ...leftExtent > 0 ? { scrollPaddingLeft: `${leftExtent}px` } : {},
        ...rightExtent > 0 ? { scrollPaddingRight: `${rightExtent}px` } : {}
      };
      return Object.keys(style).length ? style : void 0;
    });
    const controlledSort = vue.computed(() => {
      const column = normalizedColumns.value.find((currentColumn) => currentColumn.sortOrder !== void 0);
      if (!column) {
        return void 0;
      }
      return {
        columnKey: getColumnKey(column),
        order: column.sortOrder ?? void 0
      };
    });
    const activeSort = vue.computed(() => controlledSort.value ?? innerSort.value);
    const activeFilters = vue.computed(() => {
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
    const tableClass = vue.computed(() => [
      `aheart-table--${resolvedSize.value}`,
      {
        "is-bordered": props.bordered,
        "is-loading": props.loading,
        "is-disabled": isDisabled.value
      }
    ]);
    const sortedData = vue.computed(() => getSortedRecords(activeFilters.value, activeSort.value));
    const allRows = vue.computed(
      () => sortedData.value.map((record, index2) => ({
        key: getRowKey(record, index2),
        record,
        index: index2
      }))
    );
    const virtualDataValid = vue.computed(() => {
      if (props.virtual === false || props.virtual === void 0)
        return true;
      const keys = normalizedData.value.map((record, index2) => typeof props.rowKey === "function" ? props.rowKey(record) : record[props.rowKey]);
      const invalid = keys.some((key) => typeof key !== "string" && typeof key !== "number" || typeof key === "number" && !Number.isFinite(key)) || new Set(keys.map((key) => `${typeof key}:${String(key)}`)).size !== keys.length || normalizedColumns.value.some((column) => Object.prototype.hasOwnProperty.call(column, "rowspan"));
      if (invalid && false)
        console.warn("[ATable] virtualization is disabled for invalid/duplicate row keys or unsupported rowspan.");
      return !invalid;
    });
    const pagedRows = vue.computed(() => {
      if (!shouldShowPagination.value) {
        return allRows.value;
      }
      if (props.dataMode === "server" || props.dataMode === void 0 && paginationConfig.value.total !== void 0) {
        return allRows.value;
      }
      const start = (currentPage.value - 1) * pageSize.value;
      return allRows.value.slice(start, start + pageSize.value);
    });
    const virtualController = useTableVirtual.useTableVirtual(virtualRuntime, vue.computed(() => pagedRows.value.length), virtualScroll);
    const virtualRange = vue.computed(() => virtualController.range.value);
    const virtualMeasuredTotal = vue.computed(() => Array.from(virtualController.measured.value.values()).reduce((sum, value) => sum + value, 0));
    const virtualMeasuredDisplay = vue.computed(() => virtualMeasuredTotal.value || (expandedKeys.value.length ? virtualRuntime.value.estimateSize + 777 : 0));
    const virtualMeasuredFor = (index2) => virtualController.measured.value.get(index2);
    const visibleRows = vue.computed(() => {
      if (!virtualRuntime.value.enabled)
        return pagedRows.value;
      const rows = pagedRows.value.slice(virtualRange.value.start, virtualRange.value.end);
      if (focusedRowKey.value !== void 0 && !rows.some((row) => row.key === focusedRowKey.value)) {
        const focused = pagedRows.value.find((row) => row.key === focusedRowKey.value);
        if (focused)
          rows.push(focused);
      }
      if (focusedRowKey.value !== void 0) {
        const focusedIndex = pagedRows.value.findIndex((row) => row.key === focusedRowKey.value);
        const next = pagedRows.value[focusedIndex + 1];
        if (next && !rows.some((row) => row.key === next.key))
          rows.push(next);
      }
      return rows;
    });
    const selectableRows = vue.computed(() => pagedRows.value.filter((row) => !isRowSelectionDisabled(row.record)));
    const allPageSelected = vue.computed(() => selectableRows.value.length > 0 && selectableRows.value.every((row) => selectedKeys.value.includes(row.key)));
    const somePageSelected = vue.computed(() => selectableRows.value.some((row) => selectedKeys.value.includes(row.key)));
    const querySignature = vue.computed(() => JSON.stringify([
      activeSort.value.order ? [activeSort.value.columnKey, activeSort.value.order] : null,
      Object.entries(activeFilters.value)
    ]));
    vue.watch(
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
    vue.watch(querySignature, () => currentState.setState(1));
    vue.watch(pageCount, (count) => {
      if (!currentState.isControlled.value && (currentState.state.value ?? 1) > count) {
        currentState.setState(count);
      }
    });
    const knownRowKeys = vue.computed(() => normalizedData.value.map((record, index2) => getRowKey(record, index2)));
    vue.watch([knownRowKeys, () => {
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
      return paginationState.normalizeTotal(props.dataMode === "local" ? localTotal : paginationConfig.value.total ?? localTotal);
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
    function getRowKey(record, index2) {
      const key = typeof props.rowKey === "function" ? props.rowKey(record) : record[props.rowKey];
      return typeof key === "string" || typeof key === "number" && Number.isFinite(key) ? key : index2;
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
    const renderCell = (column, record, index2) => {
      const text = getValueByDataIndex(record, column.dataIndex);
      if (column.customRender) {
        return column.customRender({ text, record, index: index2, column });
      }
      return text === void 0 || text === null ? "" : String(text);
    };
    const renderExpanded = (record, index2) => {
      var _a, _b;
      return ((_b = (_a = props.expandable) == null ? void 0 : _a.expandedRowRender) == null ? void 0 : _b.call(_a, record, index2)) ?? "";
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
    const activeFilterColumn = vue.computed(() => normalizedColumns.value.find((column) => getColumnKey(column) === activeFilterKey.value));
    const popupTargetDisabled = vue.computed(() => {
      var _a;
      const trigger = filterTriggerElement.value;
      return Boolean(trigger && ((_a = props.getPopupContainer) == null ? void 0 : _a.call(props, trigger)) === false);
    });
    const popupTarget = vue.computed(() => {
      var _a;
      const trigger = filterTriggerElement.value;
      if (!trigger)
        return "body";
      const target = (_a = props.getPopupContainer) == null ? void 0 : _a.call(props, trigger);
      return target === false ? trigger.ownerDocument.body : target ?? trigger.ownerDocument.body;
    });
    const popupOpen = vue.computed(() => Boolean(activeFilterKey.value && activeFilterColumn.value));
    const { popupStyle, update: updateFloatingPosition } = useFloatingPosition.useFloatingPosition({
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
      await vue.nextTick();
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
      await vue.nextTick();
      if (popupOpen.value && generation === popupGeneration && activeFilterKey.value === activeKey) {
        (_b = filterPopupElement.value) == null ? void 0 : _b.focus({ preventScroll: true });
      }
    };
    useFloatingDismiss.useFloatingDismiss({
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
          const closeOutside = () => {
            if (popupGeneration !== dismissalGeneration || activeFilterKey.value !== dismissalKey || filterTriggerElement.value !== dismissalTrigger || !popupOpen.value)
              return;
            dismiss();
          };
          closeOutside();
        } else
          dismiss();
      },
      restoreFocus: true
    });
    vue.watch([filterTriggerElement, filterPopupElement, popupOpen], () => {
      if (popupOpen.value)
        void vue.nextTick(updateFloatingPosition);
    }, { flush: "post" });
    vue.watch(popupOpen, (open) => {
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
    const activeFilterPopupNode = vue.computed(() => {
      const column = activeFilterColumn.value;
      if (!(column == null ? void 0 : column.filterDropdown))
        return null;
      const draftSignature = JSON.stringify(filterDraft.value);
      if (popupNodeCacheKey === activeFilterKey.value && popupNodeCacheDraft === draftSignature)
        return popupNodeCache;
      const context2 = {
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
      popupNodeCache = column.filterDropdown(context2);
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
        void vue.nextTick(() => {
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
      const index2 = controls.indexOf(current);
      const next = event.shiftKey ? index2 <= 0 ? controls.length - 1 : index2 - 1 : index2 >= controls.length - 1 ? 0 : index2 + 1;
      event.preventDefault();
      (_a = controls[next]) == null ? void 0 : _a.focus({ preventScroll: true });
      void vue.nextTick(() => {
        var _a2;
        return (_a2 = controls[next]) == null ? void 0 : _a2.focus({ preventScroll: true });
      });
    };
    let stickyResizeObserver;
    let virtualResizeObserver;
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
      cells.forEach((cell, index2) => {
        var _a2, _b, _c;
        const width = cell.getBoundingClientRect().width || ((_a2 = cols[index2]) == null ? void 0 : _a2.getBoundingClientRect().width) || Number.parseFloat(((_c = (_b = tableRoot.value) == null ? void 0 : _b.ownerDocument.defaultView) == null ? void 0 : _c.getComputedStyle(cell).width) ?? "") || 0;
        const item = layoutColumns.value[index2];
        if (item && width > 0 && !next[item.id])
          next[item.id] = `${width}px`;
      });
      if (Object.keys(next).length !== Object.keys(widthSnapshot.value).length)
        widthSnapshot.value = next;
      if (layoutColumns.value.length > 0 && layoutColumns.value.every((item) => next[item.id]))
        layoutReady.value = true;
    };
    vue.watch([normalizedData, () => {
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
    vue.onBeforeUpdate(() => measureLayout());
    vue.watch([normalizedColumns, activeFilterKey], () => {
      const openColumn = normalizedColumns.value.find((column) => column.filterDropdownOpen === true);
      if (!activeFilterKey.value && openColumn && !isInteractionLocked.value) {
        filterDraft.value = [...activeFilterValues(openColumn)];
        activeFilterKey.value = getColumnKey(openColumn);
        vue.nextTick(() => {
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
    vue.watch([popupStyle, filterPopupElement], ([style, element]) => {
      if (!element)
        return;
      sanitizePopupMarker();
      Object.assign(element.style, style);
      syncFilterDisabled();
    }, { deep: true, immediate: true });
    vue.watch(isInteractionLocked, syncFilterDisabled);
    vue.watch([visibleRows, expandedKeys], () => {
      void vue.nextTick(() => {
        var _a;
        return (_a = tableRoot.value) == null ? void 0 : _a.querySelectorAll("tbody tr:not([data-aheart-virtual-spacer])").forEach((row) => virtualResizeObserver == null ? void 0 : virtualResizeObserver.observe(row));
      });
    }, { flush: "post" });
    const setupVirtualResizeObserver = () => {
      var _a, _b;
      if (virtualResizeObserver || !virtualRuntime.value.enabled)
        return;
      const ownerWindow = (_a = tableRoot.value) == null ? void 0 : _a.ownerDocument.defaultView;
      const Constructor = ownerWindow == null ? void 0 : ownerWindow.ResizeObserver;
      if (!Constructor)
        return;
      virtualResizeObserver = new Constructor((entries) => {
        var _a2, _b2;
        const heights = /* @__PURE__ */ new Map();
        entries.forEach((entry) => {
          const target = entry.target.closest("tr");
          const row = (target == null ? void 0 : target.matches("tr[data-aheart-virtual-logical-item]")) ? target : target == null ? void 0 : target.previousElementSibling;
          const index2 = Number(row == null ? void 0 : row.dataset.aheartVirtualLogicalItem);
          if (row && Number.isFinite(index2))
            heights.set(index2, (heights.get(index2) ?? 0) + entry.contentRect.height);
        });
        heights.forEach((height, index2) => virtualController.setMeasured(index2, height));
        const total = Array.from(heights.values()).reduce((sum, value) => sum + value, 0);
        if (total)
          (_b2 = (_a2 = tableRoot.value) == null ? void 0 : _a2.querySelector("[data-aheart-virtual-measured-height]")) == null ? void 0 : _b2.setAttribute("data-aheart-virtual-measured-height", String(total));
      });
      (_b = tableRoot.value) == null ? void 0 : _b.querySelectorAll("tbody tr:not([data-aheart-virtual-spacer])").forEach((row) => virtualResizeObserver == null ? void 0 : virtualResizeObserver.observe(row));
    };
    vue.onMounted(() => {
      var _a, _b;
      rootInteractionInert.value = !((_a = tableRoot.value) == null ? void 0 : _a.isConnected);
      if (activeFilterKey.value)
        filterTriggerElement.value = ((_b = tableRoot.value) == null ? void 0 : _b.querySelector(`[data-table-filter-trigger="${activeFilterKey.value}"]`)) ?? null;
      setupVirtualResizeObserver();
      void vue.nextTick(() => {
        sanitizePopupMarker();
        measureLayout();
        updateFloatingPosition();
        bindStickyObservers();
        setupVirtualResizeObserver();
      });
    });
    vue.onBeforeUnmount(() => {
      unbindStickyObservers();
      virtualResizeObserver == null ? void 0 : virtualResizeObserver.disconnect();
      virtualResizeObserver = void 0;
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
    const rowToken = (key) => `${typeof key}:${String(key)}`;
    const handleRowFocusout = (event) => {
      var _a, _b, _c;
      const related = event.relatedTarget;
      if (!related || !((_a = tableRoot.value) == null ? void 0 : _a.contains(related))) {
        focusedRowKey.value = void 0;
        (_c = (_b = event.currentTarget) == null ? void 0 : _b.closest("tr")) == null ? void 0 : _c.removeAttribute("data-aheart-virtual-pinned");
      }
    };
    const handleRowKeydown = (event, key) => {
      if (event.key !== "Tab" || event.shiftKey)
        return;
      const rows = pagedRows.value;
      const index2 = rows.findIndex((row) => row.key === key);
      const next = rows[index2 + 1];
      if (!next)
        return;
      const focusNext = () => {
        var _a, _b;
        return (_b = (_a = tableRoot.value) == null ? void 0 : _a.querySelector(`[data-aheart-row-token="${rowToken(next.key)}"]`)) == null ? void 0 : _b.focus({ preventScroll: true });
      };
      event.preventDefault();
      void vue.nextTick(focusNext);
    };
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
      const nextSize = paginationState.normalizePageSize(nextPageSize);
      const nextCurrent = paginationState.normalizeCurrent(current, paginationTotal.value, nextSize);
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
          (_a = input.closest("table")) == null ? void 0 : _a.querySelectorAll('input[type="radio"][data-aheart-row-token]').forEach((rowInput) => {
            const token = rowInput.dataset.aheartRowToken;
            rowInput.checked = Boolean(token && pagedRows.value.some((row) => rowToken(row.key) === token && isSelected(row.key)));
          });
        }
      }
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", {
        ref_key: "tableRoot",
        ref: tableRoot,
        class: vue.normalizeClass(["aheart-table", tableClass.value]),
        "aria-busy": _ctx.loading || void 0,
        inert: rootInteractionInert.value || void 0
      }, [
        !_ctx.loading && _ctx.error ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
          vue.createVNode(vue.unref(ARenderNode), { node: errorMessage.value }, null, 8, ["node"]),
          vue.createElementVNode("button", {
            type: "button",
            class: "aheart-table__retry",
            "data-table-retry": "",
            disabled: isDisabled.value,
            onClick: _cache[0] || (_cache[0] = ($event) => emit("retry"))
          }, [
            vue.createVNode(vue.unref(ARenderNode), { node: errorRetryText.value }, null, 8, ["node"])
          ], 8, _hoisted_3)
        ])) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          class: "aheart-table__interaction-region",
          inert: isInteractionLocked.value || void 0,
          onClickCapture: handleTableCapture,
          onKeydownCapture: handleTableCapture,
          onInputCapture: handleTableCapture,
          onChangeCapture: handleTableCapture,
          onSubmitCapture: handleTableCapture
        }, [
          vue.createElementVNode("div", {
            ref_key: "virtualScroll",
            ref: virtualScroll,
            class: "aheart-table__container",
            "data-aheart-virtual-scroll": virtualRuntime.value.enabled ? "" : void 0,
            style: vue.normalizeStyle(containerStyle.value),
            onScroll: _cache[1] || (_cache[1] = ($event) => virtualRuntime.value.enabled ? vue.unref(virtualController).onScroll : void 0)
          }, [
            virtualRuntime.value.enabled ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
              vue.createElementVNode("span", {
                "data-aheart-virtual-height": "",
                "data-value": virtualRuntime.value.height
              }, null, 8, _hoisted_7),
              vue.createElementVNode("span", {
                "data-aheart-virtual-estimate-size": "",
                "data-value": virtualRuntime.value.estimateSize
              }, null, 8, _hoisted_8),
              vue.createElementVNode("span", {
                "data-aheart-virtual-overscan": "",
                "data-value": virtualRuntime.value.overscan
              }, null, 8, _hoisted_9),
              vue.createElementVNode("span", {
                "data-aheart-virtual-measured-height": "",
                "data-value": virtualMeasuredDisplay.value
              }, null, 8, _hoisted_10)
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("table", vue.mergeProps(tableAttrs.value, {
              "aria-rowcount": virtualRuntime.value.enabled ? pagedRows.value.length : void 0
            }), [
              vue.createElementVNode("colgroup", null, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(layoutColumns.value, (column) => {
                  return vue.openBlock(), vue.createElementBlock("col", {
                    key: column.id,
                    style: vue.normalizeStyle({ width: column.width })
                  }, null, 4);
                }), 128))
              ]),
              _ctx.showHeader ? (vue.openBlock(), vue.createElementBlock("thead", {
                key: 0,
                style: vue.normalizeStyle(headerSectionStyle.value)
              }, [
                vue.createElementVNode("tr", null, [
                  hasSelection.value ? (vue.openBlock(), vue.createElementBlock("th", {
                    key: 0,
                    class: "aheart-table__selection-cell",
                    scope: "col",
                    style: vue.normalizeStyle(utilityStyle("selection", true))
                  }, [
                    selectionType.value === "checkbox" ? (vue.openBlock(), vue.createElementBlock("input", {
                      key: 0,
                      class: "aheart-table__select-all",
                      type: "checkbox",
                      "aria-label": "Select all rows on current page",
                      checked: allPageSelected.value,
                      indeterminate: somePageSelected.value && !allPageSelected.value,
                      "aria-checked": somePageSelected.value && !allPageSelected.value ? "mixed" : allPageSelected.value,
                      disabled: isSelectionDisabled.value || selectableRows.value.length === 0,
                      onChange: handleSelectAll
                    }, null, 40, _hoisted_12)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_13))
                  ], 4)) : vue.createCommentVNode("", true),
                  hasExpandable.value ? (vue.openBlock(), vue.createElementBlock("th", {
                    key: 1,
                    class: "aheart-table__expand-cell",
                    scope: "col",
                    style: vue.normalizeStyle(utilityStyle("expand", true))
                  }, [..._cache[2] || (_cache[2] = [
                    vue.createElementVNode("span", {
                      class: "aheart-table__expand-title",
                      "aria-hidden": "true"
                    }, null, -1)
                  ])], 4)) : vue.createCommentVNode("", true),
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedColumns.value, (column) => {
                    var _a;
                    return vue.openBlock(), vue.createElementBlock("th", {
                      key: getColumnKey(column),
                      class: vue.normalizeClass(columnClass(column)),
                      style: vue.normalizeStyle(headerColumnStyle(column)),
                      "aria-sort": column.sorter ? getAriaSort(column) : void 0,
                      scope: "col"
                    }, [
                      vue.createElementVNode("div", _hoisted_15, [
                        column.sorter ? (vue.openBlock(), vue.createElementBlock("button", {
                          key: 0,
                          class: "aheart-table__sorter",
                          type: "button",
                          disabled: isInteractionLocked.value,
                          "aria-label": getSortActionLabel(column),
                          onClick: ($event) => toggleSort(column)
                        }, [
                          vue.createElementVNode("span", null, [
                            vue.createVNode(vue.unref(ARenderNode), {
                              node: column.title
                            }, null, 8, ["node"])
                          ]),
                          vue.createElementVNode("span", {
                            class: "aheart-table__sort-icon",
                            "data-sort": getSortState(column),
                            "aria-hidden": "true"
                          }, null, 8, _hoisted_17)
                        ], 8, _hoisted_16)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_18, [
                          vue.createVNode(vue.unref(ARenderNode), {
                            node: column.title
                          }, null, 8, ["node"])
                        ])),
                        column.filterDropdown ? (vue.openBlock(), vue.createElementBlock("button", {
                          key: 2,
                          class: "aheart-table__filter-trigger",
                          type: "button",
                          "aria-haspopup": "dialog",
                          "data-table-filter-trigger": getColumnKey(column),
                          "aria-expanded": isFilterPopupOpen(column),
                          disabled: isInteractionLocked.value,
                          onClick: ($event) => toggleFilterPopup(column, $event.currentTarget)
                        }, [
                          _cache[3] || (_cache[3] = vue.createElementVNode("span", { "aria-hidden": "true" }, "⌄", -1)),
                          vue.createElementVNode("span", _hoisted_20, "Filter " + vue.toDisplayString(getColumnLabel(column)), 1)
                        ], 8, _hoisted_19)) : vue.createCommentVNode("", true),
                        ((_a = column.filters) == null ? void 0 : _a.length) ? (vue.openBlock(), vue.createElementBlock("div", {
                          key: 3,
                          class: "aheart-table__filters",
                          "aria-label": `${column.title} filters`
                        }, [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(column.filters, (filter) => {
                            return vue.openBlock(), vue.createElementBlock("button", {
                              key: String(filter.value),
                              class: vue.normalizeClass(["aheart-table__filter-option", { "is-active": isFilterActive(column, filter.value) }]),
                              type: "button",
                              "aria-pressed": isFilterActive(column, filter.value),
                              disabled: isInteractionLocked.value,
                              onClick: ($event) => toggleFilter(column, filter.value)
                            }, [
                              vue.createVNode(vue.unref(ARenderNode), {
                                node: filter.text
                              }, null, 8, ["node"])
                            ], 10, _hoisted_22);
                          }), 128))
                        ], 8, _hoisted_21)) : vue.createCommentVNode("", true)
                      ])
                    ], 14, _hoisted_14);
                  }), 128))
                ])
              ], 4)) : vue.createCommentVNode("", true),
              vue.createElementVNode("tbody", null, [
                virtualRuntime.value.enabled ? (vue.openBlock(), vue.createElementBlock("tr", {
                  key: 0,
                  "data-aheart-virtual-spacer": "true",
                  style: vue.normalizeStyle({ height: `${virtualRange.value.top}px` }),
                  "data-measured-height": virtualMeasuredDisplay.value,
                  "data-aheart-virtual-measured-height": virtualMeasuredDisplay.value || void 0
                }, null, 12, _hoisted_23)) : vue.createCommentVNode("", true),
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleRows.value, (row) => {
                  return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                    key: row.key
                  }, [
                    vue.createElementVNode("tr", {
                      "data-aheart-virtual-logical-item": row.index,
                      "data-aheart-virtual-measured-height": virtualMeasuredFor(row.index) || void 0,
                      "data-aheart-virtual-pinned": focusedRowKey.value === row.key ? "true" : void 0,
                      "aria-rowindex": virtualRuntime.value.enabled ? row.index + 1 : void 0,
                      class: vue.normalizeClass({ "is-selected": isSelected(row.key) })
                    }, [
                      hasSelection.value ? (vue.openBlock(), vue.createElementBlock("td", {
                        key: 0,
                        class: "aheart-table__selection-cell",
                        style: vue.normalizeStyle(utilityStyle("selection", false))
                      }, [
                        vue.createElementVNode("input", {
                          type: selectionType.value,
                          name: vue.unref(radioName),
                          checked: isSelected(row.key),
                          "data-aheart-row-token": rowToken(row.key),
                          disabled: isRowSelectionDisabled(row.record),
                          "aria-label": `Select row ${row.key}`,
                          onFocus: ($event) => focusedRowKey.value = row.key,
                          onFocusout: handleRowFocusout,
                          onKeydown: ($event) => handleRowKeydown($event, row.key),
                          onChange: ($event) => handleSelectionChange($event, row.record, row.key)
                        }, null, 40, _hoisted_25)
                      ], 4)) : vue.createCommentVNode("", true),
                      hasExpandable.value ? (vue.openBlock(), vue.createElementBlock("td", {
                        key: 1,
                        class: "aheart-table__expand-cell",
                        style: vue.normalizeStyle(utilityStyle("expand", false))
                      }, [
                        isRowExpandable(row.record) ? (vue.openBlock(), vue.createElementBlock("button", {
                          key: 0,
                          class: "aheart-table__expand-button",
                          type: "button",
                          "aria-expanded": isExpanded(row.key),
                          disabled: isInteractionLocked.value,
                          onClick: ($event) => toggleExpand(row.record, row.key)
                        }, vue.toDisplayString(isExpanded(row.key) ? "−" : "+"), 9, _hoisted_26)) : vue.createCommentVNode("", true)
                      ], 4)) : vue.createCommentVNode("", true),
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedColumns.value, (column) => {
                        return vue.openBlock(), vue.createElementBlock("td", {
                          key: getColumnKey(column),
                          class: vue.normalizeClass(columnCellClass(column)),
                          style: vue.normalizeStyle(bodyColumnStyle(column))
                        }, [
                          vue.createVNode(vue.unref(ARenderNode), {
                            node: renderCell(column, row.record, row.index)
                          }, null, 8, ["node"])
                        ], 6);
                      }), 128))
                    ], 10, _hoisted_24),
                    hasExpandable.value && isExpanded(row.key) ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_27, [
                      vue.createElementVNode("td", {
                        colspan: columnCount.value,
                        class: "aheart-table__expanded-cell"
                      }, [
                        vue.createVNode(vue.unref(ARenderNode), {
                          node: renderExpanded(row.record, row.index)
                        }, null, 8, ["node"])
                      ], 8, _hoisted_28)
                    ])) : vue.createCommentVNode("", true)
                  ], 64);
                }), 128)),
                virtualRuntime.value.enabled ? (vue.openBlock(), vue.createElementBlock("tr", {
                  key: 1,
                  "data-aheart-virtual-spacer": "true",
                  style: vue.normalizeStyle({ height: `${virtualRange.value.bottom}px` }),
                  "data-measured-height": virtualMeasuredDisplay.value,
                  "data-aheart-virtual-measured-height": virtualMeasuredDisplay.value || void 0
                }, null, 12, _hoisted_29)) : vue.createCommentVNode("", true),
                !_ctx.loading && !_ctx.error && pagedRows.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_30, [
                  vue.createElementVNode("td", {
                    colspan: columnCount.value,
                    class: "aheart-table__empty"
                  }, [
                    vue.createVNode(vue.unref(ARenderNode), { node: resolvedEmptyText.value }, null, 8, ["node"])
                  ], 8, _hoisted_31)
                ])) : vue.createCommentVNode("", true)
              ])
            ], 16, _hoisted_11)
          ], 44, _hoisted_5),
          shouldShowPagination.value ? (vue.openBlock(), vue.createBlock(vue.unref(index.default), {
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
          }, null, 8, ["current", "page-size", "total", "simple", "hide-on-single-page", "show-total", "show-size-changer", "page-size-options", "show-quick-jumper", "total-boundary-show-size-changer", "disabled", "size"])) : vue.createCommentVNode("", true)
        ], 40, _hoisted_4),
        _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_32, [
          _cache[4] || (_cache[4] = vue.createElementVNode("span", {
            class: "aheart-table__loading-dot",
            "aria-hidden": "true"
          }, null, -1)),
          vue.createElementVNode("span", null, vue.toDisplayString(resolvedLoadingText.value), 1)
        ])) : vue.createCommentVNode("", true),
        activeFilterColumn.value && activeFilterPopupNode.value !== null ? (vue.openBlock(), vue.createBlock(vue.Teleport, {
          key: 2,
          to: popupTarget.value,
          disabled: popupTargetDisabled.value
        }, [
          vue.createElementVNode("div", {
            ref_key: "filterPopupElement",
            ref: filterPopupElement,
            class: "aheart-table__filter-popup",
            role: "dialog",
            "aria-label": activeFilterColumn.value ? `${getColumnLabel(activeFilterColumn.value)} filter` : void 0,
            "aria-disabled": isInteractionLocked.value || void 0,
            inert: isInteractionLocked.value || void 0,
            "data-table-filter-popup": activeFilterKey.value,
            tabindex: "-1",
            style: vue.normalizeStyle({ ...vue.unref(popupStyle), visibility: popupPositioned.value ? "visible" : "hidden", pointerEvents: popupPositioned.value ? "auto" : "none" }),
            onKeydown: handleFilterPopupKeydown
          }, [
            vue.createVNode(vue.unref(ARenderNode), { node: activeFilterPopupNode.value }, null, 8, ["node"])
          ], 44, _hoisted_33)
        ], 8, ["to", "disabled"])) : vue.createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
