"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const tagProps = {
  color: {
    type: String,
    default: "default"
  },
  closable: Boolean
};
const tagEmits = {
  close: (event) => event instanceof MouseEvent
};
exports.tagEmits = tagEmits;
exports.tagProps = tagProps;
