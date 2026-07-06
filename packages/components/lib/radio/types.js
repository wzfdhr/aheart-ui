"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const radioProps = {
  modelValue: {
    type: Boolean,
    default: void 0
  },
  checked: {
    type: Boolean,
    default: void 0
  },
  defaultChecked: {
    type: Boolean,
    default: void 0
  },
  value: {
    type: [String, Number, Boolean],
    default: void 0
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  autoFocus: Boolean,
  label: String,
  name: String,
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const radioEmits = {
  "update:modelValue": (checked) => typeof checked === "boolean",
  "update:checked": (checked) => typeof checked === "boolean",
  change: (checked, event) => typeof checked === "boolean" && event instanceof Event
};
const radioGroupProps = {
  modelValue: {
    type: [String, Number, Boolean],
    default: void 0
  },
  value: {
    type: [String, Number, Boolean],
    default: void 0
  },
  defaultValue: {
    type: [String, Number, Boolean],
    default: void 0
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
  },
  orientation: String,
  vertical: Boolean,
  optionType: {
    type: String,
    default: "default"
  },
  buttonStyle: {
    type: String,
    default: "outline"
  },
  size: String,
  block: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array]
};
const radioGroupEmits = {
  "update:modelValue": (value) => typeof value === "string" || typeof value === "number" || typeof value === "boolean",
  "update:value": (value) => typeof value === "string" || typeof value === "number" || typeof value === "boolean",
  change: (value) => typeof value === "string" || typeof value === "number" || typeof value === "boolean"
};
exports.radioEmits = radioEmits;
exports.radioGroupEmits = radioGroupEmits;
exports.radioGroupProps = radioGroupProps;
exports.radioProps = radioProps;
