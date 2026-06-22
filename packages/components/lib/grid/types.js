"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const rowProps = {
  gutter: {
    type: [Number, Array, Object],
    default: 0
  },
  justify: String,
  align: String,
  wrap: {
    type: Boolean,
    default: true
  }
};
const colProps = {
  span: Number,
  offset: Number,
  order: Number,
  pull: Number,
  push: Number,
  flex: [String, Number],
  xs: [Number, Object],
  sm: [Number, Object],
  md: [Number, Object],
  lg: [Number, Object],
  xl: [Number, Object],
  xxl: [Number, Object]
};
exports.colProps = colProps;
exports.rowProps = rowProps;
