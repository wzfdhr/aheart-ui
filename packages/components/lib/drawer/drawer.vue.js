"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-drawer__header"
};
const _hoisted_2 = {
  key: 1,
  class: "aheart-drawer__title"
};
const _hoisted_3 = {
  key: 2,
  class: "aheart-drawer__extra"
};
const _hoisted_4 = { class: "aheart-drawer__body" };
const _hoisted_5 = {
  key: 1,
  class: "aheart-drawer__footer"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ADrawer"
  },
  __name: "drawer",
  props: types.drawerProps,
  emits: types.drawerEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const isVertical = vue.computed(() => props.placement === "top" || props.placement === "bottom");
    const panelStyle = vue.computed(
      () => isVertical.value ? { height: normalizeSize(props.height) } : { width: normalizeSize(props.width) }
    );
    const hasFooter = vue.computed(() => props.footer || Boolean(slots.footer));
    const close = () => {
      emit("update:open", false);
      emit("close");
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
        class: "aheart-drawer",
        role: "presentation",
        tabindex: "-1",
        onKeydown: handleKeydown
      }, [
        _ctx.mask ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "aheart-drawer__mask",
          onClick: handleMaskClick
        })) : vue.createCommentVNode("", true),
        vue.createElementVNode("section", {
          class: vue.normalizeClass(["aheart-drawer__panel", `aheart-drawer__panel--${_ctx.placement}`]),
          style: vue.normalizeStyle(panelStyle.value),
          role: "dialog",
          "aria-modal": "true"
        }, [
          _ctx.title || _ctx.$slots.title || _ctx.$slots.extra || _ctx.closable ? (vue.openBlock(), vue.createElementBlock("header", _hoisted_1, [
            _ctx.closable ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 0,
              class: "aheart-drawer__close",
              type: "button",
              "aria-label": "Close",
              onClick: close
            }, " × ")) : vue.createCommentVNode("", true),
            _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
              vue.renderSlot(_ctx.$slots, "title", {}, () => [
                vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
              ])
            ])) : vue.createCommentVNode("", true),
            _ctx.$slots.extra ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
              vue.renderSlot(_ctx.$slots, "extra")
            ])) : vue.createCommentVNode("", true)
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_4, [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          hasFooter.value ? (vue.openBlock(), vue.createElementBlock("footer", _hoisted_5, [
            vue.renderSlot(_ctx.$slots, "footer")
          ])) : vue.createCommentVNode("", true)
        ], 6)
      ], 32)) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
