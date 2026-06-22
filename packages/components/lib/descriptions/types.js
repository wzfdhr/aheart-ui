"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const descriptionsProps = {
  title: String,
  extra: String,
  items: Array,
  bordered: Boolean,
  column: {
    type: Number,
    default: 3
  },
  layout: {
    type: String,
    default: "horizontal"
  },
  size: String
};
exports.descriptionsProps = descriptionsProps;
