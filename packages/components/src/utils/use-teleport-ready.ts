import { onMounted, ref } from 'vue'

// Keep Teleport disabled during SSR hydration, then enable it after the client owns the DOM.
export function useTeleportReady() {
  const ready = ref(false)
  onMounted(() => {
    ready.value = true
  })
  return ready
}
