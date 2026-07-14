import { watchEffect, toValue, onScopeDispose, nextTick } from "vue";
function useFloatingDismiss(options) {
  let removeListeners;
  const cleanup = () => {
    removeListeners == null ? void 0 : removeListeners();
    removeListeners = void 0;
  };
  const focusTrigger = () => {
    const trigger = toValue(options.trigger);
    if (!trigger)
      return;
    const focusableSelector = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ].join(",");
    const target = trigger.matches(focusableSelector) ? trigger : trigger.querySelector(focusableSelector);
    target == null ? void 0 : target.focus();
  };
  watchEffect((onCleanup) => {
    cleanup();
    if (typeof document === "undefined" || !toValue(options.open)) {
      return;
    }
    const handlePointerDown = (event) => {
      const trigger = toValue(options.trigger);
      const floating = toValue(options.floating);
      const path = event.composedPath();
      if (trigger && path.includes(trigger) || floating && path.includes(floating)) {
        return;
      }
      options.onDismiss("outside", event);
    };
    const handleKeydown = (event) => {
      if (event.key !== "Escape") {
        return;
      }
      event.preventDefault();
      options.onDismiss("escape", event);
      if (toValue(options.restoreFocus) !== false) {
        void nextTick(() => {
          if (!toValue(options.open))
            focusTrigger();
        });
      }
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeydown, true);
    removeListeners = () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeydown, true);
    };
    onCleanup(cleanup);
  });
  onScopeDispose(cleanup);
}
export {
  useFloatingDismiss
};
