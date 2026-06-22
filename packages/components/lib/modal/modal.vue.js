"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../button/index.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-modal__wrap" };
const _hoisted_2 = {
  key: 0,
  class: "aheart-modal__header"
};
const _hoisted_3 = {
  key: 0,
  class: "aheart-modal__title"
};
const _hoisted_4 = { class: "aheart-modal__body" };
const _hoisted_5 = {
  key: 1,
  class: "aheart-modal__footer"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AModal"
  },
  __name: "modal",
  props: types.modalProps,
  emits: types.modalEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const dialogStyle = vue.computed(() => ({
      width: normalizeSize(props.width)
    }));
    const hasFooter = vue.computed(() => props.footer || Boolean(slots.footer));
    const close = () => {
      emit("update:open", false);
      emit("close");
    };
    const handleOk = () => {
      emit("ok");
    };
    const handleCancel = () => {
      emit("cancel");
      close();
    };
    const handleMaskClick = () => {
      if (props.maskClosable) {
        close();
      }
    };
    const handleKeydown = (event) => {
      if (props.keyboard && event.key === "Escape") {
        close();
      }
    };
    return (_ctx, _cache) => {
      return _ctx.open ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "aheart-modal",
        role: "presentation",
        tabindex: "-1",
        onKeydown: handleKeydown
      }, [
        _ctx.mask ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "aheart-modal__mask",
          onClick: handleMaskClick
        })) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_1, [
          vue.createElementVNode("section", {
            class: vue.normalizeClass(["aheart-modal__dialog", { "is-centered": _ctx.centered }]),
            style: vue.normalizeStyle(dialogStyle.value),
            role: "dialog",
            "aria-modal": "true"
          }, [
            _ctx.title || _ctx.$slots.title || _ctx.closable ? (vue.openBlock(), vue.createElementBlock("header", _hoisted_2, [
              _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
                vue.renderSlot(_ctx.$slots, "title", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
                ])
              ])) : vue.createCommentVNode("", true),
              _ctx.closable ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 1,
                class: "aheart-modal__close",
                type: "button",
                "aria-label": "Close",
                onClick: close
              }, " × ")) : vue.createCommentVNode("", true)
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_4, [
              vue.renderSlot(_ctx.$slots, "default")
            ]),
            hasFooter.value ? (vue.openBlock(), vue.createElementBlock("footer", _hoisted_5, [
              vue.renderSlot(_ctx.$slots, "footer", {}, () => [
                vue.createVNode(vue.unref(index.default), {
                  class: "aheart-modal__cancel",
                  onClick: handleCancel
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.cancelText), 1)
                  ]),
                  _: 1
                }),
                vue.createVNode(vue.unref(index.default), {
                  class: "aheart-modal__ok",
                  type: _ctx.okType,
                  loading: _ctx.confirmLoading,
                  onClick: handleOk
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.okText), 1)
                  ]),
                  _: 1
                }, 8, ["type", "loading"])
              ])
            ])) : vue.createCommentVNode("", true)
          ], 6)
        ])
      ], 32)) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
