"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const useDroppable = require("./use-droppable.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ADropZone" },
  __name: "drop-zone",
  props: {
    data: {},
    accept: {},
    disabled: { type: Boolean },
    tag: { default: "div" }
  },
  emits: ["drop"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const root = vue.ref();
    useDroppable.useDroppable(root, {
      data: () => props.data,
      accept: () => props.accept,
      disabled: () => props.disabled,
      onDrop: (data) => emit("drop", data)
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(__props.tag), {
        ref_key: "root",
        ref: root,
        class: "aheart-dnd-drop-zone",
        "aria-disabled": __props.disabled || void 0
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["aria-disabled"]);
    };
  }
});
exports.default = _sfc_main;
