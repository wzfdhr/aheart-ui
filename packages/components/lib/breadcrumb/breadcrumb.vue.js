"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  class: "aheart-breadcrumb",
  "aria-label": "breadcrumb"
};
const _hoisted_2 = { class: "aheart-breadcrumb__list" };
const _hoisted_3 = ["aria-current"];
const _hoisted_4 = ["href"];
const _hoisted_5 = {
  key: 1,
  class: "aheart-breadcrumb__text"
};
const _hoisted_6 = {
  key: 2,
  class: "aheart-breadcrumb__separator",
  "aria-hidden": "true"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ABreadcrumb"
  },
  __name: "breadcrumb",
  props: types.breadcrumbProps,
  setup(__props) {
    const props = __props;
    const normalizedItems = vue.computed(() => props.items ?? []);
    const isCurrent = (index) => index === normalizedItems.value.length - 1;
    const shouldRenderLink = (item, index) => {
      return Boolean(item.href && !item.disabled && !isCurrent(index));
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("nav", _hoisted_1, [
        vue.createElementVNode("ol", _hoisted_2, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedItems.value, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              key: `${item.title}-${index}`,
              class: vue.normalizeClass(["aheart-breadcrumb__item", { "is-current": isCurrent(index), "is-disabled": item.disabled }]),
              "aria-current": isCurrent(index) ? "page" : void 0
            }, [
              shouldRenderLink(item, index) ? (vue.openBlock(), vue.createElementBlock("a", {
                key: 0,
                class: "aheart-breadcrumb__link",
                href: item.href
              }, vue.toDisplayString(item.title), 9, _hoisted_4)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, vue.toDisplayString(item.title), 1)),
              !isCurrent(index) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, vue.toDisplayString(_ctx.separator), 1)) : vue.createCommentVNode("", true)
            ], 10, _hoisted_3);
          }), 128))
        ])
      ]);
    };
  }
});
exports.default = _sfc_main;
