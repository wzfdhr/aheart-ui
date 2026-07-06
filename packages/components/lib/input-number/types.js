"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const renderableProp = {
  type: null,
  default: void 0
};
const inputNumberProps = {
  id: String,
  modelValue: [Number, String],
  value: [Number, String],
  defaultValue: [Number, String],
  autoFocus: Boolean,
  placeholder: String,
  prefix: renderableProp,
  suffix: renderableProp,
  size: String,
  mode: {
    type: String,
    default: "input"
  },
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
  min: Number,
  max: Number,
  step: {
    type: [Number, String],
    default: 1
  },
  precision: Number,
  decimalSeparator: String,
  stringMode: Boolean,
  formatter: Function,
  parser: Function,
  keyboard: {
    type: Boolean,
    default: true
  },
  controls: {
    type: [Boolean, Object],
    default: true
  },
  changeOnBlur: {
    type: Boolean,
    default: true
  },
  changeOnWheel: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: [Object, Function],
  styles: [Object, Function]
};
const inputNumberEmits = {
  "update:modelValue": (value) => typeof value === "number" || typeof value === "string" || value === void 0,
  change: (value) => typeof value === "number" || typeof value === "string" || value === void 0,
  pressEnter: (event) => event instanceof KeyboardEvent,
  step: (value, info) => (typeof value === "number" || typeof value === "string") && typeof info.offset === "number" && (info.type === "up" || info.type === "down") && (info.emitter === "handler" || info.emitter === "keydown" || info.emitter === "wheel")
};
exports.inputNumberEmits = inputNumberEmits;
exports.inputNumberProps = inputNumberProps;
