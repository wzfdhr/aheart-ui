import { toValue } from "vue";
import { useFloatingDismiss } from "./use-floating-dismiss.js";
import { useFloatingPosition } from "./use-floating-position.js";
import { useOverlayPortal } from "./use-overlay-portal.js";
function useFloatingLayer({ reference, floating, getPopupContainer, position, dismiss }) {
  const portal = useOverlayPortal(() => {
    const trigger = toValue(reference);
    if (!trigger)
      return false;
    const resolveContainer = getPopupContainer == null ? void 0 : getPopupContainer();
    return resolveContainer ? resolveContainer(trigger) : trigger.ownerDocument.body;
  });
  const floatingPosition = useFloatingPosition({ ...position, reference, floating });
  useFloatingDismiss({ ...dismiss, trigger: reference, floating });
  return { ...portal, floatingPosition };
}
export {
  useFloatingLayer
};
