"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const floating = require("../utils/floating.js");
const popconfirmProps = {
  title: String,
  description: String,
  placement: {
    type: String,
    default: "top",
    validator: (value) => floating.floatingPlacements.includes(value)
  },
  trigger: {
    type: [String, Array],
    default: "click",
    validator: floating.isFloatingTriggerProp
  },
  open: {
    type: Boolean,
    default: void 0
  },
  defaultOpen: Boolean,
  okText: {
    type: String,
    default: "OK"
  },
  cancelText: {
    type: String,
    default: "Cancel"
  },
  okType: {
    type: String,
    default: "primary"
  },
  disabled: Boolean,
  showCancel: {
    type: Boolean,
    default: true
  },
  arrow: {
    type: Boolean,
    default: true
  },
  zIndex: Number
};
const popconfirmEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open) => typeof open === "boolean",
  confirm: () => true,
  cancel: () => true
};
exports.popconfirmEmits = popconfirmEmits;
exports.popconfirmProps = popconfirmProps;
