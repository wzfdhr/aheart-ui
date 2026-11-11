"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
function getNextEnabledKey(entries, currentKey, key, loop = true) {
  if (!entries.length)
    return void 0;
  if (key === "Home")
    return entries[0].key;
  if (key === "End")
    return entries[entries.length - 1].key;
  const forward = key === "ArrowRight" || key === "ArrowDown";
  const index = entries.findIndex((item) => item.key === currentKey);
  if (index < 0)
    return forward ? entries[0].key : entries[entries.length - 1].key;
  const next = index + (forward ? 1 : -1);
  if (next >= 0 && next < entries.length)
    return entries[next].key;
  return loop ? entries[(next + entries.length) % entries.length].key : void 0;
}
function useRovingFocus(options) {
  const collection = () => vue.toValue(options.collection);
  const orientation = () => vue.toValue(options.orientation) ?? "both";
  const loops = () => vue.toValue(options.loop) !== false;
  const shouldPrevent = () => vue.toValue(options.preventDefault) !== false;
  const isDirection = (key) => {
    if (orientation() === "horizontal")
      return key === "ArrowLeft" || key === "ArrowRight";
    if (orientation() === "vertical")
      return key === "ArrowUp" || key === "ArrowDown";
    return key.startsWith("Arrow");
  };
  const getNextKey = (currentKey, key) => {
    if (key !== "Home" && key !== "End" && !isDirection(key))
      return void 0;
    return getNextEnabledKey(collection().getEnabledItems(), currentKey, key, loops());
  };
  const focus = (key, preventScroll = true) => {
    const item = collection().getItem(key);
    if (!item || !item.visible || item.disabled)
      return false;
    item.element.focus({ preventScroll });
    return true;
  };
  const onKeydown = (event, currentKey) => {
    const nextKey = getNextKey(currentKey, event.key);
    if (!nextKey)
      return false;
    if (shouldPrevent())
      event.preventDefault();
    return focus(nextKey);
  };
  return { getNextKey, focus, onKeydown };
}
exports.getNextEnabledKey = getNextEnabledKey;
exports.useRovingFocus = useRovingFocus;
