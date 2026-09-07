"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../pagination/index.js");
const paginationState = require("../pagination/pagination-state.js");
const useControllableState = require("../utils/use-controllable-state.js");
const useStableId = require("../utils/use-stable-id.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["aria-busy"];
const _hoisted_2 = { class: "aheart-table__container" };
const _hoisted_3 = { key: 0 };
const _hoisted_4 = {
  key: 0,
  class: "aheart-table__selection-cell",
  scope: "col"
};
const _hoisted_5 = ["checked", "indeterminate", "aria-checked", "disabled"];
const _hoisted_6 = {
  key: 1,
  class: "aheart-table__selection-title",
  "aria-hidden": "true"
};
const _hoisted_7 = {
  key: 1,
  class: "aheart-table__expand-cell",
  scope: "col"
};
const _hoisted_8 = ["aria-sort"];
const _hoisted_9 = { class: "aheart-table__head-content" };
const _hoisted_10 = ["disabled", "aria-label", "onClick"];
const _hoisted_11 = ["data-sort"];
const _hoisted_12 = {
  key: 1,
  class: "aheart-table__title"
};
const _hoisted_13 = ["aria-label"];
const _hoisted_14 = ["aria-pressed", "disabled", "onClick"];
const _hoisted_15 = {
  key: 0,
  class: "aheart-table__selection-cell"
};
const _hoisted_16 = ["type", "name", "checked", "disabled", "aria-label", "onChange"];
const _hoisted_17 = {
  key: 1,
  class: "aheart-table__expand-cell"
};
const _hoisted_18 = ["aria-expanded", "disabled", "onClick"];
const _hoisted_19 = {
  key: 0,
  class: "aheart-table__expanded-row"
};
const _hoisted_20 = ["colspan"];
const _hoisted_21 = { key: 0 };
const _hoisted_22 = ["colspan"];
const _hoisted_23 = {
  key: 0,
  class: "aheart-table__loading",
  role: "status",
  "aria-live": "polite"
};
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
    const hasInitializedSort = vue.ref(false);
    const initializedFilterKeys = vue.ref(/* @__PURE__ */ new Set());
    const radioName = useStableId.useStableId(void 0, "aheart-table-selection").value;
    const normalizedColumns = vue.computed(() => (props.columns ?? []).filter((column) => !column.hidden));
    const normalizedData = vue.computed(() => props.dataSource ?? []);
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
    const isSelectionDisabled = vue.computed(() => {
      var _a;
      return isDisabled.value || Boolean((_a = props.rowSelection) == null ? void 0 : _a.disabled);
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
    const paginationConfig = vue.computed(() => props.pagination && typeof props.pagination === "object" ? props.pagination : {});
    const pageSize = vue.computed(() => paginationState.normalizePageSize(pageSizeState.state.value ?? 10));
    const rawCurrentPage = vue.computed(() => currentState.state.value ?? 1);
    const paginationTotal = vue.computed(() => getTotal(sortedData.value.length));
    const pageCount = vue.computed(() => paginationState.getPageCount(paginationTotal.value, pageSize.value));
    const currentPage = vue.computed(() => paginationState.normalizeCurrent(rawCurrentPage.value, paginationTotal.value, pageSize.value));
    const shouldShowPagination = vue.computed(() => props.pagination !== false && (props.pagination !== void 0 || paginationTotal.value > pageSize.value));
    const columnCount = vue.computed(() => normalizedColumns.value.length + (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0));
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
    const columnStyle = (column) => ({
      width: typeof column.width === "number" ? `${column.width}px` : column.width
    });
    const columnClass = (column) => {
      var _a;
      return [
        column.className,
        column.align ? `aheart-table__cell--${column.align}` : void 0,
        {
          "is-sortable": Boolean(column.sorter),
          "is-filtered": Boolean((_a = activeFilters.value[getColumnKey(column)]) == null ? void 0 : _a.length),
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
          (_a = input.closest("table")) == null ? void 0 : _a.querySelectorAll(':scope > tbody > tr > .aheart-table__selection-cell > input[type="radio"]').forEach((rowInput, index2) => {
            var _a2;
            rowInput.checked = isSelected((_a2 = pagedRows.value[index2]) == null ? void 0 : _a2.key);
          });
        }
      }
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", {
        class: vue.normalizeClass(["aheart-table", tableClass.value]),
        "aria-busy": _ctx.loading || void 0
      }, [
        vue.createElementVNode("div", _hoisted_2, [
          vue.createElementVNode("table", null, [
            _ctx.showHeader ? (vue.openBlock(), vue.createElementBlock("thead", _hoisted_3, [
              vue.createElementVNode("tr", null, [
                hasSelection.value ? (vue.openBlock(), vue.createElementBlock("th", _hoisted_4, [
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
                  }, null, 40, _hoisted_5)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_6))
                ])) : vue.createCommentVNode("", true),
                hasExpandable.value ? (vue.openBlock(), vue.createElementBlock("th", _hoisted_7, [..._cache[0] || (_cache[0] = [
                  vue.createElementVNode("span", {
                    class: "aheart-table__expand-title",
                    "aria-hidden": "true"
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedColumns.value, (column) => {
                  var _a;
                  return vue.openBlock(), vue.createElementBlock("th", {
                    key: getColumnKey(column),
                    class: vue.normalizeClass(columnClass(column)),
                    style: vue.normalizeStyle(columnStyle(column)),
                    "aria-sort": column.sorter ? getAriaSort(column) : void 0,
                    scope: "col"
                  }, [
                    vue.createElementVNode("div", _hoisted_9, [
                      column.sorter ? (vue.openBlock(), vue.createElementBlock("button", {
                        key: 0,
                        class: "aheart-table__sorter",
                        type: "button",
                        disabled: isDisabled.value,
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
                        }, null, 8, _hoisted_11)
                      ], 8, _hoisted_10)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_12, [
                        vue.createVNode(vue.unref(ARenderNode), {
                          node: column.title
                        }, null, 8, ["node"])
                      ])),
                      ((_a = column.filters) == null ? void 0 : _a.length) ? (vue.openBlock(), vue.createElementBlock("div", {
                        key: 2,
                        class: "aheart-table__filters",
                        "aria-label": `${column.title} filters`
                      }, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(column.filters, (filter) => {
                          return vue.openBlock(), vue.createElementBlock("button", {
                            key: String(filter.value),
                            class: vue.normalizeClass(["aheart-table__filter-option", { "is-active": isFilterActive(column, filter.value) }]),
                            type: "button",
                            "aria-pressed": isFilterActive(column, filter.value),
                            disabled: isDisabled.value,
                            onClick: ($event) => toggleFilter(column, filter.value)
                          }, [
                            vue.createVNode(vue.unref(ARenderNode), {
                              node: filter.text
                            }, null, 8, ["node"])
                          ], 10, _hoisted_14);
                        }), 128))
                      ], 8, _hoisted_13)) : vue.createCommentVNode("", true)
                    ])
                  ], 14, _hoisted_8);
                }), 128))
              ])
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("tbody", null, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(pagedRows.value, (row) => {
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                  key: row.key
                }, [
                  vue.createElementVNode("tr", {
                    class: vue.normalizeClass({ "is-selected": isSelected(row.key) })
                  }, [
                    hasSelection.value ? (vue.openBlock(), vue.createElementBlock("td", _hoisted_15, [
                      vue.createElementVNode("input", {
                        type: selectionType.value,
                        name: vue.unref(radioName),
                        checked: isSelected(row.key),
                        disabled: isRowSelectionDisabled(row.record),
                        "aria-label": `Select row ${row.key}`,
                        onChange: ($event) => handleSelectionChange($event, row.record, row.key)
                      }, null, 40, _hoisted_16)
                    ])) : vue.createCommentVNode("", true),
                    hasExpandable.value ? (vue.openBlock(), vue.createElementBlock("td", _hoisted_17, [
                      isRowExpandable(row.record) ? (vue.openBlock(), vue.createElementBlock("button", {
                        key: 0,
                        class: "aheart-table__expand-button",
                        type: "button",
                        "aria-expanded": isExpanded(row.key),
                        disabled: isDisabled.value,
                        onClick: ($event) => toggleExpand(row.record, row.key)
                      }, vue.toDisplayString(isExpanded(row.key) ? "−" : "+"), 9, _hoisted_18)) : vue.createCommentVNode("", true)
                    ])) : vue.createCommentVNode("", true),
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedColumns.value, (column) => {
                      return vue.openBlock(), vue.createElementBlock("td", {
                        key: getColumnKey(column),
                        class: vue.normalizeClass(columnCellClass(column)),
                        style: vue.normalizeStyle(columnStyle(column))
                      }, [
                        vue.createVNode(vue.unref(ARenderNode), {
                          node: renderCell(column, row.record, row.index)
                        }, null, 8, ["node"])
                      ], 6);
                    }), 128))
                  ], 2),
                  hasExpandable.value && isExpanded(row.key) ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_19, [
                    vue.createElementVNode("td", {
                      colspan: columnCount.value,
                      class: "aheart-table__expanded-cell"
                    }, [
                      vue.createVNode(vue.unref(ARenderNode), {
                        node: renderExpanded(row.record, row.index)
                      }, null, 8, ["node"])
                    ], 8, _hoisted_20)
                  ])) : vue.createCommentVNode("", true)
                ], 64);
              }), 128)),
              !_ctx.loading && pagedRows.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_21, [
                vue.createElementVNode("td", {
                  colspan: columnCount.value,
                  class: "aheart-table__empty"
                }, [
                  vue.createVNode(vue.unref(ARenderNode), { node: resolvedEmptyText.value }, null, 8, ["node"])
                ], 8, _hoisted_22)
              ])) : vue.createCommentVNode("", true)
            ])
          ]),
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_23, [
            _cache[1] || (_cache[1] = vue.createElementVNode("span", {
              class: "aheart-table__loading-dot",
              "aria-hidden": "true"
            }, null, -1)),
            vue.createElementVNode("span", null, vue.toDisplayString(resolvedLoadingText.value), 1)
          ])) : vue.createCommentVNode("", true)
        ]),
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
          disabled: isDisabled.value,
          size: resolvedSize.value,
          onChange: handlePageChange
        }, null, 8, ["current", "page-size", "total", "simple", "hide-on-single-page", "show-total", "show-size-changer", "page-size-options", "show-quick-jumper", "total-boundary-show-size-changer", "disabled", "size"])) : vue.createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
