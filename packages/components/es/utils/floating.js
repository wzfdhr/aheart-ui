const floatingPlacements = [
  "top",
  "left",
  "right",
  "bottom",
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
  "leftTop",
  "leftBottom",
  "rightTop",
  "rightBottom"
];
const floatingTriggers = ["hover", "focus", "click", "contextMenu"];
const isFloatingTrigger = (value) => floatingTriggers.includes(value);
const isFloatingTriggerProp = (value) => {
  if (Array.isArray(value)) {
    return value.every((item) => typeof item === "string" && isFloatingTrigger(item));
  }
  return typeof value === "string" && isFloatingTrigger(value);
};
const normalizeFloatingTriggers = (trigger) => Array.isArray(trigger) ? trigger : [trigger];
const getFloatingPopupStyle = (color, zIndex) => ({
  ...color ? { background: color } : {},
  ...zIndex !== void 0 ? { zIndex } : {}
});
export {
  floatingPlacements,
  floatingTriggers,
  getFloatingPopupStyle,
  isFloatingTrigger,
  isFloatingTriggerProp,
  normalizeFloatingTriggers
};
