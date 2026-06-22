const tagProps = {
  color: {
    type: String,
    default: "default"
  },
  closable: Boolean
};
const tagEmits = {
  close: (event) => event instanceof MouseEvent
};
export {
  tagEmits,
  tagProps
};
