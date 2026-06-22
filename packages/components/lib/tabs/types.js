"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const tabsProps = {
  items: Array,
  activeKey: String,
  defaultActiveKey: String,
  type: {
    type: String,
    default: "line"
  },
  size: String,
  centered: Boolean
};
const tabsEmits = {
  "update:activeKey": (key) => typeof key === "string",
  change: (key) => typeof key === "string"
};
exports.tabsEmits = tabsEmits;
exports.tabsProps = tabsProps;
