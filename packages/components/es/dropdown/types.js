import { buttonTypes, buttonSizes, nativeButtonTypes } from "../button/types.js";
const dropdownProps = {
  menu: Object,
  trigger: {
    type: Array,
    default: () => ["hover"]
  },
  placement: {
    type: String,
    default: "bottomLeft"
  },
  getPopupContainer: Function,
  open: {
    type: Boolean,
    default: void 0
  },
  defaultOpen: Boolean,
  disabled: {
    type: Boolean,
    default: void 0
  },
  arrow: {
    type: [Boolean, Object],
    default: false
  },
  destroyOnHidden: Boolean,
  destroyPopupOnHide: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  overlayClassName: String,
  overlayStyle: [String, Object, Array],
  classNames: Object,
  styles: Object,
  popupRender: Function,
  dropdownRender: Function
};
const dropdownEmits = {
  "update:open": (open) => typeof open === "boolean",
  openChange: (open, info) => typeof open === "boolean" && (!info || info.source === "trigger" || info.source === "menu"),
  click: (_info) => true
};
const dropdownButtonProps = {
  menu: dropdownProps.menu,
  trigger: dropdownProps.trigger,
  placement: {
    type: String,
    default: "bottomRight"
  },
  getPopupContainer: dropdownProps.getPopupContainer,
  open: dropdownProps.open,
  defaultOpen: dropdownProps.defaultOpen,
  disabled: dropdownProps.disabled,
  arrow: dropdownProps.arrow,
  destroyOnHidden: dropdownProps.destroyOnHidden,
  destroyPopupOnHide: dropdownProps.destroyPopupOnHide,
  overlayClassName: dropdownProps.overlayClassName,
  overlayStyle: dropdownProps.overlayStyle,
  classNames: dropdownProps.classNames,
  styles: dropdownProps.styles,
  popupRender: dropdownProps.popupRender,
  dropdownRender: dropdownProps.dropdownRender,
  type: {
    type: String,
    default: "default",
    validator: (value) => buttonTypes.includes(value)
  },
  size: {
    type: String,
    validator: (value) => buttonSizes.includes(value)
  },
  nativeType: {
    type: String,
    default: "button",
    validator: (value) => nativeButtonTypes.includes(value)
  },
  htmlType: {
    type: String,
    validator: (value) => nativeButtonTypes.includes(value)
  },
  danger: Boolean,
  loading: {
    type: [Boolean, Object],
    default: false
  },
  icon: {
    type: null,
    default: void 0
  },
  href: String,
  target: String,
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  buttonsRender: Function
};
const dropdownButtonEmits = {
  "update:open": dropdownEmits["update:open"],
  openChange: dropdownEmits.openChange,
  click: (event) => event instanceof MouseEvent,
  menuClick: (_info) => true
};
export {
  dropdownButtonEmits,
  dropdownButtonProps,
  dropdownEmits,
  dropdownProps
};
