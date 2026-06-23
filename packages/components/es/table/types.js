const tableProps = {
  columns: Array,
  dataSource: Array,
  rowKey: {
    type: [String, Function],
    default: "key"
  },
  bordered: Boolean,
  loading: Boolean,
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  pagination: {
    type: [Boolean, Object],
    default: void 0
  },
  rowSelection: Object,
  expandable: Object,
  showHeader: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: [String, Number, Boolean, Object, Array],
    default: void 0
  }
};
const tableEmits = {
  change: (_pagination, _filters, _sorter, _extra) => true,
  "update:selectedRowKeys": (keys) => Array.isArray(keys),
  select: (_key, _selected, _record, _selectedRowKeys) => true,
  expand: (_expanded, _record, _key) => true
};
export {
  tableEmits,
  tableProps
};
