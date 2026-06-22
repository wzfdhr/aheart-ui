"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const messageProps = {
  notices: {
    type: Array,
    default: () => []
  },
  top: {
    type: [Number, String],
    default: 8
  }
};
const messageEmits = {
  close: (key) => typeof key === "string"
};
exports.messageEmits = messageEmits;
exports.messageProps = messageProps;
