import { watchEffect, toValue, onScopeDispose, nextTick } from "vue";
import { registerOverlay } from "./overlay-controller.js";
function useFloatingDismiss(options) {
  const overlayId = Symbol("aheart-floating-overlay");
  let unregister;
  let restoreZIndex;
  const cleanup = () => {
    unregister == null ? void 0 : unregister();
    unregister = void 0;
    restoreZIndex == null ? void 0 : restoreZIndex();
    restoreZIndex = void 0;
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
    var _a, _b;
    cleanup();
    if (typeof document === "undefined" || !toValue(options.open)) {
      return;
    }
    const trigger = toValue(options.trigger);
    const floating = toValue(options.floating);
    const ownerDocument = (trigger == null ? void 0 : trigger.ownerDocument) ?? (floating == null ? void 0 : floating.ownerDocument) ?? document;
    const HTMLElementConstructor = (_a = ownerDocument.defaultView) == null ? void 0 : _a.HTMLElement;
    const floatingElement = HTMLElementConstructor && floating instanceof HTMLElementConstructor ? floating : null;
    const originalZIndex = (floatingElement == null ? void 0 : floatingElement.style.zIndex) ?? "";
    const computedZIndex = Number.parseFloat(
      floatingElement ? ((_b = ownerDocument.defaultView) == null ? void 0 : _b.getComputedStyle(floatingElement).zIndex) ?? "" : ""
    );
    const baseZIndex = Number.isFinite(computedZIndex) ? computedZIndex : 0;
    restoreZIndex = floatingElement ? () => {
      floatingElement.style.zIndex = originalZIndex;
    } : void 0;
    unregister = registerOverlay({
      id: overlayId,
      document: ownerDocument,
      getTrigger: () => toValue(options.trigger),
      getContent: () => toValue(options.floating),
      escapeEnabled: () => toValue(options.open),
      getBaseZIndex: () => baseZIndex,
      onZIndexChange: (zIndex) => {
        const content = toValue(options.floating);
        if (HTMLElementConstructor && content instanceof HTMLElementConstructor) {
          content.style.zIndex = String(zIndex);
        }
      },
      onPointerDownOutside: (event) => {
        if (toValue(options.open))
          options.onDismiss("outside", event);
      },
      onEscape: (event) => {
        options.onDismiss("escape", event);
        if (toValue(options.restoreFocus) !== false) {
          void nextTick(() => {
            if (!toValue(options.open))
              focusTrigger();
          });
        }
      }
    });
    onCleanup(cleanup);
  });
  onScopeDispose(cleanup);
}
export {
  useFloatingDismiss
};
