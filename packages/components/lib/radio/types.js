"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const radioProps = {
  modelValue: Boolean,
  value: [String, Number, Boolean],
  disabled: {
    type: Boolean,
    default: void 0
  },
  label: String,
  name: String
};
const radioEmits = {
  "update:modelValue": (checked) => typeof checked === "boolean",
  change: (checked) => typeof checked === "boolean"
};
const radioGroupProps = {
  modelValue: [String, Number, Boolean],
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
  },
  optionType: {
    type: String,
    default: "default"
  },
  buttonStyle: {
    type: String,
    default: "outline"
  },
  size: String,
  block: Boolean
};
const radioGroupEmits = {
  "update:modelValue": (value) => typeof value === "string" || typeof value === "number" || typeof value === "boolean",
  change: (value) => typeof value === "string" || typeof value === "number" || typeof value === "boolean"
};
exports.radioEmits = radioEmits;
exports.radioGroupEmits = radioGroupEmits;
exports.radioGroupProps = radioGroupProps;
exports.radioProps = radioProps;
