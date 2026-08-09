import { defineComponent, inject, ref, computed, onBeforeUnmount, watchEffect, openBlock, createElementBlock, normalizeClass, renderSlot, nextTick } from "vue";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point/element/adapter.js";
import { endDrag, startDrag } from "./drag-state.js";
import { sortableContextKey } from "./sortable-context.js";
import { moveSortableItem } from "./sortable-registry.js";
import { useDroppable } from "./use-droppable.js";
const _hoisted_1 = ["data-sortable-index", "tabindex", "aria-disabled"];
let activeTouchOwner;
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ASortableItem" },
  __name: "sortable-item",
  props: {
    item: {},
    index: {}
  },
  setup(__props) {
    const props = __props;
    const context = inject(sortableContextKey);
    if (!context) throw new Error("ASortableItem must be used inside ASortableList.");
    const sortableContext = context;
    const root = ref();
    const itemDisabled = computed(() => sortableContext.disabled.value || typeof props.item === "object" && props.item !== null && "disabled" in props.item && props.item.disabled === true);
    const data = computed(() => ({
      type: "aheart-sortable",
      listId: sortableContext.listId,
      group: sortableContext.group,
      index: props.index
    }));
    const isTouchDragging = ref(false);
    const dragHandle = ref();
    let touchSession;
    const removeTouchListeners = (session) => {
      session.document.removeEventListener("pointermove", handleTouchPointerMove);
      session.document.removeEventListener("pointerup", handleTouchPointerUp);
      session.document.removeEventListener("pointercancel", handleTouchPointerCancel);
      session.document.removeEventListener("visibilitychange", handleTouchVisibilityChange);
      session.window.removeEventListener("blur", handleTouchInterruption);
      session.window.removeEventListener("pagehide", handleTouchInterruption);
    };
    const clearTouchSession = (clearDragState = true) => {
      if (!touchSession) return;
      const session = touchSession;
      touchSession = void 0;
      if (activeTouchOwner === releaseTouchOwnership) activeTouchOwner = void 0;
      removeTouchListeners(session);
      if (session.started) {
        isTouchDragging.value = false;
        if (clearDragState) endDrag();
      }
    };
    function releaseTouchOwnership() {
      clearTouchSession();
    }
    const completeMove = (ownerDocument, sourceElement, targetListId, targetIndex, focusHandle, announcement) => {
      void nextTick(() => {
        var _a, _b;
        const destinationList = Array.from(ownerDocument.querySelectorAll(".aheart-dnd-sortable-list")).find((element) => element.dataset.aheartSortableListId === targetListId);
        const destinationItem = destinationList == null ? void 0 : destinationList.querySelector(`[data-sortable-index="${targetIndex}"]`);
        const moved = sourceElement.isConnected ? destinationItem === sourceElement : Boolean(destinationItem);
        if (!moved || !destinationList || !destinationItem) return;
        const destinationHandle = focusHandle ? destinationItem == null ? void 0 : destinationItem.querySelector("[data-aheart-dnd-handle]") : void 0;
        (_a = destinationHandle ?? destinationItem) == null ? void 0 : _a.focus({ preventScroll: true });
        const CustomEventConstructor = (_b = ownerDocument.defaultView) == null ? void 0 : _b.CustomEvent;
        if (CustomEventConstructor) {
          destinationList.dispatchEvent(new CustomEventConstructor("aheart-sortable-announce", { detail: announcement }));
        }
      });
    };
    function handleTouchPointerMove(event) {
      if (!touchSession || event.pointerId !== touchSession.pointerId) return;
      if (itemDisabled.value) {
        clearTouchSession();
        return;
      }
      if (!touchSession.started) {
        const distanceX = event.clientX - touchSession.startX;
        const distanceY = event.clientY - touchSession.startY;
        if (Math.hypot(distanceX, distanceY) < 6) return;
        touchSession.started = true;
        isTouchDragging.value = true;
        startDrag(touchSession.data);
      }
      event.preventDefault();
    }
    function handleTouchPointerUp(event) {
      if (!touchSession || event.pointerId !== touchSession.pointerId) return;
      const session = touchSession;
      if (session.started) {
        event.preventDefault();
        const target = session.document.elementFromPoint(event.clientX, event.clientY);
        const targetItem = target == null ? void 0 : target.closest(".aheart-dnd-sortable-item");
        const targetList = target == null ? void 0 : target.closest(".aheart-dnd-sortable-list");
        const targetListId = targetList == null ? void 0 : targetList.dataset.aheartSortableListId;
        if (targetListId && targetList.dataset.aheartSortableDisabled !== "true" && (!targetItem || targetItem.getAttribute("aria-disabled") !== "true")) {
          const targetIndex = targetItem ? Number(targetItem.dataset.sortableIndex) : targetList.querySelectorAll(".aheart-dnd-sortable-item").length;
          if (Number.isInteger(targetIndex)) {
            const sourceElement = root.value;
            const moved = moveSortableItem(session.data, targetListId, targetIndex);
            if (moved && sourceElement) {
              completeMove(
                session.document,
                sourceElement,
                targetListId,
                targetIndex,
                session.data.listId !== targetListId,
                session.data.listId === targetListId ? `已移动到第 ${targetIndex + 1} 项` : `已跨列表移动到第 ${targetIndex + 1} 项`
              );
            }
          }
        }
      }
      clearTouchSession();
    }
    function handleTouchPointerCancel(event) {
      if (!touchSession || event.pointerId !== touchSession.pointerId) return;
      clearTouchSession();
    }
    function handleTouchInterruption() {
      clearTouchSession();
    }
    function handleTouchVisibilityChange() {
      if ((touchSession == null ? void 0 : touchSession.document.visibilityState) === "hidden") clearTouchSession();
    }
    const handlePointerDown = (event) => {
      var _a;
      if (touchSession || activeTouchOwner || itemDisabled.value) return;
      if (event.pointerType !== "touch" || !event.isPrimary || event.button !== 0) return;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      const ownerWindow = ownerDocument == null ? void 0 : ownerDocument.defaultView;
      if (!ownerDocument || !ownerWindow) return;
      touchSession = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        data: { ...data.value },
        document: ownerDocument,
        window: ownerWindow,
        started: false
      };
      activeTouchOwner = releaseTouchOwnership;
      ownerDocument.addEventListener("pointermove", handleTouchPointerMove, { passive: false });
      ownerDocument.addEventListener("pointerup", handleTouchPointerUp);
      ownerDocument.addEventListener("pointercancel", handleTouchPointerCancel);
      ownerDocument.addEventListener("visibilitychange", handleTouchVisibilityChange);
      ownerWindow.addEventListener("blur", handleTouchInterruption);
      ownerWindow.addEventListener("pagehide", handleTouchInterruption);
    };
    const handleNativeDragStart = () => {
      clearTouchSession(false);
    };
    onBeforeUnmount(() => clearTouchSession());
    const setDragHandle = (element) => {
      var _a, _b;
      const candidate = element && "$el" in element ? element.$el : element;
      const ElementConstructor = (_b = (_a = candidate == null ? void 0 : candidate.ownerDocument) == null ? void 0 : _a.defaultView) == null ? void 0 : _b.Element;
      dragHandle.value = ElementConstructor && candidate instanceof ElementConstructor ? candidate : void 0;
    };
    const handleProps = {
      class: "aheart-dnd-sortable-handle",
      "data-aheart-dnd-handle": "",
      ref: setDragHandle,
      onPointerdown: handlePointerDown
    };
    const isDragging = ref(false);
    watchEffect((onCleanup) => {
      const target = root.value;
      const handle = dragHandle.value;
      if (!target) return;
      const cleanup = draggable({
        element: target,
        dragHandle: handle,
        getInitialData: () => data.value,
        canDrag: () => !itemDisabled.value,
        onDragStart: () => {
          isDragging.value = true;
          startDrag(data.value);
        },
        onDrop: () => {
          isDragging.value = false;
          endDrag();
        }
      });
      onCleanup(() => {
        cleanup();
        if (isDragging.value) {
          isDragging.value = false;
          endDrag();
        }
      });
    });
    useDroppable(root, {
      data,
      accept: "aheart-sortable",
      disabled: itemDisabled,
      onDrop: (source) => {
        if (source.type !== "aheart-sortable" || source.group !== sortableContext.group) return;
        sortableContext.move(source, props.index);
      }
    });
    const handleKeydown = (event) => {
      var _a;
      if (itemDisabled.value) return;
      if (!event.altKey || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const target = event.target && typeof event.target === "object" && "closest" in event.target ? event.target : void 0;
      const ownerDocument = (target == null ? void 0 : target.ownerDocument) ?? ((_a = root.value) == null ? void 0 : _a.ownerDocument);
      const sourceElement = root.value;
      if (!ownerDocument || !sourceElement) return;
      const focusHandle = Boolean(target == null ? void 0 : target.closest("[data-aheart-dnd-handle]"));
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        const targetIndex = props.index + (event.key === "ArrowUp" ? -1 : 1);
        context.move(data.value, targetIndex, true);
        completeMove(ownerDocument, sourceElement, sortableContext.listId, targetIndex, focusHandle, `已移动到第 ${targetIndex + 1} 项`);
        return;
      }
      const lists = Array.from(ownerDocument.querySelectorAll(".aheart-dnd-sortable-list"));
      const sourceListIndex = lists.findIndex((list) => list.dataset.aheartSortableListId === sortableContext.listId);
      for (let index = sourceListIndex + (event.key === "ArrowLeft" ? -1 : 1); index >= 0 && index < lists.length; index += event.key === "ArrowLeft" ? -1 : 1) {
        const targetList = lists[index];
        const targetListId = targetList.dataset.aheartSortableListId;
        if (!targetListId || targetList.dataset.aheartSortableDisabled === "true" || !sortableContext.group || targetList.dataset.aheartSortableGroup !== sortableContext.group) continue;
        const targetIndex = targetList.querySelectorAll(".aheart-dnd-sortable-item").length;
        if (moveSortableItem(data.value, targetListId, targetIndex)) {
          completeMove(ownerDocument, sourceElement, targetListId, targetIndex, focusHandle, `已跨列表移动到第 ${targetIndex + 1} 项`);
        }
        return;
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("li", {
        ref_key: "root",
        ref: root,
        class: normalizeClass(["aheart-dnd-sortable-item", { "aheart-dnd-dragging": isDragging.value || isTouchDragging.value }]),
        "data-sortable-index": __props.index,
        tabindex: itemDisabled.value ? -1 : 0,
        "aria-disabled": itemDisabled.value ? "true" : void 0,
        onDragstartCapture: handleNativeDragStart,
        onKeydown: handleKeydown
      }, [
        renderSlot(_ctx.$slots, "default", {
          item: __props.item,
          index: __props.index,
          handleProps
        })
      ], 42, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
