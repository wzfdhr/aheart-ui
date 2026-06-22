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
  separator: String,
  split: String
};
exports.spaceProps = spaceProps;
