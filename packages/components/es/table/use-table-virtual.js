import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { getVirtualRange } from "./virtual-rows.js";
function useTableVirtual(options, count, scrollElement) {
  const scrollTop = ref(0);
  const measured = ref(/* @__PURE__ */ new Map());
  const range = computed(() => options.value.enabled ? getVirtualRange(count.value, scrollTop.value, options.value.height, options.value.estimateSize, options.value.overscan, measured.value) : { start: 0, end: count.value, top: 0, bottom: 0 });
  const onScroll = () => {
    var _a;
    scrollTop.value = ((_a = scrollElement.value) == null ? void 0 : _a.scrollTop) ?? 0;
  };
  const setMeasured = (index, height) => {
    if (height > 0) {
      const next = new Map(measured.value);
      next.set(index, height);
      measured.value = next;
    }
  };
  onMounted(() => {
    var _a;
    return (_a = scrollElement.value) == null ? void 0 : _a.addEventListener("scroll", onScroll, { passive: true });
  });
  onBeforeUnmount(() => {
    var _a;
    return (_a = scrollElement.value) == null ? void 0 : _a.removeEventListener("scroll", onScroll);
  });
  return { range, scrollTop, measured, setMeasured, onScroll };
}
export {
  useTableVirtual
};
