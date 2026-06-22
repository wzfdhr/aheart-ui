"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../button/index.js");
const floating = require("../utils/floating.js");
require("../utils/floating.css.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-floating__arrow aheart-popconfirm__arrow",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "aheart-popconfirm__message" };
const _hoisted_3 = {
  class: "aheart-popconfirm__icon",
  "aria-hidden": "true"
};
const _hoisted_4 = { class: "aheart-popconfirm__text" };
const _hoisted_5 = {
  key: 0,
  class: "aheart-popconfirm__title"
};
const _hoisted_6 = {
  key: 1,
  class: "aheart-popconfirm__description"
};
const _hoisted_7 = { class: "aheart-popconfirm__actions" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "APopconfirm"
  },
  __name: "popconfirm",
  props: types.popconfirmProps,
  emits: types.popconfirmEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const innerOpen = vue.ref(props.defaultOpen);
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = vue.computed(() => new Set(floating.normalizeFloatingTriggers(props.trigger)));
    const visible = vue.computed(() => !props.disabled && mergedOpen.value);
    const popupStyle = vue.computed(() => floating.getFloatingPopupStyle(void 0, props.zIndex));
    vue.watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    const requestOpen = (open) => {
      if (props.disabled) {
        return;
      }
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
    const handleConfirm = () => {
      emit("confirm");
      requestOpen(false);
    };
    const handleCancel = () => {
      emit("cancel");
      requestOpen(false);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-popconfirm", { "is-open": visible.value, "is-disabled": _ctx.disabled }]),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
          class: "aheart-popconfirm__trigger",
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
          class: vue.normalizeClass(["aheart-popconfirm__popup", `aheart-floating--${_ctx.placement}`]),
          style: vue.normalizeStyle(popupStyle.value),
          role: "dialog"
        }, [
          _ctx.arrow ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", _hoisted_2, [
            vue.createElementVNode("span", _hoisted_3, [
              vue.renderSlot(_ctx.$slots, "icon", {}, () => [
                _cache[0] || (_cache[0] = vue.createTextVNode("!", -1))
              ])
            ]),
            vue.createElementVNode("span", _hoisted_4, [
              _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, [
                vue.renderSlot(_ctx.$slots, "title", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
                ])
              ])) : vue.createCommentVNode("", true),
              _ctx.description || _ctx.$slots.description ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, [
                vue.renderSlot(_ctx.$slots, "description", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.description), 1)
                ])
              ])) : vue.createCommentVNode("", true)
            ])
          ]),
          vue.createElementVNode("span", _hoisted_7, [
            _ctx.showCancel ? (vue.openBlock(), vue.createBlock(vue.unref(index.default), {
              key: 0,
              class: "aheart-popconfirm__cancel",
              size: "small",
              onClick: handleCancel
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(_ctx.cancelText), 1)
              ]),
              _: 1
            })) : vue.createCommentVNode("", true),
            vue.createVNode(vue.unref(index.default), {
              class: "aheart-popconfirm__ok",
              type: _ctx.okType,
              size: "small",
              onClick: handleConfirm
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(_ctx.okText), 1)
              ]),
              _: 1
            }, 8, ["type"])
          ])
        ], 6)) : vue.createCommentVNode("", true)
      ], 34);
    };
  }
});
exports.default = _sfc_main;
