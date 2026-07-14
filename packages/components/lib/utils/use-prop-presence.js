"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const usePropPresence = (...names) => {
  const instance = vue.getCurrentInstance();
  const readPresence = () => {
    const vnodeProps = (instance == null ? void 0 : instance.vnode.props) ?? {};
    return names.some((name) => Object.prototype.hasOwnProperty.call(vnodeProps, name));
  };
  const present = vue.ref(readPresence());
  vue.onBeforeUpdate(() => {
    present.value = readPresence();
  });
  return vue.readonly(present);
};
exports.usePropPresence = usePropPresence;
