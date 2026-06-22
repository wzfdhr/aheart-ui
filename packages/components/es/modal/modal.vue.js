import { defineComponent, useSlots, computed, openBlock, createElementBlock, createCommentVNode, createElementVNode, normalizeClass, normalizeStyle, renderSlot, createTextVNode, toDisplayString, createVNode, unref, withCtx } from "vue";
import Button from "../button/index.js";
import { modalProps, modalEmits } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AModal"
  },
  __name: "modal",
  props: modalProps,
  emits: modalEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const dialogStyle = computed(() => ({
      width: normalizeSize(props.width)
    }));
    const hasFooter = computed(() => props.footer || Boolean(slots.footer));
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
      return _ctx.open ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "aheart-modal",
        role: "presentation",
        tabindex: "-1",
        onKeydown: handleKeydown
      }, [
        _ctx.mask ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "aheart-modal__mask",
          onClick: handleMaskClick
        })) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_1, [
          createElementVNode("section", {
            class: normalizeClass(["aheart-modal__dialog", { "is-centered": _ctx.centered }]),
            style: normalizeStyle(dialogStyle.value),
            role: "dialog",
            "aria-modal": "true"
          }, [
            _ctx.title || _ctx.$slots.title || _ctx.closable ? (openBlock(), createElementBlock("header", _hoisted_2, [
              _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_3, [
                renderSlot(_ctx.$slots, "title", {}, () => [
                  createTextVNode(toDisplayString(_ctx.title), 1)
                ])
              ])) : createCommentVNode("", true),
              _ctx.closable ? (openBlock(), createElementBlock("button", {
                key: 1,
                class: "aheart-modal__close",
                type: "button",
                "aria-label": "Close",
                onClick: close
              }, " × ")) : createCommentVNode("", true)
            ])) : createCommentVNode("", true),
            createElementVNode("div", _hoisted_4, [
              renderSlot(_ctx.$slots, "default")
            ]),
            hasFooter.value ? (openBlock(), createElementBlock("footer", _hoisted_5, [
              renderSlot(_ctx.$slots, "footer", {}, () => [
                createVNode(unref(Button), {
                  class: "aheart-modal__cancel",
                  onClick: handleCancel
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.cancelText), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(Button), {
                  class: "aheart-modal__ok",
                  type: _ctx.okType,
                  loading: _ctx.confirmLoading,
                  onClick: handleOk
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.okText), 1)
                  ]),
                  _: 1
                }, 8, ["type", "loading"])
              ])
            ])) : createCommentVNode("", true)
          ], 6)
        ])
      ], 32)) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
