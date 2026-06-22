"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-empty" };
const _hoisted_2 = { class: "aheart-empty__image" };
const _hoisted_3 = { class: "aheart-empty__description" };
const _hoisted_4 = {
  key: 0,
  class: "aheart-empty__footer"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AEmpty"
  },
  __name: "empty",
  props: types.emptyProps,
  setup(__props) {
    const props = __props;
    const config = context.useAheartConfig();
    const resolvedDescription = vue.computed(() => {
      var _a, _b;
      return props.description || ((_b = (_a = config.value.locale) == null ? void 0 : _a.empty) == null ? void 0 : _b.description) || "No Data";
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
        vue.createElementVNode("div", _hoisted_2, [
          vue.renderSlot(_ctx.$slots, "image", {}, () => [
            _cache[0] || (_cache[0] = vue.createElementVNode("span", {
              class: "aheart-empty__default-image",
              "aria-hidden": "true"
            }, "∅", -1))
          ])
        ]),
        vue.createElementVNode("div", _hoisted_3, vue.toDisplayString(resolvedDescription.value), 1),
        _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
          vue.renderSlot(_ctx.$slots, "default")
        ])) : vue.createCommentVNode("", true)
      ]);
    };
  }
});
exports.default = _sfc_main;
