"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
const TOKEN_ATTRIBUTES = /* @__PURE__ */ new Set(["aria-describedby", "aria-labelledby"]);
const useTriggerAria = (rootSource, getAttributes) => {
  let sequence = 0;
  let target = null;
  let originals = /* @__PURE__ */ new Map();
  const restore = () => {
    if (!target)
      return;
    for (const [name, value] of originals) {
      if (value === null)
        target.removeAttribute(name);
      else
        target.setAttribute(name, value);
    }
    target = null;
    originals = /* @__PURE__ */ new Map();
  };
  vue.watchEffect(() => {
    const root = vue.toValue(rootSource);
    const attributes = getAttributes();
    const currentSequence = ++sequence;
    void vue.nextTick(() => {
      if (currentSequence !== sequence)
        return;
      const nextTarget = (root == null ? void 0 : root.matches(FOCUSABLE_SELECTOR)) ? root : (root == null ? void 0 : root.querySelector(FOCUSABLE_SELECTOR)) ?? null;
      if (nextTarget !== target) {
        restore();
        target = nextTarget;
      }
      if (!target)
        return;
      for (const [name, value] of Object.entries(attributes)) {
        if (!originals.has(name))
          originals.set(name, target.getAttribute(name));
        const original = originals.get(name);
        if (value === void 0) {
          if (original === null)
            target.removeAttribute(name);
          else if (original !== void 0)
            target.setAttribute(name, original);
          continue;
        }
        const resolvedValue = TOKEN_ATTRIBUTES.has(name) && original ? Array.from(/* @__PURE__ */ new Set([...original.split(/\s+/), value])).join(" ") : value;
        target.setAttribute(name, resolvedValue);
      }
    });
  });
  vue.onScopeDispose(() => {
    sequence += 1;
    restore();
  });
};
exports.useTriggerAria = useTriggerAria;
