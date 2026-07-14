"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const floating = require("../utils/floating.js");
const selectProps = {
  id: String,
  labelledBy: String,
  ariaLabelledby: String,
  name: String,
  modelValue: [String, Number, Array],
  defaultValue: [String, Number, Array],
  options: Array,
  placeholder: String,
  prefix: [String, Number, Object, Array, Function],
  suffixIcon: [String, Number, Object, Array, Function],
  loadingIcon: [String, Number, Object, Array, Function],
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  status: String,
  variant: {
    type: String,
    default: void 0
  },
  bordered: {
    type: Boolean,
    default: void 0
  },
  allowClear: {
    type: [Boolean, Object],
    default: false
  },
  mode: String,
  open: {
    type: Boolean,
    default: void 0
  },
  defaultOpen: Boolean,
  placement: {
    type: String,
    default: "bottomLeft",
    validator: (value) => floating.floatingPlacements.includes(value)
  },
  autoAdjustOverflow: {
    type: Boolean,
    default: true
  },
  getPopupContainer: Function,
  popupMatchSelectWidth: {
    type: [Boolean, Number],
    default: true
  },
  showSearch: Boolean,
  searchValue: String,
  optionFilterProp: {
    type: String,
    default: "label"
  },
  filterOption: {
    type: [Boolean, Function],
    default: void 0
  },
  filterSort: Function,
  fieldNames: Object,
  notFoundContent: {
    type: String,
    default: "Not Found"
  },
  maxCount: Number,
  maxTagCount: Number,
  optionRender: Function,
  tagRender: Function,
  loading: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  }
};
const selectEmits = {
  "update:modelValue": (value) => typeof value === "string" || typeof value === "number" || Array.isArray(value),
  change: (value) => typeof value === "string" || typeof value === "number" || Array.isArray(value),
  clear: () => true,
  search: (value) => typeof value === "string",
  focus: (event) => event instanceof FocusEvent,
  blur: (event) => event instanceof FocusEvent,
  openChange: (open) => typeof open === "boolean"
};
exports.selectEmits = selectEmits;
exports.selectProps = selectProps;
