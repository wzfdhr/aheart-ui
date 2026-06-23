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
export {
  dropdownEmits,
  dropdownProps
};
