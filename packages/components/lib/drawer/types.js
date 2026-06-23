"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const drawerPlacements = ["top", "right", "bottom", "left"];
const drawerProps = {
  open: Boolean,
  title: {
    type: [String, Number, Boolean, Object, Array, Function],
    default: void 0
  },
  extra: {
    type: [String, Number, Boolean, Object, Array, Function],
    default: void 0
  },
  placement: {
    type: String,
    default: "right",
    validator: (value) => drawerPlacements.includes(value)
  },
  size: {
    type: [String, Number],
    default: "default"
  },
  width: {
    type: [Number, String],
    default: void 0
  },
  height: {
    type: [Number, String],
    default: void 0
  },
  zIndex: {
    type: Number,
    default: 1e3
  },
  closable: {
    type: [Boolean, Object],
    default: true
  },
  closeIcon: {
    type: null,
    default: void 0
  },
  mask: {
    type: [Boolean, Object],
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
  loading: Boolean,
  footer: {
    type: [Boolean, String, Number, Object, Array, Function],
    default: void 0
  },
  getContainer: {
    type: [String, Object, Function, Boolean],
    default: void 0
  },
  className: String,
  rootClassName: String,
  style: Object,
  rootStyle: Object,
  classNames: Object,
  styles: Object,
  forceRender: Boolean,
  destroyOnClose: Boolean,
  destroyOnHidden: Boolean
};
const drawerEmits = {
  "update:open": (open) => typeof open === "boolean",
  close: () => true,
  afterOpenChange: (open) => typeof open === "boolean"
};
exports.drawerEmits = drawerEmits;
exports.drawerPlacements = drawerPlacements;
exports.drawerProps = drawerProps;
