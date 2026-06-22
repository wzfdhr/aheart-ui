"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const floating = require("../utils/floating.js");
const tooltipProps = {
  title: String,
  placement: {
    type: String,
    default: "top",
    validator: (value) => floating.floatingPlacements.includes(value)
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
    type: Boolean,
    default: true
  },
  zIndex: Number,
  mouseEnterDelay: {
    type: Number,
    default: 0
  },
  mouseLeaveDelay: {
    type: Number,
    default: 0
  }
};
const tooltipEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open) => typeof open === "boolean"
};
exports.tooltipEmits = tooltipEmits;
exports.tooltipProps = tooltipProps;
