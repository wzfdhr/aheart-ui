"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const message_vue_vue_type_script_setup_true_lang = require("./message.vue.js");
const state = vue.shallowReactive({
  top: 8,
  duration: 3,
  rtl: false,
  pauseOnHover: true
});
const notices = vue.shallowRef([]);
let app;
let container;
let hostContainer;
let seed = 0;
const timers = /* @__PURE__ */ new Map();
const timerMeta = /* @__PURE__ */ new Map();
const closeResolvers = /* @__PURE__ */ new Map();
const normalizeTop = (top) => top ?? state.top;
const stringifyKey = (key) => String(key);
const getTargetContainer = () => {
  var _a;
  return ((_a = state.getContainer) == null ? void 0 : _a.call(state)) ?? document.body;
};
const unmountHost = () => {
  if (app) {
    app.unmount();
    app = void 0;
  }
  if (container == null ? void 0 : container.parentNode) {
    container.parentNode.removeChild(container);
  }
  container = void 0;
  hostContainer = void 0;
};
const ensureHost = () => {
  if (typeof document === "undefined") {
    return;
  }
  const targetContainer = getTargetContainer();
  if (app && container && hostContainer === targetContainer) {
    return;
  }
  if (app || container) {
    unmountHost();
  }
  container = document.createElement("div");
  container.className = "aheart-message-root";
  targetContainer.appendChild(container);
  hostContainer = targetContainer;
  app = vue.createApp({
    render() {
      return vue.h(message_vue_vue_type_script_setup_true_lang.default, {
        notices: notices.value,
        top: state.top,
        prefixCls: state.prefixCls,
        rtl: state.rtl,
        stack: state.stack,
        onClose: closeNotice,
        onNoticeMouseEnter: pauseNotice,
        onNoticeMouseLeave: resumeNotice
      });
    }
  });
  app.mount(container);
};
const nextKey = () => `aheart-message-${Date.now()}-${seed++}`;
const isMessageOpenConfig = (value) => {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && "content" in value);
};
const normalizeArgs = (type, contentOrConfig, duration, onClose) => {
  if (!isMessageOpenConfig(contentOrConfig)) {
    return {
      type,
      content: contentOrConfig,
      duration,
      onClose
    };
  }
  return {
    ...contentOrConfig,
    type: contentOrConfig.type ?? type,
    duration: contentOrConfig.duration ?? duration,
    onClose: contentOrConfig.onClose ?? onClose
  };
};
const clearTimer = (key) => {
  const timer = timers.get(key);
  if (timer) {
    clearTimeout(timer);
    timers.delete(key);
  }
  timerMeta.delete(key);
};
const scheduleClose = (notice) => {
  const key = stringifyKey(notice.key);
  clearTimer(key);
  if (notice.duration === 0) {
    return;
  }
  const remaining = (notice.duration ?? state.duration) * 1e3;
  timerMeta.set(key, {
    start: Date.now(),
    remaining
  });
  timers.set(
    key,
    setTimeout(() => {
      closeNotice(notice.key);
    }, remaining)
  );
};
const resolveClose = (key) => {
  const resolvers = closeResolvers.get(key);
  if (!resolvers) {
    return;
  }
  resolvers.forEach((resolve) => resolve());
  closeResolvers.delete(key);
};
const closeNotice = (key) => {
  var _a;
  const notice = notices.value.find((item) => item.key === key);
  const normalizedKey = stringifyKey(key);
  clearTimer(normalizedKey);
  notices.value = notices.value.filter((item) => item.key !== key);
  (_a = notice == null ? void 0 : notice.onClose) == null ? void 0 : _a.call(notice);
  resolveClose(normalizedKey);
};
const pauseNotice = (key) => {
  const normalizedKey = stringifyKey(key);
  const notice = notices.value.find((item) => item.key === key);
  if (!notice || !notice.pauseOnHover) {
    return;
  }
  const meta = timerMeta.get(normalizedKey);
  const timer = timers.get(normalizedKey);
  if (!meta || !timer) {
    return;
  }
  clearTimeout(timer);
  timers.delete(normalizedKey);
  meta.remaining = Math.max(0, meta.remaining - (Date.now() - meta.start));
  timerMeta.set(normalizedKey, meta);
};
const resumeNotice = (key) => {
  const normalizedKey = stringifyKey(key);
  const notice = notices.value.find((item) => item.key === key);
  const meta = timerMeta.get(normalizedKey);
  if (!notice || !notice.pauseOnHover || !meta || timers.has(normalizedKey)) {
    return;
  }
  meta.start = Date.now();
  timers.set(
    normalizedKey,
    setTimeout(() => {
      closeNotice(key);
    }, meta.remaining)
  );
};
const open = (contentOrConfig, duration, onClose) => {
  const config2 = normalizeArgs("info", contentOrConfig, duration, onClose);
  const key = config2.key ?? nextKey();
  const normalizedKey = stringifyKey(key);
  let resolveClosePromise;
  const closePromise = new Promise((resolve) => {
    resolveClosePromise = resolve;
  });
  const notice = {
    key,
    type: config2.type ?? "info",
    content: config2.content,
    duration: config2.duration ?? state.duration,
    className: config2.className,
    style: config2.style,
    icon: config2.icon,
    closable: config2.closable,
    closeIcon: config2.closeIcon,
    onClick: config2.onClick,
    onClose: config2.onClose,
    pauseOnHover: config2.pauseOnHover ?? state.pauseOnHover,
    classNames: config2.classNames,
    styles: config2.styles
  };
  const nextNotices = notices.value.slice();
  const existingIndex = nextNotices.findIndex((item) => item.key === key);
  ensureHost();
  if (existingIndex >= 0) {
    nextNotices.splice(existingIndex, 1, notice);
  } else {
    nextNotices.push(notice);
  }
  if (state.maxCount && nextNotices.length > state.maxCount) {
    const removed = nextNotices.splice(0, nextNotices.length - state.maxCount);
    removed.forEach((item) => {
      const removedKey = stringifyKey(item.key);
      clearTimer(removedKey);
      resolveClose(removedKey);
    });
  }
  notices.value = nextNotices;
  closeResolvers.set(normalizedKey, [...closeResolvers.get(normalizedKey) ?? [], resolveClosePromise]);
  scheduleClose(notice);
  return {
    key,
    close: () => closeNotice(key),
    then: closePromise.then.bind(closePromise)
  };
};
const typedOpen = (type) => (contentOrConfig, duration, onClose) => {
  const config2 = normalizeArgs(type, contentOrConfig, duration, onClose);
  return open(config2);
};
const destroy = (key) => {
  if (key) {
    closeNotice(key);
    return;
  }
  Array.from(timers.keys()).forEach(clearTimer);
  Array.from(closeResolvers.keys()).forEach(resolveClose);
  notices.value = [];
  state.top = 8;
  state.duration = 3;
  state.maxCount = void 0;
  state.stack = void 0;
  state.getContainer = void 0;
  state.prefixCls = void 0;
  state.rtl = false;
  state.pauseOnHover = true;
  unmountHost();
};
const config = (options) => {
  const previousContainer = hostContainer;
  if (options.top !== void 0) {
    state.top = normalizeTop(options.top);
  }
  if (options.duration !== void 0) {
    state.duration = options.duration;
  }
  state.maxCount = options.maxCount;
  if (options.stack !== void 0) {
    state.stack = options.stack;
  }
  if (options.getContainer !== void 0) {
    state.getContainer = options.getContainer;
  }
  if (options.prefixCls !== void 0) {
    state.prefixCls = options.prefixCls;
  }
  if (options.rtl !== void 0) {
    state.rtl = options.rtl;
  }
  if (options.pauseOnHover !== void 0) {
    state.pauseOnHover = options.pauseOnHover;
  }
  if (typeof document !== "undefined" && previousContainer && previousContainer !== getTargetContainer()) {
    ensureHost();
  }
};
const message = {
  open,
  success: typedOpen("success"),
  info: typedOpen("info"),
  warning: typedOpen("warning"),
  error: typedOpen("error"),
  loading: typedOpen("loading"),
  destroy,
  config
};
exports.message = message;
