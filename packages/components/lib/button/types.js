"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const buttonTypes = ["default", "primary", "success", "warning", "danger"];
const buttonSizes = ["large", "normal", "middle", "small", "mini"];
const nativeButtonTypes = ["button", "submit", "reset"];
const buttonProps = {
  type: {
    type: String,
    default: "default",
    validator: (value) => buttonTypes.includes(value)
  },
  size: {
    type: String,
    validator: (value) => buttonSizes.includes(value)
  },
  nativeType: {
    type: String,
    default: "button",
    validator: (value) => nativeButtonTypes.includes(value)
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  loading: Boolean,
  block: Boolean,
  round: Boolean
};
exports.buttonProps = buttonProps;
exports.buttonSizes = buttonSizes;
exports.buttonTypes = buttonTypes;
exports.nativeButtonTypes = nativeButtonTypes;
