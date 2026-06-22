const messageProps = {
  notices: {
    type: Array,
    default: () => []
  },
  top: {
    type: [Number, String],
    default: 8
  }
};
const messageEmits = {
  close: (key) => typeof key === "string"
};
export {
  messageEmits,
  messageProps
};
