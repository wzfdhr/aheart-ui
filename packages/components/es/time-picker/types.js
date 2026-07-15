import { floatingPlacements } from "../utils/floating.js";
const timePickerProps = {
  id: String,
  labelledBy: String,
  ariaLabelledby: String,
  modelValue: String,
  defaultValue: String,
  placeholder: String,
  disabled: { type: Boolean, default: void 0 },
  readOnly: Boolean,
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  format: { type: String, default: "HH:mm:ss" },
  valueFormat: { type: String, default: "HH:mm:ss" },
  use12Hours: Boolean,
  allowClear: { type: Boolean, default: true },
  open: { type: Boolean, default: void 0 },
  defaultOpen: Boolean,
  placement: {
    type: String,
    default: "bottomLeft",
    validator: (value) => floatingPlacements.includes(value)
  },
  autoAdjustOverflow: { type: Boolean, default: true },
  getPopupContainer: Function,
  showNow: { type: Boolean, default: true },
  needConfirm: Boolean,
  disabledTime: [Function, Object],
  hideDisabledOptions: Boolean,
  changeOnScroll: Boolean,
  size: String,
  status: String,
  variant: String,
  prefix: null,
  suffixIcon: [Object, Function],
  clearIcon: [Object, Function],
  renderExtraFooter: Function
};
const timePickerEmits = {
  "update:modelValue": (value) => value === void 0 || typeof value === "string",
  change: (value) => value === void 0 || typeof value === "string",
  openChange: (open) => typeof open === "boolean",
  clear: () => true,
  invalid: (input) => typeof input === "string"
};
const timeRangePickerProps = {
  ...timePickerProps,
  modelValue: Array,
  defaultValue: Array,
  placeholder: Array,
  disabledTime: [Function, Object],
  allowEmpty: { type: Array, default: () => [false, false] },
  order: { type: Boolean, default: true },
  separator: null,
  presets: Array,
  needConfirm: { type: Boolean, default: true }
};
const timeRangePickerEmits = {
  "update:modelValue": (value) => value === void 0 || Array.isArray(value),
  change: (value) => value === void 0 || Array.isArray(value),
  calendarChange: (value, info) => Array.isArray(value) && Boolean(info.range),
  openChange: (open) => typeof open === "boolean",
  clear: () => true,
  invalid: (input, part) => typeof input === "string" && (part === "start" || part === "end"),
  ok: (value) => value === void 0 || Array.isArray(value)
};
export {
  timePickerEmits,
  timePickerProps,
  timeRangePickerEmits,
  timeRangePickerProps
};
