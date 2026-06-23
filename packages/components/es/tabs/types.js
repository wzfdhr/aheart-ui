const renderableProp = [String, Number, Boolean, Object, Array, Function];
const tabsProps = {
  items: Array,
  activeKey: String,
  defaultActiveKey: String,
  type: {
    type: String,
    default: "line"
  },
  size: String,
  centered: Boolean,
  tabPlacement: String,
  tabPosition: String,
  tabBarExtraContent: renderableProp,
  tabBarGutter: Number,
  tabBarStyle: [String, Object, Array],
  indicator: Object,
  animated: {
    type: [Boolean, Object],
    default: false
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
const tabsEmits = {
  "update:activeKey": (key) => typeof key === "string",
  change: (key) => typeof key === "string",
  tabClick: (key, event) => typeof key === "string" && event instanceof MouseEvent
};
export {
  tabsEmits,
  tabsProps
};
