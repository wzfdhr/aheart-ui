import { floatingPlacements, isFloatingTriggerProp } from "../utils/floating.js";
const renderableProp = {
  type: null,
  default: void 0
};
const popoverProps = {
  title: renderableProp,
  content: renderableProp,
  placement: {
    type: String,
    default: "top",
    validator: (value) => floatingPlacements.includes(value)
  },
  trigger: {
    type: [String, Array],
    default: "hover",
    validator: isFloatingTriggerProp
  },
  open: {
    type: Boolean,
    default: void 0
  },
  defaultOpen: Boolean,
  color: String,
  mouseEnterDelay: {
    type: Number,
    default: 0.1
  },
  mouseLeaveDelay: {
    type: Number,
    default: 0.1
  },
  destroyOnHidden: Boolean,
  fresh: Boolean,
  arrow: {
    type: [Boolean, Object],
    default: true
  },
  zIndex: Number,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  overlayClassName: String,
  overlayStyle: [String, Object, Array],
  overlayInnerStyle: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const popoverEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open) => typeof open === "boolean"
};
export {
  popoverEmits,
  popoverProps
};
