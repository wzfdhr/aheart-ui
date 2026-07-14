"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const requestFrame = (callback) => typeof requestAnimationFrame === "function" ? requestAnimationFrame(callback) : setTimeout(() => callback(Date.now()), 0);
const cancelFrame = (frame) => {
  if (frame === void 0)
    return;
  if (typeof cancelAnimationFrame === "function")
    cancelAnimationFrame(frame);
  else
    clearTimeout(frame);
};
const reducedMotion = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function useMotionPresence(visible, options) {
  const initiallyVisible = vue.toValue(visible);
  const mounted = vue.ref(initiallyVisible || Boolean(vue.toValue(options.forceRender)));
  const phase = vue.ref(initiallyVisible ? "entered" : "hidden");
  let enterFrame;
  let leaveTimer;
  const clearPending = () => {
    cancelFrame(enterFrame);
    enterFrame = void 0;
    if (leaveTimer !== void 0)
      clearTimeout(leaveTimer);
    leaveTimer = void 0;
  };
  const beginEnter = () => {
    clearPending();
    mounted.value = true;
    phase.value = "enter";
    enterFrame = requestFrame(() => {
      enterFrame = void 0;
      if (vue.toValue(visible))
        phase.value = "entered";
    });
  };
  const beginLeave = () => {
    clearPending();
    if (!mounted.value)
      return;
    phase.value = "leave";
    leaveTimer = setTimeout(() => {
      leaveTimer = void 0;
      phase.value = "hidden";
      if (vue.toValue(options.destroyOnHidden) && !vue.toValue(options.forceRender))
        mounted.value = false;
    }, reducedMotion() ? 0 : options.duration);
  };
  vue.watch(
    [() => vue.toValue(visible), () => Boolean(vue.toValue(options.forceRender))],
    ([isVisible, forceRender]) => {
      if (isVisible)
        beginEnter();
      else if (forceRender && !mounted.value) {
        clearPending();
        mounted.value = true;
        phase.value = "hidden";
      } else
        beginLeave();
    }
  );
  vue.onBeforeUnmount(clearPending);
  return { isMounted: vue.computed(() => mounted.value), phase };
}
exports.useMotionPresence = useMotionPresence;
