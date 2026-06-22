"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const inputNumberProps = {
  modelValue: Number,
  placeholder: String,
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  min: Number,
  max: Number,
  step: {
    type: Number,
    default: 1
  },
  controls: {
    type: Boolean,
    default: true
  }
};
const inputNumberEmits = {
  "update:modelValue": (value) => typeof value === "number" || value === void 0,
  change: (value) => typeof value === "number" || value === void 0
};
exports.inputNumberEmits = inputNumberEmits;
exports.inputNumberProps = inputNumberProps;
