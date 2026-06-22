const radioProps = {
  modelValue: Boolean,
  disabled: {
    type: Boolean,
    default: void 0
  },
  label: String,
  name: String
};
const radioEmits = {
  "update:modelValue": (checked) => typeof checked === "boolean",
  change: (checked) => typeof checked === "boolean"
};
export {
  radioEmits,
  radioProps
};
