"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const switchProps = {
  modelValue: {
    type: Boolean,
    default: void 0
  },
  checked: {
    type: Boolean,
    default: void 0
  },
  value: {
    type: Boolean,
    default: void 0
  },
  defaultChecked: {
    type: Boolean,
    default: void 0
  },
  defaultValue: {
    type: Boolean,
    default: void 0
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  loading: Boolean,
  size: String,
  checkedChildren: String,
  unCheckedChildren: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const switchEmits = {
  "update:modelValue": (checked) => typeof checked === "boolean",
  "update:checked": (checked) => typeof checked === "boolean",
  "update:value": (checked) => typeof checked === "boolean",
  change: (checked, event) => typeof checked === "boolean" && event instanceof MouseEvent,
  click: (checked, event) => typeof checked === "boolean" && event instanceof MouseEvent
};
exports.switchEmits = switchEmits;
exports.switchProps = switchProps;
