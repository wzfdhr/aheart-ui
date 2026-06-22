"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const index = require("../pagination/index.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-table__container" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = {
  key: 0,
  class: "aheart-table__selection-cell",
  scope: "col"
};
const _hoisted_4 = {
  key: 1,
  class: "aheart-table__expand-cell",
  scope: "col"
};
const _hoisted_5 = ["disabled", "onClick"];
const _hoisted_6 = ["data-sort"];
const _hoisted_7 = { key: 1 };
const _hoisted_8 = {
  key: 0,
  class: "aheart-table__selection-cell"
};
const _hoisted_9 = ["type", "checked", "disabled", "aria-label", "onChange"];
const _hoisted_10 = {
  key: 1,
  class: "aheart-table__expand-cell"
};
const _hoisted_11 = ["aria-expanded", "disabled", "onClick"];
const _hoisted_12 = {
  key: 0,
  class: "aheart-table__expanded-row"
};
const _hoisted_13 = ["colspan"];
const _hoisted_14 = { key: 0 };
const _hoisted_15 = ["colspan"];
const _hoisted_16 = {
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
    var _a, _b;
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const innerSelectedRowKeys = vue.ref(((_a = props.rowSelection) == null ? void 0 : _a.defaultSelectedRowKeys) ?? []);
    const innerExpandedRowKeys = vue.ref(((_b = props.expandable) == null ? void 0 : _b.defaultExpandedRowKeys) ?? []);
    const innerCurrent = vue.ref(props.pagination && typeof props.pagination === "object" ? props.pagination.defaultCurrent ?? props.pagination.current ?? 1 : 1);
    const innerSort = vue.ref({});
    const radioName = `aheart-table-selection-${Math.random().toString(36).slice(2)}`;
    const normalizedColumns = vue.computed(() => props.columns ?? []);
    const normalizedData = vue.computed(() => props.dataSource ?? []);
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const hasSelection = vue.computed(() => Boolean(props.rowSelection));
    const hasExpandable = vue.computed(() => {
      var _a2;
      return Boolean((_a2 = props.expandable) == null ? void 0 : _a2.expandedRowRender);
    });
    const selectionType = vue.computed(() => {
      var _a2;
      return ((_a2 = props.rowSelection) == null ? void 0 : _a2.type) ?? "checkbox";
    });
    const isSelectionDisabled = vue.computed(() => {
      var _a2;
      return isDisabled.value || Boolean((_a2 = props.rowSelection) == null ? void 0 : _a2.disabled);
    });
    const selectedKeys = vue.computed(() => {
      var _a2;
      return ((_a2 = props.rowSelection) == null ? void 0 : _a2.selectedRowKeys) ?? innerSelectedRowKeys.value;
    });
    const expandedKeys = vue.computed(() => {
      var _a2;
      return ((_a2 = props.expandable) == null ? void 0 : _a2.expandedRowKeys) ?? innerExpandedRowKeys.value;
    });
    const resolvedEmptyText = vue.computed(() => {
      var _a2, _b2;
      return props.emptyText || ((_b2 = (_a2 = config.value.locale) == null ? void 0 : _a2.empty) == null ? void 0 : _b2.description) || "No Data";
    });
    const paginationConfig = vue.computed(() => props.pagination && typeof props.pagination === "object" ? props.pagination : {});
    const pageSize = vue.computed(() => paginationConfig.value.pageSize ?? paginationConfig.value.defaultPageSize ?? 10);
    const currentPage = vue.computed(() => paginationConfig.value.current ?? innerCurrent.value);
    const paginationTotal = vue.computed(() => paginationConfig.value.total ?? sortedData.value.length);
    const shouldShowPagination = vue.computed(() => props.pagination !== false && (props.pagination !== void 0 || sortedData.value.length > pageSize.value));
    const columnCount = vue.computed(() => normalizedColumns.value.length + (hasSelection.value ? 1 : 0) + (hasExpandable.value ? 1 : 0));
    const tableClass = vue.computed(() => [
      `aheart-table--${resolvedSize.value}`,
      {
        "is-bordered": props.bordered,
        "is-loading": props.loading,
        "is-disabled": isDisabled.value
      }
    ]);
    const sortedData = vue.computed(() => {
      const activeColumn = normalizedColumns.value.find((column) => getColumnKey(column) === innerSort.value.columnKey);
      if (!activeColumn || !innerSort.value.order || typeof activeColumn.sorter !== "function") {
        return normalizedData.value;
      }
      const sorter = activeColumn.sorter;
      const direction = innerSort.value.order === "ascend" ? 1 : -1;
      return [...normalizedData.value].sort((a, b) => sorter(a, b) * direction);
    });
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
      const start = (currentPage.value - 1) * pageSize.value;
      return allRows.value.slice(start, start + pageSize.value);
    });
    vue.watch(
      () => {
        var _a2;
        return (_a2 = props.rowSelection) == null ? void 0 : _a2.defaultSelectedRowKeys;
      },
      (keys) => {
        var _a2;
        if (!((_a2 = props.rowSelection) == null ? void 0 : _a2.selectedRowKeys) && keys) {
          innerSelectedRowKeys.value = keys;
        }
      }
    );
    const getColumnKey = (column) => {
      return column.key ?? String(Array.isArray(column.dataIndex) ? column.dataIndex.join(".") : column.dataIndex ?? column.title);
    };
    const getRowKey = (record, index2) => {
      if (typeof props.rowKey === "function") {
        return props.rowKey(record);
      }
      const key = record[props.rowKey];
      return typeof key === "string" || typeof key === "number" ? key : index2;
    };
    const getValueByDataIndex = (record, dataIndex) => {
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
    };
    const renderCell = (column, record, index2) => {
      const text = getValueByDataIndex(record, column.dataIndex);
      if (column.customRender) {
        return column.customRender({ text, record, index: index2, column });
      }
      return text ?? "";
    };
    const renderExpanded = (record, index2) => {
      var _a2, _b2;
      return ((_b2 = (_a2 = props.expandable) == null ? void 0 : _a2.expandedRowRender) == null ? void 0 : _b2.call(_a2, record, index2)) ?? "";
    };
    const columnStyle = (column) => ({
      width: typeof column.width === "number" ? `${column.width}px` : column.width
    });
    const columnClass = (column) => [
      column.className,
      column.align ? `aheart-table__cell--${column.align}` : void 0,
      {
        "is-sortable": Boolean(column.sorter),
        "is-ellipsis": column.ellipsis
      }
    ];
    const columnCellClass = (column) => [
      column.className,
      column.align ? `aheart-table__cell--${column.align}` : void 0,
      {
        "is-ellipsis": column.ellipsis
      }
    ];
    const getSortState = (column) => {
      const key = getColumnKey(column);
      if (innerSort.value.columnKey !== key || !innerSort.value.order) {
        return "none";
      }
      return innerSort.value.order;
    };
    const toggleSort = (column) => {
      if (isDisabled.value) {
        return;
      }
      const key = getColumnKey(column);
      const currentOrder = innerSort.value.columnKey === key ? innerSort.value.order : void 0;
      const nextOrder = currentOrder === void 0 ? "ascend" : currentOrder === "ascend" ? "descend" : void 0;
      innerSort.value = { columnKey: nextOrder ? key : void 0, order: nextOrder };
      emitTableChange(currentPage.value, pageSize.value);
    };
    const isSelected = (key) => selectedKeys.value.includes(key);
    const toggleSelection = (record, key, checked) => {
      var _a2;
      if (isSelectionDisabled.value) {
        return;
      }
      const nextKeys = selectionType.value === "radio" ? checked ? [key] : [] : checked ? Array.from(/* @__PURE__ */ new Set([...selectedKeys.value, key])) : selectedKeys.value.filter((currentKey) => currentKey !== key);
      if (!((_a2 = props.rowSelection) == null ? void 0 : _a2.selectedRowKeys)) {
        innerSelectedRowKeys.value = nextKeys;
      }
      emit("update:selectedRowKeys", nextKeys);
      emit("select", key, checked, record, nextKeys);
    };
    const isRowExpandable = (record) => {
      var _a2, _b2;
      return ((_b2 = (_a2 = props.expandable) == null ? void 0 : _a2.rowExpandable) == null ? void 0 : _b2.call(_a2, record)) ?? true;
    };
    const isExpanded = (key) => expandedKeys.value.includes(key);
    const toggleExpand = (record, key) => {
      var _a2;
      if (isDisabled.value) {
        return;
      }
      const nextExpanded = !isExpanded(key);
      const nextKeys = nextExpanded ? [...expandedKeys.value, key] : expandedKeys.value.filter((currentKey) => currentKey !== key);
      if (!((_a2 = props.expandable) == null ? void 0 : _a2.expandedRowKeys)) {
        innerExpandedRowKeys.value = nextKeys;
      }
      emit("expand", nextExpanded, record, key);
    };
    const handlePageChange = (current, nextPageSize) => {
      innerCurrent.value = current;
      emitTableChange(current, nextPageSize);
    };
    const emitTableChange = (current, nextPageSize) => {
      const activeColumn = normalizedColumns.value.find((column) => getColumnKey(column) === innerSort.value.columnKey);
      emit(
        "change",
        { current, pageSize: nextPageSize, total: paginationTotal.value },
        {},
        {
          column: activeColumn,
          columnKey: innerSort.value.columnKey,
          field: activeColumn == null ? void 0 : activeColumn.dataIndex,
          order: innerSort.value.order
        }
      );
    };
    const getEventChecked = (event) => {
      var _a2;
      return Boolean((_a2 = event.target) == null ? void 0 : _a2.checked);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", {
        class: vue.normalizeClass(["aheart-table", tableClass.value])
      }, [
        vue.createElementVNode("div", _hoisted_1, [
          vue.createElementVNode("table", null, [
            _ctx.showHeader ? (vue.openBlock(), vue.createElementBlock("thead", _hoisted_2, [
              vue.createElementVNode("tr", null, [
                hasSelection.value ? (vue.openBlock(), vue.createElementBlock("th", _hoisted_3, [..._cache[0] || (_cache[0] = [
                  vue.createElementVNode("span", {
                    class: "aheart-table__selection-title",
                    "aria-hidden": "true"
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                hasExpandable.value ? (vue.openBlock(), vue.createElementBlock("th", _hoisted_4, [..._cache[1] || (_cache[1] = [
                  vue.createElementVNode("span", {
                    class: "aheart-table__expand-title",
                    "aria-hidden": "true"
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedColumns.value, (column) => {
                  return vue.openBlock(), vue.createElementBlock("th", {
                    key: getColumnKey(column),
                    class: vue.normalizeClass(columnClass(column)),
                    style: vue.normalizeStyle(columnStyle(column)),
                    scope: "col"
                  }, [
                    column.sorter ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      class: "aheart-table__sorter",
                      type: "button",
                      disabled: isDisabled.value,
                      onClick: ($event) => toggleSort(column)
                    }, [
                      vue.createElementVNode("span", null, vue.toDisplayString(column.title), 1),
                      vue.createElementVNode("span", {
                        class: "aheart-table__sort-icon",
                        "data-sort": getSortState(column),
                        "aria-hidden": "true"
                      }, null, 8, _hoisted_6)
                    ], 8, _hoisted_5)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_7, vue.toDisplayString(column.title), 1))
                  ], 6);
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
                    hasSelection.value ? (vue.openBlock(), vue.createElementBlock("td", _hoisted_8, [
                      vue.createElementVNode("input", {
                        type: selectionType.value,
                        name: radioName,
                        checked: isSelected(row.key),
                        disabled: isSelectionDisabled.value,
                        "aria-label": `Select row ${row.key}`,
                        onChange: ($event) => toggleSelection(row.record, row.key, getEventChecked($event))
                      }, null, 40, _hoisted_9)
                    ])) : vue.createCommentVNode("", true),
                    hasExpandable.value ? (vue.openBlock(), vue.createElementBlock("td", _hoisted_10, [
                      isRowExpandable(row.record) ? (vue.openBlock(), vue.createElementBlock("button", {
                        key: 0,
                        class: "aheart-table__expand-button",
                        type: "button",
                        "aria-expanded": isExpanded(row.key),
                        disabled: isDisabled.value,
                        onClick: ($event) => toggleExpand(row.record, row.key)
                      }, vue.toDisplayString(isExpanded(row.key) ? "−" : "+"), 9, _hoisted_11)) : vue.createCommentVNode("", true)
                    ])) : vue.createCommentVNode("", true),
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedColumns.value, (column) => {
                      return vue.openBlock(), vue.createElementBlock("td", {
                        key: getColumnKey(column),
                        class: vue.normalizeClass(columnCellClass(column)),
                        style: vue.normalizeStyle(columnStyle(column))
                      }, vue.toDisplayString(renderCell(column, row.record, row.index)), 7);
                    }), 128))
                  ], 2),
                  hasExpandable.value && isExpanded(row.key) ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_12, [
                    vue.createElementVNode("td", {
                      colspan: columnCount.value,
                      class: "aheart-table__expanded-cell"
                    }, vue.toDisplayString(renderExpanded(row.record, row.index)), 9, _hoisted_13)
                  ])) : vue.createCommentVNode("", true)
                ], 64);
              }), 128)),
              !_ctx.loading && pagedRows.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_14, [
                vue.createElementVNode("td", {
                  colspan: columnCount.value,
                  class: "aheart-table__empty"
                }, vue.toDisplayString(resolvedEmptyText.value), 9, _hoisted_15)
              ])) : vue.createCommentVNode("", true)
            ])
          ]),
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_16, [..._cache[2] || (_cache[2] = [
            vue.createElementVNode("span", {
              class: "aheart-table__loading-dot",
              "aria-hidden": "true"
            }, null, -1),
            vue.createElementVNode("span", null, "Loading", -1)
          ])])) : vue.createCommentVNode("", true)
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
      ], 2);
    };
  }
});
exports.default = _sfc_main;
