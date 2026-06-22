"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const badgeProps = {
  count: [Number, String],
  dot: Boolean,
  status: String,
  text: String,
  overflowCount: {
    type: Number,
    default: 99
  },
  showZero: Boolean,
  size: {
    type: String,
    default: "medium"
  },
  offset: Array,
  color: String,
  title: String,
  classNames: Object,
  styles: Object
};
exports.badgeProps = badgeProps;
