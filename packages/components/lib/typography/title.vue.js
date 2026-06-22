"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATitle"
  },
  __name: "title",
  props: types.titleProps,
  setup(__props) {
    const props = __props;
    const tagName = vue.computed(() => `h${props.level}`);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(tagName.value), {
        class: vue.normalizeClass(["aheart-typography-title", `aheart-typography-title--${_ctx.level}`])
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
exports.default = _sfc_main;
