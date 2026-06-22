import { floatingPlacements, isFloatingTriggerProp } from "../utils/floating.js";
const popconfirmProps = {
  title: String,
  description: String,
  icon: String,
  placement: {
    type: String,
    default: "top",
    validator: (value) => floatingPlacements.includes(value)
  },
  trigger: {
    type: [String, Array],
    default: "click",
    validator: isFloatingTriggerProp
  },
  open: {
    type: Boolean,
    default: void 0
  },
  defaultOpen: Boolean,
  okText: {
    type: String,
    default: "OK"
  },
  cancelText: {
    type: String,
    default: "Cancel"
  },
  okType: {
    type: String,
    default: "primary"
  },
  okButtonProps: Object,
  cancelButtonProps: Object,
  disabled: Boolean,
  showCancel: {
    type: Boolean,
    default: true
  },
  color: String,
  arrow: {
    type: Boolean,
    default: true
  },
  zIndex: Number,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const popconfirmEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open) => typeof open === "boolean",
  confirm: () => true,
  cancel: () => true,
  popupClick: (event) => event instanceof MouseEvent
};
export {
  popconfirmEmits,
  popconfirmProps
};
