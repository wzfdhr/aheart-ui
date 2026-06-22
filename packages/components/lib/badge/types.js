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
  }
};
exports.badgeProps = badgeProps;
