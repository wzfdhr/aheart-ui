import { ref, onBeforeUnmount } from "vue";
const usePointerDrag = (options) => {
  const isDragging = ref(false);
  let animationFrame;
  let latestEvent;
  let activePointerId;
  let dragShield;
  let previousCursor = "";
  let previousUserSelect = "";
  const getDocument = () => typeof document === "undefined" ? void 0 : document;
  const getCursor = () => (typeof options.cursor === "function" ? options.cursor() : options.cursor) ?? "default";
  const cancelFrame = () => {
    if (animationFrame === void 0) {
      return;
    }
    if (typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(animationFrame);
    } else {
      clearTimeout(animationFrame);
    }
    animationFrame = void 0;
  };
  const removeShield = () => {
    dragShield == null ? void 0 : dragShield.remove();
    dragShield = void 0;
  };
  const restoreDocument = () => {
    const currentDocument = getDocument();
    if (!currentDocument) {
      return;
    }
    currentDocument.body.style.cursor = previousCursor;
    currentDocument.body.style.userSelect = previousUserSelect;
  };
  const stop = (reason = "end") => {
    var _a;
    const currentDocument = getDocument();
    if (!isDragging.value || !currentDocument) {
      return;
    }
    if (reason === "end" && latestEvent) {
      cancelFrame();
      const finalEvent = latestEvent;
      latestEvent = void 0;
      options.onMove(finalEvent);
    } else {
      cancelFrame();
      latestEvent = void 0;
    }
    currentDocument.removeEventListener("pointermove", handleMove);
    currentDocument.removeEventListener("pointerup", handlePointerUp);
    currentDocument.removeEventListener("pointercancel", handlePointerCancel);
    window.removeEventListener("blur", handleWindowBlur);
    removeShield();
    restoreDocument();
    isDragging.value = false;
    activePointerId = void 0;
    (_a = options.onEnd) == null ? void 0 : _a.call(options, reason);
  };
  const flushMove = () => {
    animationFrame = void 0;
    const moveEvent = latestEvent;
    latestEvent = void 0;
    if (moveEvent) {
      options.onMove(moveEvent);
    }
  };
  const scheduleMove = () => {
    if (animationFrame !== void 0) {
      return;
    }
    animationFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame(flushMove) : window.setTimeout(flushMove, 16);
  };
  function handleMove(event) {
    if (!isDragging.value || !isActivePointer(event)) {
      return;
    }
    event.preventDefault();
    latestEvent = event;
    scheduleMove();
  }
  function handlePointerUp(event) {
    if (!isActivePointer(event)) {
      return;
    }
    stop("end");
  }
  function handlePointerCancel(event) {
    if (!isActivePointer(event)) {
      return;
    }
    stop("cancel");
  }
  function handleWindowBlur() {
    stop("blur");
  }
  function isActivePointer(event) {
    const pointerId = event.pointerId;
    return pointerId === void 0 || activePointerId === pointerId;
  }
  const createShield = (currentDocument) => {
    const shield = currentDocument.createElement("div");
    shield.dataset.aheartDragShield = "true";
    shield.style.position = "fixed";
    shield.style.inset = "0";
    shield.style.zIndex = "2147483647";
    shield.style.cursor = getCursor();
    shield.style.pointerEvents = "all";
    shield.style.background = "transparent";
    currentDocument.body.appendChild(shield);
    dragShield = shield;
  };
  const start = (event) => {
    var _a, _b;
    const currentDocument = getDocument();
    if (!currentDocument || isDragging.value || event.button !== void 0 && event.button !== 0) {
      return;
    }
    event.preventDefault();
    isDragging.value = true;
    activePointerId = event.pointerId;
    previousCursor = currentDocument.body.style.cursor;
    previousUserSelect = currentDocument.body.style.userSelect;
    currentDocument.body.style.cursor = getCursor();
    currentDocument.body.style.userSelect = "none";
    createShield(currentDocument);
    (_b = (_a = event.currentTarget) == null ? void 0 : _a.setPointerCapture) == null ? void 0 : _b.call(_a, event.pointerId);
    currentDocument.addEventListener("pointermove", handleMove);
    currentDocument.addEventListener("pointerup", handlePointerUp);
    currentDocument.addEventListener("pointercancel", handlePointerCancel);
    window.addEventListener("blur", handleWindowBlur);
  };
  onBeforeUnmount(() => stop("unmount"));
  return {
    isDragging,
    start,
    stop
  };
};
export {
  usePointerDrag
};
