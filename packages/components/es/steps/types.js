const stepsProps = {
  items: Array,
  current: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: "process"
  },
  direction: {
    type: String,
    default: "horizontal"
  },
  size: String
};
const stepsEmits = {
  change: (current) => Number.isInteger(current)
};
export {
  stepsEmits,
  stepsProps
};
