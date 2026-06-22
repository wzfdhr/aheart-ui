"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AParagraph"
  },
  __name: "paragraph",
  props: types.paragraphProps,
  setup(__props) {
    const props = __props;
    const paragraphClass = vue.computed(() => ({
      [`aheart-typography-paragraph--${props.type}`]: props.type,
      "is-strong": props.strong,
      "is-italic": props.italic,
      "is-ellipsis": props.ellipsis,
      "is-disabled": props.disabled
    }));
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("p", {
        class: vue.normalizeClass(["aheart-typography-paragraph", paragraphClass.value])
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
exports.default = _sfc_main;
