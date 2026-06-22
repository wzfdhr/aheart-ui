"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-current"];
const _hoisted_2 = ["disabled", "aria-disabled", "onClick"];
const _hoisted_3 = {
  class: "aheart-steps__indicator",
  "aria-hidden": "true"
};
const _hoisted_4 = { class: "aheart-steps__icon" };
const _hoisted_5 = { class: "aheart-steps__content" };
const _hoisted_6 = { class: "aheart-steps__title" };
const _hoisted_7 = {
  key: 0,
  class: "aheart-steps__description"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASteps"
  },
  __name: "steps",
  props: types.stepsProps,
  emits: types.stepsEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const normalizedItems = vue.computed(() => props.items ?? []);
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const stepsClass = vue.computed(() => [
      `aheart-steps--${props.direction}`,
      `aheart-steps--${resolvedSize.value}`
    ]);
    const getStatus = (item, index) => {
      if (item.status) {
        return item.status;
      }
      if (index < props.current) {
        return "finish";
      }
      if (index === props.current) {
        return props.status;
      }
      return "wait";
    };
    const getItemClass = (item, index) => {
      const status = getStatus(item, index);
      return {
        [`aheart-steps__item--${status}`]: true,
        "is-disabled": item.disabled
      };
    };
    const getIndicatorText = (item, index) => {
      const status = getStatus(item, index);
      if (status === "finish") {
        return "✓";
      }
      if (status === "error") {
        return "!";
      }
      return index + 1;
    };
    const handleStepClick = (item, index) => {
      if (item.disabled || index === props.current) {
        return;
      }
      emit("change", index);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-steps", stepsClass.value]),
        role: "list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedItems.value, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            key: `${item.title}-${index}`,
            class: vue.normalizeClass(["aheart-steps__item", getItemClass(item, index)]),
            role: "listitem",
            "aria-current": index === _ctx.current ? "step" : void 0
          }, [
            vue.createElementVNode("button", {
              class: "aheart-steps__button",
              type: "button",
              disabled: item.disabled,
              "aria-disabled": item.disabled ? "true" : void 0,
              onClick: ($event) => handleStepClick(item, index)
            }, [
              vue.createElementVNode("span", _hoisted_3, [
                vue.createElementVNode("span", _hoisted_4, vue.toDisplayString(getIndicatorText(item, index)), 1)
              ]),
              vue.createElementVNode("span", _hoisted_5, [
                vue.createElementVNode("span", _hoisted_6, vue.toDisplayString(item.title), 1),
                item.description ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7, vue.toDisplayString(item.description), 1)) : vue.createCommentVNode("", true)
              ])
            ], 8, _hoisted_2)
          ], 10, _hoisted_1);
        }), 128))
      ], 2);
    };
  }
});
exports.default = _sfc_main;
