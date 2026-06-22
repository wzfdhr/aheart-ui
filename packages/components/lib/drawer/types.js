"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const drawerPlacements = ["top", "right", "bottom", "left"];
const drawerProps = {
  open: Boolean,
  title: String,
  placement: {
    type: String,
    default: "right",
    validator: (value) => drawerPlacements.includes(value)
  },
  width: {
    type: [Number, String],
    default: 378
  },
  height: {
    type: [Number, String],
    default: 378
  },
  closable: {
    type: Boolean,
    default: true
  },
  mask: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  footer: Boolean,
  destroyOnClose: Boolean
};
const drawerEmits = {
  "update:open": (open) => typeof open === "boolean",
  close: () => true
};
exports.drawerEmits = drawerEmits;
exports.drawerPlacements = drawerPlacements;
exports.drawerProps = drawerProps;
