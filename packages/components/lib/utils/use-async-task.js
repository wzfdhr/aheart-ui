"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const useAsyncTask = (task, options = {}) => {
  const status = vue.shallowRef("idle");
  const data = vue.shallowRef();
  const error = vue.shallowRef();
  let requestId = 0;
  let controller;
  const abort = () => {
    requestId += 1;
    controller == null ? void 0 : controller.abort();
    controller = void 0;
    if (status.value === "pending")
      status.value = "idle";
  };
  const reset = () => {
    abort();
    status.value = "idle";
    data.value = void 0;
    error.value = void 0;
  };
  const run = async (...args) => {
    var _a, _b;
    controller == null ? void 0 : controller.abort();
    const currentController = new AbortController();
    const currentRequestId = ++requestId;
    controller = currentController;
    status.value = "pending";
    error.value = void 0;
    try {
      const result = await task({ signal: currentController.signal, requestId: currentRequestId }, ...args);
      if (currentController.signal.aborted || currentRequestId !== requestId)
        return void 0;
      controller = void 0;
      data.value = result;
      status.value = "success";
      (_a = options.onSuccess) == null ? void 0 : _a.call(options, result);
      return result;
    } catch (reason) {
      if (currentController.signal.aborted || currentRequestId !== requestId)
        return void 0;
      controller = void 0;
      error.value = reason;
      status.value = "error";
      (_b = options.onError) == null ? void 0 : _b.call(options, reason);
      return void 0;
    }
  };
  vue.onBeforeUnmount(abort);
  return {
    status: vue.readonly(status),
    data: vue.readonly(data),
    error: vue.readonly(error),
    isPending: vue.computed(() => status.value === "pending"),
    run,
    abort,
    reset
  };
};
exports.useAsyncTask = useAsyncTask;
