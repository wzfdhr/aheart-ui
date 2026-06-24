"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const floating = require("../utils/floating.js");
const renderableProp = {
  type: null,
  default: void 0
};
const iconProp = {
  type: null,
  default: void 0
};
const popconfirmProps = {
  title: renderableProp,
  description: renderableProp,
  icon: iconProp,
  placement: {
    type: String,
    default: "top",
    validator: (value) => floating.floatingPlacements.includes(value)
  },
  autoAdjustOverflow: {
    type: Boolean,
    default: true
  },
  trigger: {
    type: [String, Array],
    default: "click",
    validator: floating.isFloatingTriggerProp
  },
  open: {
    type: Boolean,
    default: void 0
  },
  defaultOpen: Boolean,
  destroyOnHidden: Boolean,
  destroyTooltipOnHide: Boolean,
  fresh: Boolean,
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
  mouseEnterDelay: {
    type: Number,
    default: 0.1
  },
  mouseLeaveDelay: {
    type: Number,
    default: 0.1
  },
  arrow: {
    type: [Boolean, Object],
    default: true
  },
  zIndex: Number,
  getPopupContainer: Function,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  overlayClassName: String,
  overlayStyle: [String, Object, Array],
  overlayInnerStyle: [String, Object, Array],
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
exports.popconfirmEmits = popconfirmEmits;
exports.popconfirmProps = popconfirmProps;
