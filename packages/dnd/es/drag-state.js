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
const cancelNativeDrag = (ownerWindow) => {
  if (!ownerWindow) return;
  const event = ownerWindow.document.createEvent("MouseEvent");
  event.initEvent("dragend", true, true);
  ownerWindow.dispatchEvent(event);
};
export {
  cancelNativeDrag,
  currentDragData,
  endDrag,
  isDragActive,
  startDrag
};
