const inputNumberProps = {
  id: String,
  modelValue: Number,
  placeholder: String,
  prefix: String,
  suffix: String,
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
    type: Number,
    default: 1
  },
  precision: Number,
  formatter: Function,
  parser: Function,
  keyboard: {
    type: Boolean,
    default: true
  },
  controls: {
    type: Boolean,
    default: true
  }
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
