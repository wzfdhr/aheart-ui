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
  footer: {
    type: Boolean,
    default: true
  },
  destroyOnClose: Boolean
};
const modalEmits = {
  "update:open": (open) => typeof open === "boolean",
  ok: () => true,
  cancel: () => true,
  close: () => true
};
export {
  modalEmits,
  modalProps
};
