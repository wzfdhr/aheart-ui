"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const modalProps = {
  open: Boolean,
  title: {
    type: null,
    default: void 0
  },
  width: {
    type: [Number, String],
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
    type: null,
    default: "OK"
  },
  cancelText: {
    type: null,
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
    type: [Boolean, String, Number, Object, Array, Function],
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
  afterOpenChange: (open) => typeof open === "boolean",
  afterClose: () => true
};
exports.modalEmits = modalEmits;
exports.modalProps = modalProps;
