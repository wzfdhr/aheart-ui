"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const renderableProp = [String, Number, Object, Array, Function];
const alertProps = {
  type: {
    type: String,
    default: void 0
  },
  title: renderableProp,
  message: renderableProp,
  description: renderableProp,
  showIcon: {
    type: Boolean,
    default: void 0
  },
  closable: {
    type: [Boolean, Object],
    default: false
  },
  banner: Boolean,
  variant: {
    type: String,
    default: "outlined"
  },
  action: renderableProp,
  icon: renderableProp,
  closeIcon: renderableProp,
  role: {
    type: String,
    default: "alert"
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const alertEmits = {
  close: (event) => event instanceof MouseEvent,
  afterClose: () => true
};
exports.alertEmits = alertEmits;
exports.alertProps = alertProps;
