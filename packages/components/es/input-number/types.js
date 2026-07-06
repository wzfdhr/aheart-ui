const renderableProp = {
  type: null,
  default: void 0
};
const inputNumberProps = {
  id: String,
  modelValue: Number,
  placeholder: String,
  prefix: renderableProp,
  suffix: renderableProp,
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
  min: Number,
  max: Number,
  step: {
    type: [Number, String],
    default: 1
  },
  precision: Number,
  decimalSeparator: String,
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
  changeOnWheel: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const inputNumberEmits = {
  "update:modelValue": (value) => typeof value === "number" || value === void 0,
  change: (value) => typeof value === "number" || value === void 0,
  pressEnter: (event) => event instanceof KeyboardEvent,
  step: (value, info) => typeof value === "number" && typeof info.offset === "number" && (info.type === "up" || info.type === "down")
};
export {
  inputNumberEmits,
  inputNumberProps
};
