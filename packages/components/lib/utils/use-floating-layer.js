"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const useFloatingDismiss = require("./use-floating-dismiss.js");
const useFloatingPosition = require("./use-floating-position.js");
const useOverlayPortal = require("./use-overlay-portal.js");
function useFloatingLayer({ reference, floating, getPopupContainer, position, dismiss }) {
  const portal = useOverlayPortal.useOverlayPortal(() => {
    const trigger = vue.toValue(reference);
    if (!trigger)
      return false;
    const resolveContainer = getPopupContainer == null ? void 0 : getPopupContainer();
    return resolveContainer ? resolveContainer(trigger) : trigger.ownerDocument.body;
  });
  const floatingPosition = useFloatingPosition.useFloatingPosition({ ...position, reference, floating });
  useFloatingDismiss.useFloatingDismiss({ ...dismiss, trigger: reference, floating });
  return { ...portal, floatingPosition };
}
exports.useFloatingLayer = useFloatingLayer;
