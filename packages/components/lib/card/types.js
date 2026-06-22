"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const cardVariants = ["outlined", "borderless"];
const cardTypes = ["inner"];
const cardProps = {
  title: String,
  extra: String,
  bordered: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    validator: (value) => cardVariants.includes(value)
  },
  type: {
    type: String,
    validator: (value) => cardTypes.includes(value)
  },
  hoverable: Boolean,
  loading: Boolean,
  size: String,
  actions: Array,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  headStyle: [String, Object, Array],
  bodyStyle: [String, Object, Array],
  classNames: Object,
  styles: Object
};
exports.cardProps = cardProps;
exports.cardTypes = cardTypes;
exports.cardVariants = cardVariants;
