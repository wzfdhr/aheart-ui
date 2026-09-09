import { acquireDndLiveRegion, disposeDndLiveRegion, announceDnd } from "./dnd-announcer.js";
const sessions = /* @__PURE__ */ new WeakMap();
const registrations = /* @__PURE__ */ new WeakMap();
let sessionCounter = 0;
const rootKey = (event) => event.target === event.currentTarget && (event.key === " " || event.key === "Enter");
const compatible = (session, zone) => !zone.isDisabled() && (!zone.accepts || zone.accepts(session.data)) && zone.getScope() === session.sourceScope;
function updateKeyboardState(ownerDocument) {
  const session = sessions.get(ownerDocument);
  for (const registration of registrations.get(ownerDocument) ?? []) {
    if (registration.kind === "source") {
      registration.element.classList.toggle("aheart-dnd-keyboard-grabbed", Boolean((session == null ? void 0 : session.element) === registration.element));
      registration.element.dataset.aheartDndKeyboardState = (session == null ? void 0 : session.element) === registration.element ? "grabbed" : "idle";
      registration.element.setAttribute("aria-pressed", (session == null ? void 0 : session.element) === registration.element ? "true" : "false");
    } else {
      const isCompatible = Boolean(session && compatible(session, registration));
      registration.element.classList.toggle("aheart-dnd-keyboard-compatible", isCompatible);
      registration.element.dataset.aheartDndKeyboardState = session ? isCompatible ? "compatible" : "incompatible" : "idle";
      registration.element.setAttribute("aria-dropeffect", session ? isCompatible ? "move" : "none" : "none");
    }
  }
}
function makeSessionId() {
  return `aheart-keyboard-${Date.now().toString(36)}-${(++sessionCounter).toString(36)}`;
}
function cancel(ownerDocument, reason) {
  var _a;
  const session = sessions.get(ownerDocument);
  if (!session) return;
  sessions.set(ownerDocument, void 0);
  updateKeyboardState(ownerDocument);
  (_a = session.onCancel) == null ? void 0 : _a.call(session, {
    sessionId: session.sessionId,
    data: session.data,
    source: { label: session.sourceLabel, scopeKey: session.sourceScope },
    reason
  });
  if (reason !== "owner-detached" && session.sourceElement.isConnected) session.sourceElement.focus({ preventScroll: true });
}
function ensureDocumentListeners(ownerDocument) {
  var _a;
  const win = ownerDocument.defaultView;
  const frameElement = win == null ? void 0 : win.frameElement;
  let interruptionTimer;
  const deferInterruption = () => {
    if (!win) {
      cancel(ownerDocument, "page-hidden");
      return;
    }
    if (interruptionTimer !== void 0) return;
    interruptionTimer = win.setTimeout(() => {
      interruptionTimer = void 0;
      if (!sessions.get(ownerDocument)) return;
      cancel(ownerDocument, frameElement && !frameElement.isConnected ? "owner-detached" : "page-hidden");
    }, 0);
  };
  const keydown = (event) => {
    if (event.key === "Escape") cancel(ownerDocument, "cancelled");
  };
  const visibility = () => {
    if (ownerDocument.visibilityState === "hidden") deferInterruption();
  };
  const pagehide = () => deferInterruption();
  ownerDocument.addEventListener("keydown", keydown, true);
  ownerDocument.addEventListener("visibilitychange", visibility);
  win == null ? void 0 : win.addEventListener("pagehide", pagehide);
  let frameObserver;
  const ParentObserver = (_a = frameElement == null ? void 0 : frameElement.ownerDocument.defaultView) == null ? void 0 : _a.MutationObserver;
  if (frameElement && ParentObserver) {
    frameObserver = new ParentObserver(() => {
      var _a2, _b;
      if (!frameElement.isConnected) {
        cancel(ownerDocument, "owner-detached");
        (_a2 = documentCleanup.get(ownerDocument)) == null ? void 0 : _a2();
        for (const release of liveReleases.get(ownerDocument) ?? []) release();
        disposeDndLiveRegion(ownerDocument);
        liveReleases.delete(ownerDocument);
        (_b = registrations.get(ownerDocument)) == null ? void 0 : _b.clear();
        registrations.delete(ownerDocument);
        documentCleanup.delete(ownerDocument);
      }
    });
    frameObserver.observe(frameElement.ownerDocument, { childList: true, subtree: true });
  }
  return () => {
    if (interruptionTimer !== void 0) win == null ? void 0 : win.clearTimeout(interruptionTimer);
    interruptionTimer = void 0;
    ownerDocument.removeEventListener("keydown", keydown, true);
    ownerDocument.removeEventListener("visibilitychange", visibility);
    win == null ? void 0 : win.removeEventListener("pagehide", pagehide);
    frameObserver == null ? void 0 : frameObserver.disconnect();
  };
}
const documentCleanup = /* @__PURE__ */ new WeakMap();
const liveReleases = /* @__PURE__ */ new WeakMap();
function register(registration, kind) {
  const ownerDocument = registration.element.ownerDocument;
  let set = registrations.get(ownerDocument);
  if (!set) {
    set = /* @__PURE__ */ new Set();
    registrations.set(ownerDocument, set);
    documentCleanup.set(ownerDocument, ensureDocumentListeners(ownerDocument));
  }
  set.add(registration);
  const releaseLiveRegion = acquireDndLiveRegion(ownerDocument);
  let releases = liveReleases.get(ownerDocument);
  if (!releases) {
    releases = /* @__PURE__ */ new Set();
    liveReleases.set(ownerDocument, releases);
  }
  releases.add(releaseLiveRegion);
  const keydown = (event) => {
    var _a;
    if (!rootKey(event)) return;
    if (registration.isDisabled()) {
      announceDnd(ownerDocument, kind === "zone" ? "目标已禁用" : "项目已禁用");
      return;
    }
    if (kind === "source") {
      const current = sessions.get(ownerDocument);
      if (current) cancel(ownerDocument, "replaced");
      const data = { ...registration.getData() };
      const session2 = {
        ...registration,
        sessionId: makeSessionId(),
        data,
        sourceLabel: registration.getLabel(),
        sourceScope: registration.getScope(),
        sourceElement: registration.element
      };
      sessions.set(ownerDocument, session2);
      updateKeyboardState(ownerDocument);
      event.preventDefault();
      const payload2 = { sessionId: session2.sessionId, data, source: { label: session2.sourceLabel, scopeKey: session2.sourceScope } };
      registration.onGrab(payload2);
      announceDnd(ownerDocument, `${session2.sourceLabel}，已抓取`);
      return;
    }
    const session = sessions.get(ownerDocument);
    if (!session) {
      announceDnd(ownerDocument, `${registration.getLabel()}，没有可放置的项目`);
      return;
    }
    event.preventDefault();
    const reason = registration.isDisabled() ? "目标已禁用" : registration.getScope() !== session.sourceScope ? "目标不在当前页面" : registration.accepts && !registration.accepts(session.data) ? "类型不匹配，拒绝放置" : void 0;
    if (reason) {
      announceDnd(ownerDocument, reason);
      return;
    }
    sessions.set(ownerDocument, void 0);
    updateKeyboardState(ownerDocument);
    const payload = {
      sessionId: session.sessionId,
      data: session.data,
      source: { label: session.sourceLabel, scopeKey: session.sourceScope },
      target: { label: registration.getLabel(), scopeKey: registration.getScope() }
    };
    (_a = registration.onDrop) == null ? void 0 : _a.call(registration, session.data, payload);
    announceDnd(ownerDocument, `${session.sourceLabel}，已放置到${registration.getLabel()}`);
  };
  registration.element.addEventListener("keydown", keydown);
  const focus = () => {
    if (kind !== "zone") return;
    const session = sessions.get(ownerDocument);
    if (!session) return;
    announceDnd(ownerDocument, compatible(session, registration) ? `${registration.getLabel()}，可放置` : `${registration.getLabel()}，类型不匹配`);
  };
  registration.element.addEventListener("focus", focus);
  return () => {
    var _a, _b;
    const current = sessions.get(ownerDocument);
    if ((current == null ? void 0 : current.element) === registration.element) cancel(ownerDocument, "unmounted");
    registration.element.removeEventListener("keydown", keydown);
    registration.element.removeEventListener("focus", focus);
    releaseLiveRegion();
    (_a = liveReleases.get(ownerDocument)) == null ? void 0 : _a.delete(releaseLiveRegion);
    set.delete(registration);
    updateKeyboardState(ownerDocument);
    if (set.size === 0) {
      (_b = documentCleanup.get(ownerDocument)) == null ? void 0 : _b();
      documentCleanup.delete(ownerDocument);
      registrations.delete(ownerDocument);
    }
  };
}
function registerKeyboardSource(registration) {
  return register({ ...registration, kind: "source" }, "source");
}
function registerKeyboardZone(registration) {
  return register({ ...registration, kind: "zone" }, "zone");
}
function cancelKeyboardScope(ownerDocument, scopeKey) {
  const session = sessions.get(ownerDocument);
  if (session && session.sourceScope !== scopeKey) cancel(ownerDocument, "scope-changed");
}
export {
  cancelKeyboardScope,
  registerKeyboardSource,
  registerKeyboardZone
};
