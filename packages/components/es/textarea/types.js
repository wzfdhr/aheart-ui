const textareaProps = {
  id: String,
  modelValue: String,
  placeholder: String,
  rows: {
    type: Number,
    default: 3
  },
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
  autoSize: [Boolean, Object],
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const textareaEmits = {
  "update:modelValue": (value) => typeof value === "string",
  input: (value) => typeof value === "string",
  change: (value) => typeof value === "string",
  clear: () => true,
  pressEnter: (event) => event instanceof KeyboardEvent
};
export {
  textareaEmits,
  textareaProps
};
