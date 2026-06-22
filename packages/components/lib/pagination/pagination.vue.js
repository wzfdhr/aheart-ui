"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-pagination__total"
};
const _hoisted_2 = ["disabled"];
const _hoisted_3 = {
  key: 1,
  class: "aheart-pagination__simple"
};
const _hoisted_4 = ["aria-current", "disabled", "onClick"];
const _hoisted_5 = ["disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "APagination"
  },
  __name: "pagination",
  props: types.paginationProps,
  emits: types.paginationEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const innerCurrent = vue.ref(props.defaultCurrent);
    const isControlled = vue.computed(() => props.current !== void 0);
    const mergedPageSize = vue.computed(() => props.pageSize ?? props.defaultPageSize);
    const pageCount = vue.computed(() => Math.max(1, Math.ceil(props.total / mergedPageSize.value)));
    const mergedCurrent = vue.computed(() => Math.min(Math.max(props.current ?? innerCurrent.value, 1), pageCount.value));
    const shouldRender = vue.computed(() => !(props.hideOnSinglePage && pageCount.value <= 1));
    const pages = vue.computed(() => Array.from({ length: pageCount.value }, (_, index) => index + 1));
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const paginationClass = vue.computed(() => [
      `aheart-pagination--${resolvedSize.value}`,
      {
        "is-disabled": isDisabled.value,
        "is-simple": props.simple
      }
    ]);
    vue.watch(
      () => props.total,
      () => {
        if (!isControlled.value && innerCurrent.value > pageCount.value) {
          innerCurrent.value = pageCount.value;
        }
      }
    );
    const setCurrent = (nextCurrent) => {
      if (isDisabled.value) {
        return;
      }
      const normalizedCurrent = Math.min(Math.max(nextCurrent, 1), pageCount.value);
      if (normalizedCurrent === mergedCurrent.value) {
        return;
      }
      if (!isControlled.value) {
        innerCurrent.value = normalizedCurrent;
      }
      emit("update:current", normalizedCurrent);
      emit("change", normalizedCurrent, mergedPageSize.value);
    };
    return (_ctx, _cache) => {
      return shouldRender.value ? (vue.openBlock(), vue.createElementBlock("nav", {
        key: 0,
        class: vue.normalizeClass(["aheart-pagination", paginationClass.value]),
        "aria-label": "pagination"
      }, [
        _ctx.showTotal ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, "Total " + vue.toDisplayString(_ctx.total) + " items", 1)) : vue.createCommentVNode("", true),
        vue.createElementVNode("button", {
          class: "aheart-pagination__prev",
          type: "button",
          disabled: isDisabled.value || mergedCurrent.value <= 1,
          "aria-label": "Previous Page",
          onClick: _cache[0] || (_cache[0] = ($event) => setCurrent(mergedCurrent.value - 1))
        }, " ‹ ", 8, _hoisted_2),
        _ctx.simple ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(mergedCurrent.value) + " / " + vue.toDisplayString(pageCount.value), 1)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 2 }, vue.renderList(pages.value, (page) => {
          return vue.openBlock(), vue.createElementBlock("button", {
            key: page,
            class: vue.normalizeClass(["aheart-pagination__page", { "is-active": page === mergedCurrent.value }]),
            type: "button",
            "aria-current": page === mergedCurrent.value ? "page" : void 0,
            disabled: isDisabled.value,
            onClick: ($event) => setCurrent(page)
          }, vue.toDisplayString(page), 11, _hoisted_4);
        }), 128)),
        vue.createElementVNode("button", {
          class: "aheart-pagination__next",
          type: "button",
          disabled: isDisabled.value || mergedCurrent.value >= pageCount.value,
          "aria-label": "Next Page",
          onClick: _cache[1] || (_cache[1] = ($event) => setCurrent(mergedCurrent.value + 1))
        }, " › ", 8, _hoisted_5)
      ], 2)) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
