"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const dropdownProps = {
  menu: Object,
  trigger: {
    type: Array,
    default: () => ["click"]
  },
  placement: {
    type: String,
    default: "bottomLeft"
  },
  open: {
    type: Boolean,
    default: void 0
  },
  defaultOpen: Boolean,
  disabled: {
    type: Boolean,
    default: void 0
  },
  arrow: Boolean
};
const dropdownEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open) => typeof open === "boolean",
  click: (_info) => true
};
exports.dropdownEmits = dropdownEmits;
exports.dropdownProps = dropdownProps;
