const paginationProps = {
  total: {
    type: Number,
    default: 0
  },
  current: Number,
  defaultCurrent: {
    type: Number,
    default: 1
  },
  pageSize: Number,
  defaultPageSize: {
    type: Number,
    default: 10
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  size: String,
  simple: Boolean,
  hideOnSinglePage: Boolean,
  showTotal: {
    type: [Boolean, Function],
    default: false
  },
  align: String,
  showLessItems: Boolean,
  showSizeChanger: Boolean,
  pageSizeOptions: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  showQuickJumper: Boolean,
  itemRender: Function,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const paginationEmits = {
  "update:current": (current) => Number.isInteger(current),
  "update:pageSize": (pageSize) => Number.isInteger(pageSize),
  change: (current, pageSize) => Number.isInteger(current) && Number.isInteger(pageSize),
  showSizeChange: (current, pageSize) => Number.isInteger(current) && Number.isInteger(pageSize)
};
export {
  paginationEmits,
  paginationProps
};
