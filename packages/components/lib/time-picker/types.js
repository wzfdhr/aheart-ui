"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const floating = require("../utils/floating.js");
const timePickerProps = {
  id: String,
  labelledBy: String,
  ariaLabelledby: String,
  modelValue: String,
  defaultValue: String,
  placeholder: { type: String, default: "Select time" },
  disabled: Boolean,
  readOnly: Boolean,
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  format: { type: String, default: "HH:mm" },
  use12Hours: Boolean,
  allowClear: { type: Boolean, default: true },
  open: { type: Boolean, default: void 0 },
  defaultOpen: Boolean,
  placement: {
    type: String,
    default: "bottomLeft",
    validator: (value) => floating.floatingPlacements.includes(value)
  },
  autoAdjustOverflow: { type: Boolean, default: true },
  getPopupContainer: Function,
  showNow: { type: Boolean, default: true },
  needConfirm: Boolean,
  disabledTime: [Function, Object]
};
const timePickerEmits = {
  "update:modelValue": (value) => value === void 0 || typeof value === "string",
  change: (value) => value === void 0 || typeof value === "string",
  openChange: (open) => typeof open === "boolean",
  clear: () => true
};
exports.timePickerEmits = timePickerEmits;
exports.timePickerProps = timePickerProps;
