"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const overlayController = require("./overlay-controller.js");
function useFloatingDismiss(options) {
  const overlayId = Symbol("aheart-floating-overlay");
  let unregister;
  let restoreZIndex;
  let disposed = false;
  const cleanup = () => {
    unregister == null ? void 0 : unregister();
    unregister = void 0;
    restoreZIndex == null ? void 0 : restoreZIndex();
    restoreZIndex = void 0;
  };
  const focusTrigger = () => {
    const trigger = vue.toValue(options.trigger);
    if (!trigger)
      return;
    const focusableSelector = [
      "button:not([disabled]):not([hidden]):not([inert])",
      "a[href]:not([hidden]):not([inert])",
      "input:not([disabled]):not([hidden]):not([inert])",
      "select:not([disabled]):not([hidden]):not([inert])",
      "textarea:not([disabled]):not([hidden]):not([inert])",
      '[tabindex]:not([tabindex="-1"]):not([hidden]):not([inert])'
    ].join(",");
    const isFocusable = (element) => !element.closest("[hidden], [inert]") && element.matches(focusableSelector);
    const target = isFocusable(trigger) ? trigger : Array.from(trigger.querySelectorAll(focusableSelector)).find(isFocusable);
    target == null ? void 0 : target.focus({ preventScroll: true });
  };
  vue.watchEffect((onCleanup) => {
    var _a, _b;
    cleanup();
    if (typeof document === "undefined" || !vue.toValue(options.open)) {
      return;
    }
    const trigger = vue.toValue(options.trigger);
    const floating = vue.toValue(options.floating);
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
    unregister = overlayController.registerOverlay({
      id: overlayId,
      document: ownerDocument,
      getTrigger: () => vue.toValue(options.trigger),
      getContent: () => vue.toValue(options.floating),
      escapeEnabled: () => vue.toValue(options.open),
      ignoreEscape: () => vue.toValue(options.ignoreEscape) === true,
      getBaseZIndex: () => baseZIndex,
      onZIndexChange: (zIndex) => {
        const content = vue.toValue(options.floating);
        if (HTMLElementConstructor && content instanceof HTMLElementConstructor) {
          content.style.zIndex = String(zIndex);
        }
      },
      onPointerDownOutside: (event) => {
        if (vue.toValue(options.open))
          options.onDismiss("outside", event);
      },
      onEscape: (event) => {
        const previousFocus = ownerDocument.activeElement;
        options.onDismiss("escape", event);
        if (vue.toValue(options.restoreFocus) === false)
          return;
        const isClosed = () => !disposed && !vue.toValue(options.open);
        void vue.nextTick(() => {
          var _a2;
          if (!isClosed() || !overlayController.canRestoreOverlayFocus(ownerDocument, previousFocus, floatingElement))
            return;
          focusTrigger();
          (_a2 = ownerDocument.defaultView) == null ? void 0 : _a2.requestAnimationFrame(() => {
            if (isClosed() && overlayController.canRestoreOverlayFocus(ownerDocument, void 0, floatingElement))
              focusTrigger();
          });
        });
      }
    });
    onCleanup(cleanup);
  });
  vue.onScopeDispose(() => {
    disposed = true;
    cleanup();
  });
}
exports.useFloatingDismiss = useFloatingDismiss;
