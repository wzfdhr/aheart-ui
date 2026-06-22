const formContextKey = Symbol("aheart-form-context");
const formProps = {
  model: {
    type: Object,
    default: () => ({})
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  layout: {
    type: String,
    default: "horizontal"
  },
  labelAlign: {
    type: String,
    default: "right"
  },
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  requiredMark: {
    type: [Boolean, String],
    default: true
  },
  colon: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: void 0
  }
};
const formEmits = {
  submit: (event) => event instanceof Event,
  finish: (values) => typeof values === "object" && values !== null,
  finishFailed: (info) => Array.isArray(info.errorFields),
  validate: (name, status, errors) => typeof name === "string" && typeof status === "boolean" && Array.isArray(errors)
};
const formItemProps = {
  label: String,
  name: String,
  required: Boolean,
  rules: Array,
  validateStatus: String,
  help: String,
  extra: String,
  hasFeedback: Boolean
};
export {
  formContextKey,
  formEmits,
  formItemProps,
  formProps
};
