import { computed } from "vue";
import { useTeleportReady } from "./use-teleport-ready.js";
function useOverlayPortal(resolveTarget) {
  const ready = useTeleportReady();
  const target = computed(resolveTarget);
  return {
    shouldTeleport: computed(() => ready.value && target.value !== false),
    teleportTo: computed(() => target.value === false ? "body" : target.value)
  };
}
export {
  useOverlayPortal
};
