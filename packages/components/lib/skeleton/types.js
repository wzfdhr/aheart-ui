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
  button: [Boolean, Object],
  input: [Boolean, Object],
  image: [Boolean, Object],
  node: [Boolean, Object],
  round: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  }
};
exports.skeletonProps = skeletonProps;
