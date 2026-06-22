"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const inputProps = {
  id: String,
  modelValue: String,
  placeholder: String,
  prefix: String,
  suffix: String,
  addonBefore: String,
  addonAfter: String,
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  readOnly: Boolean,
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
  maxlength: Number,
  showCount: Boolean,
  type: {
    type: String,
    default: "text"
  }
};
const inputEmits = {
  "update:modelValue": (value) => typeof value === "string",
  input: (value) => typeof value === "string",
  change: (value) => typeof value === "string",
  clear: () => true,
  pressEnter: (event) => event instanceof KeyboardEvent
};
exports.inputEmits = inputEmits;
exports.inputProps = inputProps;
