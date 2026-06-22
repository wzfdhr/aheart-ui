const selectProps = {
  id: String,
  name: String,
  modelValue: [String, Number, Array],
  defaultValue: [String, Number, Array],
  options: Array,
  placeholder: String,
  prefix: String,
  suffixIcon: String,
  loadingIcon: [String, Number, Object, Array, Function],
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
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
  mode: String,
  showSearch: Boolean,
  searchValue: String,
  optionFilterProp: {
    type: String,
    default: "label"
  },
  filterOption: {
    type: [Boolean, Function],
    default: void 0
  },
  filterSort: Function,
  fieldNames: Object,
  notFoundContent: {
    type: String,
    default: "Not Found"
  },
  maxCount: Number,
  loading: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  }
};
const selectEmits = {
  "update:modelValue": (value) => typeof value === "string" || typeof value === "number" || Array.isArray(value),
  change: (value) => typeof value === "string" || typeof value === "number" || Array.isArray(value),
  clear: () => true,
  search: (value) => typeof value === "string",
  focus: (event) => event instanceof FocusEvent,
  blur: (event) => event instanceof FocusEvent
};
export {
  selectEmits,
  selectProps
};
