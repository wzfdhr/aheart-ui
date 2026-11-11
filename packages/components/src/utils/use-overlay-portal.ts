import { computed } from 'vue'
import { useTeleportReady } from './use-teleport-ready'

/** Keep content inline through hydration and when a consumer returns false. */
export function useOverlayPortal(resolveTarget: () => HTMLElement | string | false) {
  const ready = useTeleportReady()
  const target = computed(resolveTarget)

  return {
    shouldTeleport: computed(() => ready.value && target.value !== false),
    teleportTo: computed(() => target.value === false ? 'body' : target.value)
  }
}
