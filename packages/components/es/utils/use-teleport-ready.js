import { ref, onMounted } from "vue";
function useTeleportReady() {
  const ready = ref(false);
  onMounted(() => {
    ready.value = true;
  });
  return ready;
}
export {
  useTeleportReady
};
