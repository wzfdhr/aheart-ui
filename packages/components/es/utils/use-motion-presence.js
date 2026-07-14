import { toValue, ref, watch, onBeforeUnmount, computed } from "vue";
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
  const initiallyVisible = toValue(visible);
  const mounted = ref(initiallyVisible || Boolean(toValue(options.forceRender)));
  const phase = ref(initiallyVisible ? "entered" : "hidden");
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
      if (toValue(visible))
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
      if (toValue(options.destroyOnHidden) && !toValue(options.forceRender))
        mounted.value = false;
    }, reducedMotion() ? 0 : options.duration);
  };
  watch(
    [() => toValue(visible), () => Boolean(toValue(options.forceRender))],
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
  onBeforeUnmount(clearPending);
  return { isMounted: computed(() => mounted.value), phase };
}
export {
  useMotionPresence
};
