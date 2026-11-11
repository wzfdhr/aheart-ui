"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const overlayController = require("./overlay-controller.js");
const useOverlayPortal = require("./use-overlay-portal.js");
function useDialogLayer(options) {
  const target = vue.computed(() => {
    const container = options.getContainer();
    if (typeof container === "function")
      return typeof window === "undefined" ? false : container();
    return container ?? (typeof document === "undefined" ? false : document.body);
  });
  const portal = useOverlayPortal.useOverlayPortal(() => target.value);
  const effectiveZIndex = vue.ref(options.getZIndex());
  let trigger = null;
  let focusBeforeClose = null;
  let registration;
  const resolveDocument = () => {
    var _a;
    const container = target.value;
    return ((_a = options.content.value) == null ? void 0 : _a.ownerDocument) ?? (trigger == null ? void 0 : trigger.ownerDocument) ?? (typeof container === "object" ? container.ownerDocument : document);
  };
  const getActiveDocument = () => (registration == null ? void 0 : registration.ownerDocument) ?? resolveDocument();
  const register = () => {
    if (registration)
      return;
    const ownerDocument = resolveDocument();
    const unregister2 = overlayController.registerOverlay({
      id: options.id,
      document: ownerDocument,
      getTrigger: () => trigger,
      getContent: () => options.content.value,
      escapeEnabled: options.escapeEnabled,
      getBaseZIndex: options.getZIndex,
      onZIndexChange: (zIndex) => {
        effectiveZIndex.value = zIndex;
      },
      onEscape: options.onEscape
    });
    overlayController.lockBodyScroll(ownerDocument);
    registration = { ownerDocument, unregister: unregister2 };
  };
  const unregister = () => {
    if (!registration)
      return;
    registration.unregister();
    overlayController.unlockBodyScroll(registration.ownerDocument);
    registration = void 0;
  };
  vue.onBeforeUnmount(() => {
    unregister();
    trigger = null;
    focusBeforeClose = null;
  });
  vue.watch(options.getZIndex, (zIndex) => {
    if (registration)
      overlayController.refreshOverlayStack(registration.ownerDocument);
    else
      effectiveZIndex.value = zIndex;
  });
  const captureTrigger = () => {
    var _a;
    focusBeforeClose = null;
    const ownerDocument = resolveDocument();
    const HTMLElementConstructor = (_a = ownerDocument.defaultView) == null ? void 0 : _a.HTMLElement;
    const pointerTarget = overlayController.getRecentPointerTarget(ownerDocument);
    const active = ownerDocument.activeElement;
    trigger = HTMLElementConstructor && pointerTarget instanceof HTMLElementConstructor ? pointerTarget : HTMLElementConstructor && active instanceof HTMLElementConstructor ? active : null;
  };
  const captureFocusBeforeClose = (isLeaving) => {
    var _a, _b;
    const ownerDocument = getActiveDocument();
    const active = ownerDocument.activeElement;
    const HTMLElementConstructor = (_a = ownerDocument.defaultView) == null ? void 0 : _a.HTMLElement;
    focusBeforeClose = active;
    if (!HTMLElementConstructor || !(active instanceof HTMLElementConstructor) || !((_b = options.content.value) == null ? void 0 : _b.contains(active)))
      return;
    void vue.nextTick(() => {
      if (focusBeforeClose === active && isLeaving() && overlayController.isTopmost(options.id, ownerDocument) && active.isConnected && overlayController.canRestoreOverlayFocus(ownerDocument, active)) {
        active.focus();
      }
    });
  };
  const restoreTriggerFocus = (enabled) => {
    if (enabled && (trigger == null ? void 0 : trigger.isConnected) && overlayController.canRestoreOverlayFocus(trigger.ownerDocument, focusBeforeClose, options.content.value)) {
      trigger.focus();
    }
    focusBeforeClose = null;
  };
  return {
    ...portal,
    effectiveZIndex,
    getActiveDocument,
    register,
    unregister,
    prepare: () => overlayController.prepareOverlayDocument(resolveDocument()),
    isTopmost: () => overlayController.isTopmost(options.id, getActiveDocument()),
    captureTrigger,
    captureFocusBeforeClose,
    restoreTriggerFocus
  };
}
exports.useDialogLayer = useDialogLayer;
