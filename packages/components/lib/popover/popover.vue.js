"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const floating = require("../utils/floating.js");
require("../utils/floating.css.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-floating__arrow aheart-popover__arrow",
  "aria-hidden": "true"
};
const _hoisted_2 = {
  key: 1,
  class: "aheart-popover__title"
};
const _hoisted_3 = {
  key: 2,
  class: "aheart-popover__content"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "APopover"
  },
  __name: "popover",
  props: types.popoverProps,
  emits: types.popoverEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const innerOpen = vue.ref(props.defaultOpen);
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = vue.computed(() => new Set(floating.normalizeFloatingTriggers(props.trigger)));
    const hasTitle = vue.computed(() => Boolean(props.title || slots.title));
    const hasContent = vue.computed(() => Boolean(props.content || slots.content));
    const visible = vue.computed(() => (hasTitle.value || hasContent.value) && mergedOpen.value);
    const popupStyle = vue.computed(() => floating.getFloatingPopupStyle(props.color, props.zIndex));
    vue.watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    const requestOpen = (open) => {
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      emit("openChange", open);
    };
    const handleMouseEnter = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpen(true);
      }
    };
    const handleMouseLeave = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpen(false);
      }
    };
    const handleFocusIn = () => {
      if (normalizedTriggers.value.has("focus")) {
        requestOpen(true);
      }
    };
    const handleFocusOut = () => {
      if (normalizedTriggers.value.has("focus")) {
        requestOpen(false);
      }
    };
    const handleClick = () => {
      if (normalizedTriggers.value.has("click")) {
        requestOpen(!mergedOpen.value);
      }
    };
    const handleContextmenu = (event) => {
      if (normalizedTriggers.value.has("contextMenu")) {
        event.preventDefault();
        requestOpen(true);
      }
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-popover", { "is-open": visible.value }]),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
          class: "aheart-popover__trigger",
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut,
          onClick: handleClick,
          onContextmenu: handleContextmenu
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 32),
        visible.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(["aheart-popover__popup", `aheart-floating--${_ctx.placement}`]),
          style: vue.normalizeStyle(popupStyle.value),
          role: "dialog"
        }, [
          _ctx.arrow ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1)) : vue.createCommentVNode("", true),
          hasTitle.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
            ])
          ])) : vue.createCommentVNode("", true),
          hasContent.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, [
            vue.renderSlot(_ctx.$slots, "content", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.content), 1)
            ])
          ])) : vue.createCommentVNode("", true)
        ], 6)) : vue.createCommentVNode("", true)
      ], 34);
    };
  }
});
exports.default = _sfc_main;
