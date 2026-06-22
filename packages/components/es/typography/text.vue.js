import { defineComponent, computed, openBlock, createBlock, resolveDynamicComponent, normalizeClass, withCtx, renderSlot } from "vue";
import { textProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AText"
  },
  __name: "text",
  props: textProps,
  setup(__props) {
    const props = __props;
    const tagName = computed(() => {
      if (props.code)
        return "code";
      if (props.keyboard)
        return "kbd";
      if (props.delete)
        return "del";
      if (props.underline)
        return "u";
      if (props.italic)
        return "em";
      if (props.strong)
        return "strong";
      return "span";
    });
    const textClass = computed(() => ({
      [`aheart-typography-text--${props.type}`]: props.type,
      "is-strong": props.strong,
      "is-italic": props.italic,
      "is-disabled": props.disabled
    }));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(tagName.value), {
        class: normalizeClass(["aheart-typography-text", textClass.value])
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
