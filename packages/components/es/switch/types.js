const switchProps = {
  modelValue: Boolean,
  disabled: {
    type: Boolean,
    default: void 0
  },
  loading: Boolean,
  size: String,
  checkedChildren: String,
  unCheckedChildren: String
};
const switchEmits = {
  "update:modelValue": (checked) => typeof checked === "boolean",
  change: (checked) => typeof checked === "boolean"
};
export {
  switchEmits,
  switchProps
};
