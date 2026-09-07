"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const treeProps = {
  treeData: {
    type: Array,
    default: () => []
  },
  expandedKeys: Array,
  defaultExpandedKeys: {
    type: Array,
    default: () => []
  },
  selectedKeys: Array,
  defaultSelectedKeys: {
    type: Array,
    default: () => []
  },
  checkedKeys: Array,
  defaultCheckedKeys: {
    type: Array,
    default: () => []
  },
  defaultExpandAll: Boolean,
  selectable: {
    type: Boolean,
    default: true
  },
  multiple: Boolean,
  checkable: Boolean,
  checkStrictly: { type: Boolean, default: true },
  loadData: Function,
  // `undefined` preserves ConfigProvider inheritance when the prop is omitted.
  disabled: {
    type: Boolean,
    default: void 0
  }
};
exports.treeProps = treeProps;
