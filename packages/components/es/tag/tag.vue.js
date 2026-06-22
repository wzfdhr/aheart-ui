import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createCommentVNode } from "vue";
import { tagProps, tagEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = { class: "aheart-tag__content" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATag"
  },
  __name: "tag",
  props: tagProps,
  emits: tagEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const presetColors = ["default", "primary", "success", "warning", "danger"];
    const isPresetColor = computed(() => presetColors.includes(props.color));
    const tagClass = computed(() => ({
      [`aheart-tag--${props.color}`]: isPresetColor.value,
      "is-custom-color": !isPresetColor.value
    }));
    const tagStyle = computed(() => ({
      "--aheart-tag-color": isPresetColor.value ? void 0 : props.color
    }));
    const handleClose = (event) => {
      emit("close", event);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-tag", tagClass.value]),
        style: normalizeStyle(tagStyle.value)
      }, [
        createElementVNode("span", _hoisted_1, [
          renderSlot(_ctx.$slots, "default")
        ]),
        _ctx.closable ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "aheart-tag__close",
          type: "button",
          "aria-label": "Close",
          onClick: handleClose
        }, " × ")) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
