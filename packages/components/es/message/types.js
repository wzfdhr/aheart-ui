const messageProps = {
  notices: {
    type: Array,
    default: () => []
  },
  top: {
    type: [Number, String],
    default: 8
  },
  prefixCls: String,
  rtl: Boolean,
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  },
  stack: {
    type: [Boolean, Object],
    default: false
  }
};
const messageEmits = {
  close: (key) => typeof key === "string" || typeof key === "number",
  noticeMouseEnter: (key) => typeof key === "string" || typeof key === "number",
  noticeMouseLeave: (key) => typeof key === "string" || typeof key === "number"
};
export {
  messageEmits,
  messageProps
};
