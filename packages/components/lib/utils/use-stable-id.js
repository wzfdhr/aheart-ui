"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const useStableId = (explicitId, prefix = "aheart") => {
  const generatedId = `${prefix}-${vue.useId().replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return vue.computed(() => vue.toValue(explicitId) ?? generatedId);
};
exports.useStableId = useStableId;
