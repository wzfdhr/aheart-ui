"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const buttonTypes = ["default", "primary", "dashed", "link", "text", "success", "warning", "danger"];
const buttonSizes = ["large", "normal", "middle", "small", "mini"];
const nativeButtonTypes = ["button", "submit", "reset"];
const buttonShapes = ["default", "circle", "round"];
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
  htmlType: {
    type: String,
    validator: (value) => nativeButtonTypes.includes(value)
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  loading: Boolean,
  block: Boolean,
  round: Boolean,
  danger: Boolean,
  ghost: Boolean,
  shape: {
    type: String,
    default: "default",
    validator: (value) => buttonShapes.includes(value)
  },
  href: String,
  target: String
};
const buttonEmits = {
  click: (event) => event instanceof MouseEvent
};
exports.buttonEmits = buttonEmits;
exports.buttonProps = buttonProps;
exports.buttonShapes = buttonShapes;
exports.buttonSizes = buttonSizes;
exports.buttonTypes = buttonTypes;
exports.nativeButtonTypes = nativeButtonTypes;
