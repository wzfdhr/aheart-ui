"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const checkboxProps = {
  modelValue: Boolean,
  value: [String, Number, Boolean],
  name: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  indeterminate: Boolean,
  label: String
};
const checkboxEmits = {
  "update:modelValue": (checked) => typeof checked === "boolean",
  change: (checked) => typeof checked === "boolean"
};
const checkboxGroupProps = {
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  name: String,
  direction: {
    type: String,
    default: "horizontal"
  }
};
const checkboxGroupEmits = {
  "update:modelValue": (value) => Array.isArray(value),
  change: (value) => Array.isArray(value)
};
exports.checkboxEmits = checkboxEmits;
exports.checkboxGroupEmits = checkboxGroupEmits;
exports.checkboxGroupProps = checkboxGroupProps;
exports.checkboxProps = checkboxProps;
