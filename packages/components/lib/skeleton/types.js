"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const skeletonProps = {
  loading: {
    type: Boolean,
    default: true
  },
  active: Boolean,
  avatar: [Boolean, Object],
  title: {
    type: [Boolean, Object],
    default: true
  },
  paragraph: {
    type: [Boolean, Object],
    default: true
  },
  round: Boolean
};
exports.skeletonProps = skeletonProps;
