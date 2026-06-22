const tabsProps = {
  items: Array,
  activeKey: String,
  defaultActiveKey: String,
  type: {
    type: String,
    default: "line"
  },
  size: String,
  centered: Boolean
};
const tabsEmits = {
  "update:activeKey": (key) => typeof key === "string",
  change: (key) => typeof key === "string"
};
export {
  tabsEmits,
  tabsProps
};
