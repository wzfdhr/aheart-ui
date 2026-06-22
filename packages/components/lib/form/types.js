"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const formProps = {
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
  }
};
const formEmits = {
  submit: (event) => event instanceof Event
};
const formItemProps = {
  label: String,
  name: String,
  required: Boolean,
  validateStatus: String,
  help: String,
  extra: String,
  hasFeedback: Boolean
};
exports.formEmits = formEmits;
exports.formItemProps = formItemProps;
exports.formProps = formProps;
