"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const cardVariants = ["outlined", "borderless"];
const cardTypes = ["inner"];
const renderableProp = [String, Number, Boolean, Object, Array];
const cardProps = {
  title: renderableProp,
  extra: renderableProp,
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
  tabList: Array,
  activeTabKey: String,
  defaultActiveTabKey: String,
  tabBarExtraContent: [String, Number, Boolean, Object, Array, Function],
  tabProps: Object,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  headStyle: [String, Object, Array],
  bodyStyle: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const cardEmits = {
  "update:activeTabKey": (key) => typeof key === "string",
  tabChange: (key) => typeof key === "string"
};
const cardMetaProps = {
  avatar: [String, Number, Boolean, Object, Array, Function],
  title: [String, Number, Boolean, Object, Array, Function],
  description: [String, Number, Boolean, Object, Array, Function],
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const cardGridProps = {
  hoverable: {
    type: Boolean,
    default: true
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
exports.cardEmits = cardEmits;
exports.cardGridProps = cardGridProps;
exports.cardMetaProps = cardMetaProps;
exports.cardProps = cardProps;
exports.cardTypes = cardTypes;
exports.cardVariants = cardVariants;
