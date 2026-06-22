const alertProps = {
  type: {
    type: String,
    default: void 0
  },
  title: String,
  message: String,
  description: String,
  showIcon: {
    type: Boolean,
    default: void 0
  },
  closable: Boolean,
  banner: Boolean,
  variant: {
    type: String,
    default: "outlined"
  },
  action: String,
  icon: String,
  closeIcon: String,
  role: {
    type: String,
    default: "alert"
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const alertEmits = {
  close: (event) => event instanceof MouseEvent,
  afterClose: () => true
};
export {
  alertEmits,
  alertProps
};
