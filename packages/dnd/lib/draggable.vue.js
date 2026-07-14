"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const useDraggable = require("./use-draggable.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ADraggable" },
  __name: "draggable",
  props: {
    data: {},
    disabled: { type: Boolean },
    tag: { default: "div" }
  },
  emits: ["dragStart", "drop"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const root = vue.ref();
    const { isDragging } = useDraggable.useDraggable(root, {
      data: () => props.data,
      disabled: () => props.disabled,
      onDragStart: () => emit("dragStart"),
      onDrop: () => emit("drop")
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(__props.tag), {
        ref_key: "root",
        ref: root,
        class: vue.normalizeClass(["aheart-dnd-draggable", { "aheart-dnd-dragging": vue.unref(isDragging) }]),
        "aria-disabled": __props.disabled || void 0
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class", "aria-disabled"]);
    };
  }
});
exports.default = _sfc_main;
