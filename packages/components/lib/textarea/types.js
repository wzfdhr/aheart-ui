"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const textareaProps = {
  id: String,
  modelValue: String,
  placeholder: String,
  rows: {
    type: Number,
    default: 3
  },
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
  autoSize: [Boolean, Object]
};
const textareaEmits = {
  "update:modelValue": (value) => typeof value === "string",
  input: (value) => typeof value === "string",
  change: (value) => typeof value === "string",
  clear: () => true,
  pressEnter: (event) => event instanceof KeyboardEvent
};
exports.textareaEmits = textareaEmits;
exports.textareaProps = textareaProps;
