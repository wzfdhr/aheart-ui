"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AFlex"
  },
  __name: "flex",
  props: types.flexProps,
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
    const flexClass = vue.computed(() => [
      {
        "is-vertical": props.vertical,
        "is-wrap": props.wrap === true,
        [`is-wrap-${props.wrap}`]: typeof props.wrap === "string",
        [`aheart-flex--justify-${props.justify}`]: props.justify,
        [`aheart-flex--align-${props.align}`]: props.align
      }
    ]);
    const flexStyle = vue.computed(() => ({
      "--aheart-flex-gap": gapToValue(props.gap)
    }));
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-flex", flexClass.value]),
        style: vue.normalizeStyle(flexStyle.value)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
exports.default = _sfc_main;
