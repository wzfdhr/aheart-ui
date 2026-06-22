const textareaProps = {
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
  status: String,
  maxlength: Number,
  showCount: Boolean,
  autoSize: Boolean
};
const textareaEmits = {
  "update:modelValue": (value) => typeof value === "string",
  input: (value) => typeof value === "string",
  change: (value) => typeof value === "string"
};
export {
  textareaEmits,
  textareaProps
};
