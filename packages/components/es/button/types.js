const buttonTypes = ["default", "primary", "dashed", "link", "text", "success", "warning", "danger"];
const buttonSizes = ["large", "normal", "middle", "small", "mini"];
const nativeButtonTypes = ["button", "submit", "reset"];
const buttonShapes = ["default", "circle", "round"];
const buttonIconPlacements = ["start", "end"];
const buttonColors = [
  "default",
  "primary",
  "danger",
  "success",
  "warning",
  "info",
  "blue",
  "purple",
  "cyan",
  "green",
  "magenta",
  "pink",
  "red",
  "orange",
  "yellow",
  "volcano",
  "geekblue",
  "lime",
  "gold"
];
const buttonVariants = ["outlined", "dashed", "solid", "filled", "text", "link"];
const buttonProps = {
  type: {
    type: String,
    default: "default",
    validator: (value) => buttonTypes.includes(value)
  },
  size: {
    type: String,
    validator: (value) => buttonSizes.includes(value)
  },
  nativeType: {
    type: String,
    default: "button",
    validator: (value) => nativeButtonTypes.includes(value)
  },
  htmlType: {
    type: String,
    validator: (value) => nativeButtonTypes.includes(value)
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  loading: {
    type: [Boolean, Object],
    default: false
  },
  block: Boolean,
  round: Boolean,
  danger: Boolean,
  ghost: Boolean,
  shape: {
    type: String,
    default: "default",
    validator: (value) => buttonShapes.includes(value)
  },
  autoInsertSpace: {
    type: Boolean,
    default: true
  },
  icon: {
    type: null,
    default: void 0
  },
  iconPlacement: {
    type: String,
    validator: (value) => buttonIconPlacements.includes(value)
  },
  iconPosition: {
    type: String,
    validator: (value) => buttonIconPlacements.includes(value)
  },
  color: {
    type: String,
    validator: (value) => buttonColors.includes(value)
  },
  variant: {
    type: String,
    validator: (value) => buttonVariants.includes(value)
  },
  href: String,
  target: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const buttonEmits = {
  click: (event) => event instanceof MouseEvent
};
export {
  buttonColors,
  buttonEmits,
  buttonIconPlacements,
  buttonProps,
  buttonShapes,
  buttonSizes,
  buttonTypes,
  buttonVariants,
  nativeButtonTypes
};
