"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const selectProps = {
  modelValue: [String, Array],
  options: Array,
  placeholder: String,
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  status: String,
  allowClear: Boolean,
  mode: String
};
const selectEmits = {
  "update:modelValue": (value) => typeof value === "string" || Array.isArray(value),
  change: (value) => typeof value === "string" || Array.isArray(value),
  clear: () => true
};
exports.selectEmits = selectEmits;
exports.selectProps = selectProps;
