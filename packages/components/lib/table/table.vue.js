"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../pagination/index.js");
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
const _hoisted_5 = {
  key: 1,
  class: "aheart-table__expand-cell",
  scope: "col"
};
const _hoisted_6 = ["aria-sort"];
const _hoisted_7 = { class: "aheart-table__head-content" };
const _hoisted_8 = ["disabled", "aria-label", "onClick"];
const _hoisted_9 = ["data-sort"];
const _hoisted_10 = {
  key: 1,
  class: "aheart-table__title"
};
const _hoisted_11 = ["aria-label"];
const _hoisted_12 = ["aria-pressed", "disabled", "onClick"];
const _hoisted_13 = {
  key: 0,
  class: "aheart-table__selection-cell"
};
const _hoisted_14 = ["type", "name", "checked", "disabled", "aria-label", "onChange"];
const _hoisted_15 = {
  key: 1,
  class: "aheart-table__expand-cell"
};
const _hoisted_16 = ["aria-expanded", "disabled", "onClick"];
const _hoisted_17 = {
  key: 0,
  class: "aheart-table__expanded-row"
};
const _hoisted_18 = ["colspan"];
const _hoisted_19 = { key: 0 };
const _hoisted_20 = ["colspan"];
const _hoisted_21 = {
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
      },
      onChange: (keys) => emit("update:selectedRowKeys", keys ?? [])
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
      onChange: (keys) => emit("update:expandedRowKeys", keys ?? [])
    });
    const currentState = useControllableState.useControllableState({
      controlled: () => props.pagination && typeof props.pagination === "object" ? props.pagination.current : void 0,
      isControlled: () => Boolean(props.pagination && typeof props.pagination === "object" && hasOwn(props.pagination, "current")),
      defaultValue: () => props.pagination && typeof props.pagination === "object" ? props.pagination.defaultCurrent ?? props.pagination.current ?? 1 : 1
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
    const pageSize = vue.computed(() => {
      const value = paginationConfig.value.pageSize ?? paginationConfig.value.defaultPageSize ?? 10;
      return Number.isFinite(value) && value > 0 ? Math.max(1, Math.trunc(value)) : 1;
    });
    const rawCurrentPage = vue.computed(() => currentState.state.value ?? 1);
    const paginationTotal = vue.computed(() => paginationConfig.value.total ?? sortedData.value.length);
    const pageCount = vue.computed(() => Math.max(1, Math.ceil(Math.max(0, paginationTotal.value) / pageSize.value)));
    const currentPage = vue.computed(() => Math.min(Math.max(rawCurrentPage.value, 1), pageCount.value));
    const shouldShowPagination = vue.computed(() => props.pagination !== false && (props.pagination !== void 0 || sortedData.value.length > pageSize.value));
    const columnCount = vue.computed(() => normalizedColumns.value.length + (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0));
    const controlledSort = vue.computed(() => {
      const column = normalizedColumns.value.find((currentColumn) => currentColumn.sortOrder !== void 0);
      if (!column) {
        return void 0;
      }
      return {
        columnKey: getColumnKey(column),
        order: column.sortOrder
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
      if (paginationConfig.value.total !== void 0) {
        return allRows.value;
      }
      const start = (currentPage.value - 1) * pageSize.value;
      return allRows.value.slice(start, start + pageSize.value);
    });
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
    vue.watch(pageCount, (count) => {
      if (!currentState.isControlled.value && (currentState.state.value ?? 1) > count) {
        currentState.setState(count);
      }
    });
    function getColumnKey(column) {
      return column.key ?? String(Array.isArray(column.dataIndex) ? column.dataIndex.join(".") : column.dataIndex ?? column.title);
    }
    function hasRenderableContent(value) {
      return value !== void 0 && value !== null && value !== false && value !== "";
    }
    function getRowKey(record, index2) {
      if (typeof props.rowKey === "function") {
        return props.rowKey(record);
      }
      const key = record[props.rowKey];
      return typeof key === "string" || typeof key === "number" ? key : index2;
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
      if (column.sortOrder === void 0) {
        innerSort.value = nextSort;
      }
      resetInnerCurrent();
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
      resetInnerCurrent();
      emitTableChange("filter", 1, pageSize.value, nextFilters, activeSort.value);
    };
    const resetInnerCurrent = () => {
      currentState.setState(1);
    };
    const isSelected = (key) => selectedKeys.value.includes(key);
    const toggleSelection = (record, key, checked) => {
      if (isSelectionDisabled.value) {
        return;
      }
      const nextKeys = selectionType.value === "radio" ? checked ? [key] : [] : checked ? Array.from(/* @__PURE__ */ new Set([...selectedKeys.value, key])) : selectedKeys.value.filter((currentKey) => currentKey !== key);
      selectedState.setState(nextKeys);
      emit("select", key, checked, record, nextKeys);
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
      currentState.setState(current);
      emitTableChange("paginate", current, nextPageSize, activeFilters.value, activeSort.value);
    };
    const emitTableChange = (action, current, nextPageSize, filters, sortState) => {
      const normalizedFilters = getNormalizedFilters(filters);
      const currentDataSource = getSortedRecords(normalizedFilters, sortState);
      const activeColumn = normalizedColumns.value.find((column) => getColumnKey(column) === sortState.columnKey);
      emit(
        "change",
        { current, pageSize: nextPageSize, total: paginationConfig.value.total ?? currentDataSource.length },
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
      if (input && ((_a = props.rowSelection) == null ? void 0 : _a.selectedRowKeys) !== void 0) {
        input.checked = isSelected(key);
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
                hasSelection.value ? (vue.openBlock(), vue.createElementBlock("th", _hoisted_4, [..._cache[0] || (_cache[0] = [
                  vue.createElementVNode("span", {
                    class: "aheart-table__selection-title",
                    "aria-hidden": "true"
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                hasExpandable.value ? (vue.openBlock(), vue.createElementBlock("th", _hoisted_5, [..._cache[1] || (_cache[1] = [
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
                    vue.createElementVNode("div", _hoisted_7, [
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
                        }, null, 8, _hoisted_9)
                      ], 8, _hoisted_8)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_10, [
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
                          ], 10, _hoisted_12);
                        }), 128))
                      ], 8, _hoisted_11)) : vue.createCommentVNode("", true)
                    ])
                  ], 14, _hoisted_6);
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
                    hasSelection.value ? (vue.openBlock(), vue.createElementBlock("td", _hoisted_13, [
                      vue.createElementVNode("input", {
                        type: selectionType.value,
                        name: vue.unref(radioName),
                        checked: isSelected(row.key),
                        disabled: isSelectionDisabled.value,
                        "aria-label": `Select row ${row.key}`,
                        onChange: ($event) => handleSelectionChange($event, row.record, row.key)
                      }, null, 40, _hoisted_14)
                    ])) : vue.createCommentVNode("", true),
                    hasExpandable.value ? (vue.openBlock(), vue.createElementBlock("td", _hoisted_15, [
                      isRowExpandable(row.record) ? (vue.openBlock(), vue.createElementBlock("button", {
                        key: 0,
                        class: "aheart-table__expand-button",
                        type: "button",
                        "aria-expanded": isExpanded(row.key),
                        disabled: isDisabled.value,
                        onClick: ($event) => toggleExpand(row.record, row.key)
                      }, vue.toDisplayString(isExpanded(row.key) ? "−" : "+"), 9, _hoisted_16)) : vue.createCommentVNode("", true)
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
                  hasExpandable.value && isExpanded(row.key) ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_17, [
                    vue.createElementVNode("td", {
                      colspan: columnCount.value,
                      class: "aheart-table__expanded-cell"
                    }, [
                      vue.createVNode(vue.unref(ARenderNode), {
                        node: renderExpanded(row.record, row.index)
                      }, null, 8, ["node"])
                    ], 8, _hoisted_18)
                  ])) : vue.createCommentVNode("", true)
                ], 64);
              }), 128)),
              !_ctx.loading && pagedRows.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_19, [
                vue.createElementVNode("td", {
                  colspan: columnCount.value,
                  class: "aheart-table__empty"
                }, [
                  vue.createVNode(vue.unref(ARenderNode), { node: resolvedEmptyText.value }, null, 8, ["node"])
                ], 8, _hoisted_20)
              ])) : vue.createCommentVNode("", true)
            ])
          ]),
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_21, [
            _cache[2] || (_cache[2] = vue.createElementVNode("span", {
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
          disabled: isDisabled.value,
          size: resolvedSize.value,
          onChange: handlePageChange
        }, null, 8, ["current", "page-size", "total", "simple", "hide-on-single-page", "show-total", "disabled", "size"])) : vue.createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
