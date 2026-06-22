import { defineComponent, useSlots, computed, openBlock, createElementBlock, createCommentVNode, createElementVNode, normalizeClass, normalizeStyle, renderSlot, createTextVNode, toDisplayString } from "vue";
import { drawerProps, drawerEmits } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ADrawer"
  },
  __name: "drawer",
  props: drawerProps,
  emits: drawerEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const isVertical = computed(() => props.placement === "top" || props.placement === "bottom");
    const panelStyle = computed(
      () => isVertical.value ? { height: normalizeSize(props.height) } : { width: normalizeSize(props.width) }
    );
    const hasFooter = computed(() => props.footer || Boolean(slots.footer));
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
      return _ctx.open ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "aheart-drawer",
        role: "presentation",
        tabindex: "-1",
        onKeydown: handleKeydown
      }, [
        _ctx.mask ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "aheart-drawer__mask",
          onClick: handleMaskClick
        })) : createCommentVNode("", true),
        createElementVNode("section", {
          class: normalizeClass(["aheart-drawer__panel", `aheart-drawer__panel--${_ctx.placement}`]),
          style: normalizeStyle(panelStyle.value),
          role: "dialog",
          "aria-modal": "true"
        }, [
          _ctx.title || _ctx.$slots.title || _ctx.$slots.extra || _ctx.closable ? (openBlock(), createElementBlock("header", _hoisted_1, [
            _ctx.closable ? (openBlock(), createElementBlock("button", {
              key: 0,
              class: "aheart-drawer__close",
              type: "button",
              "aria-label": "Close",
              onClick: close
            }, " × ")) : createCommentVNode("", true),
            _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_2, [
              renderSlot(_ctx.$slots, "title", {}, () => [
                createTextVNode(toDisplayString(_ctx.title), 1)
              ])
            ])) : createCommentVNode("", true),
            _ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_3, [
              renderSlot(_ctx.$slots, "extra")
            ])) : createCommentVNode("", true)
          ])) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "default")
          ]),
          hasFooter.value ? (openBlock(), createElementBlock("footer", _hoisted_5, [
            renderSlot(_ctx.$slots, "footer")
          ])) : createCommentVNode("", true)
        ], 6)
      ], 32)) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
