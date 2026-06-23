const drawerPlacements = ["top", "right", "bottom", "left"];
const drawerProps = {
  open: Boolean,
  title: {
    type: [String, Number, Boolean, Object, Array, Function],
    default: void 0
  },
  extra: {
    type: [String, Number, Boolean, Object, Array, Function],
    default: void 0
  },
  placement: {
    type: String,
    default: "right",
    validator: (value) => drawerPlacements.includes(value)
  },
  size: {
    type: [String, Number],
    default: "default"
  },
  width: {
    type: [Number, String],
    default: void 0
  },
  height: {
    type: [Number, String],
    default: void 0
  },
  zIndex: {
    type: Number,
    default: 1e3
  },
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
  focusable: Object,
  loading: Boolean,
  footer: {
    type: [Boolean, String, Number, Object, Array, Function],
    default: void 0
  },
  getContainer: {
    type: [String, Object, Function, Boolean],
    default: void 0
  },
  drawerRender: Function,
  className: String,
  rootClassName: String,
  style: Object,
  rootStyle: Object,
  bodyStyle: Object,
  headerStyle: Object,
  footerStyle: Object,
  maskStyle: Object,
  drawerStyle: Object,
  contentWrapperStyle: Object,
  classNames: [Object, Function],
  styles: [Object, Function],
  forceRender: Boolean,
  destroyOnClose: Boolean,
  destroyOnHidden: Boolean
};
const drawerEmits = {
  "update:open": (open) => typeof open === "boolean",
  close: () => true,
  afterOpenChange: (open) => typeof open === "boolean"
};
export {
  drawerEmits,
  drawerPlacements,
  drawerProps
};
