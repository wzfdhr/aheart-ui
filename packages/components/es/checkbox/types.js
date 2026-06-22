const checkboxProps = {
  modelValue: {
    type: Boolean,
    default: void 0
  },
  checked: {
    type: Boolean,
    default: void 0
  },
  defaultChecked: {
    type: Boolean,
    default: void 0
  },
  value: [String, Number, Boolean],
  name: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  indeterminate: Boolean,
  label: String,
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const checkboxEmits = {
  "update:modelValue": (checked) => typeof checked === "boolean",
  "update:checked": (checked) => typeof checked === "boolean",
  change: (checked, event) => typeof checked === "boolean" && event instanceof Event,
  focus: (event) => event instanceof FocusEvent,
  blur: (event) => event instanceof FocusEvent
};
const checkboxGroupProps = {
  modelValue: {
    type: Array,
    default: void 0
  },
  value: {
    type: Array,
    default: void 0
  },
  defaultValue: {
    type: Array,
    default: void 0
  },
  options: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  name: String,
  direction: {
    type: String,
    default: "horizontal"
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array]
};
const checkboxGroupEmits = {
  "update:modelValue": (value) => Array.isArray(value),
  "update:value": (value) => Array.isArray(value),
  change: (value) => Array.isArray(value)
};
export {
  checkboxEmits,
  checkboxGroupEmits,
  checkboxGroupProps,
  checkboxProps
};
