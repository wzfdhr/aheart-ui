const records = /* @__PURE__ */ new WeakMap();
const listeners = /* @__PURE__ */ new WeakMap();
const locks = /* @__PURE__ */ new WeakMap();
const recentPointerTargets = /* @__PURE__ */ new WeakMap();
const INTERACTIVE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
const getRecords = (ownerDocument) => {
  let value = records.get(ownerDocument);
  if (!value) {
    value = [];
    records.set(ownerDocument, value);
  }
  return value;
};
const isEscapeEnabled = (record) => typeof record.escapeEnabled === "function" ? record.escapeEnabled() : record.escapeEnabled !== false;
const getElement = (getter) => (getter == null ? void 0 : getter()) ?? null;
const getRecentPointerTarget = (ownerDocument = document, maxAge = 500) => {
  const recent = recentPointerTargets.get(ownerDocument);
  return recent && Date.now() - recent.recordedAt <= maxAge ? recent.target : null;
};
const refreshOverlayStack = (ownerDocument = document) => {
  var _a;
  let previousZIndex = Number.NEGATIVE_INFINITY;
  for (const record of getRecords(ownerDocument)) {
    if (!record.onZIndexChange)
      continue;
    const baseZIndex = ((_a = record.getBaseZIndex) == null ? void 0 : _a.call(record)) ?? 0;
    const zIndex = Number.isFinite(previousZIndex) ? Math.max(baseZIndex, previousZIndex + 10) : baseZIndex;
    record.onZIndexChange(zIndex);
    previousZIndex = zIndex;
  }
};
const containsTarget = (record, targets) => {
  var _a;
  const NodeConstructor = (_a = record.document.defaultView) == null ? void 0 : _a.Node;
  return targets.some(
    (target) => Boolean(
      NodeConstructor && target instanceof NodeConstructor && [getElement(record.getTrigger), getElement(record.getContent)].some((element) => element == null ? void 0 : element.contains(target))
    )
  );
};
const isTargetInOverlayTree = (id, target, ownerDocument = document) => {
  const stack = getRecords(ownerDocument);
  const record = stack.find((entry) => entry.id === id);
  if (!record)
    return false;
  const targets = Array.isArray(target) ? target : [target];
  if (containsTarget(record, targets))
    return true;
  const getParent = (child) => {
    const childIndex = stack.indexOf(child);
    const childTrigger = getElement(child.getTrigger);
    const childContent = getElement(child.getContent);
    for (let index = childIndex - 1; index >= 0; index -= 1) {
      const candidate = stack[index];
      const candidateContent = getElement(candidate.getContent);
      if (candidateContent && (candidateContent.contains(childTrigger) || candidateContent.contains(childContent))) {
        return candidate;
      }
    }
  };
  return stack.some((candidate) => {
    if (candidate.id === id || !containsTarget(candidate, targets))
      return false;
    const visited = /* @__PURE__ */ new Set();
    let parent = getParent(candidate);
    while (parent && !visited.has(parent.id)) {
      if (parent.id === id)
        return true;
      visited.add(parent.id);
      parent = getParent(parent);
    }
    return false;
  });
};
const ensureListeners = (ownerDocument) => {
  if (listeners.has(ownerDocument))
    return;
  const keydown = (event) => {
    var _a;
    recentPointerTargets.delete(ownerDocument);
    if (event.key !== "Escape")
      return;
    const stack = getRecords(ownerDocument);
    const top = stack[stack.length - 1];
    if (!top)
      return;
    event.preventDefault();
    event.stopPropagation();
    if (isEscapeEnabled(top))
      (_a = top.onEscape) == null ? void 0 : _a.call(top, event);
  };
  const pointerdown = (event) => {
    var _a, _b, _c;
    const ElementConstructor = (_a = ownerDocument.defaultView) == null ? void 0 : _a.Element;
    const pathTarget = (((_b = event.composedPath) == null ? void 0 : _b.call(event)) ?? [event.target]).find(
      (target) => ElementConstructor && target instanceof ElementConstructor
    );
    const pathElement = ElementConstructor && pathTarget instanceof ElementConstructor ? pathTarget : null;
    const pointerTarget = (pathElement == null ? void 0 : pathElement.closest(INTERACTIVE_SELECTOR)) ?? pathElement;
    if (pointerTarget)
      recentPointerTargets.set(ownerDocument, { target: pointerTarget, recordedAt: Date.now() });
    const stack = getRecords(ownerDocument);
    const top = stack[stack.length - 1];
    const path = ((_c = event.composedPath) == null ? void 0 : _c.call(event)) ?? [event.target];
    if (!top || !top.onPointerDownOutside || isTargetInOverlayTree(top.id, path, ownerDocument))
      return;
    top.onPointerDownOutside(event);
  };
  ownerDocument.addEventListener("keydown", keydown, true);
  ownerDocument.addEventListener("pointerdown", pointerdown, true);
  listeners.set(ownerDocument, { keydown, pointerdown });
};
const prepareOverlayDocument = (ownerDocument = document) => {
  ensureListeners(ownerDocument);
};
const registerOverlay = (registration) => {
  const ownerDocument = registration.document ?? document;
  const stack = getRecords(ownerDocument);
  const existing = stack.findIndex((entry) => entry.id === registration.id);
  if (existing >= 0)
    stack.splice(existing, 1);
  stack.push({ ...registration, document: ownerDocument });
  refreshOverlayStack(ownerDocument);
  ensureListeners(ownerDocument);
  return () => unregisterOverlay(registration.id, ownerDocument);
};
const unregisterOverlay = (id, ownerDocument = document) => {
  const stack = getRecords(ownerDocument);
  const index = stack.findIndex((entry) => entry.id === id);
  if (index >= 0)
    stack.splice(index, 1);
  refreshOverlayStack(ownerDocument);
  if (stack.length === 0) {
    records.delete(ownerDocument);
  }
};
const isTopmost = (id, ownerDocument = document) => {
  var _a;
  const stack = getRecords(ownerDocument);
  return ((_a = stack[stack.length - 1]) == null ? void 0 : _a.id) === id;
};
const lockBodyScroll = (ownerDocument = document) => {
  var _a, _b;
  const body = ownerDocument.body;
  if (!body)
    return;
  const state = locks.get(ownerDocument);
  if (state) {
    state.count += 1;
    return;
  }
  const paddingRight = body.style.paddingRight;
  const viewportWidth = ((_a = ownerDocument.defaultView) == null ? void 0 : _a.innerWidth) ?? 0;
  const contentWidth = ownerDocument.documentElement.clientWidth;
  const scrollbarWidth = contentWidth > 0 ? Math.max(0, viewportWidth - contentWidth) : 0;
  locks.set(ownerDocument, { count: 1, overflow: body.style.overflow, paddingRight });
  if (scrollbarWidth > 0) {
    const currentPadding = Number.parseFloat(((_b = ownerDocument.defaultView) == null ? void 0 : _b.getComputedStyle(body).paddingRight) ?? "0") || 0;
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }
  body.style.overflow = "hidden";
};
const unlockBodyScroll = (ownerDocument = document) => {
  const state = locks.get(ownerDocument);
  if (!state)
    return;
  state.count -= 1;
  if (state.count > 0)
    return;
  if (ownerDocument.body) {
    ownerDocument.body.style.overflow = state.overflow;
    ownerDocument.body.style.paddingRight = state.paddingRight;
  }
  locks.delete(ownerDocument);
};
export {
  getRecentPointerTarget,
  isTargetInOverlayTree,
  isTopmost,
  lockBodyScroll,
  prepareOverlayDocument,
  refreshOverlayStack,
  registerOverlay,
  unlockBodyScroll,
  unregisterOverlay
};
