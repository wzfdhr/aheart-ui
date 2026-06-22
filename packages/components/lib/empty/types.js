"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const EMPTY_PRESENTED_IMAGE_DEFAULT = "__AHEART_EMPTY_PRESENTED_IMAGE_DEFAULT__";
const EMPTY_PRESENTED_IMAGE_SIMPLE = "__AHEART_EMPTY_PRESENTED_IMAGE_SIMPLE__";
const renderableProp = [String, Number, Boolean, Object, Array, Function];
const emptyProps = {
  description: {
    type: renderableProp,
    default: void 0
  },
  image: {
    type: renderableProp,
    default: void 0
  },
  imageStyle: [String, Object, Array],
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
exports.EMPTY_PRESENTED_IMAGE_DEFAULT = EMPTY_PRESENTED_IMAGE_DEFAULT;
exports.EMPTY_PRESENTED_IMAGE_SIMPLE = EMPTY_PRESENTED_IMAGE_SIMPLE;
exports.emptyProps = emptyProps;
