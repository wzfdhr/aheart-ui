import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, createCommentVNode, Fragment, renderList, normalizeStyle, createVNode, unref, toDisplayString, createBlock } from "vue";
import Pagination from "../pagination/index.js";
import { normalizePageSize, getPageCount, normalizeCurrent, normalizeTotal } from "../pagination/pagination-state.js";
import { useControllableState } from "../utils/use-controllable-state.js";
import { useStableId } from "../utils/use-stable-id.js";
import { tableProps, tableEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
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
    const hasInitializedSort = ref(false);
    const initializedFilterKeys = ref(/* @__PURE__ */ new Set());
    const radioName = useStableId(void 0, "aheart-table-selection").value;
    const normalizedColumns = computed(() => (props.columns ?? []).filter((column) => !column.hidden));
    const normalizedData = computed(() => props.dataSource ?? []);
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
    const isSelectionDisabled = computed(() => {
      var _a;
      return isDisabled.value || Boolean((_a = props.rowSelection) == null ? void 0 : _a.disabled);
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
    const paginationConfig = computed(() => props.pagination && typeof props.pagination === "object" ? props.pagination : {});
    const pageSize = computed(() => normalizePageSize(pageSizeState.state.value ?? 10));
    const rawCurrentPage = computed(() => currentState.state.value ?? 1);
    const paginationTotal = computed(() => getTotal(sortedData.value.length));
    const pageCount = computed(() => getPageCount(paginationTotal.value, pageSize.value));
    const currentPage = computed(() => normalizeCurrent(rawCurrentPage.value, paginationTotal.value, pageSize.value));
    const shouldShowPagination = computed(() => props.pagination !== false && (props.pagination !== void 0 || paginationTotal.value > pageSize.value));
    const columnCount = computed(() => normalizedColumns.value.length + (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0));
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
        class: normalizeClass(["aheart-table", tableClass.value]),
        "aria-busy": _ctx.loading || void 0
      }, [
        createElementVNode("div", _hoisted_2, [
          createElementVNode("table", null, [
            _ctx.showHeader ? (openBlock(), createElementBlock("thead", _hoisted_3, [
              createElementVNode("tr", null, [
                hasSelection.value ? (openBlock(), createElementBlock("th", _hoisted_4, [
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
                ])) : createCommentVNode("", true),
                hasExpandable.value ? (openBlock(), createElementBlock("th", _hoisted_7, [..._cache[0] || (_cache[0] = [
                  createElementVNode("span", {
                    class: "aheart-table__expand-title",
                    "aria-hidden": "true"
                  }, null, -1)
                ])])) : createCommentVNode("", true),
                (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedColumns.value, (column) => {
                  var _a;
                  return openBlock(), createElementBlock("th", {
                    key: getColumnKey(column),
                    class: normalizeClass(columnClass(column)),
                    style: normalizeStyle(columnStyle(column)),
                    "aria-sort": column.sorter ? getAriaSort(column) : void 0,
                    scope: "col"
                  }, [
                    createElementVNode("div", _hoisted_9, [
                      column.sorter ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        class: "aheart-table__sorter",
                        type: "button",
                        disabled: isDisabled.value,
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
                        }, null, 8, _hoisted_11)
                      ], 8, _hoisted_10)) : (openBlock(), createElementBlock("span", _hoisted_12, [
                        createVNode(unref(ARenderNode), {
                          node: column.title
                        }, null, 8, ["node"])
                      ])),
                      ((_a = column.filters) == null ? void 0 : _a.length) ? (openBlock(), createElementBlock("div", {
                        key: 2,
                        class: "aheart-table__filters",
                        "aria-label": `${column.title} filters`
                      }, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(column.filters, (filter) => {
                          return openBlock(), createElementBlock("button", {
                            key: String(filter.value),
                            class: normalizeClass(["aheart-table__filter-option", { "is-active": isFilterActive(column, filter.value) }]),
                            type: "button",
                            "aria-pressed": isFilterActive(column, filter.value),
                            disabled: isDisabled.value,
                            onClick: ($event) => toggleFilter(column, filter.value)
                          }, [
                            createVNode(unref(ARenderNode), {
                              node: filter.text
                            }, null, 8, ["node"])
                          ], 10, _hoisted_14);
                        }), 128))
                      ], 8, _hoisted_13)) : createCommentVNode("", true)
                    ])
                  ], 14, _hoisted_8);
                }), 128))
              ])
            ])) : createCommentVNode("", true),
            createElementVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(pagedRows.value, (row) => {
                return openBlock(), createElementBlock(Fragment, {
                  key: row.key
                }, [
                  createElementVNode("tr", {
                    class: normalizeClass({ "is-selected": isSelected(row.key) })
                  }, [
                    hasSelection.value ? (openBlock(), createElementBlock("td", _hoisted_15, [
                      createElementVNode("input", {
                        type: selectionType.value,
                        name: unref(radioName),
                        checked: isSelected(row.key),
                        disabled: isRowSelectionDisabled(row.record),
                        "aria-label": `Select row ${row.key}`,
                        onChange: ($event) => handleSelectionChange($event, row.record, row.key)
                      }, null, 40, _hoisted_16)
                    ])) : createCommentVNode("", true),
                    hasExpandable.value ? (openBlock(), createElementBlock("td", _hoisted_17, [
                      isRowExpandable(row.record) ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        class: "aheart-table__expand-button",
                        type: "button",
                        "aria-expanded": isExpanded(row.key),
                        disabled: isDisabled.value,
                        onClick: ($event) => toggleExpand(row.record, row.key)
                      }, toDisplayString(isExpanded(row.key) ? "−" : "+"), 9, _hoisted_18)) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedColumns.value, (column) => {
                      return openBlock(), createElementBlock("td", {
                        key: getColumnKey(column),
                        class: normalizeClass(columnCellClass(column)),
                        style: normalizeStyle(columnStyle(column))
                      }, [
                        createVNode(unref(ARenderNode), {
                          node: renderCell(column, row.record, row.index)
                        }, null, 8, ["node"])
                      ], 6);
                    }), 128))
                  ], 2),
                  hasExpandable.value && isExpanded(row.key) ? (openBlock(), createElementBlock("tr", _hoisted_19, [
                    createElementVNode("td", {
                      colspan: columnCount.value,
                      class: "aheart-table__expanded-cell"
                    }, [
                      createVNode(unref(ARenderNode), {
                        node: renderExpanded(row.record, row.index)
                      }, null, 8, ["node"])
                    ], 8, _hoisted_20)
                  ])) : createCommentVNode("", true)
                ], 64);
              }), 128)),
              !_ctx.loading && pagedRows.value.length === 0 ? (openBlock(), createElementBlock("tr", _hoisted_21, [
                createElementVNode("td", {
                  colspan: columnCount.value,
                  class: "aheart-table__empty"
                }, [
                  createVNode(unref(ARenderNode), { node: resolvedEmptyText.value }, null, 8, ["node"])
                ], 8, _hoisted_22)
              ])) : createCommentVNode("", true)
            ])
          ]),
          _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_23, [
            _cache[1] || (_cache[1] = createElementVNode("span", {
              class: "aheart-table__loading-dot",
              "aria-hidden": "true"
            }, null, -1)),
            createElementVNode("span", null, toDisplayString(resolvedLoadingText.value), 1)
          ])) : createCommentVNode("", true)
        ]),
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
          disabled: isDisabled.value,
          size: resolvedSize.value,
          onChange: handlePageChange
        }, null, 8, ["current", "page-size", "total", "simple", "hide-on-single-page", "show-total", "show-size-changer", "page-size-options", "show-quick-jumper", "total-boundary-show-size-changer", "disabled", "size"])) : createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
