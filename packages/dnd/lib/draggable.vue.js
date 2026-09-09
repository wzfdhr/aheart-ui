"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const useDraggable = require("./use-draggable.js");
const keyboardService = require("./keyboard-service.js");
const dndAnnouncer = require("./dnd-announcer.js");
const dragState = require("./drag-state.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ADraggable" },
  __name: "draggable",
  props: {
    data: {},
    disabled: { type: Boolean },
    keyboard: { type: Boolean, default: true },
    label: {},
    scopeKey: {},
    tag: { default: "div" }
  },
  emits: ["dragStart", "drop", "keyboardGrab", "keyboardCancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const root = vue.ref();
    vue.watch(() => props.scopeKey, (scope) => {
      if (root.value) keyboardService.cancelKeyboardScope(root.value.ownerDocument, scope);
    });
    const { isDragging } = useDraggable.useDraggable(root, {
      data: () => props.data,
      disabled: () => props.disabled,
      onDragStart: () => emit("dragStart"),
      onDrop: () => emit("drop")
    });
    vue.watchEffect((onCleanup) => {
      const element = root.value;
      if (!element || !props.keyboard) return;
      const label = () => props.label ?? "可拖动项目";
      const cleanup = keyboardService.registerKeyboardSource({
        element,
        getData: () => ({ ...props.data }),
        getLabel: label,
        getScope: () => props.scopeKey,
        isDisabled: () => Boolean(props.disabled),
        onGrab: (event) => {
          dragState.startDrag(event.data, element.ownerDocument);
          emit("dragStart");
          emit("keyboardGrab", event);
        },
        onCancel: (event) => {
          dragState.endDrag(element.ownerDocument);
          emit("keyboardCancel", event);
          dndAnnouncer.announceDnd(element.ownerDocument, `拖动已取消：${event.reason}`);
        }
      });
      onCleanup(cleanup);
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(__props.tag), {
        ref_key: "root",
        ref: root,
        class: vue.normalizeClass(["aheart-dnd-draggable", { "aheart-dnd-dragging": vue.unref(isDragging) }]),
        "aria-disabled": __props.disabled || void 0,
        "aria-label": __props.label,
        role: "button",
        "aria-keyshortcuts": __props.keyboard ? "Space Enter Escape" : void 0,
        tabindex: __props.keyboard && !__props.disabled ? 0 : -1
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class", "aria-disabled", "aria-label", "aria-keyshortcuts", "tabindex"]);
    };
  }
});
exports.default = _sfc_main;
