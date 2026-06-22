const inputProps = {
  modelValue: String,
  placeholder: String,
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  status: String,
  allowClear: Boolean,
  maxlength: Number,
  showCount: Boolean,
  type: {
    type: String,
    default: "text"
  }
};
const inputEmits = {
  "update:modelValue": (value) => typeof value === "string",
  input: (value) => typeof value === "string",
  change: (value) => typeof value === "string",
  clear: () => true
};
export {
  inputEmits,
  inputProps
};
