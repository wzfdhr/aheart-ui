const modalProps = {
  open: Boolean,
  title: {
    type: null,
    default: void 0
  },
  width: {
    type: [Number, String, Object],
    default: 520
  },
  centered: Boolean,
  closable: {
    type: [Boolean, Object],
    default: true
  },
  closeIcon: {
    type: null,
    default: void 0
  },
  mask: {
    type: [Boolean, Object],
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
    type: null,
    default: void 0
  },
  cancelText: {
    type: null,
    default: void 0
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
    type: [Boolean, String, Number, Object, Array, Function],
    default: true
  },
  className: String,
  rootClassName: String,
  wrapClassName: String,
  modalRender: Function,
  getContainer: {
    type: [String, Object, Function, Boolean],
    default: void 0
  },
  style: Object,
  rootStyle: Object,
  classNames: [Object, Function],
  styles: [Object, Function],
  focusable: Object,
  focusTriggerAfterClose: {
    type: Boolean,
    default: void 0
  },
  forceRender: Boolean,
  destroyOnClose: Boolean,
  destroyOnHidden: Boolean
};
const modalEmits = {
  "update:open": (open) => typeof open === "boolean",
  ok: () => true,
  cancel: () => true,
  close: () => true,
  afterOpenChange: (open) => typeof open === "boolean",
  afterClose: () => true
};
export {
  modalEmits,
  modalProps
};
