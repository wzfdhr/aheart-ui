import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, normalizeStyle, createCommentVNode, createTextVNode, toDisplayString, createBlock, unref, withCtx, createVNode } from "vue";
import Button from "../button/index.js";
import { normalizeFloatingTriggers, getFloatingPopupStyle } from "../utils/floating.js";
import "../utils/floating.css.js";
import { popconfirmProps, popconfirmEmits } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "APopconfirm"
  },
  __name: "popconfirm",
  props: popconfirmProps,
  emits: popconfirmEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const innerOpen = ref(props.defaultOpen);
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)));
    const visible = computed(() => !props.disabled && mergedOpen.value);
    const popupStyle = computed(() => getFloatingPopupStyle(void 0, props.zIndex));
    watch(
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
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-popconfirm", { "is-open": visible.value, "is-disabled": _ctx.disabled }]),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          class: "aheart-popconfirm__trigger",
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut,
          onClick: handleClick,
          onContextmenu: handleContextmenu
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 32),
        visible.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["aheart-popconfirm__popup", `aheart-floating--${_ctx.placement}`]),
          style: normalizeStyle(popupStyle.value),
          role: "dialog"
        }, [
          _ctx.arrow ? (openBlock(), createElementBlock("span", _hoisted_1)) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_2, [
            createElementVNode("span", _hoisted_3, [
              renderSlot(_ctx.$slots, "icon", {}, () => [
                _cache[0] || (_cache[0] = createTextVNode("!", -1))
              ])
            ]),
            createElementVNode("span", _hoisted_4, [
              _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("span", _hoisted_5, [
                renderSlot(_ctx.$slots, "title", {}, () => [
                  createTextVNode(toDisplayString(_ctx.title), 1)
                ])
              ])) : createCommentVNode("", true),
              _ctx.description || _ctx.$slots.description ? (openBlock(), createElementBlock("span", _hoisted_6, [
                renderSlot(_ctx.$slots, "description", {}, () => [
                  createTextVNode(toDisplayString(_ctx.description), 1)
                ])
              ])) : createCommentVNode("", true)
            ])
          ]),
          createElementVNode("span", _hoisted_7, [
            _ctx.showCancel ? (openBlock(), createBlock(unref(Button), {
              key: 0,
              class: "aheart-popconfirm__cancel",
              size: "small",
              onClick: handleCancel
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(_ctx.cancelText), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true),
            createVNode(unref(Button), {
              class: "aheart-popconfirm__ok",
              type: _ctx.okType,
              size: "small",
              onClick: handleConfirm
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(_ctx.okText), 1)
              ]),
              _: 1
            }, 8, ["type"])
          ])
        ], 6)) : createCommentVNode("", true)
      ], 34);
    };
  }
});
export {
  _sfc_main as default
};
