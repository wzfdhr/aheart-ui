"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const checkboxProps = {
  modelValue: Boolean,
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
exports.checkboxEmits = checkboxEmits;
exports.checkboxProps = checkboxProps;
