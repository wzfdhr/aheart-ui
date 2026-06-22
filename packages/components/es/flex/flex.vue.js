import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { flexProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AFlex"
  },
  __name: "flex",
  props: flexProps,
  setup(__props) {
    const props = __props;
    const gapToValue = (gap) => {
      if (typeof gap === "number") {
        return `${gap}px`;
      }
      const tokenMap = {
        large: "var(--aheart-spacing-lg)",
        middle: "var(--aheart-spacing-md)",
        small: "var(--aheart-spacing-sm)"
      };
      return gap ? tokenMap[gap] : void 0;
    };
    const flexClass = computed(() => [
      {
        "is-vertical": props.vertical,
        "is-wrap": props.wrap === true,
        [`is-wrap-${props.wrap}`]: typeof props.wrap === "string",
        [`aheart-flex--justify-${props.justify}`]: props.justify,
        [`aheart-flex--align-${props.align}`]: props.align
      }
    ]);
    const flexStyle = computed(() => ({
      "--aheart-flex-gap": gapToValue(props.gap)
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-flex", flexClass.value]),
        style: normalizeStyle(flexStyle.value)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
