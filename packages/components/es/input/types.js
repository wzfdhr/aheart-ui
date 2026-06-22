const inputProps = {
  id: String,
  modelValue: String,
  placeholder: String,
  prefix: String,
  suffix: String,
  addonBefore: String,
  addonAfter: String,
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
  allowClear: {
    type: [Boolean, Object],
    default: false
  },
  maxlength: Number,
  showCount: {
    type: [Boolean, Object],
    default: false
  },
  count: Object,
  type: {
    type: String,
    default: "text"
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const inputEmits = {
  "update:modelValue": (value) => typeof value === "string",
  input: (value) => typeof value === "string",
  change: (value) => typeof value === "string",
  clear: () => true,
  pressEnter: (event) => event instanceof KeyboardEvent
};
export {
  inputEmits,
  inputProps
};
