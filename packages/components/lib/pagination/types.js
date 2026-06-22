"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
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
  showTotal: Boolean
};
const paginationEmits = {
  "update:current": (current) => Number.isInteger(current),
  "update:pageSize": (pageSize) => Number.isInteger(pageSize),
  change: (current, pageSize) => Number.isInteger(current) && Number.isInteger(pageSize)
};
exports.paginationEmits = paginationEmits;
exports.paginationProps = paginationProps;
