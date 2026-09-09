"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const useDroppable = require("./use-droppable.js");
const keyboardService = require("./keyboard-service.js");
const dragState = require("./drag-state.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ADropZone" },
  __name: "drop-zone",
  props: {
    data: {},
    accept: {},
    disabled: { type: Boolean },
    keyboard: { type: Boolean, default: true },
    label: {},
    scopeKey: {},
    tag: { default: "div" }
  },
  emits: ["drop", "keyboardDrop"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const root = vue.ref();
    vue.watch(() => props.scopeKey, (scope) => {
      if (root.value) keyboardService.cancelKeyboardScope(root.value.ownerDocument, scope);
    });
    useDroppable.useDroppable(root, {
      data: () => props.data,
      accept: () => props.accept,
      disabled: () => props.disabled,
      onDrop: (data) => emit("drop", data)
    });
    vue.watchEffect((onCleanup) => {
      const element = root.value;
      if (!element || !props.keyboard) return;
      const cleanup = keyboardService.registerKeyboardZone({
        element,
        getData: () => ({ ...props.data }),
        getLabel: () => props.label ?? "放置区域",
        getScope: () => props.scopeKey,
        isDisabled: () => Boolean(props.disabled),
        accepts: (data) => {
          const accepted = Array.isArray(props.accept) ? props.accept : props.accept ? [props.accept] : [];
          return accepted.length === 0 || accepted.includes(String(data.type ?? ""));
        },
        onGrab: () => void 0,
        onDrop: (data, event) => {
          dragState.endDrag(element.ownerDocument);
          emit("drop", data);
          emit("keyboardDrop", event);
        }
      });
      onCleanup(cleanup);
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(__props.tag), {
        ref_key: "root",
        ref: root,
        class: "aheart-dnd-drop-zone",
        "aria-disabled": __props.disabled || void 0,
        "aria-label": __props.label,
        role: "region",
        "aria-keyshortcuts": __props.keyboard ? "Space Enter" : void 0,
        tabindex: __props.keyboard ? __props.disabled ? -1 : 0 : -1
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["aria-disabled", "aria-label", "aria-keyshortcuts", "tabindex"]);
    };
  }
});
exports.default = _sfc_main;
