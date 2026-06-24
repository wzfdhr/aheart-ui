"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const floating = require("../utils/floating.js");
const titleProp = {
  type: null,
  default: void 0
};
const tooltipProps = {
  title: titleProp,
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
  arrow: {
    type: [Boolean, Object],
    default: true
  },
  zIndex: Number,
  getPopupContainer: Function,
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
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  overlayClassName: String,
  overlayStyle: [String, Object, Array],
  overlayInnerStyle: [String, Object, Array],
  classNames: [Object, Function],
  styles: [Object, Function]
};
const tooltipEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open) => typeof open === "boolean"
};
exports.tooltipEmits = tooltipEmits;
exports.tooltipProps = tooltipProps;
