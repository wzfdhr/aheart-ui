"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const copyableProp = [Boolean, Object];
const actionsProp = Object;
const rootHookProps = {
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: [Object, Function],
  styles: [Object, Function]
};
const typographyProps = {
  ...rootHookProps
};
const titleProps = {
  ...rootHookProps,
  level: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1 && value <= 5
  },
  type: String,
  disabled: Boolean,
  mark: Boolean,
  copyable: copyableProp,
  actions: actionsProp
};
const textProps = {
  ...rootHookProps,
  type: String,
  strong: Boolean,
  italic: Boolean,
  code: Boolean,
  keyboard: Boolean,
  delete: Boolean,
  underline: Boolean,
  mark: Boolean,
  disabled: Boolean,
  copyable: copyableProp,
  actions: actionsProp
};
const paragraphProps = {
  ...rootHookProps,
  type: String,
  strong: Boolean,
  italic: Boolean,
  ellipsis: [Boolean, Object],
  mark: Boolean,
  disabled: Boolean,
  copyable: copyableProp,
  actions: actionsProp
};
const linkProps = {
  ...rootHookProps,
  href: String,
  target: String,
  disabled: Boolean,
  underline: Boolean
};
exports.linkProps = linkProps;
exports.paragraphProps = paragraphProps;
exports.textProps = textProps;
exports.titleProps = titleProps;
exports.typographyProps = typographyProps;
