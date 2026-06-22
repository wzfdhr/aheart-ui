const alertProps = {
  type: {
    type: String,
    default: "info"
  },
  message: String,
  description: String,
  showIcon: Boolean,
  closable: Boolean
};
const alertEmits = {
  close: (event) => event instanceof MouseEvent
};
export {
  alertEmits,
  alertProps
};
