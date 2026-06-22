const flexProps = {
  vertical: Boolean,
  orientation: String,
  wrap: [Boolean, String],
  justify: String,
  align: String,
  gap: [String, Number],
  flex: [String, Number],
  component: {
    type: [String, Object, Function],
    default: "div"
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array]
};
export {
  flexProps
};
