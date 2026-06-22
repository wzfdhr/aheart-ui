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
  size: String,
  colon: {
    type: Boolean,
    default: true
  },
  labelStyle: [String, Object, Array],
  contentStyle: [String, Object, Array],
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  }
};
exports.descriptionsProps = descriptionsProps;
