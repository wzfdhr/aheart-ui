"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const titleProps = {
  level: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1 && value <= 5
  }
};
const textProps = {
  type: String,
  strong: Boolean,
  italic: Boolean,
  code: Boolean,
  keyboard: Boolean,
  delete: Boolean,
  underline: Boolean,
  disabled: Boolean
};
const paragraphProps = {
  type: String,
  strong: Boolean,
  italic: Boolean,
  ellipsis: Boolean,
  disabled: Boolean
};
const linkProps = {
  href: String,
  target: String,
  disabled: Boolean,
  underline: Boolean
};
exports.linkProps = linkProps;
exports.paragraphProps = paragraphProps;
exports.textProps = textProps;
exports.titleProps = titleProps;
