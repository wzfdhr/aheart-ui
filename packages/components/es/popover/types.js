import { floatingPlacements, isFloatingTriggerProp } from "../utils/floating.js";
const popoverProps = {
  title: String,
  content: String,
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
    type: Boolean,
    default: true
  },
  zIndex: Number
};
const popoverEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open) => typeof open === "boolean"
};
export {
  popoverEmits,
  popoverProps
};
