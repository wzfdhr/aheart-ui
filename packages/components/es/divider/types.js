const dividerProps = {
  type: {
    type: String,
    default: "horizontal"
  },
  vertical: Boolean,
  orientation: {
    type: String,
    default: "center"
  },
  titlePlacement: String,
  orientationMargin: [Number, String],
  variant: {
    type: String,
    default: "solid"
  },
  size: {
    type: String,
    default: "middle"
  },
  dashed: Boolean,
  plain: Boolean,
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
  dividerProps
};
