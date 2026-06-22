import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { paragraphProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AParagraph"
  },
  __name: "paragraph",
  props: paragraphProps,
  setup(__props) {
    const props = __props;
    const paragraphClass = computed(() => ({
      [`aheart-typography-paragraph--${props.type}`]: props.type,
      "is-strong": props.strong,
      "is-italic": props.italic,
      "is-ellipsis": props.ellipsis,
      "is-disabled": props.disabled
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("p", {
        class: normalizeClass(["aheart-typography-paragraph", paragraphClass.value])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
