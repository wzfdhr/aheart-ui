"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const selectProps = {
  id: String,
  name: String,
  modelValue: [String, Number, Array],
  options: Array,
  placeholder: String,
  prefix: String,
  suffixIcon: String,
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
  allowClear: Boolean,
  mode: String,
  showSearch: Boolean,
  searchValue: String,
  filterOption: {
    type: [Boolean, Function],
    default: void 0
  },
  notFoundContent: {
    type: String,
    default: "Not Found"
  },
  maxCount: Number
};
const selectEmits = {
  "update:modelValue": (value) => typeof value === "string" || typeof value === "number" || Array.isArray(value),
  change: (value) => typeof value === "string" || typeof value === "number" || Array.isArray(value),
  clear: () => true,
  search: (value) => typeof value === "string"
};
exports.selectEmits = selectEmits;
exports.selectProps = selectProps;
