"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const formControlKey = Symbol("aheart-form-control");
const controlCounts = /* @__PURE__ */ new WeakMap();
const useFormControl = () => {
  const context = vue.inject(formControlKey, void 0);
  if (!context)
    return void 0;
  const index = controlCounts.get(context) ?? 0;
  controlCounts.set(context, index + 1);
  return {
    ...context,
    controlId: vue.computed(() => {
      const id = context.controlId.value;
      return id && index ? `${id}-${index}` : id;
    })
  };
};
const mergeAriaIds = (...values) => {
  const ids = values.filter((value) => typeof value === "string").flatMap((value) => value.split(/\s+/)).filter(Boolean);
  return ids.length ? [...new Set(ids)].join(" ") : void 0;
};
const formAriaInvalid = (explicit, status) => explicit !== void 0 ? explicit : status === "error" ? "true" : void 0;
exports.formAriaInvalid = formAriaInvalid;
exports.formControlKey = formControlKey;
exports.mergeAriaIds = mergeAriaIds;
exports.useFormControl = useFormControl;
