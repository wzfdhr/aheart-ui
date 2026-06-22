"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const menuProps = {
  items: Array,
  mode: {
    type: String,
    default: "vertical"
  },
  theme: {
    type: String,
    default: "light"
  },
  selectedKeys: Array,
  defaultSelectedKeys: {
    type: Array,
    default: () => []
  },
  openKeys: Array,
  defaultOpenKeys: {
    type: Array,
    default: () => []
  },
  multiple: Boolean,
  selectable: {
    type: Boolean,
    default: true
  },
  inlineCollapsed: Boolean,
  inlineIndent: {
    type: Number,
    default: 24
  },
  forceSubMenuRender: Boolean,
  triggerSubMenuAction: {
    type: String,
    default: "click"
  },
  expandIcon: [Function, String, Number, Boolean, Object, Array],
  className: String,
  style: [String, Object, Array],
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: void 0
  }
};
const menuEmits = {
  click: (_info) => true,
  select: (_info) => true,
  deselect: (_info) => true,
  openChange: (keys) => Array.isArray(keys),
  "update:selectedKeys": (keys) => Array.isArray(keys),
  "update:openKeys": (keys) => Array.isArray(keys)
};
exports.menuEmits = menuEmits;
exports.menuProps = menuProps;
