"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const messageProps = {
  notices: {
    type: Array,
    default: () => []
  },
  top: {
    type: [Number, String],
    default: 8
  },
  prefixCls: String,
  rtl: Boolean,
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  }
};
const messageEmits = {
  close: (key) => typeof key === "string" || typeof key === "number",
  noticeMouseEnter: (key) => typeof key === "string" || typeof key === "number",
  noticeMouseLeave: (key) => typeof key === "string" || typeof key === "number"
};
exports.messageEmits = messageEmits;
exports.messageProps = messageProps;
