"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const stepsProps = {
  items: Array,
  current: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: "process"
  },
  direction: {
    type: String,
    default: "horizontal"
  },
  orientation: String,
  size: String,
  type: {
    type: String,
    default: "default"
  },
  titlePlacement: {
    type: String,
    default: "horizontal"
  },
  initial: {
    type: Number,
    default: 1
  },
  percent: Number,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const stepsEmits = {
  change: (current) => Number.isInteger(current)
};
exports.stepsEmits = stepsEmits;
exports.stepsProps = stepsProps;
