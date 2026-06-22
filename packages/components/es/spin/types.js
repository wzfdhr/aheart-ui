const spinProps = {
  spinning: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: "middle"
  },
  tip: String,
  delay: Number,
  indicator: [String, Number, Object, Array, Function],
  percent: [Number, String],
  fullscreen: Boolean,
  wrapperClassName: String,
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
export {
  spinProps
};
