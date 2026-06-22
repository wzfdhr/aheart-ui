const modalProps = {
  open: Boolean,
  title: String,
  width: {
    type: [Number, String],
    default: 520
  },
  centered: Boolean,
  closable: {
    type: Boolean,
    default: true
  },
  mask: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  confirmLoading: Boolean,
  okText: {
    type: String,
    default: "OK"
  },
  cancelText: {
    type: String,
    default: "Cancel"
  },
  okType: {
    type: String,
    default: "primary"
  },
  okButtonProps: Object,
  cancelButtonProps: Object,
  zIndex: {
    type: Number,
    default: 1e3
  },
  loading: Boolean,
  footer: {
    type: Boolean,
    default: true
  },
  className: String,
  rootClassName: String,
  style: Object,
  rootStyle: Object,
  classNames: Object,
  styles: Object,
  forceRender: Boolean,
  destroyOnClose: Boolean,
  destroyOnHidden: Boolean
};
const modalEmits = {
  "update:open": (open) => typeof open === "boolean",
  ok: () => true,
  cancel: () => true,
  close: () => true,
  afterOpenChange: (open) => typeof open === "boolean"
};
export {
  modalEmits,
  modalProps
};
