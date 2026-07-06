"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const formContextKey = Symbol("aheart-form-context");
const formProps = {
  model: {
    type: Object,
    default: () => ({})
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  layout: {
    type: String,
    default: "horizontal"
  },
  labelAlign: {
    type: String,
    default: "right"
  },
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  requiredMark: {
    type: [Boolean, String],
    default: true
  },
  colon: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: void 0
  }
};
const formEmits = {
  submit: (event) => event instanceof Event,
  finish: (values) => typeof values === "object" && values !== null,
  finishFailed: (info) => Array.isArray(info.errorFields),
  validate: (name, status, errors) => typeof name === "string" && typeof status === "boolean" && Array.isArray(errors)
};
const renderableProp = {
  type: [String, Number, Boolean, Object, Array],
  default: void 0
};
const tooltipProp = {
  type: [String, Number, Boolean, Object, Array, Function],
  default: void 0
};
const formItemProps = {
  label: [String, Number, Object, Array],
  name: String,
  colon: {
    type: Boolean,
    default: void 0
  },
  htmlFor: String,
  labelAlign: String,
  layout: String,
  required: Boolean,
  rules: Array,
  validateStatus: String,
  help: renderableProp,
  extra: renderableProp,
  tooltip: tooltipProp,
  hasFeedback: Boolean
};
exports.formContextKey = formContextKey;
exports.formEmits = formEmits;
exports.formItemProps = formItemProps;
exports.formProps = formProps;
