"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const floating = require("../utils/floating.js");
const datePickerProps = {
  id: String,
  modelValue: [String, Array],
  defaultValue: [String, Array],
  picker: { type: String, default: "date" },
  multiple: Boolean,
  showTime: [Boolean, Object],
  needConfirm: { type: Boolean, default: void 0 },
  presets: Array,
  minDate: String,
  maxDate: String,
  disabledDate: Function,
  defaultPickerValue: String,
  pickerValue: String,
  format: [String, Array],
  valueFormat: String,
  placeholder: String,
  size: String,
  status: String,
  variant: String,
  prefix: null,
  suffixIcon: null,
  allowClear: { type: Boolean, default: true },
  disabled: { type: Boolean, default: void 0 },
  readOnly: Boolean,
  open: { type: Boolean, default: void 0 },
  defaultOpen: Boolean,
  placement: {
    type: String,
    default: "bottomLeft",
    validator: (value) => floating.floatingPlacements.includes(value)
  },
  autoAdjustOverflow: { type: Boolean, default: true },
  getPopupContainer: Function,
  locale: Object,
  cellRender: Function
};
const datePickerEmits = {
  "update:modelValue": (value) => value === void 0 || typeof value === "string" || Array.isArray(value),
  change: (value) => value === void 0 || typeof value === "string" || Array.isArray(value),
  openChange: (open) => typeof open === "boolean",
  panelChange: (value, mode) => typeof value === "string" && typeof mode === "string",
  ok: (value) => value === void 0 || typeof value === "string" || Array.isArray(value),
  clear: () => true,
  invalid: (input) => typeof input === "string"
};
const dateRangePickerProps = {
  id: String,
  modelValue: Array,
  defaultValue: Array,
  showTime: [Boolean, Object],
  needConfirm: { type: Boolean, default: void 0 },
  presets: Array,
  picker: { type: String, default: "date" },
  pickerValue: Array,
  defaultPickerValue: Array,
  allowEmpty: { type: Array, default: () => [false, false] },
  order: { type: Boolean, default: true },
  separator: null,
  minDate: String,
  maxDate: String,
  disabledDate: Function,
  format: [String, Array],
  valueFormat: String,
  placeholder: Array,
  size: String,
  status: String,
  variant: String,
  prefix: null,
  suffixIcon: null,
  allowClear: { type: Boolean, default: true },
  disabled: { type: Boolean, default: void 0 },
  readOnly: Boolean,
  open: { type: Boolean, default: void 0 },
  defaultOpen: Boolean,
  placement: {
    type: String,
    default: "bottomLeft",
    validator: (value) => floating.floatingPlacements.includes(value)
  },
  autoAdjustOverflow: { type: Boolean, default: true },
  getPopupContainer: Function,
  locale: Object,
  cellRender: Function
};
const dateRangePickerEmits = {
  "update:modelValue": (value) => value === void 0 || Array.isArray(value),
  change: (value) => value === void 0 || Array.isArray(value),
  openChange: (open) => typeof open === "boolean",
  panelChange: (value, mode) => Array.isArray(value) && typeof mode === "string",
  calendarChange: (value, info) => (value === void 0 || Array.isArray(value)) && Boolean(info == null ? void 0 : info.range),
  ok: (value) => value === void 0 || Array.isArray(value),
  clear: () => true,
  invalid: (input, part) => typeof input === "string" && Boolean(part)
};
exports.datePickerEmits = datePickerEmits;
exports.datePickerProps = datePickerProps;
exports.dateRangePickerEmits = dateRangePickerEmits;
exports.dateRangePickerProps = dateRangePickerProps;
