"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
function useTeleportReady() {
  const ready = vue.ref(false);
  vue.onMounted(() => {
    ready.value = true;
  });
  return ready;
}
exports.useTeleportReady = useTeleportReady;
