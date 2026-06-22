"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const tagProps = {
  color: {
    type: String,
    default: "default"
  },
  variant: {
    type: String,
    default: void 0
  },
  bordered: {
    type: Boolean,
    default: void 0
  },
  closable: Boolean,
  closeIcon: {
    type: [String, Number, Boolean, Object, Array, Function],
    default: void 0
  },
  icon: [String, Number, Object, Array, Function],
  disabled: {
    type: Boolean,
    default: void 0
  },
  href: String,
  target: String,
  rel: String,
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  }
};
const tagEmits = {
  close: (event) => event instanceof MouseEvent
};
const checkableTagProps = {
  checked: Boolean,
  disabled: {
    type: Boolean,
    default: void 0
  },
  icon: [String, Number, Object, Array, Function],
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  }
};
const checkableTagEmits = {
  "update:checked": (checked) => typeof checked === "boolean",
  change: (checked, event) => typeof checked === "boolean" && event instanceof MouseEvent
};
const tagGroupProps = {
  modelValue: {
    type: [String, Number, Array],
    default: void 0
  },
  value: {
    type: [String, Number, Array],
    default: void 0
  },
  defaultValue: {
    type: [String, Number, Array],
    default: void 0
  },
  options: {
    type: Array,
    default: () => []
  },
  multiple: Boolean,
  disabled: {
    type: Boolean,
    default: void 0
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  }
};
const isTagValue = (value) => typeof value === "string" || typeof value === "number";
const isTagGroupValue = (value) => value === null || isTagValue(value) || Array.isArray(value) && value.every(isTagValue);
const tagGroupEmits = {
  "update:modelValue": isTagGroupValue,
  "update:value": isTagGroupValue,
  change: isTagGroupValue
};
exports.checkableTagEmits = checkableTagEmits;
exports.checkableTagProps = checkableTagProps;
exports.tagEmits = tagEmits;
exports.tagGroupEmits = tagGroupEmits;
exports.tagGroupProps = tagGroupProps;
exports.tagProps = tagProps;
