"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const message_vue_vue_type_script_setup_true_lang = require("./message.vue.js");
const state = vue.reactive({
  notices: [],
  top: 8,
  duration: 3
});
let app;
let container;
let seed = 0;
const timers = /* @__PURE__ */ new Map();
const normalizeTop = (top) => top ?? state.top;
const ensureHost = () => {
  if (typeof document === "undefined") {
    return;
  }
  if (app && container) {
    return;
  }
  container = document.createElement("div");
  container.className = "aheart-message-root";
  document.body.appendChild(container);
  app = vue.createApp({
    render() {
      return vue.h(message_vue_vue_type_script_setup_true_lang.default, {
        notices: state.notices,
        top: state.top,
        onClose: closeNotice
      });
    }
  });
  app.mount(container);
};
const nextKey = () => `aheart-message-${Date.now()}-${seed++}`;
const normalizeArgs = (type, contentOrConfig, duration, onClose) => {
  if (typeof contentOrConfig === "string") {
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
};
const scheduleClose = (notice) => {
  clearTimer(notice.key);
  if (notice.duration === 0) {
    return;
  }
  timers.set(
    notice.key,
    setTimeout(() => {
      closeNotice(notice.key);
    }, (notice.duration ?? state.duration) * 1e3)
  );
};
const closeNotice = (key) => {
  var _a;
  const notice = state.notices.find((item) => item.key === key);
  clearTimer(key);
  state.notices = state.notices.filter((item) => item.key !== key);
  (_a = notice == null ? void 0 : notice.onClose) == null ? void 0 : _a.call(notice);
};
const open = (contentOrConfig, duration, onClose) => {
  const config2 = normalizeArgs("info", contentOrConfig, duration, onClose);
  const key = config2.key ?? nextKey();
  const notice = {
    key,
    type: config2.type ?? "info",
    content: config2.content,
    duration: config2.duration ?? state.duration,
    onClose: config2.onClose
  };
  const existingIndex = state.notices.findIndex((item) => item.key === key);
  ensureHost();
  if (existingIndex >= 0) {
    state.notices.splice(existingIndex, 1, notice);
  } else {
    state.notices.push(notice);
  }
  if (state.maxCount && state.notices.length > state.maxCount) {
    const removed = state.notices.splice(0, state.notices.length - state.maxCount);
    removed.forEach((item) => clearTimer(item.key));
  }
  scheduleClose(notice);
  return {
    key,
    close: () => closeNotice(key)
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
  state.notices = [];
  state.top = 8;
  state.duration = 3;
  state.maxCount = void 0;
};
const config = (options) => {
  if (options.top !== void 0) {
    state.top = normalizeTop(options.top);
  }
  if (options.duration !== void 0) {
    state.duration = options.duration;
  }
  state.maxCount = options.maxCount;
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
