"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const alertProps = {
  type: {
    type: String,
    default: "info"
  },
  message: String,
  description: String,
  showIcon: Boolean,
  closable: Boolean
};
const alertEmits = {
  close: (event) => event instanceof MouseEvent
};
exports.alertEmits = alertEmits;
exports.alertProps = alertProps;
