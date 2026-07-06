"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const floating = require("../utils/floating.js");
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
    validator: (value) => floating.floatingPlacements.includes(value)
  },
  autoAdjustOverflow: {
    type: Boolean,
    default: true
  },
  trigger: {
    type: [String, Array],
    default: "hover",
    validator: floating.isFloatingTriggerProp
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
  destroyTooltipOnHide: Boolean,
  fresh: Boolean,
  align: Object,
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
  classNames: [Object, Function],
  styles: [Object, Function]
};
const popoverEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open) => typeof open === "boolean"
};
exports.popoverEmits = popoverEmits;
exports.popoverProps = popoverProps;
