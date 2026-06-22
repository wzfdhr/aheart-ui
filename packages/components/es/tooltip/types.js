import { floatingPlacements, isFloatingTriggerProp } from "../utils/floating.js";
const tooltipProps = {
  title: String,
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
  arrow: {
    type: [Boolean, Object],
    default: true
  },
  zIndex: Number,
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
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  overlayClassName: String,
  overlayStyle: [String, Object, Array],
  overlayInnerStyle: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const tooltipEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open) => typeof open === "boolean"
};
export {
  tooltipEmits,
  tooltipProps
};
