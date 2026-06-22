"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const spaceProps = {
  size: [String, Number, Array],
  direction: {
    type: String,
    default: "horizontal"
  },
  orientation: String,
  vertical: Boolean,
  align: String,
  wrap: Boolean,
  separator: [String, Number, Object, Array, Function],
  split: [String, Number, Object, Array, Function],
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: [Object, Function],
  styles: [Object, Function]
};
exports.spaceProps = spaceProps;
