import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, Fragment, renderList, createElementVNode, toDisplayString, createCommentVNode } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { stepsProps, stepsEmits } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASteps"
  },
  __name: "steps",
  props: stepsProps,
  emits: stepsEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const normalizedItems = computed(() => props.items ?? []);
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const stepsClass = computed(() => [
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
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-steps", stepsClass.value]),
        role: "list"
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedItems.value, (item, index) => {
          return openBlock(), createElementBlock("div", {
            key: `${item.title}-${index}`,
            class: normalizeClass(["aheart-steps__item", getItemClass(item, index)]),
            role: "listitem",
            "aria-current": index === _ctx.current ? "step" : void 0
          }, [
            createElementVNode("button", {
              class: "aheart-steps__button",
              type: "button",
              disabled: item.disabled,
              "aria-disabled": item.disabled ? "true" : void 0,
              onClick: ($event) => handleStepClick(item, index)
            }, [
              createElementVNode("span", _hoisted_3, [
                createElementVNode("span", _hoisted_4, toDisplayString(getIndicatorText(item, index)), 1)
              ]),
              createElementVNode("span", _hoisted_5, [
                createElementVNode("span", _hoisted_6, toDisplayString(item.title), 1),
                item.description ? (openBlock(), createElementBlock("span", _hoisted_7, toDisplayString(item.description), 1)) : createCommentVNode("", true)
              ])
            ], 8, _hoisted_2)
          ], 10, _hoisted_1);
        }), 128))
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
