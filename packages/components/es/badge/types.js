const renderableProp = [String, Number, Boolean, Object, Array, Function];
const badgeProps = {
  count: renderableProp,
  dot: Boolean,
  status: String,
  text: renderableProp,
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
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const badgeRibbonProps = {
  text: renderableProp,
  color: String,
  placement: {
    type: String,
    default: "end"
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
export {
  badgeProps,
  badgeRibbonProps
};
