"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const renderableProp = {
  type: [String, Number, Boolean, Object, Array, Function],
  default: void 0
};
const spinProps = {
  spinning: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: "middle"
  },
  description: renderableProp,
  tip: renderableProp,
  delay: Number,
  indicator: [String, Number, Object, Array, Function],
  percent: [Number, String],
  fullscreen: Boolean,
  wrapperClassName: String,
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
exports.spinProps = spinProps;
