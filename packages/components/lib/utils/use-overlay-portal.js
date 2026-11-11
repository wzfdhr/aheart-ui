"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const useTeleportReady = require("./use-teleport-ready.js");
function useOverlayPortal(resolveTarget) {
  const ready = useTeleportReady.useTeleportReady();
  const target = vue.computed(resolveTarget);
  return {
    shouldTeleport: vue.computed(() => ready.value && target.value !== false),
    teleportTo: vue.computed(() => target.value === false ? "body" : target.value)
  };
}
exports.useOverlayPortal = useOverlayPortal;
