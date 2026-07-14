import { computed, shallowRef } from "vue";
const activeDragData = shallowRef();
const isDragActive = computed(() => activeDragData.value !== void 0);
const currentDragData = computed(() => activeDragData.value);
const startDrag = (data) => {
  activeDragData.value = data;
};
const endDrag = () => {
  activeDragData.value = void 0;
};
export {
  currentDragData,
  endDrag,
  isDragActive,
  startDrag
};
