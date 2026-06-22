import { defineComponent, computed, openBlock, createElementBlock, createElementVNode, Fragment, renderList, normalizeClass, toDisplayString, createCommentVNode } from "vue";
import { breadcrumbProps } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ABreadcrumb"
  },
  __name: "breadcrumb",
  props: breadcrumbProps,
  setup(__props) {
    const props = __props;
    const normalizedItems = computed(() => props.items ?? []);
    const isCurrent = (index) => index === normalizedItems.value.length - 1;
    const shouldRenderLink = (item, index) => {
      return Boolean(item.href && !item.disabled && !isCurrent(index));
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("nav", _hoisted_1, [
        createElementVNode("ol", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedItems.value, (item, index) => {
            return openBlock(), createElementBlock("li", {
              key: `${item.title}-${index}`,
              class: normalizeClass(["aheart-breadcrumb__item", { "is-current": isCurrent(index), "is-disabled": item.disabled }]),
              "aria-current": isCurrent(index) ? "page" : void 0
            }, [
              shouldRenderLink(item, index) ? (openBlock(), createElementBlock("a", {
                key: 0,
                class: "aheart-breadcrumb__link",
                href: item.href
              }, toDisplayString(item.title), 9, _hoisted_4)) : (openBlock(), createElementBlock("span", _hoisted_5, toDisplayString(item.title), 1)),
              !isCurrent(index) ? (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString(_ctx.separator), 1)) : createCommentVNode("", true)
            ], 10, _hoisted_3);
          }), 128))
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
